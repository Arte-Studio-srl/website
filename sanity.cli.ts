import { defineCliConfig } from 'sanity/cli';

// Kept in sync with sanity.config.ts — same browser-bundle constraint applies.
export default defineCliConfig({
  api: {
    projectId: 'l9howtog',
    dataset: 'production',
  },
  deployment: {
    appId: 'ugw1fkmq0dp9yjl355amg4c8',
  },
});
