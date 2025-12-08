import { promises as fs } from 'fs';
import path from 'path';
import { Project, Category } from '@/types';
import { canUseGithubContent, fetchGithubFile, getGithubRawUrl, writeGithubFile } from '@/lib/github-content';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'projects.ts');
const PROJECTS_FILE_PATH = 'data/projects.ts';

// Cache for data with timestamp
let dataCache: {
  projects: Project[];
  categories: Category[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 1000; // 1 second cache to prevent excessive file reads

/**
 * Read the projects.ts file from GitHub or local filesystem with resiliency:
 * - Retry GitHub API reads
 * - Fallback to GitHub raw URL
 * - Fallback to local bundled file
 */
export async function readDataFile(): Promise<string> {
  const pathToRead = PROJECTS_FILE_PATH;

  if (canUseGithubContent()) {
    // GitHub mode: primary read from API with retries
    try {
      const content = await readFromGithubWithRetry(pathToRead);
      return content;
    } catch (error) {
      console.error('[Data] GitHub API read failed, attempting fallbacks', error);

      // Fallback 1: raw GitHub URL (unauthenticated)
      const rawUrl = getGithubRawUrl(pathToRead);
      if (rawUrl) {
        try {
          const res = await fetch(rawUrl, { cache: 'no-store' });
          if (res.ok) {
            const text = await res.text();
            console.warn('[Data] Served data from raw GitHub URL fallback');
            return text;
          }
          console.error('[Data] Raw GitHub URL fallback failed', { status: res.status, statusText: res.statusText });
        } catch (rawErr) {
          console.error('[Data] Raw GitHub URL fetch threw', rawErr);
        }
      }

      // Fallback 2: local file (bundled) if available
      try {
        const localContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        console.warn('[Data] Served data from local fallback file');
        return localContent;
      } catch (localErr) {
        console.error('[Data] Local fallback read failed', localErr);
      }

      // If all attempts fail, propagate the original error
      throw new Error('Failed to read projects data from all sources');
    }
  }

  // Local mode: read from local file
  try {
    return await fs.readFile(DATA_FILE_PATH, 'utf-8');
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Failed to read projects data');
  }
}

async function readFromGithubWithRetry(pathToRead: string): Promise<string> {
  const attempts = 3;
  let lastError: unknown = null;

  for (let i = 0; i < attempts; i++) {
    try {
      const { content } = await fetchGithubFile(pathToRead);
      return content;
    } catch (error) {
      lastError = error;
      const delay = 200 * (i + 1);
      console.error(`[Data] GitHub read attempt ${i + 1} failed, retrying in ${delay}ms`, error);
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
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
 * Parse the projects.ts file content to extract projects and categories
 * Uses a bracket-counting approach to handle nested arrays correctly
 */
function parseDataFile(content: string): { projects: Project[]; categories: Category[] } {
  try {
    // Helper function to extract array by counting brackets
    const extractArray = (content: string, varName: string): unknown[] => {
      const regex = new RegExp(`export const ${varName}: \\w+\\[\\] = `);
      const match = content.match(regex);
      
      if (!match) return [];
      
      const startIndex = match.index! + match[0].length;
      let bracketCount = 0;
      let inString = false;
      let escapeNext = false;
      let endIndex = startIndex;
      
      // Count brackets to find the matching closing bracket
      for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        
        // Handle escape sequences
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        // Handle strings (don't count brackets inside strings)
        if (char === '"' && !inString) {
          inString = true;
          continue;
        }
        if (char === '"' && inString) {
          inString = false;
          continue;
        }
        
        // Count brackets only outside of strings
        if (!inString) {
          if (char === '[') bracketCount++;
          if (char === ']') bracketCount--;
          
          // Found the matching closing bracket
          if (bracketCount === 0 && char === ']') {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      const arrayStr = content.substring(startIndex, endIndex);
      return JSON.parse(arrayStr) as unknown[];
    };
    
    const projects = extractArray(content, 'projects') as Project[];
    const categories = extractArray(content, 'categories') as Category[];

    return { projects, categories };
  } catch (error) {
    console.error('[Data] Failed to parse data file:', error);
    throw new Error('Failed to parse projects data');
  }
}

/**
 * Get current projects and categories (with caching)
 */
export async function getCurrentData(): Promise<{ projects: Project[]; categories: Category[] }> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (dataCache && (now - dataCache.timestamp) < CACHE_TTL) {
    return { projects: dataCache.projects, categories: dataCache.categories };
  }

  // Read and parse fresh data
  const content = await readDataFile();
  const data = parseDataFile(content);

  // Update cache
  dataCache = {
    projects: data.projects,
    categories: data.categories,
    timestamp: now,
  };

  return data;
}

/**
 * Invalidate the data cache (call after updates)
 */
export function invalidateDataCache(): void {
  dataCache = null;
  console.info('[Data] Cache invalidated');
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
    // GitHub mode: write to GitHub only (prod filesystem is readonly anyway)
    const { content, sha } = await fetchGithubFile(PROJECTS_FILE_PATH);
    const newContent = replaceProjects(content);
    await writeGithubFile({
      path: PROJECTS_FILE_PATH,
      content: newContent,
      sha,
      message: 'chore: update projects via admin dashboard',
    });
    
    // Invalidate cache after successful update
    invalidateDataCache();
    return;
  }

  // Local mode: write to local file only
  const content = await readDataFile();
  const newContent = replaceProjects(content);
  await writeDataFile(newContent);
  
  // Invalidate cache after local update
  invalidateDataCache();
}

/**
 * Update categories array in the data file
 */
export async function updateCategories(categories: Category[]): Promise<void> {
  const newCategoriesArray = JSON.stringify(categories, null, 2);

  const replaceCategories = (content: string) =>
    content.replace(
      /export const categories: Category\[\] = \[[\s\S]*?\n\];/,
      `export const categories: Category[] = ${newCategoriesArray};`
    );

  if (canUseGithubContent()) {
    // GitHub mode: write to GitHub only (prod filesystem is readonly anyway)
    const { content, sha } = await fetchGithubFile(PROJECTS_FILE_PATH);
    const newContent = replaceCategories(content);
    await writeGithubFile({
      path: PROJECTS_FILE_PATH,
      content: newContent,
      sha,
      message: 'chore: update categories via admin dashboard',
    });
    
    // Invalidate cache after successful update
    invalidateDataCache();
    return;
  }

  // Local mode: write to local file only
  const content = await readDataFile();
  const newContent = replaceCategories(content);
  await writeDataFile(newContent);
  
  // Invalidate cache after local update
  invalidateDataCache();
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

