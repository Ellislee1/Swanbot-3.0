const Discord = require("discord.js");
const Module = require("../database/models/Module.js");
const { Op } = require("sequelize");

module.exports = {
  // Required - The name of the command
  name: "modules",
  // Other ways to call the command
  aliases: ["mods", "classes"],
  // Required - What the command does
  description:
    "Show a list of all modules that belong to a specific MSc/MEng course.",
  // Required - How to use the command
  usage:
    "<Course Abbreviation>\\nCourses:\nInt-MSc: Integrated Masters\nAcs-MSc: Advanced Computer Science, MSc\nDS-MSc: Data Science, MSc\nCBY-MSc: Cyber Security, MSc\nCS-MSc: Computer Science, MSc\nBDAI-MSc: Human-Centred Big Data and Artificial Intelligence, MSc\nMENG: Software Engineering, MEng",
  // Required - If arguments are expected
  args: true,
  // Required - If the command should only be executed inside a guild
  guildOnly: false,
  // Time in between command usages (seconds)
  cooldown: 5,
  // If the command needs access to the database
  database: true,
  // Execute command
  async execute(message, args, database) {
    var course = args[0].toUpperCase();
    var modules = await get_modules(course);

    embed_base = new Discord.MessageEmbed()
      .setColor("#8332a8")
      .setTitle("Modules")
      .setDescription(
        `These are the module codes and titles that are related to the course ${course}`
      )
      .setTimestamp()
      .setFooter("- Swanbot 3.0 ❤️");

    modules.forEach((module) => {
      embed_base.addField(
        module.dataValues.module_title,
        module.dataValues.module_code,
        true
      );
    });

    message.reply(embed_base);
  },
};

async function get_modules(course) {
  var modules = await Module.findAll({
    attributes: ["module_code", "module_title"],
    where: {
      module_courses: { [Op.substring]: course },
    },
  });
  console.log(`Found: ${modules.length} records`);
  return modules;
}
