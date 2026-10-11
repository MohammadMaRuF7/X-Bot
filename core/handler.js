const config = require("./config");
const { getRuntime, getPrefix } = require("./runtime");
const { getCommand } = require("./loader");
const { canRun, isBotAdmin } = require("./permissions");
const { getText } = require("./language");
const logger = require("../utils/logger");

async function handleMessage(ctx) {
  const text = ctx.message?.text;

  if (!text || !ctx.from) return;

  const runtime = getRuntime();
  const admin = isBotAdmin(ctx.from.id);

  if (ctx.from.is_bot && !runtime.features.botToBot) return;

  if (config.features.adminOnly && !admin) return;

  const prefix = getPrefix(ctx.chat?.id);
  let body = text;

  if (text.startsWith(prefix)) {
    body = text.slice(prefix.length).trim();
  } else if (!admin || runtime.features.adminUsePrefix) {
    return;
  }

  if (!body) return;

  const parts = body.split(/\s+/);
  const commandName = parts.shift().toLowerCase();
  const args = parts;

  const command = getCommand(commandName);

  if (!command) return;

  if (!(await canRun(ctx, command.config.role))) {
    const denied = getText("permission.denied", runtime.language);

    await ctx.reply(
      typeof denied === "string"
        ? denied
        : "⛔ তোমার এই command ব্যবহার করার অনুমতি নেই।"
    );

    return;
  }

  try {
    await command.execute({
      ctx,
      args,
      config,
      runtime,
      prefix,
      command: command.config,
      getText
    });
  } catch (error) {
    logger.error(
      `Command ${commandName} failed: ${error.stack || error.message}`
    );

    await ctx.reply("❌ Command চালাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।")
      .catch(() => {});
  }
}

module.exports = { handleMessage };