function log(level, message, error) {
  const timestamp = new Date().toISOString();
  const output = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (error) {
    console.error(output, error);
    return;
  }

  if (level === "error") {
    console.error(output);
  } else {
    console.log(output);
  }
}

module.exports = {
  info: (message) => log("info", message),
  warn: (message) => log("warn", message),
  error: (message, error) => log("error", message, error)
};