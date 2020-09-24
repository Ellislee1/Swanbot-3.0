const Discord = require("discord.js");
const Module = require("../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = {
  // Required - The name of the command
  name: "createchan",
  // Other ways to call the command
  aliases: ["cc", "pop"],
  // Required - What the command does
  description: "Add channels and roles to the server.",
  // Required - How to use the command
  usage: "!createchan",
  // Required - If arguments are expected
  args: false,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 5,
  // If access to the client is needed
  client: true,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, database) {
    memberRoles = message.member.roles.cache;
    if (!memberRoles.some((role) => role.name === "Owner")) {
      return message.reply("You do not have the required role for this.");
    }

    const guild = message.guild;
    let everyone_id = get_role_id(message, "@everyone");
    let owner_id = get_role_id(message, "Owner");
    let admin_id = get_role_id(message, "Server Moderator");
    const allmodules = await get_modules();

    allmodules.forEach((module) => {
      role = get_roles(message, module.module_code);
      if (!role) {
        guild.roles.create({ data: { name: module.module_code } });
      }
      channel = get_channels(message, module.channel_name);

      let role_code = get_role_id(message, module.module_code).catch(
        console.log("You can not do this :(")
      );

      if (!channel) {
        guild.channel.create(module.channel_name, {
          type: "text",
          permissionOverwrites: [
            {
              id: everyone_id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: owner_id,
              allow: ["VIEW_CHANNEL"],
            },
            {
              id: admin_id,
              allow: ["VIEW_CHANNEL"],
            },
            {
              id: role_code,
              allow: ["VIEW_CHANNEL"],
            },
          ],
        });
      }
    });
  },
};

async function get_modules() {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title", "channel_name", "channel_type"],
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
  return message.guild.roles.cache.some((role) => role.name === module_code);
}

function get_role_id(message, role_to) {
  return message.guild.roles.cache.find((role) => role.name === role_to);
}
