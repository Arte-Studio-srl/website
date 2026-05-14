import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteConfigType = defineType({
  name: 'siteConfig',
  title: 'Site config',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (legacy / fallback)',
      description: 'Used only as fallback if the IT/EN versions below are empty. Prefer the localized fields.',
      type: 'string',
    }),
    defineField({
      name: 'tagline_it',
      title: 'Tagline (IT)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (EN)',
      type: 'string',
    }),
    defineField({
      name: 'faviconUrl',
      title: 'Favicon URL',
      type: 'string',
      initialValue: '/favicon.svg',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address (display)',
      description: 'Multi-line, free-form address shown on the site.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'addressLocality',
      title: 'City',
      description: 'Used in structured data (Organization JSON-LD) for rich results.',
      type: 'string',
    }),
    defineField({
      name: 'addressRegion',
      title: 'Region / province',
      description: 'Two-letter province code (e.g. MI) or region name. Used in structured data.',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
    }),
    defineField({
      name: 'addressCountry',
      title: 'Country code',
      description: 'ISO 3166-1 alpha-2 (e.g. IT). Used in structured data.',
      type: 'string',
      initialValue: 'IT',
    }),
    defineField({
      name: 'geo',
      title: 'Geo coordinates',
      description: 'Used in LocalBusiness JSON-LD — improves map-pack eligibility.',
      type: 'object',
      fields: [
        defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
        defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
      ],
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
    }),
    defineField({
      name: 'legal',
      title: 'Legal',
      type: 'object',
      fields: [
        defineField({ name: 'companyName', title: 'Company name', type: 'string' }),
        defineField({ name: 'piva', title: 'P.IVA', type: 'string' }),
        defineField({ name: 'legalAddress', title: 'Legal address', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'day', title: 'Day', type: 'string' }),
            defineField({ name: 'open', title: 'Open', type: 'string' }),
            defineField({ name: 'close', title: 'Close', type: 'string' }),
            defineField({ name: 'closed', title: 'Closed', type: 'boolean', initialValue: false }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: {
            select: { title: 'day', open: 'open', close: 'close', closed: 'closed' },
            prepare: ({ title, open, close, closed }) => ({
              title,
              subtitle: closed ? 'Closed' : [open, close].filter(Boolean).join(' - '),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'defaultMetaTitle',
          title: 'Default meta title (legacy / fallback)',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaTitle_it',
          title: 'Default meta title (IT)',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaTitle_en',
          title: 'Default meta title (EN)',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaDescription',
          title: 'Default meta description (legacy / fallback)',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'defaultMetaDescription_it',
          title: 'Default meta description (IT)',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'defaultMetaDescription_en',
          title: 'Default meta description (EN)',
          type: 'text',
          rows: 3,
        }),
        defineField({ name: 'siteUrl', title: 'Site URL', type: 'url' }),
        defineField({ name: 'ogImage', title: 'Open Graph image', type: 'image', options: { hotspot: true } }),
        defineField({
          name: 'locale',
          title: 'Primary locale',
          type: 'string',
          options: {
            list: [
              { title: 'Italian', value: 'it' },
              { title: 'English', value: 'en' },
            ],
          },
        }),
        defineField({ name: 'keywords', title: 'Keywords', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroCarousel',
      title: 'Hero carousel',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'project',
              title: 'Project',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt_it', title: 'Alt text (IT)', type: 'string' }),
                defineField({ name: 'alt_en', title: 'Alt text (EN)', type: 'string' }),
              ],
            }),
            defineField({ name: 'title', title: 'Title override', type: 'string' }),
            defineField({ name: 'category', title: 'Category override', type: 'string' }),
          ],
          preview: {
            select: {
              title: 'title',
              projectTitle: 'project.title',
              media: 'image',
            },
            prepare: ({ title, projectTitle, media }) => ({
              title: title || projectTitle || 'Hero slide',
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site config' }),
  },
});
