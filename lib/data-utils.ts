import { unstable_cache } from 'next/cache';
import { query } from './db';
import { Project, Category } from '@/types';

// ─── Private helpers ─────────────────────────────────────────────────────────

function mapRowToProject(row: Record<string, any>): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    year: row.year,
    client: row.client,
    description: row.description,
    thumbnail: row.thumbnail,
    stages: typeof row.stages === 'string' ? JSON.parse(row.stages) : row.stages,
  };
}

// ─── Cached queries (tagged 'site-data') ─────────────────────────────────────

export const getCurrentData = unstable_cache(
  async (): Promise<{ projects: Project[]; categories: Category[] }> => {
    try {
      const [projectsResult, categoriesResult] = await Promise.all([
        query('SELECT * FROM projects ORDER BY year DESC, created_at DESC'),
        query('SELECT * FROM categories ORDER BY name ASC'),
      ]);

      const projects = projectsResult.rows.map(mapRowToProject);
      const categories = categoriesResult.rows.map((row): Category => ({
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
      }));

      return { projects, categories };
    } catch (error) {
      console.error('Database connection failed in getCurrentData:', error);
      return { projects: [], categories: [] };
    }
  },
  ['site-data'],
  { tags: ['site-data'], revalidate: 3600 } // 1-hour fallback; tag busts on admin writes
);

export const getProjectById = unstable_cache(
  async (id: string): Promise<Project | undefined> => {
    try {
      const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
      if (result.rows.length === 0) return undefined;
      return mapRowToProject(result.rows[0]);
    } catch (error) {
      console.error('Database connection failed in getProjectById:', error);
      return undefined;
    }
  },
  ['project-by-id'],
  { tags: ['site-data'], revalidate: 3600 }
);

export const getProjectsByCategory = unstable_cache(
  async (category: string): Promise<Project[]> => {
    try {
      const result = await query(
        'SELECT * FROM projects WHERE category = $1 ORDER BY year DESC, created_at DESC',
        [category]
      );
      return result.rows.map(mapRowToProject);
    } catch (error) {
      console.error('Database connection failed in getProjectsByCategory:', error);
      return [];
    }
  },
  ['projects-by-category'],
  { tags: ['site-data'], revalidate: 3600 }
);

// ─── Mutations (always bypass cache — call revalidateTag after) ───────────────

export async function createProject(project: Project): Promise<void> {
  await query(
    `INSERT INTO projects (id, title, category, year, client, description, thumbnail, stages)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      project.id, project.title, project.category, project.year,
      project.client, project.description, project.thumbnail, JSON.stringify(project.stages),
    ]
  );
}

export async function updateProject(project: Project): Promise<void> {
  await query(
    `UPDATE projects SET
      title = $1, category = $2, year = $3, client = $4,
      description = $5, thumbnail = $6, stages = $7, updated_at = CURRENT_TIMESTAMP
     WHERE id = $8`,
    [
      project.title, project.category, project.year, project.client,
      project.description, project.thumbnail, JSON.stringify(project.stages), project.id,
    ]
  );
}

export async function deleteProject(id: string): Promise<void> {
  await query('DELETE FROM projects WHERE id = $1', [id]);
}

export async function updateCategories(categories: Category[]): Promise<void> {
  const ids = categories.map((c) => c.id);

  if (ids.length > 0) {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    await query(`DELETE FROM categories WHERE id NOT IN (${placeholders})`, ids);
  } else {
    await query('DELETE FROM categories');
  }

  for (const cat of categories) {
    await query(
      `INSERT INTO categories (id, name, description, icon) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon`,
      [cat.id, cat.name, cat.description, cat.icon]
    );
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateProject(project: Partial<Project>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!project.id?.trim()) errors.push('Project ID is required');
  if (!project.title?.trim()) errors.push('Project title is required');
  if (!project.category?.trim()) errors.push('Project category is required');
  if (!project.year || project.year < 2000 || project.year > 2100) {
    errors.push('Project year must be between 2000 and 2100');
  }
  if (!project.description?.trim()) errors.push('Project description is required');
  if (!project.thumbnail?.trim()) errors.push('Project thumbnail is required');
  if (!project.stages || project.stages.length === 0) {
    errors.push('Project must have at least one stage');
  } else {
    project.stages.forEach((stage, index) => {
      if (!stage.title?.trim()) errors.push(`Stage ${index + 1} title is required`);
      if (!stage.images || stage.images.length === 0) {
        errors.push(`Stage ${index + 1} must have at least one image`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

export function validateCategory(category: Partial<Category>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!category.id?.trim()) errors.push('Category ID is required');
  if (!category.name?.trim()) errors.push('Category name is required');
  if (!category.description?.trim()) errors.push('Category description is required');

  return { valid: errors.length === 0, errors };
}
