
const config = require("./config");
const { canRun } = require("./permissions");

function createHandler(commands) {
  return async function handleMessage(ctx) {
    if (!ctx.message?.text || !ctx.from) return;

    const text = ctx.message.text.trim();
    const prefix = config.prefix || "!";

    const isAdmin = config.admins
      .map(String)
      .includes(String(ctx.from.id));

    const prefixRequired =
      !(isAdmin && config.features?.adminUsePrefix === false);

    if (prefixRequired && !text.startsWith(prefix)) {
      return;
    }

    if (!prefixRequired && !text.startsWith(prefix)) {
      if (text.startsWith("/")) return;
    }

    const input = prefixRequired
      ? text.slice(prefix.length).trim()
      : text.trim();

    if (!input) return;

    const [name, ...args] = input.split(/\s+/);
    const command = commands.get(name.toLowerCase());

    if (!command) return;

    const meta = command.config;
    const requiredRole = Number(meta.role ?? 0);

    if (!(await canRun(ctx, requiredRole))) {
      await ctx.reply("You do not have permission to use this command.");
      return;
    }

    try {
      await command.execute({
        ctx,
        args,
        config,
        command: meta
      });
    } catch (error) {
      console.error(
        `[Command: ${meta.name}]`,
        error
      );

      await ctx.reply("An error occurred while executing this command.");
    }
  };
}

module.exports = { createHandler };
