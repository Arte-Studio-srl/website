import { promises as fs } from 'fs';
import path from 'path';
import { Project, Category } from '@/types';
import { canUseGithubContent, fetchGithubFile, writeGithubFile } from '@/lib/github-content';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'projects.ts');
const PROJECTS_FILE_PATH = 'data/projects.ts';

/**
 * Read the projects.ts file
 */
export async function readDataFile(): Promise<string> {
  try {
    return await fs.readFile(DATA_FILE_PATH, 'utf-8');
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Failed to read projects data');
  }
}

/**
 * Write to the projects.ts file
 */
export async function writeDataFile(content: string): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, content, 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Failed to write projects data');
  }
}

/**
 * Update projects array in the data file
 */
export async function updateProjects(projects: Project[]): Promise<void> {
  const newProjectsArray = JSON.stringify(projects, null, 2);

  const replaceProjects = (content: string) =>
    content.replace(
      /export const projects: Project\[\] = \[[\s\S]*?\n\];/,
      `export const projects: Project[] = ${newProjectsArray};`
    );

  if (canUseGithubContent()) {
    try {
      const { content, sha } = await fetchGithubFile(PROJECTS_FILE_PATH);
      const newContent = replaceProjects(content);
      await writeGithubFile({
        path: PROJECTS_FILE_PATH,
        content: newContent,
        sha,
        message: 'chore: update projects via admin dashboard',
      });
      return;
    } catch (error) {
      console.error('GitHub content update failed, falling back to local file.', error);
    }
  }

  const content = await readDataFile();
  const newContent = replaceProjects(content);
  await writeDataFile(newContent);
}

/**
 * Update categories array in the data file
 */
export async function updateCategories(categories: Category[]): Promise<void> {
  const content = await readDataFile();
  const newCategoriesArray = JSON.stringify(categories, null, 2);
  const newContent = content.replace(
    /export const categories: Category\[\] = \[[\s\S]*?\n\];/,
    `export const categories: Category[] = ${newCategoriesArray};`
  );
  await writeDataFile(newContent);
}

/**
 * Format category name for display
 */
export function formatCategoryName(categoryId: string): string {
  return categoryId.replace(/-/g, ' ');
}

/**
 * Validate project data
 */
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
      if (!stage.title?.trim()) {
        errors.push(`Stage ${index + 1} title is required`);
      }
      if (!stage.images || stage.images.length === 0) {
        errors.push(`Stage ${index + 1} must have at least one image`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate category data
 */
export function validateCategory(category: Partial<Category>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!category.id?.trim()) errors.push('Category ID is required');
  if (!category.name?.trim()) errors.push('Category name is required');
  if (!category.description?.trim()) errors.push('Category description is required');

  return {
    valid: errors.length === 0,
    errors
  };
}

