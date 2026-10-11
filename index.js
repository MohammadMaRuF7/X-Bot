
const express = require("express");
const { Bot } = require("grammy");
const config = require("./core/config");
const { loadEvents } = require("./core/eventLoader");

const app = express();
const bot = new Bot(config.botToken);

let shuttingDown = false;
let healthServer;

app.get(
  config.hosting?.healthPath || "/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      status: shuttingDown ? "shutting_down" : "healthy",
      bot: config.nickname,
      timestamp: new Date().toISOString()
    });
  }
);

bot.catch((error) => {
  console.error(
    "[PrimeX-Bot] Telegram update error:",
    error.message
  );
});

async function start() {
  const port = Number(config.hosting?.port || 3000);

  healthServer = app.listen(port, "0.0.0.0", () => {
    console.log(`[Health] Listening on port ${port}`);
  });

  try {
    await bot.init();

    console.log(
      `[PrimeX-Bot] Initialized as @${bot.botInfo.username}`
    );

    loadEvents(bot);

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
      onStart: () => {
        console.log("[PrimeX-Bot] Polling started.");
      }
    });
  } catch (error) {
    console.error(
      "[PrimeX-Bot] Startup failed:",
      error
    );

    await shutdown();
    process.exitCode = 1;
  }
}

async function shutdown() {
  if (shuttingDown) return;

  shuttingDown = true;

  try {
    await bot.stop();
  } catch (error) {
    console.error("[Shutdown] Bot stop:", error.message);
  }

  if (healthServer) {
    await new Promise((resolve) => {
      healthServer.close(resolve);
    });
  }
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

start();
