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
      const members = ctx.message.new_chat_members;

      try {
        await groups.saveGroup(ctx.chat);
      } catch (error) {
        console.error("[Welcome] Database:", error.message);
      }

      for (const member of members) {
        if (member.id === ctx.me.id) continue;

        try {
          const group = await groups.getGroup(ctx.chat.id);

          if (group?.welcome_enabled === false) continue;

          await ctx.reply(
            getText("welcome", {
              name: [member.first_name, member.last_name]
                .filter(Boolean)
                .join(" "),
              nickname: config.nickname
            })
          );
        } catch (error) {
          console.error("[Welcome] Failed:", error.message);
        }
      }
    });
  }
};