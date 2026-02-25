import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://progettoartestudio.it";
const LOCALES = ["it", "en"];

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await readSiteConfig();
  const baseUrl = (site.seo?.siteUrl || DEFAULT_SITE_URL).replace(/\/$/, "");

  const staticPaths = ["", "contact/", "projects/all/"] as const;
  const staticPriorities = [1, 0.8, 0.9] as const;
  const staticChangeFreq = ["weekly", "monthly", "weekly"] as const;

  const staticRoutes: MetadataRoute.Sitemap = [];
  for (let i = 0; i < staticPaths.length; i++) {
    for (const locale of LOCALES) {
      const path = staticPaths[i] ? `${locale}/${staticPaths[i]}` : `${locale}/`;
      staticRoutes.push({
        url: `${baseUrl}/${path}`,
        lastModified: new Date(),
        changeFrequency: staticChangeFreq[i],
        priority: staticPriorities[i],
      });
    }
  }

  const { projects, categories } = await getCurrentData();

  const projectUrls: MetadataRoute.Sitemap = [];
  for (const project of projects) {
    for (const locale of LOCALES) {
      projectUrls.push({
        url: `${baseUrl}/${locale}/project/${project.id}/`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  const categoryUrls: MetadataRoute.Sitemap = [];
  for (const category of categories) {
    for (const locale of LOCALES) {
      categoryUrls.push({
        url: `${baseUrl}/${locale}/projects/${category.id}/`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...categoryUrls, ...projectUrls];
}
