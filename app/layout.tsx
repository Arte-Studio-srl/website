import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { readSiteConfig } from "@/lib/site-config-storage";
import { buildBaseMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

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
  let locale: string = routing.defaultLocale;
  try {
    locale = await getLocale();
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
  let htmlLang: string = routing.defaultLocale;
  try {
    htmlLang = await getLocale();
  } catch {}

  return (
    <html lang={htmlLang} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

