const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const Module = require("../../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = class JoinChannel extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ["enrol", "j"],
			group: 'uni specific',
			memberName: 'join',
			description: 'Adds users to a module channel, by giving them the tag',
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
    	await join_channels(message, text);
	};
}

async function join_channels(message, args) {
  	joined = [];
  	failed = [];

	args = args.split(" ")
	
  	for (const code of args) {
    	result = await Module.findAll({
      	attributes: ["module_code"],
      	where: {
        	module_code: code.toUpperCase(),
      	},
    	});

    	if (result.length >= 1) {
      		try {
        	role = message.guild.roles.cache.find(
          		(role) => role.name === code.toUpperCase()
        	);
        	message.member.roles.add(role);
        	joined.push(code.toUpperCase());
      		} catch (err) {
        		console.log("ERROR:: ", err);
        		failed.push(code.toUpperCase());
      		}
    	} else {
      		failed.push(code.toUpperCase());
    	}
  	}

  if (joined.length >= 1) {
    message.author.send("You have been enrolled in " + joined);
  }

  if (failed.length >= 1) {
    message.author.send("Failed to enroll in " + failed);
  }
}