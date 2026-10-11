
const config = require("../../core/config");

module.exports = {
  config: {
    name: "welcome",
    version: "1.0.0",
    author: "𝐌𝐚𝐑𝐮𝐅",
    description: "Welcome new members in Telegram groups."
  },

  register(bot) {
    bot.on("message:new_chat_members", async (ctx) => {
      const members = ctx.message.new_chat_members;

      for (const member of members) {
        if (member.is_bot && member.id === ctx.me.id) {
          continue;
        }

        const name = [
          member.first_name,
          member.last_name
        ].filter(Boolean).join(" ");

        const welcomeMessage =
          `🎉 Welcome, ${name}!\n\n` +
          `Welcome to ${config.nickname} community! 💙\n` +
          `Enjoy your stay and follow the group rules.`;

        try {
          await ctx.reply(welcomeMessage);
        } catch (error) {
          console.error(
            "[Welcome Event] Failed:",
            error.message
          );
        }
      }
    });
  }
};
