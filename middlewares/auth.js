const config = require("../core/config");
const { canRun } = require("../core/permissions");

async function authorize(ctx, requiredRole = 0) {
  return canRun(ctx, requiredRole);
}

function isBotAdmin(userId) {
  return config.admins.map(String).includes(String(userId));
}

module.exports = {
  authorize,
  isBotAdmin
};