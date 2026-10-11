
const { Pool } = require("pg");
const config = require("../core/config");

const databaseConfig = config.database || {};

let pool = null;

function getPool() {
  if (databaseConfig.enabled !== true) {
    throw new Error("Database is disabled in config.json.");
  }

  if (pool) return pool;

  if (
    !databaseConfig.connectionString ||
    databaseConfig.connectionString ===
      "YOUR_POSTGRESQL_CONNECTION_STRING"
  ) {
    throw new Error("PostgreSQL connectionString is not configured.");
  }

  pool = new Pool({
    connectionString: databaseConfig.connectionString,
    ssl: databaseConfig.ssl
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pool.on("error", (error) => {
    console.error("[Database] Idle client error:", error.message);
  });

  return pool;
}

async function query(text, params = []) {
  return getPool().query(text, params);
}

async function initDatabase() {
  const db = getPool();

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

  console.log("[Database] Tables initialized.");
}

async function closeDatabase() {
  if (!pool) return;

  const currentPool = pool;
  pool = null;

  await currentPool.end();
}

module.exports = {
  getPool,
  query,
  initDatabase,
  closeDatabase
};
