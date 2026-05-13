import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/lib/data-utils';

// GET single project - Public endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined;
    const project = await getProjectById(id, locale);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('GET project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
