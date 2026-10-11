
const fs = require("fs");
const path = require("path");

function loadCommands() {
  const commandsPath = path.join(
    __dirname,
    "..",
    "app",
    "commands"
  );

  const commands = new Map();

  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
    return commands;
  }

  const files = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"))
    .sort();

  for (const file of files) {
    const filePath = path.join(commandsPath, file);

    try {
      delete require.cache[require.resolve(filePath)];

      const command = require(filePath);
      const meta = command.config;

      if (
        !meta?.name ||
        typeof command.execute !== "function"
      ) {
        console.warn(`[Loader] Invalid command: ${file}`);
        continue;
      }

      const names = [
        meta.name,
        ...(Array.isArray(meta.aliases) ? meta.aliases : [])
      ];

      for (const name of names) {
        const key = String(name).toLowerCase();

        if (commands.has(key)) {
          throw new Error(`Duplicate command or alias: ${key}`);
        }

        commands.set(key, command);
      }

      console.log(`[Loader] Loaded ${meta.name}`);
    } catch (error) {
      console.error(`[Loader] ${file}: ${error.message}`);
    }
  }

  return commands;
}

module.exports = { loadCommands };
