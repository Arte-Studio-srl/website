import { NextRequest, NextResponse } from 'next/server';
import { readSiteConfig, writeSiteConfig } from '@/lib/site-config-storage';

function validateConfig(config: any): { valid: boolean; error?: string } {
  const requiredStrings = [
    'siteName',
    'tagline',
    'faviconUrl',
    'contactEmail',
    'phone',
    'address',
    'googleMapsUrl',
    'legal.companyName',
    'legal.piva',
    'seo.defaultMetaTitle',
    'seo.defaultMetaDescription',
  ];

  for (const path of requiredStrings) {
    const value = path.split('.').reduce((acc: any, key) => acc?.[key], config);
    if (typeof value !== 'string' || !value.trim()) {
      return { valid: false, error: `Missing or invalid field: ${path}` };
    }
  }

  if (!Array.isArray(config.openingHours)) {
    return { valid: false, error: 'openingHours must be an array' };
  }
  if (!Array.isArray(config.heroCarousel)) {
    return { valid: false, error: 'heroCarousel must be an array' };
  }

  return { valid: true };
}

export async function GET() {
  try {
    const config = await readSiteConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error reading site config', error);
    return NextResponse.json({ success: false, error: 'Failed to read config' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateConfig(body);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    await writeSiteConfig(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site config', error);
    return NextResponse.json({ success: false, error: 'Failed to update config' }, { status: 500 });
  }
}

