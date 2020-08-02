const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  // Required - The name of the command
  name: "help",
  // Other ways to call the command
  aliases: ["commands"],
  // Required - What the command does
  description: "Lists all commands or a usage for a specific command",
  // How to use the command
  usage: "<command name> or !help",
  // Required - If arguments are expected
  args: false,
  // Required - If the command should only be executed inside a guild
  guildOnly: false,
  // Time in between command usages (seconds)
  cooldown: 2,
  // Execute command
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    // List all commands
    if (!args.length) {
      let embed = new Discord.MessageEmbed()
        .setColor("#8332a8")
        .setTitle("Commands")
        .setDescription(
          `Hi! I'm Swanbot 3.0. I'm a custom bot made by a student for the Compsci/Software Eng MSc/MEng Discord. Please find below a list of my commands.\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
        );

      commands.forEach((command) => {
        commandName = command.name;
        embed.addField(commandName, command.description);
      });

      return message.author
        .send(embed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "it seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }

    // Details for a specific command
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    let embed = new Discord.MessageEmbed()
      .setColor("#8332a8")
      .setTitle(command.name)
      .setDescription(command.description);

    if (command.aliases) embed.addField("aliases", command.aliases);
    if (command.usage)
      embed.addField("Usage", `${prefix}${command.name} ${command.usage}`);

    embed.addField("Cooldown", `${command.cooldown || 3} seconds`);

    message.channel.send(embed);
  },
};
