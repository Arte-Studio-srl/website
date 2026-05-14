'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { EMAIL_REGEX, submitSiteContact, useContactForm } from '@/lib/use-contact-form';

interface ContactFormShape extends Record<string, string | undefined> {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const INITIAL: ContactFormShape = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactForm() {
  const t = useTranslations('contact');

  const validate = useCallback((values: ContactFormShape) => {
    const errors: Partial<Record<keyof ContactFormShape, string>> = {};
    if (!values.name.trim()) errors.name = t('validationName');
    if (!values.email.trim()) errors.email = t('validationEmail');
    else if (!EMAIL_REGEX.test(values.email)) errors.email = t('validationEmailInvalid');
    if (!values.subject.trim()) errors.subject = t('validationSubject');
    if (!values.message.trim()) errors.message = t('validationMessage');
    return errors;
  }, [t]);

  const buildPayload = useCallback((values: ContactFormShape) => ({
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
  } = useContactForm<ContactFormShape>({
    initialValues: INITIAL,
    validate,
    buildPayload,
    submit: submitSiteContact,
    successResetMs: 5000,
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
            <Icon icon="ph:user" className="w-4 h-4 text-bronze-500" aria-hidden />
            {t('name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.name ? 'border-red-500' : 'border-bronze-200'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
            <Icon icon="ph:envelope" className="w-4 h-4 text-bronze-500" aria-hidden />
            {t('email')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.email ? 'border-red-500' : 'border-bronze-200'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
            <Icon icon="ph:phone" className="w-4 h-4 text-bronze-500" aria-hidden />
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-bronze-200 transition-colors focus:outline-none focus:border-bronze-600"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
            <Icon icon="ph:tag" className="w-4 h-4 text-bronze-500" aria-hidden />
            {t('subject')} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${errors.subject ? 'border-red-500' : 'border-bronze-200'}`}
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-charcoal font-display mb-2 flex items-center gap-1.5">
            <Icon icon="ph:note-pencil" className="w-4 h-4 text-bronze-500" aria-hidden />
            {t('message')} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 resize-none ${errors.message ? 'border-red-500' : 'border-bronze-200'}`}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 font-display text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-bronze-400 cursor-not-allowed' : 'bg-bronze-600 hover:bg-bronze-700 hover:shadow-lg'} text-white`}
        >
          {isSubmitting
            ? <><Icon icon="ph:circle-notch" className="w-5 h-5 animate-spin" aria-hidden /> {t('sending')}</>
            : <><Icon icon="ph:paper-plane-tilt" className="w-5 h-5" aria-hidden /> {t('send')}</>}
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
  );
}
