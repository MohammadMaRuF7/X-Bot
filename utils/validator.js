function isValidPrefix(prefix) {
  return (
    typeof prefix === "string" &&
    prefix.length >= 1 &&
    prefix.length <= 5 &&
    !/\s/.test(prefix)
  );
}

function isValidTelegramId(id) {
  return /^\d+$/.test(String(id));
}

module.exports = {
  isValidPrefix,
  isValidTelegramId
};