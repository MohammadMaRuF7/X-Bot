const express = require("express");
const { Bot } = require("grammy");

const config = require("./core/config");
const loadEvents = require("./core/eventLoader");
const { loadCommands } = require("./core/loader");
const registerBusinessEvents = require("./services/business");
const logger = require("./utils/logger");

const app = express();
const bot = new Bot(config.botToken);

app.get(config.hosting.healthPath || "/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    bot: config.nickname
  });
});

app.get("/", (_req, res) => {
  res.status(200).send(`${config.nickname} is running.`);
});

async function start() {
  await bot.init();

  await loadCommands();
  await loadEvents(bot);

  if (config.features.business && config.business.enabled) {
    registerBusinessEvents(bot);
  }

  if (config.features.healthServer !== false) {
    const port = Number(config.hosting.port) || 3000;

    app.listen(port, "0.0.0.0", () => {
      logger.info(`Health server listening on port ${port}`);
    });
  }

  await bot.api.deleteWebhook({ drop_pending_updates: false });

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
    onStart: (botInfo) => {
      logger.info(`Bot started: @${botInfo.username}`);
    }
  });
}

let stopping = false;

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;

  logger.info(`Received ${signal}; shutting down.`);

  try {
    await bot.stop();
  } catch (error) {
    logger.error(`Shutdown error: ${error.message}`);
  }

  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

start().catch((error) => {
  logger.error(`Startup failed: ${error.stack || error.message}`);
  process.exit(1);
});