import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://progettoartestudio.it";
const DEFAULT_LOCALE = "it";
const LOCALES = ["it", "en"] as const;

export const dynamic = "force-static";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Single build-time timestamp for static routes — search engines penalize
// sitemaps where every lastmod is "right now" on every regeneration.
const BUILD_TIME = new Date();

function buildAlternates(baseUrl: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${baseUrl}/${l}/${path}`;
  }
  languages["x-default"] = languages[DEFAULT_LOCALE];
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await readSiteConfig();
  const baseUrl = (site.seo?.siteUrl || DEFAULT_SITE_URL).replace(/\/$/, "");

  const staticEntries: Array<{ path: string; priority: number; changeFrequency: ChangeFreq }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "contact/", priority: 0.8, changeFrequency: "monthly" },
    { path: "projects/all/", priority: 0.9, changeFrequency: "weekly" },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticEntries.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}/${DEFAULT_LOCALE}/${path}`,
    lastModified: BUILD_TIME,
    changeFrequency,
    priority,
    alternates: { languages: buildAlternates(baseUrl, path) },
  }));

  const { projects, categories } = await getCurrentData();

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => {
    const path = `projects/${category.id}/`;
    return {
      url: `${baseUrl}/${DEFAULT_LOCALE}/${path}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: buildAlternates(baseUrl, path) },
    };
  });

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const path = `project/${project.id}/`;
    return {
      url: `${baseUrl}/${DEFAULT_LOCALE}/${path}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: buildAlternates(baseUrl, path) },
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes];
}
