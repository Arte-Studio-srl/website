// DB-backed verification code storage — safe for serverless multi-container environments.
// Codes are stored in the verification_codes PostgreSQL table with automatic expiry via reset_at.

import { query } from './db';

export async function setVerificationCode(email: string, code: string, expiresInMs: number): Promise<void> {
  const expiresInSeconds = Math.ceil(expiresInMs / 1000);
  await query(
    `INSERT INTO verification_codes (email, code, expires_at)
     VALUES ($1, $2, NOW() + ($3 || ' seconds')::interval)
     ON CONFLICT (email) DO UPDATE
       SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`,
    [email, code, expiresInSeconds]
  );
}

export async function getVerificationCode(
  email: string
): Promise<{ code: string; expiresAt: number } | null> {
  const result = await query(
    `SELECT code, extract(epoch from expires_at) * 1000 AS expires_ms
     FROM verification_codes
     WHERE email = $1`,
    [email]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return { code: row.code, expiresAt: Math.ceil(Number(row.expires_ms)) };
}

export async function deleteVerificationCode(email: string): Promise<void> {
  await query('DELETE FROM verification_codes WHERE email = $1', [email]);
}
