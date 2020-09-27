const Discord = require("discord.js");
const Group = require("../database/models/Groups.js");

module.exports = {
  // Required - The name of the command
  name: "inv",
  // Other ways to call the command
  aliases: ["invite", "add"],
  // Required - What the command does
  description:
    "Add a member to a private channel, using their IDs (right click name copy id)",
  // Required - How to use the command
  usage: "<user tags>, !inv 671435844510416916 747415844510416916",
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
    const guild = message.guild;
    const channel = message.channel;
    const author_id = message.author.id;
    const owner = await get_owner(channel.name);

    if (owner == "") {
      message.reply(
        "This channel is not a private channel and you can not invite people to it."
      );
      return;
    }

    console.log(author_id.toString());
    console.log(owner.toString());

    console.log(author_id.toString() == owner.toString());
    if (author_id.toString() != owner.toString()) {
      message.reply("You must be the creator of the channel to invite people.");
      return;
    }

    addmembers(guild, channel, args);
  },
};

async function get_owner(chan_name) {
  var creator = await Group.findAll({
    attributes: ["group_creator"],
    where: {
      group_name: chan_name,
    },
  });
  console.log(creator[0].dataValues.group_creator);
  return creator[0].dataValues.group_creator;
}

function addmembers(guild, channel, users) {
  console.log(channel);
  users.forEach((user) => {
    let this_user = guild.members.cache.get(user);

    channel
      .createOverwrite(this_user, {
        VIEW_CHANNEL: true,
      })
      .then((channel) =>
        console.log(channel.permissionOverwrites.get(this_user.id))
      )
      .catch(console.error);
  });
}
