const Discord = require("discord.js");
const Module = require("../database/models/Module");
const fs = require("fs");
const filePath = "./files/modules-static.json";

module.exports = {
  // Required - The name of the command
  name: "popmodules",
  // Other ways to call the command
  aliases: ["createmodules", "cm", "pm", "pop"],
  // Required - What the command does
  description: "Admin command to populate the modules table",
  // Required - How to use the command
  usage: "",
  // Required - If the command should only be executed inside a guild
  guildOnly: true,
  // Time in between command usages (seconds)
  cooldown: 0,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, db) {
    memberRoles = message.member.roles.cache;
    if (!memberRoles.some((role) => role.name === "Owner")) {
      return message.reply("You do not have the required role for this.");
    }

    const modules = await get_modules(course);
  },
};

function loadFile() {
  let location = fs.readFileSync(filePath);
  let data = JSON.parse(location);
  return data.modules;
}

function getCourses(coursesArray) {
  courses = "";
  coursesArray.forEach((course) => {
    courses += course;
    courses += ",";
  });
  return courses.slice(0, -1);
}

async function get_modules(course) {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title", "channel_name", "channel_type"],
    where: {
      module_courses: { [Op.substring]: course },
    },
  });
  console.log(`Found: ${modules.length} records`);
  return modules;
}
