const config = require("../core/config");

function isBotToBotEnabled() {
  return config.features?.botToBot === true;
}

function shouldProcessBotMessage(message) {
  if (!isBotToBotEnabled()) return false;

  return Boolean(message?.from?.is_bot);
}

module.exports = {
  isBotToBotEnabled,
  shouldProcessBotMessage
};