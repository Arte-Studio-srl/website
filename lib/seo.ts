import type { Metadata } from "next";
import type { SiteConfig, Project, Category } from "@/types";

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://progettoartestudio.it";
const MAX_DESCRIPTION_LENGTH = 160;
const LOCALES = ["it", "en"] as const;

const OG_LOCALE: Record<string, string> = {
  it: "it_IT",
  en: "en_US",
};

/** Open Graph locale metadata for multilingual SEO */
function getOgLocales(locale?: string) {
  if (!locale) return {};
  const otherLocales = LOCALES.filter((l) => l !== locale);
  return {
    locale: OG_LOCALE[locale] || locale,
    alternateLocale: otherLocales.map((l) => OG_LOCALE[l] || l),
  };
}

/** Build path with locale prefix (e.g. /it/contact/) */
export function pathWithLocale(path: string, locale: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}/${clean}`.replace(/\/+/g, "/");
}

/** Build absolute URL from path (handles trailing slash from next.config) */
export function buildAbsoluteUrl(path: string, siteUrl?: string): string {
  const base = siteUrl || DEFAULT_SITE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const normalized = cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

/** Truncate text for meta description (recommended 150–160 chars) */
export function truncateDescription(text: string, maxLen = MAX_DESCRIPTION_LENGTH): string {
  const stripped = text.replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLen) return stripped;
  return stripped.slice(0, maxLen - 3).trim() + "...";
}

/** Ensure image URL is absolute (og:image requires absolute URLs) */
export function toAbsoluteImageUrl(url: string, siteUrl?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = siteUrl || DEFAULT_SITE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base.replace(/\/$/, "")}${path}`;
}

/** Build base metadata from site config (used by layout + page overrides) */
export function buildBaseMetadata(site: SiteConfig): Metadata {
  const siteUrl = site.seo?.siteUrl || DEFAULT_SITE_URL;
  const title = site.seo.defaultMetaTitle || `${site.siteName} | ${site.tagline}`;
  const description = site.seo?.defaultMetaDescription || site.tagline;
  const ogImage = site.seo?.ogImage
    ? toAbsoluteImageUrl(site.seo.ogImage, siteUrl)
    : site.heroCarousel?.[0]?.image
      ? toAbsoluteImageUrl(site.heroCarousel[0].image, siteUrl)
      : toAbsoluteImageUrl("/og-default.png", siteUrl);

  const locale = site.seo?.locale || "it";
  const metadataBase = new URL(siteUrl);

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${site.siteName}`,
    },
    description,
    keywords: site.seo?.keywords || ["architettura", "scenografia", "design", "spazi espositivi", "eventi", "Milano"],
    authors: site.legal?.companyName ? [{ name: site.legal.companyName }] : undefined,
    creator: site.siteName,
    publisher: site.legal?.companyName,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      siteName: site.siteName,
      title,
      description,
      url: metadataBase.origin,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: site.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

/** Build metadata for a project detail page */
export function buildProjectMetadata(
  project: Project,
  site: SiteConfig,
  locale?: string
): Metadata {
  const siteUrl = site.seo?.siteUrl || DEFAULT_SITE_URL;
  const path = locale ? `/${locale}/project/${project.id}/` : `/project/${project.id}/`;
  const url = buildAbsoluteUrl(path, siteUrl);
  const title = project.title;
  const description = truncateDescription(
    project.description || `${project.title} - ${project.client || "Progetto"} ${project.year}`
  );
  const image = toAbsoluteImageUrl(project.thumbnail, siteUrl);

  const alternates: Metadata["alternates"] = { canonical: url };
  if (locale) {
    alternates.languages = Object.fromEntries(
      LOCALES.map((l) => [
        l,
        buildAbsoluteUrl(`/${l}/project/${project.id}/`, siteUrl),
      ])
    );
    alternates.languages["x-default"] = buildAbsoluteUrl(
      `/it/project/${project.id}/`,
      siteUrl
    );
  }

  const ogLocales = getOgLocales(locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      ...ogLocales,
      title,
      description,
      url,
      type: "article",
      publishedTime: project.year ? `${project.year}-01-01` : undefined,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Build metadata for a category/portfolio page */
export function buildCategoryMetadata(
  category: Category,
  projectCount: number,
  site: SiteConfig,
  locale?: string
): Metadata {
  const siteUrl = site.seo?.siteUrl || DEFAULT_SITE_URL;
  const path = locale ? `/${locale}/projects/${category.id}/` : `/projects/${category.id}/`;
  const url = buildAbsoluteUrl(path, siteUrl);
  const title = category.name;
  const description = truncateDescription(
    category.description || `Esplora i progetti di ${category.name}. ${projectCount} progetti nel portfolio.`
  );

  const alternates: Metadata["alternates"] = { canonical: url };
  if (locale) {
    alternates.languages = Object.fromEntries(
      LOCALES.map((l) => [
        l,
        buildAbsoluteUrl(`/${l}/projects/${category.id}/`, siteUrl),
      ])
    );
    alternates.languages["x-default"] = buildAbsoluteUrl(
      `/it/projects/${category.id}/`,
      siteUrl
    );
  }

  const ogLocales = getOgLocales(locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      ...ogLocales,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/** Build metadata for a static route (contact, all projects, etc.) */
export function buildPageMetadata(
  opts: {
    title: string;
    description: string;
    path: string;
    /** If true, bypasses the layout title template (e.g. for home page) */
    absoluteTitle?: boolean;
  },
  site: SiteConfig,
  locale?: string
): Metadata {
  const siteUrl = site.seo?.siteUrl || DEFAULT_SITE_URL;
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = buildAbsoluteUrl(path, siteUrl);

  const alternates: Metadata["alternates"] = { canonical: url };
  if (locale) {
    const pathWithOtherLocales = LOCALES.map((l) =>
      buildAbsoluteUrl(path.replace(/^\/[a-z]{2}(\/|$)/, `/${l}$1`), siteUrl)
    );
    alternates.languages = Object.fromEntries(
      LOCALES.map((l, i) => [l, pathWithOtherLocales[i]])
    );
    alternates.languages["x-default"] = pathWithOtherLocales[0];
  }

  const ogLocales = getOgLocales(locale);

  return {
    title: opts.absoluteTitle
      ? { absolute: opts.title }
      : opts.title,
    description: truncateDescription(opts.description),
    alternates,
    openGraph: {
      ...ogLocales,
      title: opts.title,
      description: opts.description,
      url,
    },
    twitter: {
      card: "summary",
      title: opts.title,
      description: opts.description,
    },
  };
}
