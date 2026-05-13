import { NextRequest, NextResponse } from 'next/server';
import { getCurrentData } from '@/lib/data-utils';

// Force dynamic so updates are visible without rebuilds
export const dynamic = 'force-dynamic';

// GET all categories - Public endpoint
export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined;
    const { categories } = await getCurrentData(locale);

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
