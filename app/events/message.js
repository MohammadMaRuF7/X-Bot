const { handleMessage } = require("../../core/handler");

module.exports = {
  name: "message",
  register(bot) {
    bot.on("message:text", async (ctx) => {
      await handleMessage(ctx);
    });
  }
};