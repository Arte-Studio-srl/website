'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteConfig, formatPhoneDisplay, formatTelHref, getGoogleMapsEmbedUrl } from '@/lib/site-config';

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const site = getSiteConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactForm, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact-page' }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-charcoal text-cream">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 bg-bronze-500 mb-6"
            />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-cream/80 leading-relaxed">
              Let&apos;s discuss your next project and bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl text-charcoal mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl text-bronze-600 mb-3">Address</h3>
                  <p className="text-charcoal/80 leading-relaxed">
                    {site.address.split('\n').map((line, idx) => (
                      <span key={idx} className="block">{line}</span>
                    ))}
                  </p>
                  {site.legal.legalAddress && (
                    <p className="text-charcoal/60 text-sm mt-2">
                      Sede legale: {site.legal.legalAddress}
                    </p>
                  )}
                  <a
                    href={site.googleMapsUrl}
                    className="text-bronze-600 hover:text-bronze-700 transition-colors text-sm inline-flex items-center gap-2 mt-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Google Maps
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-xl text-bronze-600 mb-3">Phone</h3>
                  <a
                    href={formatTelHref(site.phone)}
                    className="text-charcoal/80 hover:text-bronze-600 transition-colors text-lg"
                  >
                    {formatPhoneDisplay(site.phone)}
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-xl text-bronze-600 mb-3">Email</h3>
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="text-charcoal/80 hover:text-bronze-600 transition-colors text-lg"
                  >
                    {site.contactEmail}
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-xl text-bronze-600 mb-3">Business Details</h3>
                  <p className="text-charcoal/60 text-sm">
                    {site.legal.companyName} — P.IVA e C.F. {site.legal.piva}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hours + Map (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-10"
            >
              <div className="relative bg-white p-8 shadow-lg">
                <div className="absolute inset-0 blueprint-grid opacity-10" />
                <div className="relative z-10">
                  <p className="font-display text-2xl text-charcoal mb-4">
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
                <h3 className="font-display text-xl text-charcoal mb-3">Find Us</h3>
                <div className="relative overflow-hidden rounded-lg shadow-lg border border-bronze-100 bg-white">
                  <div className="aspect-[4/3]">
                    <iframe
                      src={getGoogleMapsEmbedUrl(site)}
                      title="ArteStudio on Google Maps"
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </div>
                <a
                  href={site.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-bronze-600 hover:text-bronze-700 transition-colors text-sm mt-3"
                >
                  Open in Google Maps
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form (Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-white/90 backdrop-blur shadow-2xl border border-bronze-100 rounded-xl px-6 py-10 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-display text-3xl text-charcoal">
                      Send us a Message
                    </h2>
                    <p className="text-charcoal/70 mt-2">
                      We usually respond within one business day.
                    </p>
                  </div>
                  <div className="h-1 w-24 bg-bronze-500 md:h-10 md:w-1 md:bg-bronze-500 md:self-stretch md:rounded-full" />
                </div>

                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-charcoal font-display mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${
                          errors.name ? 'border-red-500' : 'border-bronze-200'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-charcoal font-display mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${
                          errors.email ? 'border-red-500' : 'border-bronze-200'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-charcoal font-display mb-2">
                        Phone
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
                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-charcoal font-display mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 ${
                          errors.subject ? 'border-red-500' : 'border-bronze-200'
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-charcoal font-display mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 border-2 transition-colors focus:outline-none focus:border-bronze-600 resize-none ${
                          errors.message ? 'border-red-500' : 'border-bronze-200'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 font-display text-lg transition-all ${
                        isSubmitting
                          ? 'bg-bronze-400 cursor-not-allowed'
                          : 'bg-bronze-600 hover:bg-bronze-700 hover:shadow-lg'
                      } text-white`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-100 border border-green-400 text-green-700"
                      >
                        Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-100 border border-red-400 text-red-700"
                      >
                        Sorry, there was an error sending your message. Please try again or contact us directly via email.
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

