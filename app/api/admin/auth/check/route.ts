import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    const user = authenticated ? await getCurrentUser() : null;

    return NextResponse.json({
      authenticated,
      user,
    });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}



