import type { Metadata } from "next";
import { readSiteConfig } from "@/lib/site-config-storage";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = routing.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const site = await readSiteConfig(locale);
  return buildPageMetadata(
    {
      title: t("contactTitle"),
      description: t("contactDescription"),
      path: `/${locale}/contact/`,
    },
    site,
    locale
  );
}

export default async function ContactLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  const locale = routing.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : routing.defaultLocale;
  setRequestLocale(locale);
  return <>{children}</>;
}
