import { getTranslations } from 'next-intl/server';
import { Icon } from '@iconify/react';
import { Link } from '@/i18n/navigation';
import SectionHeading from '@/components/SectionHeading';
import { getFaqs } from '@/lib/data-utils';
import type { Locale } from '@/i18n/routing';

interface Props {
  locale: Locale;
}

export default async function FaqSection({ locale }: Props) {
  const [t, faqs] = await Promise.all([
    getTranslations({ locale, namespace: 'faq' }),
    getFaqs(locale, { featuredOnly: true }),
  ]);

  if (faqs.length === 0) return null;

  return (
    <section className="relative py-28 bg-cream overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-px bg-bronze-200/50" aria-hidden />
      <div className="absolute bottom-0 inset-x-0 h-px bg-bronze-200/50" aria-hidden />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <SectionHeading
          title={t('homeTitle')}
          subtitle={t('homeSubtitle')}
          className="mb-16"
        />

        <ul className="mx-auto max-w-3xl divide-y divide-bronze-200/70 border-y border-bronze-300/70 bg-white/60 backdrop-blur-sm">
          {faqs.map((faq, idx) => (
            <li key={faq.id}>
              <details className="group">
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

        <div className="mt-12 flex justify-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-3 font-display text-bronze-700 hover:text-bronze-900 transition-colors"
          >
            <span className="h-px w-8 bg-bronze-500 transition-all group-hover:w-12" aria-hidden />
            {t('viewAll')}
            <Icon
              icon="ph:arrow-right"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
