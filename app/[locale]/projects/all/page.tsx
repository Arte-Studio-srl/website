import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AllProjectsFilter from '@/components/AllProjectsFilter';
import PageHero from '@/components/PageHero';
import { getCurrentData } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { isLocale, type Locale } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AllProjectsPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  setRequestLocale(locale);

  const [{ projects, categories }, site, t] = await Promise.all([
    getCurrentData(locale),
    readSiteConfig(locale),
    getTranslations({ locale, namespace: 'projects' }),
  ]);

  return (
    <main className="min-h-screen">
      <Header categories={categories} />
      <PageHero title={t('allTitle')} subtitle={t('allSubtitle')} />
      <AllProjectsFilter projects={projects} categories={categories} />
      <Footer locale={locale} site={site} categories={categories} />
    </main>
  );
}
