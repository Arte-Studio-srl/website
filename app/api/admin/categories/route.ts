import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updateCategories, validateCategory } from '@/lib/data-utils';

// Mark as dynamic for Next.js
export const dynamic = 'force-dynamic';

// PUT - Update categories - Requires authentication
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { categories: newCategories } = await request.json();
    
    // Validate categories array
    if (!Array.isArray(newCategories)) {
      return NextResponse.json(
        { success: false, error: 'Categories must be an array' },
        { status: 400 }
      );
    }

    // Validate each category
    const validationErrors: string[] = [];
    newCategories.forEach((cat, index) => {
      const validation = validateCategory(cat);
      if (!validation.valid) {
        validationErrors.push(`Category ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    await updateCategories(newCategories);
    
    return NextResponse.json({
      success: true,
      message: 'Categories updated successfully',
      categories: newCategories
    });
  } catch (error) {
    console.error('PUT categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update categories' },
      { status: 500 }
    );
  }
}

