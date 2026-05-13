import { cache } from 'react';
import type { SiteConfig } from '@/types';
import { fallbackSiteConfig } from '@/lib/default-data';
import { isSanityConfigured, sanityFetch } from '@/lib/sanity';

type SanitySiteConfig = Partial<SiteConfig> & {
  heroCarousel?: Array<{
    projectId?: string;
    image?: string;
    title?: string;
    category?: string;
  }>;
};

const siteConfigQuery = `*[_type == "siteConfig"][0] {
  siteName,
  tagline,
  faviconUrl,
  contactEmail,
  phone,
  address,
  googleMapsUrl,
  legal,
  openingHours,
  social,
  seo,
  "heroCarousel": coalesce(heroCarousel[]{
    "projectId": coalesce(project->slug.current, projectId),
    "image": coalesce(image.asset->url, imageUrl, ""),
    title,
    category
  }, [])
}`;

// Strip null/undefined so partial Sanity documents don't overwrite fallback
// values via spread (GROQ returns explicit `null` for unset fields).
function stripNulls<T extends object>(obj: T | null | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  ) as Partial<T>;
}

function mergeSiteConfig(config: SanitySiteConfig | null): SiteConfig {
  if (!config) return fallbackSiteConfig;

  return {
    ...fallbackSiteConfig,
    ...stripNulls(config),
    legal: {
      ...fallbackSiteConfig.legal,
      ...stripNulls(config.legal),
    },
    social: {
      ...fallbackSiteConfig.social,
      ...stripNulls(config.social),
    },
    seo: {
      ...fallbackSiteConfig.seo,
      ...stripNulls(config.seo),
    },
    openingHours: config.openingHours || fallbackSiteConfig.openingHours,
    heroCarousel: config.heroCarousel || fallbackSiteConfig.heroCarousel,
  };
}

async function _readSiteConfig(): Promise<SiteConfig> {
  if (!isSanityConfigured) return fallbackSiteConfig;

  try {
    const config = await sanityFetch<SanitySiteConfig>(siteConfigQuery);
    return mergeSiteConfig(config);
  } catch (error) {
    console.error('Sanity site config fetch failed:', error);
    return fallbackSiteConfig;
  }
}

export const readSiteConfig = cache(_readSiteConfig);
