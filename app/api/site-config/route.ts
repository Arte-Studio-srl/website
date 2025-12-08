import { NextResponse } from 'next/server';
import { readSiteConfig } from '@/lib/site-config-storage';

export async function GET() {
  try {
    const config = await readSiteConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error reading site config', error);
    return NextResponse.json({ success: false, error: 'Failed to read config' }, { status: 500 });
  }
}

