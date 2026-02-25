// DB-backed rate limiter — safe for serverless multi-container environments.
// Uses the rate_limits PostgreSQL table. Falls back to allow if DB is unavailable
// (fail-open is preferable to locking out users on DB transient errors).

import { query } from './db';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 15 * 60 * 1000 }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const windowSeconds = Math.ceil(config.windowMs / 1000);
  const now = Date.now();
  const resetTime = now + config.windowMs;

  try {
    const result = await query(
      `INSERT INTO rate_limits (identifier, count, reset_at)
       VALUES ($1, 1, NOW() + ($2 || ' seconds')::interval)
       ON CONFLICT (identifier) DO UPDATE
         SET count = CASE
               WHEN rate_limits.reset_at < NOW() THEN 1
               ELSE rate_limits.count + 1
             END,
             reset_at = CASE
               WHEN rate_limits.reset_at < NOW() THEN NOW() + ($2 || ' seconds')::interval
               ELSE rate_limits.reset_at
             END
       RETURNING count, extract(epoch from reset_at) * 1000 AS reset_ms`,
      [identifier, windowSeconds]
    );

    const row = result.rows[0];
    const count: number = Number(row.count);
    const dbResetTime: number = Math.ceil(Number(row.reset_ms));
    const allowed = count <= config.maxAttempts;
    const remaining = Math.max(0, config.maxAttempts - count);

    return { allowed, remaining, resetTime: dbResetTime };
  } catch (error) {
    console.error('[RateLimit] DB error, failing open:', error);
    // Fail open to avoid locking out users during transient DB errors
    return { allowed: true, remaining: config.maxAttempts - 1, resetTime };
  }
}

export async function resetRateLimit(identifier: string): Promise<void> {
  try {
    await query('DELETE FROM rate_limits WHERE identifier = $1', [identifier]);
  } catch (error) {
    console.error('[RateLimit] DB error on reset:', error);
  }
}
