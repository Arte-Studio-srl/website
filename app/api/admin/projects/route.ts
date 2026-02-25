import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { getCurrentData, createProject, validateProject } from '@/lib/data-utils';

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const newProject = await request.json();
    
    const validation = validateProject(newProject);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }
    
    const { projects } = await getCurrentData();
    
    if (projects.some(p => p.id === newProject.id)) {
      return NextResponse.json(
        { success: false, error: 'Project ID already exists' },
        { status: 400 }
      );
    }
    
    await createProject(newProject);
    revalidateTag('site-data', 'default');
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('POST project error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
