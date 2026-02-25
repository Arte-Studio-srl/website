import { unstable_cache } from 'next/cache';
import { query } from './db';
import { SiteConfig } from '@/types';
import { fallbackSiteConfig as fallbackConfig } from '@/lib/default-data';

const _readSiteConfigRaw = async (): Promise<SiteConfig> => {
  try {
    const result = await query("SELECT config FROM site_config WHERE id = 'default'");
    if (result.rows.length > 0) {
      return typeof result.rows[0].config === 'string'
        ? JSON.parse(result.rows[0].config) as SiteConfig
        : result.rows[0].config as SiteConfig;
    }

    // First run: seed the DB with the fallback config
    await writeSiteConfig(fallbackConfig);
    return fallbackConfig;
  } catch (error) {
    console.error('Error reading site config from DB', error);
    return fallbackConfig;
  }
};

export const readSiteConfig = unstable_cache(
  _readSiteConfigRaw,
  ['site-config'],
  { tags: ['site-data'], revalidate: 3600 }
);

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await query(
    `INSERT INTO site_config (id, config) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = CURRENT_TIMESTAMP`,
    ['default', JSON.stringify(config)]
  );
}
