import { Pool } from 'pg';
import { categories, projects } from '../data/projects';
import { siteConfig } from '../data/site-config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function migrateData() {
  const client = await pool.connect();
  try {
    console.log('Migrating categories...');
    for (const category of categories) {
      await client.query(
        `INSERT INTO categories (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [category.id, category.name, category.description]
      );
    }

    console.log('Migrating projects...');
    for (const project of projects) {
      await client.query(
        `INSERT INTO projects (id, title, category, year, client, description, thumbnail, stages) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET 
           title = EXCLUDED.title, 
           category = EXCLUDED.category, 
           year = EXCLUDED.year, 
           client = EXCLUDED.client, 
           description = EXCLUDED.description, 
           thumbnail = EXCLUDED.thumbnail, 
           stages = EXCLUDED.stages`,
        [
          project.id, 
          project.title, 
          project.category, 
          project.year, 
          project.client, 
          project.description, 
          project.thumbnail, 
          JSON.stringify(project.stages || [])
        ]
      );
    }

    console.log('Migrating site config...');
    await client.query(
      `INSERT INTO site_config (id, config) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config`,
      ['default', JSON.stringify(siteConfig)]
    );

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error migrating data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateData();
