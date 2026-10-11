const config = require("../core/config");

function registerBusinessEvents(bot) {
  if (config.features?.business !== true) return;

  bot.on("business_connection", async (ctx) => {
    const connection = ctx.businessConnection;

    console.log(
      "[Business] Connection update:",
      connection.id,
      connection.is_enabled
    );
  });

  bot.on("business_message", async (ctx) => {
    if (config.business?.enabled !== true) return;
    if (config.business?.autoReply !== true) return;

    const message = ctx.businessMessage;

    if (!message?.text || message.from?.is_bot) return;

    console.log(
      "[Business] Message received:",
      message.chat.id
    );

    // Add permission-aware business automation here.
    // Do not automatically reply to every message.
  });
}

module.exports = { registerBusinessEvents };