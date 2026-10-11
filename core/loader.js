
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
  const loadedFiles = [];

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
      const command = require(filePath);
      const meta = command.config;

      if (
        !meta ||
        typeof meta.name !== "string" ||
        !meta.name.trim() ||
        typeof command.execute !== "function"
      ) {
        throw new Error(
          "Command requires config.name and an execute function."
        );
      }

      if (
        meta.role !== undefined &&
        ![0, 1, 2].includes(Number(meta.role))
      ) {
        throw new Error("Command role must be 0, 1, or 2.");
      }

      const names = [
        meta.name,
        ...(Array.isArray(meta.aliases) ? meta.aliases : [])
      ];

      const normalized = names.map(name => {
        if (typeof name !== "string" || !name.trim()) {
          throw new Error("Command names and aliases must be non-empty strings.");
        }

        return name.trim().toLowerCase();
      });

      if (new Set(normalized).size !== normalized.length) {
        throw new Error("Duplicate names or aliases in command metadata.");
      }

      for (const name of normalized) {
        if (commands.has(name)) {
          throw new Error(`Command name or alias already registered: ${name}`);
        }
      }

      for (const name of normalized) {
        commands.set(name, command);
      }

      loadedFiles.push(file);
      console.log(`[Loader] Loaded ${meta.name}`);
    } catch (error) {
      console.error(`[Loader] ${file}: ${error.message}`);
      throw error;
    }
  }

  console.log(
    `[Loader] Registered ${loadedFiles.length} command files.`
  );

  return commands;
}

module.exports = { loadCommands };
