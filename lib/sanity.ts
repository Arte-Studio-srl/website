import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || '2025-02-25';

export const isSanityConfigured = Boolean(projectId && dataset);

if (typeof window === 'undefined') {
  console.log(`[sanity] configured=${isSanityConfigured} projectId=${projectId ? 'set' : 'MISSING'} dataset=${dataset ? 'set' : 'MISSING'}`);
}

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
    })
  : null;

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<T>(query, params);
}
