const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const commands = new Map();
const aliases = new Map();

async function loadCommands() {
  const commandsPath = path.join(__dirname, "..", "app", "commands");

  commands.clear();
  aliases.clear();

  if (!fs.existsSync(commandsPath)) {
    logger.info("No commands directory found.");
    return commands;
  }

  const files = fs.readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(commandsPath, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);
      const meta = command.config;

      if (
        !meta ||
        typeof meta.name !== "string" ||
        typeof command.execute !== "function"
      ) {
        logger.error(`Invalid command module: ${file}`);
        continue;
      }

      const name = meta.name.toLowerCase();

      if (commands.has(name) || aliases.has(name)) {
        logger.error(`Duplicate command name: ${name}`);
        continue;
      }

      command.config.aliases = Array.isArray(meta.aliases)
        ? meta.aliases.map((alias) => String(alias).toLowerCase())
        : [];

      command.config.role = Number.isInteger(meta.role)
        ? meta.role
        : 0;

      commands.set(name, command);

      for (const alias of command.config.aliases) {
        if (commands.has(alias) || aliases.has(alias)) {
          logger.error(`Duplicate command alias: ${alias}`);
          continue;
        }

        aliases.set(alias, name);
      }

      logger.info(`Loaded command: ${name}`);
    } catch (error) {
      logger.error(`Failed to load command ${file}: ${error.message}`);
      throw error;
    }
  }

  return commands;
}

function getCommand(name) {
  const key = String(name || "").toLowerCase();
  const commandName = aliases.get(key) || key;

  return commands.get(commandName) || null;
}

function getAllCommands() {
  return [...commands.values()];
}

module.exports = {
  loadCommands,
  getCommand,
  getAllCommands,
  commands,
  aliases
};