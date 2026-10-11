const {
  getRuntime,
  getGroupSetting
} = require("../../core/runtime");

module.exports = {
  name: "welcome",
  register(bot) {
    bot.on("message:new_chat_members", async (ctx) => {
      const runtime = getRuntime();

      if (!runtime.features.welcome) return;

      const chat = ctx.chat;
      const enabled = getGroupSetting(chat.id, "welcomeEnabled", true);

      if (!enabled) return;

      for (const member of ctx.message.new_chat_members || []) {
        if (member.id === ctx.me.id) continue;

        const name = [member.first_name, member.last_name]
          .filter(Boolean)
          .join(" ");

        try {
          await ctx.reply(
            `স্বাগতম, ${name || "বন্ধু"}! 🎉\n\n` +
            `${chat.title || "এই গ্রুপে"} তোমাকে স্বাগতম।\n` +
            `Bot: ${runtime.nickname}`
          );
        } catch (error) {
          console.error(`Welcome message failed: ${error.message}`);
        }
      }
    });
  }
};