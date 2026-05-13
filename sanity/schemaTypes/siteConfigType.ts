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
      title: 'Tagline',
      type: 'string',
      validation: (rule) => rule.required(),
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
      title: 'Address',
      type: 'text',
      rows: 3,
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
        defineField({ name: 'defaultMetaTitle', title: 'Default meta title', type: 'string' }),
        defineField({ name: 'defaultMetaDescription', title: 'Default meta description', type: 'text', rows: 3 }),
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
