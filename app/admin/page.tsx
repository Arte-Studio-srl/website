'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  totalProjects: number;
  totalCategories: number;
  latestProjectYear: number | string;
  totalImages: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalCategories: 0,
    latestProjectYear: '-',
    totalImages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        const projects = data.projects;
        const categories = data.categories;
        
        // Calculate stats
        const totalImages = projects.reduce((acc: number, project: any) => {
          return acc + project.stages.reduce((stageAcc: number, stage: any) => {
            return stageAcc + stage.images.length;
          }, 0);
        }, 0);
        
        const latestYear = projects.length > 0 
          ? Math.max(...projects.map((p: any) => parseInt(p.year))) 
          : '-';
        
        setStats({
          totalProjects: projects.length,
          totalCategories: categories.length,
          latestProjectYear: latestYear,
          totalImages: totalImages
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      href: '/admin/projects',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
      title: 'Projects',
      description: 'Manage your portfolio projects, add new ones, edit existing projects, and organize images.'
    },
    {
      href: '/admin/categories',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      ),
      title: 'Categories',
      description: 'Manage project categories, edit descriptions, and organize your portfolio structure.'
    },
    {
      href: '/admin/images',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      title: 'Images',
      description: 'Upload and manage project images, organize drawings and final outputs.'
    },
    {
      href: '/admin/config',
      icon: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ),
      title: 'Configuration',
      description: 'General site settings, contact information, and other configuration options.'
    }
  ];

  return (
    <AdminLayout 
      title="Admin"
      backHref="/"
      backLabel="View Site"
    >
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dashboardCards.map((card) => (
          <Link 
            key={card.href}
            href={card.href}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-bronze-500 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-bronze-100 rounded-lg flex items-center justify-center group-hover:bg-bronze-200 transition-colors">
                <svg className="w-6 h-6 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {card.icon}
                </svg>
              </div>
              <h2 className="font-display text-2xl text-charcoal">{card.title}</h2>
            </div>
            <p className="text-charcoal/70">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="font-display text-2xl text-charcoal mb-6">Quick Overview</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bronze-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-display text-bronze-600 mb-2">{stats.totalProjects}</div>
              <div className="text-charcoal/70">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-bronze-600 mb-2">{stats.totalCategories}</div>
              <div className="text-charcoal/70">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-bronze-600 mb-2">{stats.latestProjectYear}</div>
              <div className="text-charcoal/70">Latest Project</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display text-bronze-600 mb-2">{stats.totalImages}</div>
              <div className="text-charcoal/70">Total Images</div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
