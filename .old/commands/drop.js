const Discord = require("discord.js");
const Module = require("../database/models/Module.js");

module.exports = {
  // Required - The name of the command
  name: "drop",
  // Other ways to call the command
  aliases: [],
  // Required - What the command does
  description: "Drop a module using the module code",
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
    await drop_chanels(message, args);
  },
};

async function drop_chanels(message, args) {
  dropped = [];
  failed = [];

  args.forEach((module) => {
    role = message.member.roles.cache.find(
      (rol) => rol.name === module.toUpperCase()
    );
    console.log(role);
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
