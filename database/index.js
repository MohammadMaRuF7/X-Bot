
const { Pool } = require("pg");
const config = require("../core/config");

let pool = null;
let initialized = false;

function getPool() {
  if (config.database?.enabled !== true) {
    throw new Error("Database is disabled in config.json.");
  }

  if (pool) return pool;

  const connectionString = config.database.connectionString;

  if (
    typeof connectionString !== "string" ||
    !connectionString.trim() ||
    connectionString === "YOUR_POSTGRESQL_CONNECTION_STRING"
  ) {
    throw new Error(
      "Set a valid PostgreSQL connectionString in config.json."
    );
  }

  pool = new Pool({
    connectionString,
    ssl: config.database.ssl
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    application_name: "PrimeX-Bot"
  });

  pool.on("error", (error) => {
    console.error("[Database] Idle connection error:", error.message);
  });

  return pool;
}

async function query(text, params = []) {
  return getPool().query(text, params);
}

async function initDatabase() {
  if (config.database?.enabled !== true) {
    console.log("[Database] Disabled.");
    return false;
  }

  if (initialized) return true;

  const db = getPool();

  await db.query("SELECT 1");

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id BIGINT PRIMARY KEY,
      first_name TEXT NOT NULL DEFAULT '',
      username TEXT,
      language TEXT NOT NULL DEFAULT 'en',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS groups (
      chat_id BIGINT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      prefix TEXT,
      welcome_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      setting_key TEXT PRIMARY KEY,
      setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  initialized = true;
  console.log("[Database] Connected and initialized.");

  return true;
}

async function closeDatabase() {
  if (!pool) return;

  const currentPool = pool;

  pool = null;
  initialized = false;

  await currentPool.end();

  console.log("[Database] Connection pool closed.");
}

module.exports = {
  getPool,
  query,
  initDatabase,
  closeDatabase
};
