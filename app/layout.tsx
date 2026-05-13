import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";
import { SiteDataProvider } from "@/components/SiteDataProvider";
import { buildBaseMetadata } from "@/lib/seo";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { getLocale } from "next-intl/server";

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await readSiteConfig();
  const base = buildBaseMetadata(site);
  return {
    ...base,
    icons: {
      icon: site.faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await readSiteConfig();
  let htmlLang = "it";
  try {
    htmlLang = await getLocale();
  } catch {
    // Admin or non-i18n routes
  }
  const { projects, categories } = await getCurrentData(htmlLang);

  const siteUrl = siteConfig.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://progettoartestudio.it";

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">
        <OrganizationJsonLd
          siteName={siteConfig.siteName}
          tagline={siteConfig.tagline}
          siteUrl={siteUrl}
          contactEmail={siteConfig.contactEmail}
          address={siteConfig.address}
          social={siteConfig.social}
        />
        <SiteDataProvider data={{ siteConfig, projects, categories }}>
          {children}
          <FloatingContact />
        </SiteDataProvider>
      </body>
    </html>
  );
}

