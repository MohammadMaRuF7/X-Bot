
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error("[Config] config.json not found.");
  }

  let config;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`[Config] Invalid JSON: ${error.message}`);
  }

  if (
    typeof config.botToken !== "string" ||
    !config.botToken.trim() ||
    config.botToken === "YOUR_TELEGRAM_BOT_TOKEN"
  ) {
    throw new Error("[Config] Set a valid botToken in config.json.");
  }

  if (!Array.isArray(config.admins)) {
    throw new Error("[Config] admins must be an array.");
  }

  if (
    typeof config.prefix !== "string" ||
    !config.prefix.length ||
    /\s/.test(config.prefix)
  ) {
    throw new Error("[Config] prefix must be a non-empty string without spaces.");
  }

  if (
    typeof config.language !== "string" ||
    !/^[a-z]{2,3}$/i.test(config.language)
  ) {
    throw new Error("[Config] language must be a valid language code.");
  }

  config.nickname ||= "PrimeX Bot";
  config.apiTokens ||= {};
  config.features ||= {};
  config.business ||= {};
  config.hosting ||= {};

  config.features.multiLanguage ??= true;
  config.features.selfListen ??= false;
  config.features.botToBot ??= false;
  config.features.adminOnly ??= false;
  config.features.adminUsePrefix ??= false;
  config.features.business ??= false;
  config.features.businessAutoReply ??= false;
  config.features.healthServer ??= true;
  config.features.groupAdminCommands ??= true;
  config.features.customPrefix ??= true;

  config.business.enabled ??= false;
  config.business.autoReply ??= false;
  config.business.allowedUpdates ??= true;

  config.hosting.port ??= 3000;
  config.hosting.healthPath ||= "/health";

  config.admins = config.admins.map(String);

  return config;
}

module.exports = loadConfig();
