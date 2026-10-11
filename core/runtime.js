const config = require("./config");

const runtime = {
  nickname: config.nickname,
  prefix: config.prefix,
  language: config.language,
  features: { ...config.features },
  business: { ...config.business },
  groupPrefixes: new Map(),
  groupSettings: new Map()
};

function getRuntime() {
  return runtime;
}

function setFeature(name, enabled) {
  if (!Object.prototype.hasOwnProperty.call(runtime.features, name)) {
    throw new Error(`Unknown feature: ${name}`);
  }

  runtime.features[name] = Boolean(enabled);
  return runtime.features[name];
}

function setPrefix(prefix, chatId = null) {
  if (typeof prefix !== "string" || !prefix.trim()) {
    throw new Error("Prefix must be a non-empty string.");
  }

  if (chatId !== null) {
    runtime.groupPrefixes.set(String(chatId), prefix);
  } else {
    runtime.prefix = prefix;
  }

  return prefix;
}

function getPrefix(chatId = null) {
  if (chatId !== null) {
    return runtime.groupPrefixes.get(String(chatId)) || runtime.prefix;
  }

  return runtime.prefix;
}

function setNickname(nickname) {
  if (typeof nickname !== "string" || !nickname.trim()) {
    throw new Error("Nickname must be a non-empty string.");
  }

  runtime.nickname = nickname.trim();
  return runtime.nickname;
}

function setGroupSetting(chatId, key, value) {
  const id = String(chatId);
  const settings = runtime.groupSettings.get(id) || {};

  settings[key] = value;
  runtime.groupSettings.set(id, settings);

  return value;
}

function getGroupSetting(chatId, key, fallback = null) {
  const settings = runtime.groupSettings.get(String(chatId));

  if (!settings || !Object.prototype.hasOwnProperty.call(settings, key)) {
    return fallback;
  }

  return settings[key];
}

module.exports = {
  getRuntime,
  setFeature,
  setPrefix,
  getPrefix,
  setNickname,
  setGroupSetting,
  getGroupSetting
};