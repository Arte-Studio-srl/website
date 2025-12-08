import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { canUseGithubContent, uploadGithubBinaryFile, deleteGithubFile } from '@/lib/github-content';
import { getCurrentData, updateProjects } from '@/lib/data-utils';
import { Project, ProjectStage } from '@/types';

// Security constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Validate and sanitize projectId to prevent path traversal
function sanitizeProjectId(projectId: string): string | null {
  // Only allow alphanumeric characters and hyphens
  if (!/^[a-z0-9-]+$/i.test(projectId)) {
    return null;
  }
  // Prevent path traversal attempts
  if (projectId.includes('..') || projectId.includes('/') || projectId.includes('\\')) {
    return null;
  }
  return projectId;
}

// Sanitize upload type (stage identifiers, etc.)
function sanitizeUploadType(value: string): string | null {
  if (!value) return null;
  if (value === 'thumbnail') return 'thumbnail';
  if (!/^[a-z0-9-]+$/i.test(value)) {
    return null;
  }
  if (value.includes('..') || value.includes('/') || value.includes('\\')) {
    return null;
  }
  return value.toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const type = formData.get('type') as string;
    
    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'No project ID provided' },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { success: false, error: 'No upload type provided' },
        { status: 400 }
      );
    }

    // Sanitize projectId
    const sanitizedProjectId = sanitizeProjectId(projectId);
    if (!sanitizedProjectId) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const sanitizedType = sanitizeUploadType(type);
    if (!sanitizedType) {
      return NextResponse.json(
        { success: false, error: 'Invalid upload type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WEBP allowed' },
        { status: 400 }
      );
    }

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file extension' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    let filename: string;
    if (sanitizedType === 'thumbnail') {
      filename = `thumb.${extension}`;
    } else {
      // For non-thumbnails, generate unique filename with timestamp
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 6);
      filename = `${sanitizedType}-${timestamp}-${random}.${extension}`;
    }

    const relativePath = `public/images/projects/${sanitizedProjectId}/${filename}`;
    const publicUrl = `/images/projects/${sanitizedProjectId}/${filename}`;

    if (canUseGithubContent()) {
      // GitHub mode: upload to GitHub only
      console.info('[Upload] Uploading to GitHub', { path: relativePath });
      const result = await uploadGithubBinaryFile({
        path: relativePath,
        content: buffer,
        message: `feat: upload image ${filename} for project ${sanitizedProjectId}`,
      });
      
      console.info('[Upload] Uploaded to GitHub', { url: result.url });
      
      return NextResponse.json({
        success: true,
        url: result.url,
        filename,
        size: buffer.length,
        uploadedToGithub: true,
        message: 'Image uploaded to GitHub'
      });
    }

    // Local mode: save to local file only
    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', sanitizedProjectId);
    await fs.mkdir(projectDir, { recursive: true });
    const filepath = path.join(projectDir, filename);
    await fs.writeFile(filepath, buffer);
    console.info('[Upload] Saved locally', { path: filepath });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
      uploadedToGithub: false,
      message: 'Image saved locally'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// GET - List images for a project
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'No project ID provided' },
        { status: 400 }
      );
    }

    const sanitizedProjectId = sanitizeProjectId(projectId);
    if (!sanitizedProjectId) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', sanitizedProjectId);
    
    try {
      const files = await fs.readdir(projectDir);
      const images = files
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/images/projects/${sanitizedProjectId}/${f}`);

      return NextResponse.json({
        success: true,
        images
      });
    } catch {
      return NextResponse.json({
        success: true,
        images: []
      });
    }
  } catch (error) {
    console.error('GET images error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve images' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an image
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: 'No image path provided' },
        { status: 400 }
      );
    }

    // Validate path format
    if (!imagePath.startsWith('/images/projects/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image path' },
        { status: 400 }
      );
    }

    // Extract and validate projectId from path
    const pathParts = imagePath.split('/');
    const projectId = pathParts[3];
    if (!sanitizeProjectId(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID in path' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Ensure we're only deleting from the projects directory
    const projectsDir = path.join(process.cwd(), 'public', 'images', 'projects');
    if (!fullPath.startsWith(projectsDir)) {
      return NextResponse.json(
        { success: false, error: 'Invalid path' },
        { status: 400 }
      );
    }

    if (canUseGithubContent()) {
      // GitHub mode: delete from GitHub only
      const relativePath = `public${imagePath}`;
      console.info('[Upload] Deleting from GitHub', { path: relativePath });
      await deleteGithubFile({
        path: relativePath,
        message: `chore: delete image ${imagePath}`,
      });
      console.info('[Upload] Deleted from GitHub');
    } else {
      // Local mode: delete from local file only
      await fs.unlink(fullPath);
      console.info('[Upload] Deleted locally', { path: fullPath });
    }

    // CRITICAL: Remove image reference from all projects
    try {
      console.info('[Upload] Removing image references from project data');
      const { projects } = await getCurrentData();
      let referencesRemoved = 0;
      let projectsUpdated = 0;

      // Update each project to remove this image path
      const updatedProjects: Project[] = projects.map((project) => {
        let projectModified = false;
        
        // Check thumbnail
        if (project.thumbnail === imagePath) {
          console.warn('[Upload] Project uses deleted image as thumbnail', { projectId: project.id });
          // Don't auto-remove thumbnail, just warn
        }
        
        // Check all stage images
        const updatedStages: ProjectStage[] = project.stages?.map((stage) => {
          const originalLength = stage.images.length;
          const filteredImages = stage.images.filter((img) => img !== imagePath);

          if (filteredImages.length < originalLength) {
            referencesRemoved += (originalLength - filteredImages.length);
            projectModified = true;
            console.info('[Upload] Removed stage image reference', { projectId: project.id, stageTitle: stage.title });
          }

          return {
            ...stage,
            images: filteredImages,
          };
        }) || project.stages;
        
        if (projectModified) {
          projectsUpdated++;
        }
        
        return {
          ...project,
          stages: updatedStages,
        };
      });

      // Save updated projects if any changes were made
      if (projectsUpdated > 0) {
        await updateProjects(updatedProjects);
        console.info('[Upload] Updated projects after delete', { projectsUpdated, referencesRemoved });
      } else {
        console.info('[Upload] No project references found for deleted image');
      }
    } catch (updateError) {
      console.error('[Delete] Failed to update project references:', updateError);
      // Don't fail the entire deletion if project update fails
      // The file is already deleted, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('DELETE image error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

