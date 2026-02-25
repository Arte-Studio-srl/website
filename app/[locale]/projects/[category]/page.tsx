import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryPageClient from '@/components/CategoryPageClient';
import { getCurrentData, getProjectsByCategory } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { buildCategoryMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, category: categoryId } = await params;
  const { categories } = await getCurrentData();
  const categoryData = categories.find((c) => c.id === categoryId);
  if (!categoryData) return {};
  const projects = await getProjectsByCategory(categoryId);
  const site = await readSiteConfig();
  return buildCategoryMetadata(categoryData, projects.length, site, locale);
}

export async function generateStaticParams() {
  const locs = routing.locales.map((locale) => ({ locale }));
  try {
    const { categories } = await getCurrentData();
    const params: { locale: string; category: string }[] = [];
    for (const { locale } of locs) {
      for (const cat of categories) {
        params.push({ locale, category: cat.id });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const { categories } = await getCurrentData();
  const categoryData = categories.find((c) => c.id === category);
  if (!categoryData) notFound();

  const projects = await getProjectsByCategory(category);

  return (
    <main className="min-h-screen">
      <Header />
      <CategoryPageClient categoryData={categoryData} projects={projects} />
      <Footer />
    </main>
  );
}
