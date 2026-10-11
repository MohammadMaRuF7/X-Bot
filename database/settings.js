
const db = require("./index");

async function getSetting(key, defaultValue = null) {
  const result = await db.query(
    "SELECT setting_value FROM settings WHERE setting_key = $1",
    [key]
  );

  return result.rows.length
    ? result.rows[0].setting_value
    : defaultValue;
}

async function setSetting(key, value) {
  const result = await db.query(
    `INSERT INTO settings (
      setting_key, setting_value, updated_at
    )
    VALUES ($1, $2::jsonb, NOW())
    ON CONFLICT (setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      updated_at = NOW()
    RETURNING setting_key, setting_value`,
    [key, JSON.stringify(value)]
  );

  return result.rows[0];
}

async function deleteSetting(key) {
  const result = await db.query(
    "DELETE FROM settings WHERE setting_key = $1",
    [key]
  );

  return result.rowCount > 0;
}

module.exports = {
  getSetting,
  setSetting,
  deleteSetting
};
