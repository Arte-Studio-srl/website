'use client';

import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

const IconHouse = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M219.3,108.7l-80-80a16,16,0,0,0-22.6,0l-80,80A15.9,15.9,0,0,0,32,120v96a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V160h48v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V120A15.9,15.9,0,0,0,219.3,108.7Z" />
  </svg>
);

const IconImages = () => (
  <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor" aria-hidden>
    <path d="M216,32H72A16,16,0,0,0,56,48V64H40A16,16,0,0,0,24,80V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V192h16a16,16,0,0,0,16-16V48A16,16,0,0,0,216,32Z" />
  </svg>
);

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
                <IconHouse />
                {t('backHome')}
              </Link>
              <Link href="/projects/all" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-bronze-600 text-bronze-600 hover:bg-bronze-600 hover:text-white transition-all font-display text-lg">
                <IconImages />
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
