'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ActionButtons from '@/components/admin/ActionButtons';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Project deleted successfully!');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading projects..." />;
  }

  const actionButtonClass =
    'inline-flex items-center gap-2 border border-charcoal bg-charcoal text-white px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black transition-all';

  return (
    <AdminLayout 
      title="Projects"
      actions={
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Link href="/admin/projects/new" className={actionButtonClass}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      }
    >
      {/* Filters */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-3 uppercase tracking-widest">
              Search Projects
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-bronze-300 focus:ring-0 text-sm font-medium outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal/60 mb-3 uppercase tracking-widest">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-bronze-300 focus:ring-0 text-sm font-medium outline-none transition-colors appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Count */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="font-display text-2xl text-charcoal">All Projects</h2>
        <p className="text-xs uppercase tracking-widest text-charcoal/50 font-bold">
          {filteredProjects.length} / {projects.length}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white border border-gray-200 hover:border-bronze-300 transition-all group flex flex-col">
            {/* Thumbnail */}
            <div className="relative h-64 bg-gray-100 overflow-hidden border-b border-gray-200">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Action Buttons - Top Right */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ActionButtons
                  viewHref={`/project/${project.id}`}
                  editHref={`/admin/projects/edit/${project.id}`}
                  onDelete={() => deleteProject(project.id)}
                  size="sm"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-2xl text-charcoal line-clamp-2 leading-tight pr-4">
                  {project.title}
                </h3>
                <span className="text-xs font-bold tracking-widest text-bronze-600 mt-1.5">
                  {project.year}
                </span>
              </div>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-100 text-xs font-bold tracking-widest text-charcoal/60 uppercase">
                  {project.category.replace('-', ' ')}
                </span>
              </div>

              <p className="text-sm text-charcoal/60 line-clamp-3 mb-6 font-light leading-relaxed flex-grow">
                {project.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-bronze-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-xs font-bold tracking-widest text-charcoal/60 uppercase">{project.stages.length} Stages</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-bronze-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold tracking-widest text-charcoal/60 uppercase">
                    {project.stages.reduce((acc, stage) => acc + stage.images.length, 0)} Img
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-gray-200 bg-white mt-8">
          <p className="text-charcoal/40 text-lg font-light">No projects found</p>
        </div>
      )}
    </AdminLayout>
  );
}
