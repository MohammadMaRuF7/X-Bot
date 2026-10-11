
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config.json");

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error("config.json was not found.");
  }

  let config;

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid config.json: ${error.message}`);
  }

  if (!config.botToken) {
    throw new Error("botToken is required in config.json.");
  }

  config.nickname ||= "PrimeX Bot";
  config.prefix ||= "!";
  config.language ||= "en";
  config.admins ||= [];
  config.features ||= {};

  return config;
}

module.exports = loadConfig();
