import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

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

export const metadata: Metadata = {
  title: "ArteStudio - Event Structures & Scenography",
  description: "Professional event structures, stages, exhibition stands, and scenography for conventions, exhibitions, fashion shows, and theater productions.",
  keywords: "event structures, scenography, stage design, exhibition stands, fashion shows, theater, Milano",
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

