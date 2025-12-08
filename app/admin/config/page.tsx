'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SiteConfig } from '@/data/site-config';

const emptyConfig: SiteConfig = {
  siteName: '',
  tagline: '',
  faviconUrl: '',
  contactEmail: '',
  phone: '',
  address: '',
  googleMapsUrl: '',
  legal: { companyName: '', piva: '' },
  openingHours: [],
  social: { facebook: '', instagram: '', linkedin: '' },
  seo: { defaultMetaTitle: '', defaultMetaDescription: '' },
  heroCarousel: [],
};

export default function ConfigAdminPage() {
  const [config, setConfig] = useState<SiteConfig>(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/site-config', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load config');
      setConfig(data.config);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save config');
      alert('Configuration saved');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  const updateOpeningHour = (index: number, field: keyof SiteConfig['openingHours'][number], value: string | boolean) => {
    setConfig(prev => {
      const hours = [...prev.openingHours];
      hours[index] = { ...hours[index], [field]: value };
      return { ...prev, openingHours: hours };
    });
  };

  const addOpeningHour = () => {
    setConfig(prev => ({
      ...prev,
      openingHours: [
        ...prev.openingHours,
        { day: '', open: '', close: '', closed: false, note: '' },
      ],
    }));
  };

  const removeOpeningHour = (index: number) => {
    setConfig(prev => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, i) => i !== index),
    }));
  };

  const updateHeroSlide = (index: number, field: keyof SiteConfig['heroCarousel'][number], value: string) => {
    setConfig(prev => {
      const slides = [...prev.heroCarousel];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, heroCarousel: slides };
    });
  };

  const addHeroSlide = () => {
    setConfig(prev => ({
      ...prev,
      heroCarousel: [
        ...prev.heroCarousel,
        { projectId: '', image: '', title: '', category: '' },
      ],
    }));
  };

  const removeHeroSlide = (index: number) => {
    setConfig(prev => ({
      ...prev,
      heroCarousel: prev.heroCarousel.filter((_, i) => i !== index),
    }));
  };

  const actionButtonClass =
    'inline-flex items-center gap-2 rounded-full bg-bronze-600 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-bronze-700 transition-colors disabled:opacity-50';

  const saveButton = !loading ? (
    <button
      onClick={handleSave}
      disabled={saving}
      className={actionButtonClass}
      aria-label="Save changes"
    >
      {saving ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          <span className="font-medium">Saving...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Save Changes</span>
        </>
      )}
    </button>
  ) : undefined;

  return (
    <AdminLayout title="Site Configuration" actions={saveButton}>
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 bg-white rounded-lg shadow">Loading configuration...</div>
        ) : (
          <>
            {/* General Settings */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="font-display text-2xl text-charcoal mb-6">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Tagline / Short Description
                  </label>
                  <textarea
                    value={config.tagline}
                    onChange={(e) => setConfig(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    value={config.faviconUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, faviconUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* SEO Defaults */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="font-display text-2xl text-charcoal mb-6">SEO Defaults</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={config.seo.defaultMetaTitle}
                    onChange={(e) => setConfig(prev => ({ ...prev, seo: { ...prev.seo, defaultMetaTitle: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={config.seo.defaultMetaDescription}
                    onChange={(e) => setConfig(prev => ({ ...prev, seo: { ...prev.seo, defaultMetaDescription: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="font-display text-2xl text-charcoal mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Phone Number (with country code)
                  </label>
                  <input
                    type="tel"
                    value={config.phone}
                    onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Address
                  </label>
                  <textarea
                    value={config.address}
                    onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={config.googleMapsUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Business / Legal */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="font-display text-2xl text-charcoal mb-6">Business Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={config.legal.companyName}
                    onChange={(e) => setConfig(prev => ({ ...prev, legal: { ...prev.legal, companyName: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    VAT / Tax ID (P.IVA)
                  </label>
                  <input
                    type="text"
                    value={config.legal.piva}
                    onChange={(e) => setConfig(prev => ({ ...prev, legal: { ...prev.legal, piva: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Registered Office (Sede Legale)
                  </label>
                  <input
                    type="text"
                    value={config.legal.legalAddress || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, legal: { ...prev.legal, legalAddress: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-charcoal">Opening Hours</h2>
                <button
                  onClick={addOpeningHour}
                  className="px-3 py-2 text-sm bg-bronze-600 text-white rounded hover:bg-bronze-700 transition-colors"
                >
                  Add Entry
                </button>
              </div>

              {config.openingHours.length === 0 && (
                <p className="text-sm text-charcoal/60 mb-4">No hours set yet.</p>
              )}

              <div className="space-y-4">
                {config.openingHours.map((entry, index) => (
                  <div key={`${entry.day}-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-charcoal mb-1">
                        Day
                      </label>
                      <input
                        type="text"
                        value={entry.day}
                        onChange={(e) => updateOpeningHour(index, 'day', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        placeholder="Monday"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal mb-1">
                        Opens
                      </label>
                      <input
                        type="text"
                        value={entry.open}
                        onChange={(e) => updateOpeningHour(index, 'open', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        placeholder="09:00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal mb-1">
                        Closes
                      </label>
                      <input
                        type="text"
                        value={entry.close}
                        onChange={(e) => updateOpeningHour(index, 'close', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        placeholder="18:00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal mb-1">
                        Note
                      </label>
                      <input
                        type="text"
                        value={entry.note || ''}
                        onChange={(e) => updateOpeningHour(index, 'note', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        placeholder="By appointment"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-sm text-charcoal">
                        <input
                          type="checkbox"
                          checked={Boolean(entry.closed)}
                          onChange={(e) => updateOpeningHour(index, 'closed', e.target.checked)}
                          className="rounded border-gray-300 text-bronze-600 focus:ring-bronze-500"
                        />
                        Closed
                      </label>
                      <button
                        type="button"
                        onClick={() => removeOpeningHour(index)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="font-display text-2xl text-charcoal mb-6">Social Media Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={config.social.facebook || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      social: { ...prev.social, facebook: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={config.social.instagram || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      social: { ...prev.social, instagram: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={config.social.linkedin || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      social: { ...prev.social, linkedin: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-charcoal">Hero Slides</h2>
                <button
                  onClick={addHeroSlide}
                  className="px-3 py-2 text-sm bg-bronze-600 text-white rounded hover:bg-bronze-700 transition-colors"
                >
                  Add Slide
                </button>
              </div>

              {config.heroCarousel.length === 0 && (
                <p className="text-sm text-charcoal/60 mb-4">No slides added yet.</p>
              )}

              <div className="space-y-4">
                {config.heroCarousel.map((slide, index) => (
                  <div key={`${slide.projectId}-${index}`} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Project ID / Slug
                        </label>
                        <input
                          type="text"
                          value={slide.projectId}
                          onChange={(e) => updateHeroSlide(index, 'projectId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={slide.category || ''}
                          onChange={(e) => updateHeroSlide(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeHeroSlide(index)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove Slide
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-display text-lg text-charcoal mb-2">ℹ️ Note</h3>
              <p className="text-sm text-charcoal/70">
                Changes are saved via the admin API to the repository/local file. Live site components may require a refresh/rebuild to reflect updates.
              </p>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

