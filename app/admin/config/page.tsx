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

  const saveButton = !loading ? (
    <button
      onClick={handleSave}
      disabled={saving}
      className="bg-bronze-600 hover:bg-bronze-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
      title={saving ? 'Saving...' : 'Save Changes'}
    >
      {saving ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
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

