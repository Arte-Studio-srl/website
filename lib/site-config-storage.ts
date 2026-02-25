import { query } from './db';
import { SiteConfig } from '@/types';
import { siteConfig as fallbackConfig } from '@/data/site-config';

export async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const result = await query("SELECT config FROM site_config WHERE id = 'default'");
    if (result.rows.length > 0) {
      return typeof result.rows[0].config === 'string' 
        ? JSON.parse(result.rows[0].config) as SiteConfig
        : result.rows[0].config as SiteConfig;
    }
    
    // If not in DB yet, insert the fallback and return it
    await writeSiteConfig(fallbackConfig);
    return fallbackConfig;
  } catch (error) {
    console.error('Error reading site config from DB', error);
    return fallbackConfig; // If DB not init or error, serve fallback to prevent crash
  }
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await query(
    `INSERT INTO site_config (id, config) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = CURRENT_TIMESTAMP`,
    ['default', JSON.stringify(config)]
  );
}
