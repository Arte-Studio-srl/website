'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, ProjectStage } from '@/types';

interface ImageInfo {
  path: string;
  projectId: string;
  type: 'thumbnail' | 'drawing' | 'final';
}

export default function ImagesAdminPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        
        // Extract all images from projects
        const allImages: ImageInfo[] = [];
        data.projects.forEach((project: Project) => {
          // Thumbnail
          if (project.thumbnail) {
            allImages.push({
              path: project.thumbnail,
              projectId: project.id,
              type: 'thumbnail'
            });
          }
          
          // Stage images
          project.stages.forEach((stage: ProjectStage) => {
            stage.images.forEach((img: string) => {
              allImages.push({
                path: img,
                projectId: project.id,
                type: stage.type
              });
            });
          });
        });
        
        setImages(allImages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imagePath: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/upload?path=${encodeURIComponent(imagePath)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Image deleted successfully! Remember to update the project to remove the reference.');
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const filteredImages = selectedProject === 'all'
    ? images
    : images.filter(img => img.projectId === selectedProject);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bronze-600 mx-auto mb-4"></div>
          <p className="text-charcoal">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-charcoal text-cream border-b-4 border-bronze-500 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="text-bronze-300 hover:text-bronze-200 transition-colors"
            >
              ← 
            </Link>
            <h1 className="font-display text-2xl">Image Gallery</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-charcoal">
              Filter by Project:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-bronze-500 focus:border-transparent"
            >
              <option value="all">All Projects ({images.length} images)</option>
              {projects.map(project => {
                const projectImages = images.filter(img => img.projectId === project.id);
                return (
                  <option key={project.id} value={project.id}>
                    {project.title} ({projectImages.length} images)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-charcoal/70">
            <span>Total: {filteredImages.length} images</span>
            <span>Thumbnails: {filteredImages.filter(i => i.type === 'thumbnail').length}</span>
            <span>Drawings: {filteredImages.filter(i => i.type === 'drawing').length}</span>
            <span>Finals: {filteredImages.filter(i => i.type === 'final').length}</span>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredImages.map((img, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={img.path}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-2">
                  <span className="text-white text-xs font-medium mb-2 capitalize">
                    {img.type}
                  </span>
                  <button
                    onClick={() => deleteImage(img.path)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs text-charcoal/70 truncate mb-1">
                  {img.projectId}
                </p>
                <p className="text-xs text-bronze-600 capitalize">
                  {img.type}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal/60 text-lg">No images found</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-display text-lg text-charcoal mb-2">💡 How to manage images</h3>
          <ul className="text-sm text-charcoal/70 space-y-2">
            <li>• Upload images through the project editor (New Project or Edit Project)</li>
            <li>• Deleting an image here only removes the file - update the project to remove references</li>
            <li>• Images are organized by project ID in the file system</li>
            <li>• Thumbnails are automatically named &quot;thumb.jpg&quot; when uploaded</li>
          </ul>
        </div>
      </main>
    </div>
  );
}



