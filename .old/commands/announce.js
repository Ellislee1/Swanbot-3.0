const Discord = require("discord.js");

module.exports = {
  // Required - The name of the command
  name: "announce",
  // Other ways to call the command
  aliases: ["ann", "shout", "alert"],
  // Required - What the command does
  description: "Make an announcement to everyone in the general channel.",
  // Required - How to use the command
  usage: "<announcement>",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 10,
  // Execute command
  execute(message, args) {
    const channel = message.guild.channels.cache.find(
      (channel) => channel.name == "general"
    );
    announcement = args.join(" ");

    let embed = new Discord.MessageEmbed()
      .setTitle("Announcement!")
      .setColor("#fc4103")
      .setDescription(announcement)
      .setTimestamp(new Date());
    channel.send(embed);

    message.delete();
  },
};
