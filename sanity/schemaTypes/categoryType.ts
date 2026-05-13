import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name_it',
      title: 'Name (IT)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Name (EN)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name_it', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description_it',
      title: 'Description (IT)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description_en',
      title: 'Description (EN)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Optional Iconify icon id or short internal label.',
      type: 'string',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: 'name_it',
      subtitle: 'slug.current',
    },
  },
});
