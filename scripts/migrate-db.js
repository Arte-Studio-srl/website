// Adds rate_limits and verification_codes tables for serverless-safe distributed storage.
// Run with: node scripts/migrate-db.js

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env' });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');

    // Rate limits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        identifier TEXT PRIMARY KEY,
        count       INTEGER NOT NULL DEFAULT 1,
        reset_at    TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('✓ rate_limits table ready');

    // Index to speed up cleanup of expired rows (optional)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits (reset_at);
    `);

    // Verification codes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        email      TEXT PRIMARY KEY,
        code       TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      );
    `);
    console.log('✓ verification_codes table ready');

    console.log('All migrations applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
