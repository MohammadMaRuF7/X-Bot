
const express = require("express");
const { Bot } = require("grammy");
const config = require("./core/config");
const { loadEvents } = require("./core/eventLoader");
const { initDatabase, closeDatabase } = require("./database");
const { registerBusinessEvents } = require("./services/business");

const app = express();
const bot = new Bot(config.botToken);

let server;
let stopping = false;

app.get(config.hosting?.healthPath || "/health", (req, res) => {
  res.status(stopping ? 503 : 200).json({
    success: !stopping,
    status: stopping ? "shutting_down" : "healthy",
    bot: config.nickname,
    timestamp: new Date().toISOString()
  });
});

bot.catch((error) => {
  console.error("[Telegram]", error.message);
});

async function start() {
  try {
    server = app.listen(
      Number(config.hosting?.port || 3000),
      "0.0.0.0",
      () => console.log("[Health] Server started.")
    );

    if (config.database?.enabled === true) {
      await initDatabase();
    }

    await bot.init();

    loadEvents(bot);
    registerBusinessEvents(bot);

    await bot.start({
      allowed_updates: [
        "message",
        "edited_message",
        "callback_query",
        "my_chat_member",
        "chat_member",
        "business_connection",
        "business_message",
        "edited_business_message",
        "deleted_business_messages"
      ],
      onStart: (info) => {
        console.log(`[PrimeX-Bot] Started as @${info.username}`);
      }
    });
  } catch (error) {
    console.error("[Startup]", error);
    await shutdown();
    process.exitCode = 1;
  }
}

async function shutdown() {
  if (stopping) return;
  stopping = true;

  try {
    await bot.stop();
  } catch {}

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  try {
    await closeDatabase();
  } catch (error) {
    console.error("[Database shutdown]", error.message);
  }
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

start();
