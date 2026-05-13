import { defineArrayMember, defineField, defineType } from 'sanity';

const stageIconOptions = [
  { title: 'Concept', value: 'compass' },
  { title: 'Blueprint', value: 'blueprint' },
  { title: 'Build', value: 'layers' },
  { title: 'Capture', value: 'camera' },
  { title: 'Experience', value: 'sparkles' },
  { title: 'Milestone', value: 'flag' },
];

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title_it',
      title: 'Title (IT)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (EN)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title_it', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.min(2000).max(2100),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'description_it',
      title: 'Description (IT)',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description_en',
      title: 'Description (EN)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stages',
      title: 'Project stages',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'projectStage',
          title: 'Stage',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: stageIconOptions,
                layout: 'radio',
              },
              initialValue: 'blueprint',
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'images.0',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title_it',
      subtitle: 'category.name_it',
      media: 'thumbnail',
    },
  },
});
