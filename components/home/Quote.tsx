import { getTranslations } from 'next-intl/server';

export default async function Quote({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="py-24 bg-charcoal text-cream relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-10" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-8">
            &ldquo;{t('quote')}&rdquo;
          </blockquote>
          <p className="text-bronze-300 text-lg">
            {t('quoteAuthor')}
          </p>
        </div>
      </div>
    </section>
  );
}
