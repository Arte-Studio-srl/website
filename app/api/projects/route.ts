import { NextResponse } from 'next/server';
import { getCurrentData } from '@/lib/data-utils';

// Mark as dynamic for Next.js
export const dynamic = 'force-dynamic';

// GET all projects - Public endpoint
export async function GET() {
  try {
    const { projects, categories } = await getCurrentData();
    
    return NextResponse.json({
      success: true,
      projects,
      categories
    });
  } catch (error) {
    console.error('GET projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

