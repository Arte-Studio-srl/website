'use client';

import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="min-h-screen">
      <Header />
      <section className="relative min-h-[80vh] flex items-center justify-center bg-cream">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display text-9xl md:text-[12rem] text-bronze-600 leading-none">404</h1>
            </div>
            <div className="h-1 bg-bronze-600 mx-auto mb-8 w-[120px]" />
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">{t('title')}</h2>
            <p className="text-xl text-charcoal/70 mb-12 leading-relaxed">{t('description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bronze-600 text-white hover:bg-bronze-700 transition-all font-display text-lg hover:shadow-xl">
                <Icon icon="ph:house" className="w-5 h-5" aria-hidden />
                {t('backHome')}
              </Link>
              <Link href="/projects/all" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg">
                <Icon icon="ph:images" className="w-5 h-5" aria-hidden />
                {t('viewProjects')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
