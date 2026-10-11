
module.exports = {
  config: {
    name: "ping",
    aliases: ["p"],
    author: "𝐌𝐚𝐑𝐮𝐅",
    version: "1.0.0",
    category: "utility",
    role: 0,
    description: "Check bot response.",
    guide: "{prefix}ping"
  },

  async execute({ ctx }) {
    const start = Date.now();

    const message = await ctx.reply("Pong!");

    const latency = Date.now() - start;

    await ctx.api.editMessageText(
      ctx.chat.id,
      message.message_id,
      `🏓 Pong!\nLatency: ${latency} ms`
    );
  }
};
