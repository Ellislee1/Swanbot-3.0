const Discord = require("discord.js");
const banned_characters = ["<", ">", "!", "@", "&", "#"];
const Group = require("../database/models/Groups.js");

module.exports = {
  // Required - The name of the command
  name: "group",
  // Other ways to call the command
  aliases: ["team"],
  // Required - What the command does
  description: "Create a channel and add people to it for a provate group.",
  // Required - How to use the command
  usage:
    "<group name> <users to add>. The group name must be all lowercase and no spaces i.e. <group_alpha>",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 0,
  // If access to the client is needed
  client: false,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, database) {
    const name = args.shift().toLowerCase();
    const creator = message.author.id;
    const users = args;
    const guild = message.guild;
    let everyone_id = get_role_id(message, "@everyone");

    let category = guild.channels.cache.find(
      (c) => c.name == "Private" && c.type == "category"
    );

    console.log(`Name ${name}, creator ${creator}, users ${users[0]}`);

    if (name.length > 25 || name.langth < 1) {
      message.reply(
        "Please ensure that the name is less than 25 characters and greater than 1"
      );
      return;
    }

    if (banned_characters.includes(name[0])) {
      message.reply(
        "Please ensure the name starts with a valid character i.e. not @,#,!,&,<,> etc"
      );
      return;
    }

    // Check if channel name already exists
    const created = await check_name(name);

    if (created) {
      message.reply("That group name is already in use, Sorry!");
      return;
    } else {
      guild.channels.create(name, {
        type: "text",
        parent: category.id,
        permissionOverwrites: [
          {
            id: everyone_id.toString(),
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: creator,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });

      let channel = guild.channels.cache.find(
        (c) => c.name == name && c.type == "text"
      );

      addmembers(guild, channel, users);

      await add_channel(message, name, creator, users);
    }
  },
};

async function check_name(name) {
  var groups = await Group.findAll({
    attributes: ["group_name"],
    where: {
      group_name: name,
    },
  });
  console.log(`Found: ${groups.length} records`);
  return groups.length >= 1;
}

async function add_channel(message, name, creator, users) {
  const channel = await Group.create({
    group_name: name,
    group_creator: creator,
    creation_date: new Date(),
    users: "N/A",
  });

  if (!channel) {
    message.reply("there was an error creating the channel");
  }
  return;
}

function get_role_id(message, role_to) {
  return message.guild.roles.cache.find((role) => role.name === role_to).id;
}

function addmembers(guild, channel, users) {
  users.forEach((user) => {
    usr = user.substring(3, 21);
    // let this_user = guild.members.cache.get(user.id);

    channel.overwritePermissions([
      {
        id: usr,
        deny: ["VIEW_CHANNEL"],
      },
    ]);
  });
}
