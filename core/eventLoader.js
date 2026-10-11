
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
    fs.mkdirSync(eventsPath, { recursive: true });
    return;
  }

  const files = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"))
    .sort();

  for (const file of files) {
    const filePath = path.join(eventsPath, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const event = require(filePath);

      if (typeof event.register !== "function") {
        console.warn(`[EventLoader] Invalid event: ${file}`);
        continue;
      }

      event.register(bot);

      console.log(
        `[EventLoader] Registered ${event.config?.name || file}`
      );
    } catch (error) {
      console.error(
        `[EventLoader] Failed ${file}:`,
        error.message
      );

      throw error;
    }
  }
}

module.exports = { loadEvents };
