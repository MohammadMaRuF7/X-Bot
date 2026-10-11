const config = require("./config");

const USER = 0;
const GROUP_ADMIN = 1;
const BOT_ADMIN = 2;

function isBotAdmin(userId) {
  if (!userId) return false;

  return config.admins.includes(String(userId));
}

async function getRole(ctx) {
  const userId = ctx.from?.id;

  if (isBotAdmin(userId)) {
    return BOT_ADMIN;
  }

  if (!ctx.chat || !["group", "supergroup"].includes(ctx.chat.type)) {
    return USER;
  }

  try {
    const member = await ctx.api.getChatMember(ctx.chat.id, userId);

    if (["creator", "administrator"].includes(member.status)) {
      return GROUP_ADMIN;
    }
  } catch {
    return USER;
  }

  return USER;
}

async function canRun(ctx, requiredRole = USER) {
  const role = await getRole(ctx);

  if (config.features.adminOnly && role !== BOT_ADMIN) {
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