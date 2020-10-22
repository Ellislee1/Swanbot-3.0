const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const Module = require("../../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = class CreateChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'create',
			aliases: ['cre', 'chan', 'cc', 'pop'],
			group: 'admin',
			memberName: 'create',
			description: 'Add all channels to the discord server',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            hidden = true,
		});
    }
    
    async run(message) {
        // memberRoles = message.member.roles.cache;
        // if (!memberRoles.some((role) => role.name === "Owner")) {
        //     return message.reply("You do not have the required role for this.");
        // }

        const guild = message.guild;
        let everyone_id = get_role_id(message, "@everyone");
        let owner_id = get_role_id(message, "Owner");
        let admin_id = get_role_id(message, "Server Moderator");

        let semester1 = guild.channels.cache.find(
        (c) => c.name == "Semester 1" && c.type == "category"
        );

        let semester2 = guild.channels.cache.find(
        (c) => c.name == "Semester 2" && c.type == "category"
        );

        let multi = guild.channels.cache.find(
        (c) => c.name == "Multi-Semester" && c.type == "category"
        );


        const allmodules = await get_modules();

        allmodules.forEach(async (module) => {
            let new_role = get_roles(message, module.module_code);
            let role_code = "";
            if (!new_role) {
                console.log(`Creating ${module.module_code}`);
                role_code = await guild.roles
                .create({ data: { name: module.module_code } })
                .then(console.log("Role Created"));
            }
            else {
                role_code = await get_role_id(message, module.module_code);
            }
            let channel = await get_channels(message, module.channel_name);

            if (!channel) {
                let module_sem = multi;
                if (module.module_semester == 0) {
                    module_sem = multi;
                } else if (module.module_semester == 1) {
                    module_sem = semester1;
                } else {
                    module_sem = semester2;
                }
            

                // console.log(`ROLEW +++++ ${role_code}`);
                guild.channels.create(module.channel_name, {
                    type: "text",
                    parent: module_sem.id,
                    permissionOverwrites: [
                        {
                        id: everyone_id.toString(),
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: owner_id.toString(),
                        allow: ["VIEW_CHANNEL"],
                    },
                    {
                        id: admin_id.toString(),
                        allow: ["VIEW_CHANNEL"],
                    },
                    {
                        id: role_code.toString(),
                        allow: ["VIEW_CHANNEL"],
                    },
                ],
            });
        }
        });
        message.say("Modules Created!");
    }
};


async function get_modules() {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title", "channel_name", "channel_type", "module_semester"],
  });
  console.log(`Found: ${modules.length} records`);
  return modules;
}

function get_channels(message, channel_name) {
  return message.guild.channels.cache.some(
    (chan) => chan.name === channel_name
  );
}

function get_roles(message, module_code) {
    let ro = message.guild.roles.cache.some((role) => role.name === module_code);
    return ro
}

function get_role_id(message, role_to) {
    return message.guild.roles.cache.find((role) => role.name === role_to).id;
}