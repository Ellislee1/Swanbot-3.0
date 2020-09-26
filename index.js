require("dotenv").config();

const fs = require("fs");
const Discord = require("discord.js");
const { prefix } = require("./config.json");
const sqDB = require("./database/db");
const Modules = require("./database/models/Module");
const Groups = require("./database/models/Groups");

const client = new Discord.Client();
const TOKEN = process.env.TOKEN;
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", async () => {
  await sqDB
    .authenticate()
    .then(() => {
      console.log("Connected to database!");
      buildTables();
    })
    .catch((error) =>
      console.log("ERROR:: Error connecting to database!", error)
    );
  console.log("Ready!");
});

client.on("message", async (message) => {
  try {
    if (!message.author.bot) {
      log(message);
    }
  } catch {}
  // Drop out if message does not start with a prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Split message up into command and arguments
  const args = message.content.slice(prefix.length).trim().split(" ");
  const commandName = args.shift().toLowerCase();
  try {
    console.log(
      `${new_date()} ${message.member.user.tag} [${
        message.channel.name
      }]:!<${commandName}>[${args}]`
    );
  } catch (err) {}

  message.guild;

  // get the command name
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // Chesk the command exists
  if (!command)
    return message.reply(
      "That is not a valid command, use `!help` for a list of commands."
    );

  // check to see if the command is guild only
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check if arguments are required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\n The proper usage for this command is: \`${prefix}${commandName} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // If the command has a cool down
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Try to execute the command
  try {
    if (command.database) {
      command.execute(message, args, sqDB);
    } else {
      command.execute(message, args);
    }
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

function buildTables() {
  Modules.init(sqDB);
  Groups.init(sqDB);

  sqDB.sync();
}

function log(message) {
  const channel = message.guild.channels.cache.find(
    (channel) => channel.name == "log"
  );

  channel.send(
    `\`\`\`${new_date()} ${message.member.user.tag} [${
      message.channel.name
    }]:\n${message.content}\`\`\``
  );
}

function new_date() {
  var date = new Date();

  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth();

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  newdate =
    year +
    "-" +
    month +
    "-" +
    day +
    "T" +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    "Z";

  return newdate;
}

client.login(TOKEN);
