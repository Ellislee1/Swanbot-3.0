const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const Module = require("../../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = class Drop extends Command {
	constructor(client) {
		super(client, {
			name: 'drop',
			aliases: ["d"],
			group: 'uni specific',
			memberName: 'drop',
			description: 'Removes user from a module tag',
			guildOnly: true,
			args: [
				{
					key: 'text',
					prompt: '<list of module codes>. Seperate module codes using a space.',
					type: 'string',
				}
			]
		});
	}
    
	async run(message, { text }) {
        if (message.channel.name != "module-enrol") {
      		message.reply("Please do that in the Module-Enrol channel.");
      		message.delete();
      		return;
    	}
    	await drop_chanels(message, text);
	};
}

async function drop_chanels(message, args) {
  	dropped = [];
  	failed = [];

	args = args.split(" ")
	
  	args.forEach((module) => {
    role = message.member.roles.cache.find(
      (rol) => rol.name === module.toUpperCase()
    );
    try {
      message.member.roles.remove(role);
      dropped.push(module.toUpperCase());
    } catch (err) {
      console.log("ERROR:: ", err);
      failed.push(module.toUpperCase());
    }
  });

  if (dropped.length >= 1) {
    message.author.send(
      "You have dropped the following modules and will no longer be able to see the channels: " +
        dropped
    );
  }

  if (failed.length >= 1) {
    message.author.send("Failed to drop the following modules: " + failed);
  }
}