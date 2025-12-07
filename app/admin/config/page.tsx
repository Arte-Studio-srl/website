'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConfigAdminPage() {
  const [config, setConfig] = useState({
    siteName: 'ArteStudio',
    siteDescription: 'Professional event structures and stage design',
    contactEmail: 'info@artestudio.com',
    contactPhone: '+39 123 456 7890',
    address: 'Via Example 123, Milano, Italy',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate save - in a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Configuration saved! (Note: This is a placeholder. Implement backend storage as needed.)');
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-charcoal text-cream border-b-4 border-bronze-500 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="text-bronze-300 hover:text-bronze-200 transition-colors"
              >
                ← 
              </Link>
              <h1 className="font-display text-2xl">Site Configuration</h1>
            </div>
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
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
                  Site Description
                </label>
                <textarea
                  value={config.siteDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={config.contactPhone}
                  onChange={(e) => setConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
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
                  value={config.socialMedia.facebook}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
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
                  value={config.socialMedia.instagram}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
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
                  value={config.socialMedia.linkedin}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={config.socialMedia.twitter}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-display text-lg text-charcoal mb-2">⚠️ Note</h3>
            <p className="text-sm text-charcoal/70">
              This configuration page is a placeholder. To make it functional, you'll need to:
            </p>
            <ul className="text-sm text-charcoal/70 mt-2 space-y-1 list-disc list-inside">
              <li>Create a configuration file or database table</li>
              <li>Implement API endpoints to save/load configuration</li>
              <li>Update your site components to use these configuration values</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

