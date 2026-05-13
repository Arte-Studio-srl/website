import { unstable_cache } from 'next/cache';
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

function mergeSiteConfig(config: SanitySiteConfig | null): SiteConfig {
  if (!config) return fallbackSiteConfig;

  return {
    ...fallbackSiteConfig,
    ...config,
    legal: {
      ...fallbackSiteConfig.legal,
      ...config.legal,
    },
    social: {
      ...fallbackSiteConfig.social,
      ...config.social,
    },
    seo: {
      ...fallbackSiteConfig.seo,
      ...config.seo,
    },
    openingHours: config.openingHours || fallbackSiteConfig.openingHours,
    heroCarousel: config.heroCarousel || fallbackSiteConfig.heroCarousel,
  };
}

export const readSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    if (!isSanityConfigured) return fallbackSiteConfig;

    try {
      const config = await sanityFetch<SanitySiteConfig>(siteConfigQuery);
      return mergeSiteConfig(config);
    } catch (error) {
      console.error('Sanity site config fetch failed:', error);
      return fallbackSiteConfig;
    }
  },
  ['sanity-site-config'],
  { tags: ['site-data'], revalidate: 3600 }
);
