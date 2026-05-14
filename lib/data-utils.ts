import { cache } from 'react';
import { sanityFetch, isSanityConfigured } from './sanity';
import type { Category, Faq, Project, ProjectImage, ProjectStage, StageIcon } from '@/types';
import type { Locale } from '@/i18n/routing';

const stageIcons: StageIcon[] = ['compass', 'blueprint', 'layers', 'camera', 'sparkles', 'flag'];

const DEFAULT_LOCALE: Locale = 'it';

function normalizeLocale(input?: Locale | string | null): Locale {
  return input === 'en' ? 'en' : 'it';
}

type SanityImage = {
  url?: string;
  alt?: string;
};

type SanityStage = {
  id?: string;
  title?: string;
  description?: string;
  icon?: StageIcon;
  type?: string;
  images?: SanityImage[];
};

type SanityProject = {
  id?: string;
  title?: string;
  category?: unknown;
  categoryName?: string;
  year?: number;
  client?: string;
  description?: string;
  thumbnail?: unknown;
  thumbnailAlt?: string;
  stages?: SanityStage[];
  updatedAt?: string;
};

type SanityCategory = {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  updatedAt?: string;
};

type SanityFaq = {
  id?: string;
  question?: string;
  answer?: string;
  featured?: boolean;
  sortOrder?: number;
  updatedAt?: string;
};

function buildProjectsQuery(locale: Locale): string {
  return `*[_type == "project"] | order(year desc, _createdAt desc) {
  "id": coalesce(slug.current, projectId, _id),
  "title": coalesce(title_${locale}, title_en, title_it, title, ""),
  "category": coalesce(category->slug.current, categorySlug, category, ""),
  "categoryName": coalesce(category->name_${locale}, category->name_en, category->name_it, ""),
  year,
  client,
  "description": coalesce(description_${locale}, description_en, description_it, description, ""),
  "thumbnail": coalesce(thumbnail.asset->url, thumbnailUrl, ""),
  "thumbnailAlt": coalesce(thumbnail.alt_${locale}, thumbnail.alt_en, thumbnail.alt_it, ""),
  "updatedAt": _updatedAt,
  "stages": coalesce(stages[]{
    "id": coalesce(_key, id),
    "title": coalesce(title_${locale}, title_en, title_it, title, ""),
    "description": coalesce(description_${locale}, description_en, description_it, description, ""),
    icon,
    type,
    "images": coalesce(
      images[]{
        "url": asset->url,
        "alt": coalesce(alt_${locale}, alt_en, alt_it, "")
      },
      imageUrls[]{ "url": @, "alt": "" },
      []
    )
  }, [])
}`;
}

function buildCategoriesQuery(locale: Locale): string {
  return `*[_type == "category"] | order(coalesce(sortOrder, name_it, name) asc) {
  "id": coalesce(slug.current, categoryId, _id),
  "name": coalesce(name_${locale}, name_en, name_it, name, ""),
  "description": coalesce(description_${locale}, description_en, description_it, description, ""),
  icon,
  "updatedAt": _updatedAt
}`;
}

function buildFaqsQuery(locale: Locale, featuredOnly: boolean): string {
  const filter = featuredOnly ? ' && featured == true' : '';
  return `*[_type == "faq"${filter}] | order(coalesce(sortOrder, 100) asc, _createdAt asc) {
  "id": _id,
  "question": coalesce(question_${locale}, question_en, question_it, ""),
  "answer": coalesce(answer_${locale}, answer_en, answer_it, ""),
  "featured": coalesce(featured, false),
  "sortOrder": coalesce(sortOrder, 100),
  "updatedAt": _updatedAt
}`;
}

function normalizeImage(raw: SanityImage | string | null | undefined): ProjectImage | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { url: raw, alt: '' };
  if (!raw.url) return null;
  return { url: raw.url, alt: raw.alt || '' };
}

function normalizeStage(stage: SanityStage, index: number): ProjectStage | null {
  const icon = stage.icon && stageIcons.includes(stage.icon)
    ? stage.icon
    : stageIcons[index % stageIcons.length];

  const images = Array.isArray(stage.images)
    ? stage.images.map(normalizeImage).filter((img): img is ProjectImage => Boolean(img))
    : [];

  return {
    id: stage.id || `stage-${index + 1}`,
    title: stage.title || `Step ${index + 1}`,
    description: stage.description || '',
    icon,
    type: stage.type,
    images,
  };
}

function normalizeProject(project: SanityProject): Project | null {
  if (!project.id || !project.title) return null;

  const categorySlug = typeof project.category === 'string' ? project.category : '';

  return {
    id: project.id,
    title: project.title,
    category: categorySlug,
    categoryName: project.categoryName || categorySlug.replace(/-/g, ' '),
    year: Number(project.year) || new Date().getFullYear(),
    client: project.client || '',
    description: project.description || '',
    thumbnail: typeof project.thumbnail === 'string' && project.thumbnail
      ? project.thumbnail
      : '/logo.png',
    thumbnailAlt: project.thumbnailAlt || '',
    stages: Array.isArray(project.stages)
      ? project.stages
          .map(normalizeStage)
          .filter((stage): stage is ProjectStage => Boolean(stage))
      : [],
    updatedAt: project.updatedAt,
  };
}

function normalizeCategory(category: SanityCategory): Category | null {
  if (!category.id || !category.name) return null;
  return {
    id: category.id,
    name: category.name,
    description: category.description || '',
    icon: category.icon,
    updatedAt: category.updatedAt,
  };
}

function normalizeFaq(faq: SanityFaq): Faq | null {
  if (!faq.id || !faq.question || !faq.answer) return null;
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    featured: Boolean(faq.featured),
    sortOrder: typeof faq.sortOrder === 'number' ? faq.sortOrder : 100,
    updatedAt: faq.updatedAt,
  };
}

async function _getCurrentData(locale: Locale): Promise<{ projects: Project[]; categories: Category[] }> {
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
}

export const getCurrentData = cache((locale?: Locale | string) =>
  _getCurrentData(normalizeLocale(locale ?? DEFAULT_LOCALE))
);

export const getProjectById = async (id: string, locale?: Locale | string): Promise<Project | undefined> => {
  const { projects } = await getCurrentData(locale);
  return projects.find((project) => project.id === id);
};

export const getProjectsByCategory = async (category: string, locale?: Locale | string): Promise<Project[]> => {
  const { projects } = await getCurrentData(locale);
  return projects.filter((project) => project.category === category);
};

async function _getFaqs(locale: Locale, featuredOnly: boolean): Promise<Faq[]> {
  if (!isSanityConfigured) return [];

  try {
    const raw = await sanityFetch<SanityFaq[]>(buildFaqsQuery(locale, featuredOnly));
    return (raw || [])
      .map(normalizeFaq)
      .filter((faq): faq is Faq => Boolean(faq));
  } catch (error) {
    console.error('Sanity FAQ fetch failed:', error);
    return [];
  }
}

export const getFaqs = cache((locale?: Locale | string, options?: { featuredOnly?: boolean }) =>
  _getFaqs(normalizeLocale(locale ?? DEFAULT_LOCALE), Boolean(options?.featuredOnly)),
);
