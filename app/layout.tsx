import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";
import { SiteDataProvider } from "@/components/SiteDataProvider";

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
  return {
    title: site.seo.defaultMetaTitle,
    description: site.seo.defaultMetaDescription,
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
  const { projects, categories } = await getCurrentData();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">
        <SiteDataProvider data={{ siteConfig, projects, categories }}>
          {children}
          <FloatingContact />
        </SiteDataProvider>
      </body>
    </html>
  );
}

