
const { loadCommands } = require("../../core/loader");
const { createHandler } = require("../../core/handler");

const commands = loadCommands();
const handleMessage = createHandler(commands);

module.exports = {
  config: {
    name: "message",
    version: "1.0.0",
    author: "𝐌𝐚𝐑𝐮𝐅",
    description: "Handle incoming Telegram commands."
  },

  register(bot) {
    bot.on("message:text", async (ctx) => {
      await handleMessage(ctx);
    });
  }
};
