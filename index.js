require("dotenv").config();

const sqDB = require("./database/db");
const Modules = require("./database/models/Module");
const Groups = require("./database/models/Groups");
const Log = require("./database/models/Log.js");
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const TOKEN = process.env.TOKEN;

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '228555209016606720',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['general', 'General commands'],
        ['admin', 'Commands for admins'],
        ['uni specific', 'Commands used for uni related work'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
client.once('ready', async () => {
    await sqDB
    .authenticate()
    .then(() => {
      console.log("Connected to database!");
      buildTables();
    })


	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);

client.login(TOKEN);

client.on("message", (message)=> {
    if (!message.author.bot) {
      log(message);
    }
})

function buildTables() {
  Modules.init(sqDB);
  Groups.init(sqDB);
  Log.init(sqDB);

  sqDB.sync();
}

function log(message) {
  try {
    const channel = message.guild.channels.cache.find(
      (channel) => channel.name == "log"
    );
    date = get_date();
    time = get_time();
    user = message.member.user.tag;
    chan = message.channel.name;
    content = String(message.content);
    const data = [date, time, user, chan, content];

    logging(data);

    channel.send(
      `\`\`\`${new_date()} ${user} [${chan}]:\n${content}\`\`\``
    );
  } catch (err) {
    console.log(err)
  }
}


function get_date() {
  var date = new Date();

  var year = date.getFullYear();
  var day = date.getDay();
  var month = date.getMonth();

  console.log(month)
  console.log(day)
  newdate =
    year +
    "-" +
    month +
    "-" +
    day;
  
  return newdate
}

function get_time() {
  var date = new Date();

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

  newtime =
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  
  return newtime
}

function new_date() {
  var date = new Date();

  var year = date.getFullYear();
  var day = date.getDate()();
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

async function logging(args) {
  try {
    console.log(args[0])
		await Log.create({
			date: args[0],
			time: args[1],
			user: args[2],
			channel: args[3],
			message: args[4]
    });
    console.log('Saved to server');
  } catch (err) {
    console.log("Error:")
    console.log(err);
  }
}