import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { sanityFetch, isSanityConfigured } from './sanity';
import type { Category, Project, ProjectStage, StageIcon } from '@/types';

const stageIcons: StageIcon[] = ['compass', 'blueprint', 'layers', 'camera', 'sparkles', 'flag'];

export type Locale = 'it' | 'en';
const DEFAULT_LOCALE: Locale = 'it';

function normalizeLocale(input?: string | null): Locale {
  return input === 'en' ? 'en' : 'it';
}

type SanityStage = {
  id?: string;
  title?: string;
  description?: string;
  icon?: StageIcon;
  type?: string;
  images?: string[];
};

type SanityProject = {
  id?: string;
  title?: string;
  category?: unknown;
  year?: number;
  client?: string;
  description?: string;
  thumbnail?: unknown;
  stages?: SanityStage[];
};

type SanityCategory = {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
};

function buildProjectsQuery(locale: Locale): string {
  return `*[_type == "project"] | order(year desc, _createdAt desc) {
  "id": coalesce(slug.current, projectId, _id),
  "title": coalesce(title_${locale}, title_en, title_it, title, ""),
  "category": coalesce(category->slug.current, categorySlug, category, ""),
  year,
  client,
  "description": coalesce(description_${locale}, description_en, description_it, description, ""),
  "thumbnail": coalesce(thumbnail.asset->url, thumbnailUrl, ""),
  "stages": coalesce(stages[]{
    "id": coalesce(_key, id),
    title,
    description,
    icon,
    type,
    "images": coalesce(images[].asset->url, imageUrls, [])
  }, [])
}`;
}

function buildCategoriesQuery(locale: Locale): string {
  return `*[_type == "category"] | order(coalesce(sortOrder, name_it, name) asc) {
  "id": coalesce(slug.current, categoryId, _id),
  "name": coalesce(name_${locale}, name_en, name_it, name, ""),
  "description": coalesce(description_${locale}, description_en, description_it, description, ""),
  icon
}`;
}

function normalizeStage(stage: SanityStage, index: number): ProjectStage {
  const icon = stage.icon && stageIcons.includes(stage.icon)
    ? stage.icon
    : stageIcons[index % stageIcons.length];

  return {
    id: stage.id || `stage-${index + 1}`,
    title: stage.title || `Step ${index + 1}`,
    description: stage.description || '',
    icon,
    type: stage.type,
    images: Array.isArray(stage.images) ? stage.images.filter(Boolean) : [],
  };
}

function normalizeProject(project: SanityProject): Project | null {
  if (!project.id || !project.title) return null;

  return {
    id: project.id,
    title: project.title,
    category: typeof project.category === 'string' ? project.category : '',
    year: Number(project.year) || new Date().getFullYear(),
    client: project.client || '',
    description: project.description || '',
    thumbnail: typeof project.thumbnail === 'string' && project.thumbnail
      ? project.thumbnail
      : '/logo.png',
    stages: Array.isArray(project.stages)
      ? project.stages.map(normalizeStage)
      : [],
  };
}

function normalizeCategory(category: SanityCategory): Category | null {
  if (!category.id || !category.name) return null;
  return {
    id: category.id,
    name: category.name,
    description: category.description || '',
    icon: category.icon,
  };
}

const _getCurrentData = unstable_cache(
  async (locale: Locale): Promise<{ projects: Project[]; categories: Category[] }> => {
    if (!isSanityConfigured) {
      return { projects: [], categories: [] };
    }

    try {
      const [projectsRaw, categoriesRaw] = await Promise.all([
        sanityFetch<SanityProject[]>(buildProjectsQuery(locale)),
        sanityFetch<SanityCategory[]>(buildCategoriesQuery(locale)),
      ]);

      const projects = (projectsRaw || [])
        .map(normalizeProject)
        .filter((project): project is Project => Boolean(project));

      const categories = (categoriesRaw || [])
        .map(normalizeCategory)
        .filter((category): category is Category => Boolean(category));

      return { projects, categories };
    } catch (error) {
      console.error('Sanity data fetch failed:', error);
      return { projects: [], categories: [] };
    }
  },
  ['sanity-site-data'],
  { tags: ['site-data'], revalidate: 3600 }
);

export const getCurrentData = cache((locale?: string) =>
  _getCurrentData(normalizeLocale(locale ?? DEFAULT_LOCALE))
);

export const getProjectById = async (id: string, locale?: string): Promise<Project | undefined> => {
  const { projects } = await getCurrentData(locale);
  return projects.find((project) => project.id === id);
};

export const getProjectsByCategory = async (category: string, locale?: string): Promise<Project[]> => {
  const { projects } = await getCurrentData(locale);
  return projects.filter((project) => project.category === category);
};
