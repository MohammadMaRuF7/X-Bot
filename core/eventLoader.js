const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

async function loadEvents(bot) {
  const eventsPath = path.join(__dirname, "..", "app", "events");

  if (!fs.existsSync(eventsPath)) {
    logger.info("No events directory found.");
    return;
  }

  const files = fs.readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(eventsPath, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const event = require(filePath);

      if (!event || typeof event.register !== "function") {
        logger.error(`Invalid event module: ${file}`);
        continue;
      }

      event.register(bot);
      logger.info(`Loaded event: ${event.name || file}`);
    } catch (error) {
      logger.error(`Failed to load event ${file}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = loadEvents;