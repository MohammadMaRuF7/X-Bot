const config = require("../core/config");
const { getRuntime } = require("../core/runtime");
const logger = require("../utils/logger");

function registerBusinessEvents(bot) {
  bot.on("business_connection", async (ctx) => {
    const connection = ctx.update.business_connection;

    logger.info(
      `Business connection updated: ${connection.id}; enabled=${connection.is_enabled}`
    );
  });

  bot.on("business_message", async (ctx) => {
    const message = ctx.update.business_message;

    if (!message || !message.chat) return;

    const runtime = getRuntime();

    if (!runtime.features.business) return;

    logger.info(
      `Business message received: chat=${message.chat.id}, message=${message.message_id}`
    );

    const autoReply =
      runtime.business.autoReply === true &&
      runtime.features.businessAutoReply === true;

    if (!autoReply || !message.text || message.from?.is_bot) return;

    const replyText =
      runtime.business.replyText ||
      config.business.replyText ||
      "ধন্যবাদ! আপনার মেসেজ পেয়েছি।";

    try {
      await ctx.api.sendMessage(message.chat.id, replyText, {
        business_connection_id: message.business_connection_id,
        reply_parameters: {
          message_id: message.message_id
        }
      });
    } catch (error) {
      logger.error(`Business auto-reply failed: ${error.message}`);
    }
  });
}

module.exports = registerBusinessEvents;