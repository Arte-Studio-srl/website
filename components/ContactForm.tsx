'use client';

import { useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useContactForm } from '@/lib/use-contact-form';
import { submitSiteContact } from '@/lib/contact-transport';
import {
  CONTACT_FIELD_LIMITS,
  createContactFieldErrors,
} from '@/lib/contact-validation';
import { FormAlert, TextareaField, TextField } from '@/components/contact/FormFields';

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
    return createContactFieldErrors(values, {
      required: {
        name: t('validationName'),
        email: t('validationEmail'),
        subject: t('validationSubject'),
        message: t('validationMessage'),
      },
      invalidEmail: t('validationEmailInvalid'),
      tooLong: (_field, limit) => t('validationTooLong', { max: limit }),
    });
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
        <TextField
          id="name"
          name="name"
          label={t('name')}
          icon="ph:user"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          maxLength={CONTACT_FIELD_LIMITS.name}
        />
        <TextField
          id="email"
          name="email"
          type="email"
          label={t('email')}
          icon="ph:envelope"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          maxLength={CONTACT_FIELD_LIMITS.email}
        />
        <TextField
          id="phone"
          name="phone"
          type="tel"
          label={t('phone')}
          icon="ph:phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={CONTACT_FIELD_LIMITS.phone}
        />
      </div>
      <div className="space-y-6">
        <TextField
          id="subject"
          name="subject"
          label={t('subject')}
          icon="ph:tag"
          required
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          maxLength={CONTACT_FIELD_LIMITS.subject}
        />
        <TextareaField
          id="message"
          name="message"
          label={t('message')}
          icon="ph:note-pencil"
          required
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          rows={5}
          maxLength={CONTACT_FIELD_LIMITS.message}
        />
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
          <FormAlert tone="success">
            {t('success')}
          </FormAlert>
        )}
        {submitStatus === 'error' && (
          <FormAlert tone="error">
            {t('error')}
          </FormAlert>
        )}
      </div>
    </form>
  );
}
