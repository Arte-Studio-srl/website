'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category, Project, ProjectStage, StageIcon } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import IconButton from '@/components/admin/IconButton';
import FormField from '@/components/admin/FormField';
import FormSelect from '@/components/admin/FormSelect';
import FormTextarea from '@/components/admin/FormTextarea';
import ImageUpload from '@/components/admin/ImageUpload';

type ProjectFormData = Omit<Project, 'id'> & { id: string };

const STAGE_ICON_OPTIONS: { value: StageIcon; label: string; helper: string }[] = [
  { value: 'compass', label: 'Concept', helper: 'Vision and direction' },
  { value: 'blueprint', label: 'Blueprint', helper: 'Design and planning' },
  { value: 'layers', label: 'Build', helper: 'Production & fabrication' },
  { value: 'camera', label: 'Capture', helper: 'Previews & renders' },
  { value: 'sparkles', label: 'Experience', helper: 'Final delivery' },
  { value: 'flag', label: 'Milestone', helper: 'Key checkpoint' },
];

const createStageId = () => `stage-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
const chooseIconForStage = (stage: ProjectStage, index: number): StageIcon => {
  if (stage.icon) return stage.icon;
  if (stage.type === 'drawing') return 'blueprint';
  if (stage.type === 'final') return 'sparkles';
  return STAGE_ICON_OPTIONS[index % STAGE_ICON_OPTIONS.length].value;
};

const createEmptyStage = (index: number): ProjectStage => ({
  id: createStageId(),
  title: `Step ${index}`,
  description: '',
  images: [],
  icon: STAGE_ICON_OPTIONS[index % STAGE_ICON_OPTIONS.length].value,
});

const collectProjectImages = (project: ProjectFormData): string[] => {
  const images: string[] = [];

  if (project.thumbnail) {
    images.push(project.thumbnail);
  }

  project.stages?.forEach((stage) => {
    stage.images?.forEach((img) => images.push(img));
  });

  return images;
};

const normalizeStages = (stages: ProjectStage[] = []): ProjectStage[] => {
  if (stages.length === 0) return [createEmptyStage(1)];
  return stages.map((stage, index) => ({
    ...stage,
    id: stage.id || createStageId(),
    icon: chooseIconForStage(stage, index),
  }));
};

const createEmptyProjectForm = (): ProjectFormData => ({
  id: '',
  title: '',
  category: '',
  year: new Date().getFullYear(),
  client: '',
  description: '',
  thumbnail: '',
  stages: normalizeStages([]),
});

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string | undefined;
  const isEditMode = projectId && projectId !== 'new';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const initialImagesRef = useRef<Set<string>>(new Set());
  const pendingUploadsRef = useRef<Set<string>>(new Set());
  const hasSavedRef = useRef(false);

  const [formData, setFormData] = useState<ProjectFormData>(() => createEmptyProjectForm());

  const markInitialImages = useCallback((project: ProjectFormData) => {
    initialImagesRef.current = new Set(collectProjectImages(project));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (isEditMode) {
        const [projectRes, categoriesRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch('/api/categories')
        ]);
        const projectData = await projectRes.json();
        const categoriesData = await categoriesRes.json();

        if (projectData.success) {
          const normalizedProject: ProjectFormData = {
            ...projectData.project,
            stages: normalizeStages(projectData.project.stages),
          };
          setFormData(normalizedProject);
          markInitialImages(normalizedProject);
        }
        if (categoriesData.success) setCategories(categoriesData.categories);
      } else {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) setCategories(data.categories);
        // New project: baseline has no images yet
        markInitialImages(createEmptyProjectForm());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [isEditMode, markInitialImages, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      id: isEditMode ? prev.id : generateId(title)
    }));
  };

  const handleStageUpdate = (stageIndex: number, updater: (stage: ProjectStage) => ProjectStage) => {
    setFormData(prev => {
      const updatedStages = [...prev.stages];
      updatedStages[stageIndex] = updater(updatedStages[stageIndex]);
      return { ...prev, stages: updatedStages };
    });
  };

  const deleteImage = useCallback(async (url: string) => {
    if (!url) return;
    try {
      await fetch(`/api/admin/upload?path=${encodeURIComponent(url)}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete image', error);
    }
  }, []);

  const cleanupPendingUploads = useCallback(async () => {
    const pending = Array.from(pendingUploadsRef.current);
    if (pending.length === 0) return;

    pendingUploadsRef.current.clear();
    await Promise.all(pending.map((url) => deleteImage(url)));
  }, [deleteImage]);

  const handleImageRemoval = useCallback(async (url: string) => {
    if (!url) return;

    // Only auto-delete images that were uploaded during this edit session
    const isNewUpload = !initialImagesRef.current.has(url);
    pendingUploadsRef.current.delete(url);

    if (isNewUpload) {
      await deleteImage(url);
    }
  }, [deleteImage]);

  const recordUpload = useCallback((url: string) => {
    if (!initialImagesRef.current.has(url)) {
      pendingUploadsRef.current.add(url);
    }
  }, []);

  const handleStageImageRemove = useCallback(
    async (stageIndex: number, imgIndex: number, url: string) => {
      handleStageUpdate(stageIndex, (current) => ({
        ...current,
        images: current.images.filter((_, idx) => idx !== imgIndex),
      }));
      await handleImageRemoval(url);
    },
    [handleImageRemoval, handleStageUpdate]
  );

  const handleAddStage = () => {
    setFormData(prev => {
      const nextIndex = prev.stages.length + 1;
      return {
        ...prev,
        stages: [...prev.stages, createEmptyStage(nextIndex)],
      };
    });
  };

  const handleRemoveStage = (stageIndex: number) => {
    setFormData(prev => {
      if (prev.stages.length === 1) return prev;
      const updatedStages = prev.stages.filter((_, idx) => idx !== stageIndex);
      return { ...prev, stages: updatedStages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnail) {
      alert('Please upload a thumbnail image');
      return;
    }

    if (formData.stages.some(stage => !stage.title?.trim())) {
      alert('Please add a title to each step');
      return;
    }

    if (formData.stages.some(stage => stage.images.length === 0)) {
      alert('Please add at least one image to each step');
      return;
    }

    setSaving(true);
    try {
      const url = isEditMode ? `/api/admin/projects/${projectId}` : '/api/admin/projects';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        hasSavedRef.current = true;
        pendingUploadsRef.current.clear();
        alert(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
        router.push('/admin/projects');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    await cleanupPendingUploads();
    router.push('/admin/projects');
  };

  useEffect(() => {
    return () => {
      if (!hasSavedRef.current) {
        cleanupPendingUploads();
      }
    };
  }, [cleanupPendingUploads]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading project..." />;
  }

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  return (
    <AdminLayout 
      title={isEditMode ? 'Edit Project' : 'New Project'}
      backHref="/admin/projects"
      backLabel="← Projects"
      actions={
        isEditMode && (
          <a
            href={`/project/${formData.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bronze-300 hover:text-bronze-200 transition-colors text-sm"
          >
            View Live →
          </a>
        )
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="font-display text-2xl text-charcoal mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <FormField
              label="Project Title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., International Corporate Summit"
            />

            <FormField
              label="Project ID"
              type="text"
              value={formData.id}
              disabled
              helpText={isEditMode ? 'ID cannot be changed after creation' : 'Auto-generated from title'}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Category"
                required
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />

              <FormField
                label="Year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min={2000}
                max={2100}
              />
            </div>

            <FormField
              label="Client"
              type="text"
              required
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              placeholder="e.g., Global Tech Conference"
            />

            <FormTextarea
              label="Description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Brief description of the project..."
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="font-display text-2xl text-charcoal mb-6">Thumbnail Image</h2>
          <ImageUpload
            projectId={formData.id}
            type="thumbnail"
            currentImage={formData.thumbnail}
            onUploadComplete={(url) => {
              recordUpload(url);
              setFormData(prev => ({ ...prev, thumbnail: url }));
            }}
            onRemove={() => {
              handleImageRemoval(formData.thumbnail);
              setFormData(prev => ({ ...prev, thumbnail: '' }));
            }}
            label="Main thumbnail (recommended: 16:9 aspect ratio)"
            disabled={!formData.id}
          />
          {!formData.id && (
            <p className="text-sm text-red-600 mt-2">Enter project title first to enable upload</p>
          )}
        </div>

        {/* Stages */}
        <div className="space-y-6">
          {formData.stages.map((stage, stageIndex) => {
            const uploadType = stage.id || `stage-${stageIndex + 1}`;
            return (
              <div key={stage.id ?? stageIndex} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
                      Step {stageIndex + 1}
                    </p>
                    <h2 className="font-display text-2xl text-charcoal">
                      {stage.title || 'Untitled step'}
                    </h2>
                    <p className="text-sm text-charcoal/60">
                      Define the milestone, pick an icon, then drop the visuals.
                    </p>
                  </div>
                  {formData.stages.length > 1 && (
                    <IconButton
                      icon="trash"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveStage(stageIndex)}
                      label="Remove step"
                    />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      label="Step Title"
                      type="text"
                      value={stage.title}
                      onChange={(e) =>
                        handleStageUpdate(stageIndex, (current) => ({
                          ...current,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Concept development"
                    />

                    <FormTextarea
                      label="Step Description"
                      value={stage.description}
                      onChange={(e) =>
                        handleStageUpdate(stageIndex, (current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Add notes, goals, or what was achieved in this step."
                    />

                    <div>
                      <p className="block text-sm font-medium text-charcoal mb-3">
                        Step icon (optional)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {STAGE_ICON_OPTIONS.map((option) => {
                          const active = stage.icon === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                handleStageUpdate(stageIndex, (current) => ({
                                  ...current,
                                  icon: option.value,
                                }))
                              }
                              className={`rounded-md border px-3 py-2 text-left transition-colors ${
                                active
                                  ? 'border-bronze-500 bg-bronze-50 text-charcoal'
                                  : 'border-gray-200 hover:border-bronze-400'
                              }`}
                            >
                              <span className="block text-sm font-semibold">{option.label}</span>
                              <span className="block text-[11px] text-charcoal/60">
                                {option.helper}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-4">
                      Images ({stage.images.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {stage.images.map((img, imgIndex) => (
                        <ImageUpload
                          key={imgIndex}
                          projectId={formData.id}
                          type={uploadType}
                          currentImage={img}
                          onUploadComplete={() => {}}
                          onRemove={() => handleStageImageRemove(stageIndex, imgIndex, img)}
                        />
                      ))}
                      <ImageUpload
                        projectId={formData.id}
                        type={uploadType}
                        onUploadComplete={(url) => {
                          recordUpload(url);
                          handleStageUpdate(stageIndex, (current) => ({
                            ...current,
                            images: [...current.images, url],
                          }));
                        }}
                        disabled={!formData.id}
                      />
                    </div>
                    {!formData.id && (
                      <p className="text-sm text-red-600 mt-2">
                        Enter project title first to enable upload
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 rounded-lg border border-dashed border-bronze-300/60 shadow-inner flex items-center justify-between">
          <div>
            <p className="font-display text-lg text-charcoal">Add more steps</p>
            <p className="text-sm text-charcoal/60">Build your own flow — discovery, design, prototyping, delivery, anything.</p>
          </div>
          <IconButton
            type="button"
            icon="plus"
            variant="secondary"
            size="md"
            onClick={handleAddStage}
            label="Add step"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 items-center">
          <IconButton
            type="submit"
            icon={saving ? 'save' : 'check'}
            variant="primary"
            size="lg"
            disabled={saving}
            label={saving ? `${isEditMode ? 'Updating' : 'Creating'}...` : `${isEditMode ? 'Update' : 'Create'} Project`}
          />
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-charcoal rounded font-medium transition-colors"
          >
            Cancel
          </button>
          {saving && (
            <span className="text-charcoal/60">{isEditMode ? 'Updating' : 'Creating'} project...</span>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}

