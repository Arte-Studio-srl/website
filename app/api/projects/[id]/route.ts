import { NextRequest, NextResponse } from 'next/server';
import { getCurrentData } from '@/lib/data-utils';

// Static export compatibility
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const { projects } = await getCurrentData();
  return projects.map((project) => ({ id: project.id }));
}

// GET single project - Public endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { projects } = await getCurrentData();
    const project = projects.find((p) => p.id === id);
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('GET project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

