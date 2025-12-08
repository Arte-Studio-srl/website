import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getCurrentData, updateProjects, validateProject } from '@/lib/data-utils';

// POST - Create new project - Requires authentication
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newProject = await request.json();
    
    // Validate project data
    const validation = validateProject(newProject);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Get current projects
    const { projects } = await getCurrentData();
    
    // Check if project ID already exists
    if (projects.some(p => p.id === newProject.id)) {
      return NextResponse.json(
        { success: false, error: 'Project ID already exists' },
        { status: 400 }
      );
    }
    
    const currentProjects = [...projects, newProject];
    await updateProjects(currentProjects);
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('POST project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

