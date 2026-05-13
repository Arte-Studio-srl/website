import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AllProjectsFilter from '@/components/AllProjectsFilter';
import { getCurrentData } from '@/lib/data-utils';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AllProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { projects, categories } = await getCurrentData(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  return (
    <main className="min-h-screen">
      <Header locale={locale} />
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="h-1 w-20 bg-bronze-500 mb-6" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">{t('allTitle')}</h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">{t('allSubtitle')}</p>
          </div>
        </div>
      </section>
      <AllProjectsFilter projects={projects} categories={categories} />
      <Footer locale={locale} />
    </main>
  );
}
