const requests = new Map();

function rateLimit(options = {}) {
  const limit = options.limit || 5;
  const windowMs = options.windowMs || 10000;

  return async (ctx, next) => {
    if (!ctx.from) return next();

    const key = String(ctx.from.id);
    const now = Date.now();
    const record = requests.get(key);

    if (!record || now - record.start >= windowMs) {
      requests.set(key, {
        start: now,
        count: 1
      });

      return next();
    }

    if (record.count >= limit) {
      return;
    }

    record.count++;
    return next();
  };
}

module.exports = { rateLimit };