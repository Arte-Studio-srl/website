import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getPresignedUploadUrl, deleteS3Object } from '@/lib/s3';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function sanitizeProjectId(projectId: string): string | null {
  if (!/^[a-z0-9-]+$/i.test(projectId)) return null;
  if (projectId.includes('..') || projectId.includes('/') || projectId.includes('\\')) return null;
  return projectId;
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, type, filename, contentType } = await request.json();

    if (!projectId || !type || !filename || !contentType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const sanitizedProjectId = sanitizeProjectId(projectId);
    if (!sanitizedProjectId) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json({ success: false, error: 'Invalid content type' }, { status: 400 });
    }

    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ success: false, error: 'Invalid extension' }, { status: 400 });
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    const safeFilename = type === 'thumbnail' ? `thumb.${extension}` : `${type}-${timestamp}-${random}.${extension}`;
    const key = `projects/${sanitizedProjectId}/${safeFilename}`;

    const { url, publicUrl } = await getPresignedUploadUrl(key, contentType);

    return NextResponse.json({
      success: true,
      presignedUrl: url,
      publicUrl,
      filename: safeFilename
    });
  } catch (error) {
    console.error('Upload presign error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json({ success: false, error: 'No image path provided' }, { status: 400 });
    }

    // Extract key from URL
    let key = imagePath;
    if (imagePath.startsWith('http')) {
      const url = new URL(imagePath);
      key = url.pathname.substring(1);
    } else if (imagePath.startsWith('/images/projects/')) {
      return NextResponse.json({ success: false, error: 'Local deletions no longer supported' }, { status: 400 });
    }

    // Validate that the key is scoped to the projects/ prefix only
    if (!key.startsWith('projects/') || key.includes('..')) {
      return NextResponse.json({ success: false, error: 'Invalid image path' }, { status: 400 });
    }

    await deleteS3Object(key);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('DELETE image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
