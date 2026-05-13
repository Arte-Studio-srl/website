'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPhoneDisplay, formatTelHref, getGoogleMapsEmbedUrl } from '@/lib/site-config';
import { useSiteData } from '@/components/SiteDataProvider';
import { useTranslations } from 'next-intl';
import { EMAIL_REGEX, useContactForm } from '@/lib/use-contact-form';

interface ContactForm extends Record<string, string | undefined> {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const INITIAL: ContactForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const t = useTranslations('contact');
  const { siteConfig: site } = useSiteData();

  const validate = useCallback((values: ContactForm) => {
    const errors: Partial<Record<keyof ContactForm, string>> = {};
    if (!values.name.trim()) errors.name = t('validationName');
    if (!values.email.trim()) errors.email = t('validationEmail');
    else if (!EMAIL_REGEX.test(values.email)) errors.email = t('validationEmailInvalid');
    if (!values.subject.trim()) errors.subject = t('validationSubject');
    if (!values.message.trim()) errors.message = t('validationMessage');
    return errors;
  }, [t]);

  const buildPayload = useCallback((values: ContactForm) => ({
    ...values,
    source: 'contact-page',
  }), []);

  const {
    values: formData,
    errors,
    status: submitStatus,
    isSubmitting,
    handleChange,
    handleSubmit: onSubmit,
  } = useContactForm<ContactForm>({
    initialValues: INITIAL,
    validate,
    buildPayload,
    successResetMs: 5000,
  });

  return (
    <main className="min-h-screen">
      <Header />
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.8, delay: 0.3 }} className="h-1 bg-bronze-500 mb-6" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">{t('title')}</h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">{t('subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className="font-display text-3xl text-charcoal mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:map-pin" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">Address</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      {site.address.split('\n').map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </p>
                    {site.legal.legalAddress && (
                      <p className="text-charcoal/60 text-sm mt-2">Sede legale: {site.legal.legalAddress}</p>
                    )}
                    <a href={site.googleMapsUrl} className="text-bronze-600 hover:text-bronze-700 transition-colors text-sm inline-flex items-center gap-1.5 mt-2" target="_blank" rel="noreferrer">
                      View on Google Maps
                      <Icon icon="ph:arrow-square-out" className="w-3.5 h-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-50 flex items-center justify-center shrink-0">
                    <Icon icon="ph:phone" className="w-5 h-5 text-bronze-600" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-bronze-600 mb-2">Phone</h3>
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
                    <h3 className="font-display text-xl text-bronze-600 mb-2">Email</h3>
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
                    <h3 className="font-display text-xl text-bronze-600 mb-2">Business Details</h3>
                    <p className="text-charcoal/60 text-sm">{site.legal.companyName} — P.IVA e C.F. {site.legal.piva}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-10">
              <div className="relative bg-white p-8 shadow-lg">
                <div className="absolute inset-0 blueprint-grid opacity-10" />
                <div className="relative z-10">
                  <p className="font-display text-2xl text-charcoal mb-4 flex items-center gap-3">
                    <Icon icon="ph:clock" className="w-6 h-6 text-bronze-600" aria-hidden />
                    Working Hours
                  </p>
                  <div className="space-y-2 text-charcoal/70">
                    {site.openingHours.map((entry) => (
                      <p key={entry.day}>
                        {entry.day}: {entry.closed ? 'Closed' : entry.note || `${entry.open} - ${entry.close}`}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl text-charcoal mb-3 flex items-center gap-2">
                  <Icon icon="ph:map-trifold" className="w-5 h-5 text-bronze-600" aria-hidden />
                  Find Us
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
                  Open in Google Maps
                  <Icon icon="ph:arrow-square-out" className="w-3.5 h-3.5" aria-hidden />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-20">
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-bronze-100 rounded-xl px-6 py-10 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-display text-3xl text-charcoal">Send us a Message</h2>
                    <p className="text-charcoal/70 mt-2">We usually respond within one business day.</p>
                  </div>
                  <div className="h-1 w-24 bg-bronze-500 md:h-10 md:w-1 md:bg-bronze-500 md:self-stretch md:rounded-full" />
                </div>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
                        <Icon icon="ph:user" className="w-4 h-4 text-bronze-500" aria-hidden />
                        {t('name')} *
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.name ? 'border-red-500' : 'border-bronze-200'}`} />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
                        <Icon icon="ph:envelope" className="w-4 h-4 text-bronze-500" aria-hidden />
                        {t('email')} *
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.email ? 'border-red-500' : 'border-bronze-200'}`} />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
                        <Icon icon="ph:phone" className="w-4 h-4 text-bronze-500" aria-hidden />
                        {t('phone')}
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-bronze-200 transition-colors focus:outline-none focus:border-bronze-600" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="subject" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
                        <Icon icon="ph:tag" className="w-4 h-4 text-bronze-500" aria-hidden />
                        {t('subject')} *
                      </label>
                      <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.subject ? 'border-red-500' : 'border-bronze-200'}`} />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
                        <Icon icon="ph:note-pencil" className="w-4 h-4 text-bronze-500" aria-hidden />
                        {t('message')} *
                      </label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 resize-none ${errors.message ? 'border-red-500' : 'border-bronze-200'}`} />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={isSubmitting} className={`w-full py-4 font-display text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-bronze-400 cursor-not-allowed' : 'bg-bronze-600 hover:bg-bronze-700 hover:shadow-lg'} text-white`}>
                      {isSubmitting ? <><Icon icon="ph:circle-notch" className="w-5 h-5 animate-spin" aria-hidden /> {t('sending')}</> : <><Icon icon="ph:paper-plane-tilt" className="w-5 h-5" aria-hidden /> {t('send')}</>}
                    </button>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    {submitStatus === 'success' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-100 border border-green-400 text-green-700 flex items-center gap-3">
                        <Icon icon="ph:check-circle" className="w-5 h-5 shrink-0" aria-hidden />
                        {t('success')}
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-100 border border-red-400 text-red-700 flex items-center gap-3">
                        <Icon icon="ph:warning-circle" className="w-5 h-5 shrink-0" aria-hidden />
                        {t('error')}
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
