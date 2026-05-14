import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { readSiteConfig } from "@/lib/site-config-storage";
import { buildBaseMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { isLocale, routing, type Locale } from "@/i18n/routing";

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
  let locale: Locale = routing.defaultLocale;
  try {
    const detectedLocale = await getLocale();
    if (isLocale(detectedLocale)) locale = detectedLocale;
  } catch {}
  const site = await readSiteConfig(locale);
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
  // /studio and other non-localized routes don't go through the next-intl
  // middleware, so getLocale() throws there — fall back to the default locale.
  let htmlLang: Locale = routing.defaultLocale;
  try {
    const detectedLocale = await getLocale();
    if (isLocale(detectedLocale)) htmlLang = detectedLocale;
  } catch {}

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
