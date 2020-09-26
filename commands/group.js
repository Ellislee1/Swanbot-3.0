const Discord = require("discord.js");

module.exports = {
  // Required - The name of the command
  name: "group",
  // Other ways to call the command
  aliases: ["team"],
  // Required - What the command does
  description: "Create a channel and add people to it for a provate group.",
  // Required - How to use the command
  usage:
    "<group name> <users to add>. The group name must be all lowercase and no spaces i.e. `group_alpha`",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 30,
  // If access to the client is needed
  client: false,
  // If the command needs access to the database
  database: true,
  // Execute command
  execute(message, args, database) {
    const name = args.shift().toLowerCase();
    const creator = message.author.id;
    const users = args;

    console.log(`Name ${name}, creator ${creator}, users ${users}`);

    if (name.length > 25 || name.langth < 1) {
      message.reply(
        "Please ensure that the name is less than 25 characters and greater than 1"
      );
      return;
    }

    if (name[0] == "@" || name[0] == "#") {
      message.reply(
        "Please ensure the name starts with a valid character i.e. not @/#"
      );
      return;
    }
  },
};
