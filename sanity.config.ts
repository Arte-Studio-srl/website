'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { itITLocale } from '@sanity/locale-it-it';
import { schemaTypes } from './sanity/schemaTypes';

// Hardcoded so the deployed Studio bundle at artestudio.sanity.studio resolves
// in the browser — the Sanity CLI bundler doesn't inline NEXT_PUBLIC_* vars
// (that prefix is a Next.js convention), so env-based lookups crash on load.
// The projectId is public.
const projectId = 'l9howtog';
const dataset = 'production';

export default defineConfig({
  name: 'default',
  title: 'ArteStudio CMS',
  projectId,
  dataset,
  plugins: [
    itITLocale(),
    structureTool({
      name: 'content',
      title: 'Contenuti',
      structure: (S) =>
        S.list()
          .title('Contenuti')
          .items([
            S.listItem()
              .title('Configurazione del sito')
              .id('siteConfig')
              .child(
                S.document()
                  .schemaType('siteConfig')
                  .documentId('siteConfig')
                  .title('Configurazione del sito')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Progetti'),
            S.documentTypeListItem('category').title('Categorie'),
            S.documentTypeListItem('faq').title('Domande frequenti (FAQ)'),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
