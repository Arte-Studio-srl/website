import { promises as fs } from 'fs';
import path from 'path';
import { canUseGithubContent, fetchGithubFile, writeGithubFile } from '@/lib/github-content';
import { SiteConfig, siteConfig as fallbackConfig } from '@/data/site-config';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'data', 'site-config.ts');
const CONFIG_TS_PATH = 'data/site-config.ts';

function serializeConfig(config: SiteConfig): string {
  const serialized = JSON.stringify(config, null, 2);
  return `export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
  note?: string;
};

export type HeroSlide = {
  projectId: string;
  image: string;
  title: string;
  category?: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  faviconUrl: string;
  contactEmail: string;
  phone: string; // store as E.164-ish, e.g. +390289031657
  address: string;
  googleMapsUrl: string;
  legal: {
    companyName: string;
    piva: string;
    legalAddress?: string;
  };
  openingHours: OpeningHour[];
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
  };
  heroCarousel: HeroSlide[];
};

export const siteConfig: SiteConfig = ${serialized};
`;
}

export async function readSiteConfig(): Promise<SiteConfig> {
  // In GitHub mode we still import the local module for now; this is a fallback
  return fallbackConfig;
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  if (canUseGithubContent()) {
    const { sha } = await fetchGithubFile(CONFIG_TS_PATH);
    const newContent = serializeConfig(config);
    await writeGithubFile({
      path: CONFIG_TS_PATH,
      content: newContent,
      sha,
      message: 'chore: update site config via admin',
    });
    return;
  }

  await fs.writeFile(CONFIG_FILE_PATH, serializeConfig(config), 'utf-8');
}


