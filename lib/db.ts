import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

// Keep connection limit low to avoid exhausting database connections in serverless environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  max: 5, // Vercel Postgres/pg typically works well with a small pool limit per function instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Attach the database pool to Vercel's lifecycle management
attachDatabasePool(pool);

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export default pool;
