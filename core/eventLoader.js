
const fs = require("fs");
const path = require("path");

function loadEvents(bot) {
  const eventsPath = path.join(
    __dirname,
    "..",
    "app",
    "events"
  );

  if (!fs.existsSync(eventsPath)) {
    throw new Error("[EventLoader] app/events directory not found.");
  }

  const files = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"))
    .sort();

  const registered = [];

  for (const file of files) {
    const filePath = path.join(eventsPath, file);

    try {
      const event = require(filePath);

      if (
        !event.config ||
        typeof event.config.name !== "string" ||
        typeof event.register !== "function"
      ) {
        throw new Error(
          "Event must export config.name and register(bot)."
        );
      }

      event.register(bot);
      registered.push(event.config.name);

      console.log(`[EventLoader] Registered ${event.config.name}`);
    } catch (error) {
      console.error(`[EventLoader] Failed ${file}:`, error.message);
      throw error;
    }
  }

  console.log(
    `[EventLoader] Registered ${registered.length} events.`
  );

  return registered;
}

module.exports = { loadEvents };
