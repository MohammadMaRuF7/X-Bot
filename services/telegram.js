const config = require("../core/config");

async function sendMessage(bot, chatId, text, options = {}) {
  return bot.api.sendMessage(chatId, text, options);
}

async function getBotInfo(bot) {
  return bot.api.getMe();
}

async function getMember(bot, chatId, userId) {
  return bot.api.getChatMember(chatId, userId);
}

module.exports = {
  sendMessage,
  getBotInfo,
  getMember
};