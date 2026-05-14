import { defineCliConfig } from 'sanity/cli';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  'production';

if (!projectId) {
  throw new Error(
    'Sanity CLI: NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) is required'
  );
}

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: 'ugw1fkmq0dp9yjl355amg4c8',
  },
});
