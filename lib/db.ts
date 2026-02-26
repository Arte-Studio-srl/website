import { Pool } from 'pg';

// Keep connection limit low to avoid exhausting database connections in serverless environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Vercel-specific: attach pool to their lifecycle (prevents connection leaks on suspend).
// Skip when running in Docker, local Node, or any non-Vercel environment.
if (process.env.VERCEL === '1') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { attachDatabasePool } = require('@vercel/functions');
  attachDatabasePool(pool);
}

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export default pool;
