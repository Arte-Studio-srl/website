import { defineField, defineType } from 'sanity';

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question_it',
      title: 'Question (IT)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'question_en',
      title: 'Question (EN)',
      type: 'string',
    }),
    defineField({
      name: 'answer_it',
      title: 'Answer (IT)',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer_en',
      title: 'Answer (EN)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home',
      description: 'When enabled, this FAQ appears in the compact home section. Otherwise it lives only on the /faq page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      description: 'Lower numbers appear first.',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: 'question_it',
      featured: 'featured',
      order: 'sortOrder',
    },
    prepare: ({ title, featured, order }) => ({
      title: title || 'FAQ',
      subtitle: [featured ? '★ home' : null, typeof order === 'number' ? `#${order}` : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
