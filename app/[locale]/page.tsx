import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import ImageShowcase from "@/components/home/ImageShowcase";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProcessSection from "@/components/home/ProcessSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Quote from "@/components/home/Quote";
import { readSiteConfig } from "@/lib/site-config-storage";
import { getCurrentData } from "@/lib/data-utils";
import { buildPageMetadata } from "@/lib/seo";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { HeroSlide } from "@/types";

const PLACEHOLDER_SLIDE: HeroSlide = {
  projectId: 'placeholder',
  image: '/logo.png',
  title: 'ArteStudio',
  category: 'Architecture',
};

export const dynamic = 'force-static';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const site = await readSiteConfig(locale);
  return buildPageMetadata(
    {
      title: t("homeTitle"),
      description: t("homeDescription"),
      path: `/${locale}/`,
      absoluteTitle: true,
    },
    site,
    locale
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [siteConfig, { projects, categories }] = await Promise.all([
    readSiteConfig(locale),
    getCurrentData(locale),
  ]);

  const configuredSlides = siteConfig.heroCarousel.filter((slide) => slide.image);
  const slides: HeroSlide[] = configuredSlides.length > 0
    ? configuredSlides
    : projects.length > 0
      ? projects.slice(0, 5).map((p) => ({
          projectId: p.id,
          image: p.thumbnail,
          imageAlt: p.thumbnailAlt || p.title,
          title: p.title,
          category: p.categoryName || p.category,
        }))
      : [PLACEHOLDER_SLIDE];

  return (
    <main className="min-h-screen">
      <Header categories={categories} />
      <HeroCarousel slides={slides} tagline={siteConfig.tagline} />
      <ImageShowcase projects={projects} />
      <CategoriesSection categories={categories} locale={locale} />
      <ProcessSection locale={locale} />
      <FeaturedProjects projects={projects} locale={locale} />
      <Quote locale={locale} />
      <Footer locale={locale} site={siteConfig} categories={categories} />
    </main>
  );
}
