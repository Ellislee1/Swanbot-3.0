const Discord = require("discord.js");
const Module = require("../database/models/Module.js");

module.exports = {
  // Required - The name of the command
  name: "join",
  // Other ways to call the command
  aliases: ["enrol", "j"],
  // Required - What the command does
  description: "Adds users to a module channel, by giving them the tag",
  // Required - How to use the command
  usage: "<list of module codes>. Seperate module codes using a space.",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 2,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, database) {
    if (message.channel.name != "module-enrol") {
      message.reply("Please do that in the Module-Enrol channel.");
      message.delete();
      return;
    }
    await join_channels(message, args);
  },
};

async function join_channels(message, args) {
  joined = [];
  failed = [];

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
