// Basic in-memory rate limiter (per TRD: "Rate limiting on comment/post creation (basic)").
// Note: this resets on server restart and is per-instance — fine for a single-server
// deployment; for multi-instance serverless at scale you'd swap this for a Redis-backed
// limiter, but that's beyond what the TRD asks for.
const store = new Map();

export function rateLimit(identifier, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now - record.start > windowMs) {
    store.set(identifier, { count: 1, start: now });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
