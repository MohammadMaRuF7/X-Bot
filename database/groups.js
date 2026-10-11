
const db = require("./index");

async function saveGroup(chat) {
  if (!chat?.id) {
    throw new Error("A valid Telegram chat ID is required.");
  }

  const result = await db.query(
    `INSERT INTO groups (chat_id, title, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (chat_id)
     DO UPDATE SET
       title = EXCLUDED.title,
       updated_at = NOW()
     RETURNING *`,
    [String(chat.id), chat.title || ""]
  );

  return result.rows[0];
}

async function getGroup(chatId) {
  const result = await db.query(
    "SELECT * FROM groups WHERE chat_id = $1",
    [String(chatId)]
  );

  return result.rows[0] || null;
}

async function setGroupPrefix(chatId, prefix) {
  const result = await db.query(
    `UPDATE groups
     SET prefix = $2, updated_at = NOW()
     WHERE chat_id = $1
     RETURNING *`,
    [String(chatId), prefix]
  );

  return result.rows[0] || null;
}

async function setWelcome(chatId, enabled) {
  const result = await db.query(
    `UPDATE groups
     SET welcome_enabled = $2, updated_at = NOW()
     WHERE chat_id = $1
     RETURNING *`,
    [String(chatId), Boolean(enabled)]
  );

  return result.rows[0] || null;
}

module.exports = {
  saveGroup,
  getGroup,
  setGroupPrefix,
  setWelcome
};
