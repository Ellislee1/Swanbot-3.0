const { Command } = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class Announce extends Command {
	constructor(client) {
		super(client, {
			name: 'announce',
			aliases: ['ann', 'shout', 'alert'],
			group: 'general',
			memberName: 'announce',
			description: 'Make an announcement to everyone in the general channel.',
			guildOnly: true,
			args: [
				{
					key: 'text',
					prompt: 'What would you like to announce?',
					type: 'string',
				}
			]
		});
    }
    
	run(message, { text }) {
		const channel = message.guild.channels.cache.find(
      (channel) => channel.name == "general"
		);
		
		let embed = new Discord.MessageEmbed()
      .setTitle("Announcement!")
      .setColor("#fc4103")
      .setDescription(text)
      .setTimestamp(new Date());

        return channel.send(embed);
    }
};