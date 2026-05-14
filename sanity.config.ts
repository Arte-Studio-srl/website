'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  'production';

if (!projectId) {
  throw new Error(
    'Sanity Studio: NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) is required'
  );
}

export default defineConfig({
  name: 'default',
  title: 'ArteStudio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site config')
              .id('siteConfig')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
                  .title('Site config')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'siteConfig'
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
