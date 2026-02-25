import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { updateProject, deleteProject, validateProject, getProjectById } from '@/lib/data-utils';
import { deleteS3Object } from '@/lib/s3';

// Helper to extract S3 keys from a project's images
function extractImageKeys(project: any): string[] {
  const keys: string[] = [];
  
  // Helper to extract key from a URL or raw path
  const addKey = (path: string) => {
    if (!path) return;
    let key = path;
    if (path.startsWith('http')) {
      try {
        const url = new URL(path);
        key = url.pathname.substring(1); // Remove leading slash
      } catch (e) {
        return;
      }
    }
    // Only track valid S3 project keys to avoid deleting random things
    if (key && key.startsWith('projects/') && !key.includes('..')) {
      keys.push(key);
    }
  };

  if (project.thumbnail) addKey(project.thumbnail);
  if (project.stages && Array.isArray(project.stages)) {
    project.stages.forEach((stage: any) => {
      if (stage.images && Array.isArray(stage.images)) {
        stage.images.forEach(addKey);
      }
    });
  }
  
  return keys;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updatedProject = await request.json();
    
    const validation = validateProject(updatedProject);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    // 1. Identify orphaned images
    const oldKeys = extractImageKeys(existingProject);
    const newKeys = extractImageKeys(updatedProject);
    
    // Find keys in oldKeys that are NOT in newKeys
    const orphanedKeys = oldKeys.filter(key => !newKeys.includes(key));
    
    // 2. Delete orphaned images from S3 (run in background to not block response)
    if (orphanedKeys.length > 0) {
      Promise.allSettled(
        orphanedKeys.map(key => deleteS3Object(key))
      ).then(results => {
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orphaned images`, failed);
        } else {
          console.log(`Successfully cleaned up ${orphanedKeys.length} orphaned images.`);
        }
      });
    }

    // 3. Update database
    await updateProject(updatedProject);
    revalidateTag('site-data', 'default');
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('PUT project error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    await deleteProject(id);
    revalidateTag('site-data', 'default');
    
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE project error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
