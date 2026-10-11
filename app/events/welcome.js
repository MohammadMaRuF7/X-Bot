
const config = require("../../core/config");
const { getText } = require("../../core/language");
const groups = require("../../database/groups");

module.exports = {
  config: {
    name: "welcome",
    version: "1.0.0",
    author: "𝐌𝐚𝐑𝐮𝐅",
    description: "Welcome new Telegram group members."
  },

  register(bot) {
    bot.on("message:new_chat_members", async (ctx) => {
      if (!ctx.chat || !ctx.message?.new_chat_members) return;

      const members = ctx.message.new_chat_members;

      try {
        await groups.saveGroup(ctx.chat);
      } catch (error) {
        if (config.database?.enabled) {
          console.error("[Welcome] Group save failed:", error.message);
        }
      }

      let groupSettings = null;

      if (config.database?.enabled) {
        try {
          groupSettings = await groups.getGroup(ctx.chat.id);
        } catch (error) {
          console.error("[Welcome] Settings lookup failed:", error.message);
        }
      }

      if (groupSettings?.welcome_enabled === false) return;

      for (const member of members) {
        if (member.id === ctx.me.id) continue;

        const name = [
          member.first_name,
          member.last_name
        ].filter(Boolean).join(" ");

        try {
          const language = config.features?.multiLanguage
            ? config.language
            : "en";

          await ctx.reply(
            getText(
              "welcome",
              {
                name,
                nickname: config.nickname
              },
              language
            )
          );
        } catch (error) {
          console.error("[Welcome] Message failed:", error.message);
        }
      }
    });
  }
};
