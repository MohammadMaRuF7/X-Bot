
const fs = require("fs");
const path = require("path");
const config = require("./config");

const languageCache = new Map();

function loadLanguage(language) {
  const code = String(language || "en").toLowerCase();
  const filePath = path.join(
    __dirname,
    "..",
    "languages",
    `${code}.lang`
  );

  if (languageCache.has(code)) {
    return languageCache.get(code);
  }

  if (!fs.existsSync(filePath)) {
    if (code !== "en") {
      return loadLanguage("en");
    }

    throw new Error("Default language file languages/en.lang is missing.");
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  languageCache.set(code, data);

  return data;
}

function getText(key, replacements = {}, language = config.language) {
  const messages = loadLanguage(language);
  let result = messages[key];

  if (typeof result !== "string") {
    result = loadLanguage("en")[key];
  }

  if (typeof result !== "string") {
    return key;
  }

  for (const [name, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{${name}}`, String(value));
  }

  return result;
}

module.exports = {
  getText,
  loadLanguage
};
