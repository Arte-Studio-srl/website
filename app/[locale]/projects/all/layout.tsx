import type { Metadata } from "next";
import { readSiteConfig } from "@/lib/site-config-storage";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const site = await readSiteConfig();
  return buildPageMetadata(
    {
      title: t("allProjectsTitle"),
      description: t("allProjectsDescription"),
      path: `/${locale}/projects/all/`,
    },
    site,
    locale
  );
}

export default async function AllProjectsLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
