import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";
import { getSiteConfig } from "@/lib/site-config";

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

const site = getSiteConfig();

export const metadata: Metadata = {
  title: site.seo.defaultMetaTitle,
  description: site.seo.defaultMetaDescription,
  icons: {
    icon: site.faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

