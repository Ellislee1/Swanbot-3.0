const Discord = require("discord.js");

module.exports = {
  // Required - The name of the command
  name: "questionnaire",
  // Other ways to call the command
  aliases: ["qa", "survey"],
  // Required - What the command does
  description:
    "Ask users from the discord to fill out your questionnaire/survey as part of user research.",
  // Required - How to use the command
  usage: "<link> <Description>\nEnsure the link is `http://` or `https://`",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 5,
  // Execute command
  execute(message, args) {
    const channel = message.guild.channels.cache.find(
      (channel) => channel.name == "research-general"
    );

    let link = args.shift();
    let description = "";

    if (link.includes("https://") || link.includes("http://")) {
      if (link.indexOf("http") != 0) {
        return message.reply(
          'Please ensure the link includes `https://` or `http://` at the start e.g. "https://google.com"'
        );
      }
    } else {
      return message.reply(
        'Please ensure the link includes `https://` or `http://` at the start e.g. "https://google.com"'
      );
    }

    args.forEach((arg) => {
      description += arg;
    });

    let embed = new Discord.MessageEmbed()
      .setTitle(`${message.member.user.username}'s Questionnaire`)
      .setColor("#fc4103")
      .setURL(link)
      .setDescription(description)
      .addField("Link", link)
      .setTimestamp(new Date());
    channel.send(embed);

    message.delete();
  },
};
