module.exports = {
  name: "ping",
  description: "Pong!",
  args: false,
  usage: "ping",
  guildOnly: false,
  execute(message, args) {
    message.reply("Pong!");
  },
};
