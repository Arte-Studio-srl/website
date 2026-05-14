import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { readSiteConfig } from "@/lib/site-config-storage";
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

  const [messages, siteConfig] = await Promise.all([
    import(`@/messages/${locale}.json`).then((m) => m.default),
    readSiteConfig(locale),
  ]);

  const siteUrl =
    siteConfig.seo?.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://progettoartestudio.it";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <OrganizationJsonLd site={siteConfig} siteUrl={siteUrl} locale={locale} />
      {children}
      <FloatingContact contactEmail={siteConfig.contactEmail} />
    </NextIntlClientProvider>
  );
}
