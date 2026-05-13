import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";
import { SiteDataProvider } from "@/components/SiteDataProvider";
import { OrganizationJsonLd } from "@/components/JsonLd";
import FloatingContact from "@/components/FloatingContact";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, siteConfig, { projects, categories }] = await Promise.all([
    getMessages(),
    readSiteConfig(),
    getCurrentData(locale),
  ]);

  const siteUrl =
    siteConfig.seo?.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://progettoartestudio.it";

  return (
    <NextIntlClientProvider messages={messages}>
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
    </NextIntlClientProvider>
  );
}
