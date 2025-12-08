'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { Category } from '@/types';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = (id: string, field: keyof Category, value: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const addCategory = () => {
    const newId = `category-${Date.now()}`;
    const newCategory: Category = {
      id: newId,
      name: 'New Category',
      description: 'Description here'
    };
    // Add to the beginning so it's immediately visible
    setCategories(prev => [newCategory, ...prev]);
    
    // Scroll to top after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const removeCategory = (id: string) => {
    if (!confirm('Are you sure you want to remove this category? This may affect existing projects.')) {
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const saveCategories = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Categories saved successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving categories:', error);
      alert('Failed to save categories');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading categories..." />;
  }

  const actionButtonClass =
    'inline-flex items-center gap-2 rounded-full bg-bronze-600 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-bronze-700 transition-colors disabled:opacity-50';

  return (
    <AdminLayout 
      title="Manage Categories"
      actions={
        <div className="flex gap-2">
          <button
            onClick={addCategory}
            className={`${actionButtonClass} bg-green-600 hover:bg-green-700`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add Category</span>
          </button>
          <button
            onClick={saveCategories}
            disabled={saving}
            className={actionButtonClass}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
        </div>
      }
    >
      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-700 font-medium">About Categories</p>
            <p className="text-sm text-blue-600 mt-1">
              Categories help organize your projects. New categories will appear at the top. 
              Don&apos;t forget to save your changes!
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-l-4 border-bronze-500 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header with delete button */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-bronze-100 rounded-lg flex items-center justify-center group-hover:bg-bronze-200 transition-colors flex-shrink-0">
                    <svg className="w-6 h-6 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1 uppercase tracking-wide">
                      Category ID
                    </label>
                    <input
                      type="text"
                      value={category.id}
                      onChange={(e) => updateCategory(category.id, 'id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent text-sm"
                      placeholder="e.g., conventions"
                    />
                    <p className="text-xs text-charcoal/50 mt-1">
                      Used in URLs
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1 uppercase tracking-wide">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent font-display text-lg"
                      placeholder="e.g., Conventions"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-charcoal/70 mb-1 uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent text-sm resize-none"
                      rows={3}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-bronze-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-charcoal/60 text-lg mb-4">No categories yet</p>
          <button
            onClick={addCategory}
            className="bg-bronze-600 hover:bg-bronze-700 text-white px-6 py-3 rounded transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Category
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

