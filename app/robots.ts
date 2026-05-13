import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/lib/site-config-storage";

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://progettoartestudio.it";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await readSiteConfig();
  const baseUrl = site.seo?.siteUrl || DEFAULT_SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/"],
      },
    ],
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
