import { cache } from 'react';
import type { SiteConfig } from '@/types';
import { fallbackSiteConfig } from '@/lib/default-data';
import { isSanityConfigured, sanityFetch } from '@/lib/sanity';
import type { Locale } from '@/i18n/routing';

type SanitySiteConfig = Partial<SiteConfig> & {
  heroCarousel?: Array<{
    projectId?: string;
    image?: string;
    imageAlt?: string;
    title?: string;
    category?: string;
  }>;
};

function buildSiteConfigQuery(locale: Locale): string {
  return `*[_type == "siteConfig"][0] {
  siteName,
  "tagline": coalesce(tagline_${locale}, tagline_en, tagline_it, tagline, ""),
  faviconUrl,
  contactEmail,
  phone,
  address,
  addressLocality,
  addressRegion,
  postalCode,
  addressCountry,
  geo,
  googleMapsUrl,
  legal,
  openingHours,
  social,
  "seo": {
    "defaultMetaTitle": coalesce(seo.defaultMetaTitle_${locale}, seo.defaultMetaTitle_en, seo.defaultMetaTitle_it, seo.defaultMetaTitle),
    "defaultMetaDescription": coalesce(seo.defaultMetaDescription_${locale}, seo.defaultMetaDescription_en, seo.defaultMetaDescription_it, seo.defaultMetaDescription),
    "siteUrl": seo.siteUrl,
    "ogImage": seo.ogImage.asset->url,
    "locale": seo.locale,
    "keywords": seo.keywords
  },
  "heroCarousel": coalesce(heroCarousel[]{
    "projectId": coalesce(project->slug.current, projectId),
    "image": coalesce(image.asset->url, project->thumbnail.asset->url, imageUrl, ""),
    "imageAlt": coalesce(
      image.alt_${locale}, image.alt_en, image.alt_it,
      project->thumbnail.alt_${locale}, project->thumbnail.alt_en, project->thumbnail.alt_it,
      ""
    ),
    "title": coalesce(title, project->title_${locale}, project->title_en, project->title_it, project->title, ""),
    "category": coalesce(category, project->category->name_${locale}, project->category->name_en, project->category->name_it, "")
  }, [])
}`;
}

function normalizeLocale(input?: Locale | string | null): Locale {
  return input === 'en' ? 'en' : 'it';
}

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
    geo: config.geo ?? fallbackSiteConfig.geo,
  };
}

async function _readSiteConfig(locale: Locale): Promise<SiteConfig> {
  if (!isSanityConfigured) return fallbackSiteConfig;

  try {
    const config = await sanityFetch<SanitySiteConfig>(buildSiteConfigQuery(locale));
    return mergeSiteConfig(config);
  } catch (error) {
    console.error('Sanity site config fetch failed:', error);
    return fallbackSiteConfig;
  }
}

export const readSiteConfig = cache((locale?: Locale | string) =>
  _readSiteConfig(normalizeLocale(locale)),
);
