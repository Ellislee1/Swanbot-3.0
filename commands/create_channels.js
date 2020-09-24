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

    const allmodules = await get_modules();
    const channels = get_channels(message);
    console.log(channels);
  },
};

async function get_modules() {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title", "channel_name", "channel_type"],
  });
  console.log(`Found: ${modules.length} records`);
  return modules;
}

function get_channels(message) {
  const channels = message.guild.channels.cache.array();

  return channels;
}
