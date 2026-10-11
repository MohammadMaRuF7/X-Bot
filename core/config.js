const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");

let config = {};

if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid config.json: ${error.message}`);
  }
}

const configToken =
  typeof config.botToken === "string"
    ? config.botToken.trim()
    : "";

const variableToken =
  typeof process.env.BOT_TOKEN === "string"
    ? process.env.BOT_TOKEN.trim()
    : "";

const isPlaceholder = (token) =>
  !token || token === "YOUR_TELEGRAM_BOT_TOKEN";

const botToken = !isPlaceholder(configToken)
  ? configToken
  : variableToken;

if (isPlaceholder(botToken)) {
  throw new Error(
    "Bot token missing! Set botToken in config.json or BOT_TOKEN in hosting variables."
  );
}

config.botToken = botToken;

config.admins = Array.isArray(config.admins)
  ? config.admins.map(String)
  : [];

config.nickname =
  typeof config.nickname === "string" && config.nickname.trim()
    ? config.nickname.trim()
    : "PrimeX Bot";

config.prefix =
  typeof config.prefix === "string" && config.prefix.length
    ? config.prefix
    : "!";

config.language = config.language || "bn";

config.features = {
  multiLanguage: true,
  selfListen: true,
  botToBot: true,
  adminOnly: false,
  adminUsePrefix: false,
  business: true,
  businessAutoReply: false,
  healthServer: true,
  groupAdminCommands: true,
  customPrefix: true,
  welcome: true,
  ...(config.features || {})
};

config.business = {
  enabled: true,
  autoReply: false,
  replyText: "ধন্যবাদ! আপনার মেসেজ পেয়েছি।",
  ...(config.business || {})
};

config.hosting = {
  port: 3000,
  healthPath: "/health",
  ...(config.hosting || {})
};

module.exports = config;