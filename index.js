
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Bot } = require("grammy");

const configPath = path.join(__dirname, "config.json");

if (!fs.existsSync(configPath)) {
  throw new Error("config.json not found in repository root.");
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

if (!config.botToken || config.botToken === "YOUR_TELEGRAM_BOT_TOKEN") {
  throw new Error("Please configure botToken in config.json.");
}

const app = express();
const bot = new Bot(config.botToken);

app.get(config.hosting?.healthPath || "/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    bot: config.nickname,
    timestamp: new Date().toISOString()
  });
});

bot.catch((error) => {
  console.error("[PrimeX-Bot] Telegram error:", error.message);
});

bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome to ${config.nickname}!\n\n` +
    `Language: ${config.language}\n` +
    `Prefix: ${config.prefix}`
  );
});

bot.command("ping", async (ctx) => {
  await ctx.reply("Pong! Bot is responding.");
});

async function start() {
  const port = Number(config.hosting?.port || 3000);

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[PrimeX-Bot] Health server listening on ${port}`);
  });

  try {
    const me = await bot.api.getMe();

    console.log(`[PrimeX-Bot] Logged in as @${me.username}`);

    await bot.start({
      allowed_updates: [
        "message",
        "edited_message",
        "callback_query",
        "business_connection",
        "business_message",
        "edited_business_message",
        "deleted_business_messages"
      ],
      onStart: () => {
        console.log("[PrimeX-Bot] Bot started successfully.");
      }
    });
  } catch (error) {
    console.error("[PrimeX-Bot] Startup failed:", error.message);
    server.close();
    process.exitCode = 1;
  }
}

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

start();
