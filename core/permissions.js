
const config = require("./config");

const BOT_ADMIN = 2;
const GROUP_ADMIN = 1;
const USER = 0;

function isBotAdmin(userId) {
  if (!userId) return false;

  return config.admins.includes(String(userId));
}

async function getRole(ctx) {
  if (!ctx.from) return USER;

  if (isBotAdmin(ctx.from.id)) {
    return BOT_ADMIN;
  }

  if (
    ctx.chat &&
    ["group", "supergroup"].includes(ctx.chat.type)
  ) {
    try {
      const member = await ctx.api.getChatMember(
        ctx.chat.id,
        ctx.from.id
      );

      if (["creator", "administrator"].includes(member.status)) {
        return GROUP_ADMIN;
      }
    } catch (error) {
      console.error(
        "[Permissions] Could not verify group role:",
        error.message
      );
    }
  }

  return USER;
}

async function canRun(ctx, requiredRole = USER) {
  if (!ctx.from) return false;

  const role = await getRole(ctx);

  if (
    config.features.adminOnly === true &&
    role !== BOT_ADMIN
  ) {
    return false;
  }

  if (
    requiredRole === GROUP_ADMIN &&
    !config.features.groupAdminCommands &&
    role !== BOT_ADMIN
  ) {
    return false;
  }

  return role >= requiredRole;
}

module.exports = {
  USER,
  GROUP_ADMIN,
  BOT_ADMIN,
  isBotAdmin,
  getRole,
  canRun
};
