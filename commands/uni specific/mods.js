const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const Module = require("../../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = class Modules extends Command {
	constructor(client) {
		super(client, {
			name: 'modules',
			aliases: ['mods', 'classes'],
			group: 'uni specific',
			memberName: 'modules',
			description: 'Show a list of all modules that belong to a specific MSc/MEng course.',
			args: [
				{
					key: 'course',
					prompt: 'Please elect a course',
					type: 'string',
				}
			]
		});
    }
    
	async run(message, { course }) {
		var modules = await get_modules(course);
		
        let embed_base = new Discord.MessageEmbed()
      .setColor("#8332a8")
      .setTitle("Modules")
      .setDescription(
        `These are the module codes and titles that are related to the course ${course}`
      )
      .setTimestamp()
      .setFooter("- Swanbot 3.0 ❤️");

    modules.forEach((module) => {
      embed_base.addField(
        module.dataValues.module_title,
        module.dataValues.module_code,
        true
      );
    });

    message.reply(embed_base);
    }
};

async function get_modules(course) {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title"],
    where: {
      module_courses: { [Op.substring]: course },
    },
  });
  console.log(`Found: ${modules.length} records`);
  return modules;
}