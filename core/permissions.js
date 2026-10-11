
const config = require("./config");

function getRole(ctx) {
  const senderId = String(ctx.from?.id || "");

  if (config.admins.map(String).includes(senderId)) {
    return 2;
  }

  if (
    ctx.chat?.type === "group" ||
    ctx.chat?.type === "supergroup"
  ) {
    const member = ctx.chatMember;

    if (
      member &&
      ["administrator", "creator"].includes(member.status)
    ) {
      return 1;
    }
  }

  return 0;
}

async function resolveRole(ctx) {
  const senderId = String(ctx.from?.id || "");

  if (config.admins.map(String).includes(senderId)) {
    return 2;
  }

  if (
    ctx.chat?.type === "group" ||
    ctx.chat?.type === "supergroup"
  ) {
    try {
      const member = await ctx.api.getChatMember(
        ctx.chat.id,
        ctx.from.id
      );

      if (["administrator", "creator"].includes(member.status)) {
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return 0;
}

async function canRun(ctx, requiredRole = 0) {
  const role = await resolveRole(ctx);

  if (config.features?.adminOnly && role !== 2) {
    return false;
  }

  return role >= requiredRole;
}

module.exports = {
  getRole,
  resolveRole,
  canRun
};
