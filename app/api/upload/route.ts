import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';

// Mark as dynamic for Next.js
export const dynamic = 'force-dynamic';

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

    // Create directory if it doesn't exist
    const projectDir = path.join(process.cwd(), 'public', 'images', 'projects', sanitizedProjectId);
    await fs.mkdir(projectDir, { recursive: true });

    // Generate safe filename
    let filename: string;
    if (sanitizedType === 'thumbnail') {
      filename = `thumb.${extension}`;
    } else {
      try {
        const files = await fs.readdir(projectDir);
        const typeFiles = files.filter(f => f.startsWith(sanitizedType));
        const nextNumber = typeFiles.length + 1;
        filename = `${sanitizedType}-${nextNumber}.${extension}`;
      } catch {
        filename = `${sanitizedType}-1.${extension}`;
      }
    }

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filepath = path.join(projectDir, filename);
    await fs.writeFile(filepath, buffer);

    const stats = await fs.stat(filepath);
    const publicUrl = `/images/projects/${sanitizedProjectId}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: stats.size
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

    await fs.unlink(fullPath);

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

