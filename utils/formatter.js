function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    `${remainingSeconds}s`
  ].filter(Boolean).join(" ");
}

function formatUser(user) {
  return [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}

module.exports = {
  formatDuration,
  formatUser
};