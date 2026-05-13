'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { EMAIL_REGEX, useContactForm } from '@/lib/use-contact-form';

interface WidgetForm extends Record<string, string | undefined> {
  name: string;
  email: string;
  message: string;
}

const INITIAL: WidgetForm = { name: '', email: '', message: '' };

interface Props {
  contactEmail: string;
}

export default function FloatingContact({ contactEmail }: Props) {
  const t = useTranslations('contact');
  const tFloat = useTranslations('floating');
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const required = useMemo(() => t('validationRequired'), [t]);
  const invalidEmail = useMemo(() => t('validationEmailInvalid'), [t]);

  const validate = useCallback((values: WidgetForm) => {
    const errors: Partial<Record<keyof WidgetForm, string>> = {};
    if (!values.name.trim()) errors.name = required;
    if (!values.email.trim()) errors.email = required;
    else if (!EMAIL_REGEX.test(values.email)) errors.email = invalidEmail;
    if (!values.message.trim()) errors.message = required;
    return errors;
  }, [required, invalidEmail]);

  const buildPayload = useCallback((values: WidgetForm) => ({
    ...values,
    subject: 'Website inquiry',
    source: 'floating-widget',
  }), []);

  const {
    values: form,
    errors,
    status,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetStatus,
  } = useContactForm<WidgetForm>({ initialValues: INITIAL, validate, buildPayload });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[320px] sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-bronze-100 bg-white"
          >
            <div className="flex items-start justify-between px-5 py-4 bg-charcoal text-cream">
              <div className="flex items-center gap-3">
                <Icon icon="ph:chat-circle-dots" className="w-6 h-6 text-bronze-300" aria-hidden />
                <div>
                  <p className="font-display text-lg">{tFloat('title')}</p>
                  <p className="text-sm text-cream/80">{tFloat('subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={tFloat('close')}
                className="text-cream/80 hover:text-white transition-colors"
              >
                <Icon icon="ph:x" className="w-5 h-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-display text-charcoal flex items-center gap-1.5">
                  <Icon icon="ph:user" className="w-3.5 h-3.5 text-bronze-500" aria-hidden />
                  {t('name')} *
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border-2 px-3 py-2 text-sm transition focus:outline-none focus:border-bronze-600 ${
                    errors.name ? 'border-red-500' : 'border-bronze-200'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-display text-charcoal flex items-center gap-1.5">
                  <Icon icon="ph:envelope" className="w-3.5 h-3.5 text-bronze-500" aria-hidden />
                  {t('email')} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-md border-2 px-3 py-2 text-sm transition focus:outline-none focus:border-bronze-600 ${
                    errors.email ? 'border-red-500' : 'border-bronze-200'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-display text-charcoal flex items-center gap-1.5">
                  <Icon icon="ph:note-pencil" className="w-3.5 h-3.5 text-bronze-500" aria-hidden />
                  {tFloat('messageLabel')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full rounded-md border-2 px-3 py-2 text-sm transition focus:outline-none focus:border-bronze-600 resize-none ${
                    errors.message ? 'border-red-500' : 'border-bronze-200'
                  }`}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>

              <div className="flex items-center justify-between text-xs text-charcoal/70">
                <span>{tFloat('preferEmail')}</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-bronze-700 hover:text-bronze-600 font-display inline-flex items-center gap-1"
                >
                  <Icon icon="ph:envelope-simple" className="w-3 h-3" aria-hidden />
                  {contactEmail}
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md py-3 font-display text-sm text-white transition focus:outline-none flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-bronze-400 cursor-not-allowed'
                    : 'bg-bronze-600 hover:bg-bronze-700 shadow-md'
                }`}
              >
                {isSubmitting
                  ? <><Icon icon="ph:circle-notch" className="w-4 h-4 animate-spin" aria-hidden /> {t('sending')}</>
                  : <><Icon icon="ph:paper-plane-tilt" className="w-4 h-4" aria-hidden /> {t('send')}</>
                }
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-green-800 text-sm flex items-center gap-2"
                  >
                    <Icon icon="ph:check-circle" className="w-4 h-4 shrink-0" aria-hidden />
                    {t('success')}
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-sm flex items-center gap-2"
                  >
                    <Icon icon="ph:warning-circle" className="w-4 h-4 shrink-0" aria-hidden />
                    {t('error')}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={toggleRef}
        onClick={() => {
          setOpen((prev) => !prev);
          resetStatus();
        }}
        aria-expanded={open}
        aria-label={tFloat('open')}
        className="relative flex items-center justify-center rounded-full bg-bronze-600 p-3 text-white shadow-xl transition hover:bg-bronze-700 focus:outline-none focus:ring-2 focus:ring-bronze-300 h-14 w-14"
        whileTap={{ scale: 0.96 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-bronze-500/40"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden
        />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur overflow-hidden">
          <Icon icon="ph:chat-circle-dots" className="h-5 w-5" aria-hidden />
        </span>
      </motion.button>
    </div>
  );
}
