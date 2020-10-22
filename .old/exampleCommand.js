const Discord = require("discord.js");

module.exports = {
  // Required - The name of the command
  name: "",
  // Other ways to call the command
  aliases: [],
  // Required - What the command does
  description: "",
  // Required - How to use the command
  usage: "",
  // Required - If arguments are expected
  args: false,
  // Required - If the command should only be executed inside a guild
  guildOnly: false,
  // Time in between command usages (seconds)
  cooldown: false,
  // If access to the client is needed
  client: false,
  // If the command needs access to the database
  database: false,
  // Execute command
  execute(message, args, { client }, { database }) {
    message.channels.send("Pong!");
  },
};
