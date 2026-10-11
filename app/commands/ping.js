module.exports = {
  config: {
    name: "ping",
    aliases: ["p"],
    author: "𝐌𝐚𝐑𝐮𝐅",
    version: "1.0.0",
    description: "Check bot response time.",
    category: "utility",
    role: 0,
    guide: "{prefix}ping"
  },

  async execute({ ctx }) {
    const start = Date.now();
    const message = await ctx.reply("🏓 Checking latency...");

    const latency = Date.now() - start;

    await ctx.api.editMessageText(
      ctx.chat.id,
      message.message_id,
      `🏓 Pong!\n⚡ Response: ${latency} ms`
    );
  }
};