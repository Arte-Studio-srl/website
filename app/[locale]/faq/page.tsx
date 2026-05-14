import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { JsonLd } from '@/components/JsonLd';
import { Link } from '@/i18n/navigation';
import { Icon } from '@iconify/react';
import { getCurrentData, getFaqs } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { isLocale, type Locale } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FaqPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  setRequestLocale(locale);

  const [t, tCommon, site, { categories }, faqs] = await Promise.all([
    getTranslations({ locale, namespace: 'faq' }),
    getTranslations({ locale, namespace: 'common' }),
    readSiteConfig(locale),
    getCurrentData(locale),
    getFaqs(locale),
  ]);

  const faqJsonLd = faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main className="min-h-screen">
      <Header categories={categories} />

      <PageHero
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        breadcrumbs={[
          { label: tCommon('home'), href: '/' },
          { label: tCommon('faq') },
        ]}
      />

      <section className="relative py-20 bg-cream overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-30" aria-hidden />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {faqs.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center bg-white/70 border border-bronze-200 px-8 py-14">
              <Icon icon="ph:chat-circle-dots" className="w-10 h-10 mx-auto text-bronze-500 mb-4" aria-hidden />
              <p className="text-charcoal/75 leading-relaxed">{t('empty')}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-bronze-600 text-white font-display hover:bg-bronze-700 transition-colors"
              >
                <Icon icon="ph:chat-dots" className="w-4 h-4" aria-hidden />
                {t('contactCta')}
              </Link>
            </div>
          ) : (
            <ul className="mx-auto max-w-3xl divide-y divide-bronze-200/70 border-y border-bronze-300/70 bg-white/60 backdrop-blur-sm">
              {faqs.map((faq, idx) => (
                <li key={faq.id}>
                  <details className="group" open={idx === 0}>
                    <summary className="flex items-start gap-5 px-5 md:px-8 py-6 cursor-pointer list-none select-none focus-visible:outline-none focus-visible:bg-bronze-50/80 transition-colors hover:bg-bronze-50/60">
                      <span
                        className="font-display text-bronze-600/80 text-sm tracking-[0.3em] pt-1 shrink-0 w-10"
                        aria-hidden
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-lg md:text-xl text-charcoal leading-snug">
                        {faq.question}
                      </span>
                      <span
                        className="shrink-0 w-9 h-9 rounded-full border border-bronze-400/70 flex items-center justify-center text-bronze-600 transition-transform duration-300 group-open:rotate-45"
                        aria-hidden
                      >
                        <Icon icon="ph:plus" className="w-4 h-4" />
                      </span>
                    </summary>
                    <div className="px-5 md:px-8 pb-7 -mt-1">
                      <div className="ml-0 md:ml-[60px] border-l border-bronze-300/60 pl-4 md:pl-5 text-charcoal/75 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}

          <div className="mx-auto max-w-3xl mt-20 relative">
            <div className="relative bg-charcoal text-cream px-8 py-12 md:px-12 md:py-14 overflow-hidden">
              <div className="absolute inset-0 blueprint-grid opacity-10" aria-hidden />
              <div className="absolute top-0 left-0 h-1 w-24 bg-bronze-500" aria-hidden />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <p className="font-display text-2xl md:text-3xl mb-3">{t('stillCurious')}</p>
                  <p className="text-cream/75 leading-relaxed max-w-xl">{t('stillCuriousBody')}</p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-bronze-600 text-white font-display hover:bg-bronze-700 transition-colors shrink-0"
                >
                  <Icon icon="ph:chat-dots" className="w-4 h-4" aria-hidden />
                  {t('contactCta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <Footer locale={locale} site={site} categories={categories} />
    </main>
  );
}
