'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface WidgetForm {
  name: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'success' | 'error';

export default function FloatingContact() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<WidgetForm>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof WidgetForm, string>>>({});
  const isAdminRoute = pathname?.startsWith('/admin');
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  const validate = () => {
    const nextErrors: Partial<Record<keyof WidgetForm, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Required';
    if (!form.email.trim()) nextErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Invalid email';
    if (!form.message.trim()) nextErrors.message = 'Required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subject: 'Website inquiry',
          source: 'floating-widget',
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Send failed');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3500);
    } catch (error) {
      console.error('Contact send error', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof WidgetForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isAdminRoute) {
    return null;
  }

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
              <div>
                <p className="font-display text-lg">Let&apos;s talk</p>
                <p className="text-sm text-cream/80">We reply within one business day</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close contact form"
                className="text-cream/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-display text-charcoal">
                  Name *
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
                <label htmlFor="email" className="text-sm font-display text-charcoal">
                  Email *
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
                <label htmlFor="message" className="text-sm font-display text-charcoal">
                  Project details *
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
                <span>Prefer email?</span>
                <a
                  href="mailto:info@progettoartestudio.it"
                  className="text-bronze-700 hover:text-bronze-600 font-display"
                >
                  info@progettoartestudio.it
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md py-3 font-display text-sm text-white transition focus:outline-none ${
                  isSubmitting
                    ? 'bg-bronze-400 cursor-not-allowed'
                    : 'bg-bronze-600 hover:bg-bronze-700 shadow-md'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-green-800 text-sm"
                  >
                    Received! We will contact you shortly.
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-sm"
                  >
                    Something went wrong. Please try again.
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
          setStatus('idle');
        }}
        aria-expanded={open}
        aria-label="Open contact form"
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
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v1m18 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0l-9 6-9-6"
            />
          </svg>
        </span>
      </motion.button>
    </div>
  );
}

