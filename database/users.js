
const db = require("./index");

async function saveUser(user) {
  if (!user?.id) {
    throw new Error("A valid Telegram user ID is required.");
  }

  const result = await db.query(
    `INSERT INTO users (
      user_id, first_name, username, updated_at
    )
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      first_name = EXCLUDED.first_name,
      username = EXCLUDED.username,
      updated_at = NOW()
    RETURNING *`,
    [
      String(user.id),
      user.first_name || "",
      user.username || null
    ]
  );

  return result.rows[0];
}

async function getUser(userId) {
  const result = await db.query(
    "SELECT * FROM users WHERE user_id = $1",
    [String(userId)]
  );

  return result.rows[0] || null;
}

async function setUserLanguage(userId, language) {
  const result = await db.query(
    `UPDATE users
     SET language = $2, updated_at = NOW()
     WHERE user_id = $1
     RETURNING *`,
    [String(userId), language]
  );

  return result.rows[0] || null;
}

module.exports = {
  saveUser,
  getUser,
  setUserLanguage
};
