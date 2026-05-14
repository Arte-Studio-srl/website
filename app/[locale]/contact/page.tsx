import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';
import { Icon } from '@iconify/react';
import { getCurrentData } from '@/lib/data-utils';
import { readSiteConfig } from '@/lib/site-config-storage';
import { formatPhoneDisplay, formatTelHref, getGoogleMapsEmbedUrl, resolveDayKey } from '@/lib/site-config';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { isLocale, type Locale } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  setRequestLocale(locale);

  const [t, site, { categories }] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    readSiteConfig(locale),
    getCurrentData(locale),
  ]);

  return (
    <main className="min-h-screen">
      <Header categories={categories} />
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl text-charcoal mb-8">{t('infoHeading')}</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:map-pin" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">{t('address')}</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      {site.address.split('\n').map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </p>
                    {site.legal.legalAddress && (
                      <p className="text-charcoal/60 text-sm mt-2">{t('legalAddress')}: {site.legal.legalAddress}</p>
                    )}
                    <a href={site.googleMapsUrl} className="text-bronze-600 hover:text-bronze-700 transition-colors text-sm inline-flex items-center gap-1.5 mt-2" target="_blank" rel="noreferrer">
                      {t('viewOnMaps')}
                      <Icon icon="ph:arrow-square-out" className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:phone" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">{t('phone')}</h3>
                    <a href={formatTelHref(site.phone)} className="text-charcoal/80 hover:text-bronze-600 transition-colors text-lg">
                      {formatPhoneDisplay(site.phone)}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:envelope" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">{t('email')}</h3>
                    <a href={`mailto:${site.contactEmail}`} className="text-charcoal/80 hover:text-bronze-600 transition-colors text-lg">
                      {site.contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:buildings" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">{t('businessDetails')}</h3>
                    <p className="text-charcoal/60 text-sm">{site.legal.companyName} — P.IVA e C.F. {site.legal.piva}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative bg-white p-8 shadow-lg">
                <div className="absolute inset-0 blueprint-grid opacity-10" />
                <div className="relative z-10">
                  <p className="font-display text-2xl text-charcoal mb-4 flex items-center gap-3">
                    <Icon icon="ph:clock" className="w-6 h-6 text-bronze-600" aria-hidden />
                    {t('workingHours')}
                  </p>
                  <div className="space-y-2 text-charcoal/70">
                    {site.openingHours.map((entry) => {
                      const dayKey = resolveDayKey(entry.day);
                      const dayLabel = dayKey ? t(`days.${dayKey}`) : entry.day;
                      return (
                        <p key={entry.day}>
                          {dayLabel}: {entry.closed ? t('closed') : entry.note || `${entry.open} - ${entry.close}`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl text-charcoal mb-3 flex items-center gap-2">
                  <Icon icon="ph:map-trifold" className="w-5 h-5 text-bronze-600" aria-hidden />
                  {t('findUs')}
                </h3>
                <div className="relative overflow-hidden rounded-lg shadow-lg border border-bronze-100 bg-white">
                  <div className="aspect-[4/3]">
                    <iframe
                      src={getGoogleMapsEmbedUrl(site)}
                      title={t('mapTitle')}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </div>
                <a href={site.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-bronze-600 hover:text-bronze-700 transition-colors text-sm mt-3">
                  {t('openInMaps')}
                  <Icon icon="ph:arrow-square-out" className="w-3.5 h-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-bronze-100 rounded-xl px-6 py-10 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-display text-3xl text-charcoal">{t('formHeading')}</h2>
                    <p className="text-charcoal/70 mt-2">{t('formSubtitle')}</p>
                  </div>
                  <div className="h-1 w-24 bg-bronze-500 md:h-10 md:w-1 md:bg-bronze-500 md:self-stretch md:rounded-full" />
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} site={site} categories={categories} />
    </main>
  );
}
