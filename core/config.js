const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");

if (!fs.existsSync(configPath)) {
  throw new Error("config.json was not found.");
}

let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch (error) {
  throw new Error(`Invalid config.json: ${error.message}`);
}

if (
  typeof config.botToken !== "string" ||
  !config.botToken.trim() ||
  config.botToken === "YOUR_TELEGRAM_BOT_TOKEN"
) {
  throw new Error("Set a valid botToken in config.json.");
}

if (!Array.isArray(config.admins)) {
  config.admins = [];
}

config.admins = config.admins.map(String);
config.nickname = config.nickname || "PrimeX Bot";
config.prefix = config.prefix || "!";
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