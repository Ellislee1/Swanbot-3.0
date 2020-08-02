module.exports = {
  name: "ping",
  description: "Pong!",
  args: false,
  usage: "",
  guildOnly: false,
  execute(message, args) {
    message.channels.send("Pong!");
  },
};
