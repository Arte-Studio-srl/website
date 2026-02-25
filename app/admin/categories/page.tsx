'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { Category } from '@/types';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<(Category & { _key?: string })[]>([]);
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
        setCategories(
          data.categories.map((c: Category) => ({ ...c, _key: Math.random().toString(36).substring(2) }))
        );
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w-]+/g, '')     // Remove all non-word chars
      .replace(/--+/g, '-');       // Replace multiple - with single -
  };

  const updateCategory = (rowKey: string, field: keyof Category, value: string) => {
    setCategories(prev =>
      prev.map(cat => {
        const identifier = cat._key || cat.id;
        if (identifier !== rowKey) return cat;
        
        const updatedCat = { ...cat, [field]: value };
        // Auto-slugify the ID if the name is changed
        if (field === 'name') {
          updatedCat.id = slugify(value);
        }
        return updatedCat;
      })
    );
  };

  const addCategory = () => {
    const newCategory: Category & { _key?: string } = {
      id: 'new-category',
      name: 'New Category',
      description: 'Description here',
      _key: Math.random().toString(36).substring(2)
    };
    // Add to the beginning so it's immediately visible
    setCategories(prev => [newCategory, ...prev]);
    
    // Scroll to top after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const removeCategory = (rowKey: string) => {
    if (!confirm('Are you sure you want to remove this category? This may affect existing projects.')) {
      return;
    }
    setCategories(prev => prev.filter(cat => (cat._key || cat.id) !== rowKey));
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
    'inline-flex items-center gap-2 border border-bronze-200 bg-white text-charcoal px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-bronze-50 hover:border-bronze-300 transition-all disabled:opacity-50';

  return (
    <AdminLayout 
      title="Categories"
      actions={
        <div className="flex gap-4">
          <button
            onClick={addCategory}
            className={`${actionButtonClass} !bg-charcoal !text-white !border-charcoal hover:!bg-black`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
          <button
            onClick={saveCategories}
            disabled={saving}
            className={actionButtonClass}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-charcoal border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      }
    >
      {/* Info Banner */}
      <div className="border border-gray-200 bg-white p-6 mb-8 flex items-start gap-4">
        <svg className="w-5 h-5 text-bronze-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-charcoal mb-1">About Categories</p>
          <p className="text-sm text-charcoal/60 font-light leading-relaxed">
            Categories help organize your projects. New categories will appear at the top. 
            Don&apos;t forget to save your changes!
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const rowKey = category._key || category.id;
            return (
            <div
              key={rowKey}
              className="bg-white border border-gray-200 hover:border-bronze-200 transition-colors group"
            >
              <div className="p-6">
                {/* Header with delete button */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-10 h-10 border border-gray-100 flex items-center justify-center text-bronze-600 group-hover:bg-bronze-50 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => removeCategory(rowKey)}
                    className="p-2 text-charcoal/30 hover:text-red-600 transition-colors"
                    title="Remove category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-charcoal/60 mb-2 uppercase tracking-widest">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(rowKey, 'name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-bronze-300 focus:ring-0 font-display text-xl outline-none transition-colors"
                      placeholder="e.g., Conventions"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal/60 mb-2 uppercase tracking-widest">
                      URL Slug / Category ID
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-charcoal/60 text-sm font-medium rounded-sm cursor-not-allowed flex items-center gap-2">
                       <svg className="w-4 h-4 text-bronze-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {category.id}
                    </div>
                    <p className="text-xs text-charcoal/50 mt-2 font-light italic">
                      This is the unique identifier used in website URLs (e.g., /projects/{category.id || '...'}). 
                      It is automatically generated from the Display Name.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal/60 mb-2 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      value={category.description}
                      onChange={(e) => updateCategory(rowKey, 'description', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-bronze-300 focus:ring-0 text-sm font-light resize-none outline-none transition-colors"
                      rows={3}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-16 text-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 border border-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-charcoal/60 text-lg mb-8 font-light">No categories yet</p>
          <button
            onClick={addCategory}
            className={`${actionButtonClass} !bg-charcoal !text-white !border-charcoal hover:!bg-black inline-flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Category
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

