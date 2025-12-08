import { NextResponse } from 'next/server';
import { getCurrentData } from '@/lib/data-utils';

// Mark as dynamic for Next.js
export const dynamic = 'force-dynamic';

// GET all categories - Public endpoint
export async function GET() {
  try {
    const { categories } = await getCurrentData();
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

