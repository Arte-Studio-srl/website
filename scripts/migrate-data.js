const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  require('dotenv').config({ path: '.env' });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
});

async function migrateData() {
  const client = await pool.connect();
  
  try {
    // We import dynamically because TS files need ts-node or transpilation
    // If not using ts-node, we'll assume there's a compiled version, but
    // since we're writing a simple migration script, we can parse it using regex or just require it if we configure ts-node.
    console.log('Use `npx ts-node scripts/migrate-data.ts` to run this script if it is converted to TS.');
  } finally {
    client.release();
    pool.end();
  }
}

migrateData();