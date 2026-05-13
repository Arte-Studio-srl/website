'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

const projectId = 'l9howtog';
const dataset = 'production';

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
