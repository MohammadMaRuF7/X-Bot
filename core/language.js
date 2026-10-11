
const fs = require("fs");
const path = require("path");
const config = require("./config");

const languagesPath = path.join(__dirname, "..", "languages");
const cache = new Map();

function loadLanguage(language = config.language) {
  const code = String(language || "en").toLowerCase();

  if (cache.has(code)) {
    return cache.get(code);
  }

  const filePath = path.join(languagesPath, `${code}.lang`);

  if (!fs.existsSync(filePath)) {
    if (code !== "en") {
      return loadLanguage("en");
    }

    throw new Error("[Language] languages/en.lang not found.");
  }

  let messages;

  try {
    messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `[Language] Invalid ${code}.lang: ${error.message}`
    );
  }

  if (
    !messages ||
    typeof messages !== "object" ||
    Array.isArray(messages)
  ) {
    throw new Error(`[Language] ${code}.lang must contain a JSON object.`);
  }

  cache.set(code, messages);
  return messages;
}

function getText(key, replacements = {}, language = config.language) {
  const messages = loadLanguage(language);
  let message = messages[key];

  if (typeof message !== "string") {
    message = loadLanguage("en")[key];
  }

  if (typeof message !== "string") {
    return key;
  }

  return message.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(replacements, name)
      ? String(replacements[name])
      : match;
  });
}

function clearLanguageCache() {
  cache.clear();
}

module.exports = {
  loadLanguage,
  getText,
  clearLanguageCache
};
