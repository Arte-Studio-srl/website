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
      const response = await fetch(`/api/projects/${id}`, {
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
    'inline-flex items-center gap-2 rounded-full bg-bronze-600 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:bg-bronze-700 transition-colors';

  return (
    <AdminLayout 
      title="Manage Projects"
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
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Search Projects
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
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
      <div className="mb-6">
        <p className="text-charcoal/70">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Action Buttons - Top Right */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ActionButtons
                  viewHref={`/project/${project.id}`}
                  editHref={`/admin/projects/edit/${project.id}`}
                  onDelete={() => deleteProject(project.id)}
                  size="sm"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl text-charcoal line-clamp-2 flex-1">
                  {project.title}
                </h3>
                <span className="text-sm text-bronze-600 font-medium ml-2">
                  {project.year}
                </span>
              </div>

              <p className="text-sm text-bronze-600 mb-2 capitalize">
                {project.category.replace('-', ' ')}
              </p>

              <p className="text-sm text-charcoal/70 line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Stats */}
              <div className="flex gap-4 text-xs text-charcoal/60">
                <span>{project.stages.length} stages</span>
                <span>
                  {project.stages.reduce((acc, stage) => acc + stage.images.length, 0)} images
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-charcoal/60 text-lg">No projects found</p>
        </div>
      )}
    </AdminLayout>
  );
}
