const Discord = require("discord.js");
const Group = require("../database/models/Groups.js");

module.exports = {
  // Required - The name of the command
  name: "inv",
  // Other ways to call the command
  aliases: ["invite", "add"],
  // Required - What the command does
  description: "Add a member to a private channel",
  // Required - How to use the command
  usage: "<user tag>",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 2,
  // If access to the client is needed
  client: false,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, database) {
    var name = message.channel.name;
    await get_owner(name);
  },
};

async function get_owner(chan_name) {
  var creator = await Group.findAll({
    attributes: ["group_creator"],
    where: {
      group_name: name,
    },
  });
  console.log(creator);
  console.log(creator == "");
  return;
}
