export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const buckets = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const current = buckets.get(identifier);

  if (!current || current.resetTime <= now) {
    const resetTime = now + config.windowMs;
    buckets.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxAttempts - 1, resetTime };
  }

  current.count += 1;
  const allowed = current.count <= config.maxAttempts;
  return {
    allowed,
    remaining: Math.max(0, config.maxAttempts - current.count),
    resetTime: current.resetTime,
  };
}
