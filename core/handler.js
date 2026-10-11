
const config = require("./config");
const { canRun, isBotAdmin } = require("./permissions");
const { getText } = require("./language");

function createHandler(commands) {
  return async function handleMessage(ctx) {
    if (!ctx.message?.text || !ctx.from) return;

    const text = ctx.message.text.trim();
    if (!text) return;

    const prefix = config.prefix || "!";
    const admin = isBotAdmin(ctx.from.id);
    const adminUsePrefix = config.features.adminUsePrefix === true;

    const hasPrefix = text.startsWith(prefix);
    const prefixRequired = !admin || adminUsePrefix;

    if (prefixRequired && !hasPrefix) return;

    if (!prefixRequired && !hasPrefix && text.startsWith("/")) {
      return;
    }

    const input = hasPrefix
      ? text.slice(prefix.length).trim()
      : text;

    if (!input) return;

    const [name, ...args] = input.split(/\s+/);
    const command = commands.get(name.toLowerCase());

    if (!command) return;

    const requiredRole = Number(command.config.role ?? 0);

    if (![0, 1, 2].includes(requiredRole)) {
      console.error(
        `[Handler] Invalid role for ${command.config.name}`
      );
      return;
    }

    const allowed = await canRun(ctx, requiredRole);

    if (!allowed) {
      await ctx.reply(
        getText("no_permission", {}, config.language)
      );
      return;
    }

    try {
      await command.execute({
        ctx,
        args,
        config,
        command: command.config
      });
    } catch (error) {
      console.error(
        `[Command: ${command.config.name}]`,
        error
      );

      await ctx.reply(
        getText("command_error", {}, config.language)
      );
    }
  };
}

module.exports = { createHandler };
