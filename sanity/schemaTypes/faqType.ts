import { defineField, defineType } from 'sanity';

export const faqType = defineType({
  name: 'faq',
  title: 'Domanda frequente',
  type: 'document',
  groups: [
    { name: 'it', title: 'Italiano', default: true },
    { name: 'en', title: 'English' },
    { name: 'settings', title: 'Impostazioni' },
  ],
  fields: [
    defineField({
      name: 'question_it',
      title: 'Domanda (italiano)',
      description: 'La domanda così come la pone un cliente. Esempio: "Realizzate progetti anche fuori Italia?".',
      group: 'it',
      type: 'string',
      validation: (rule) => rule.required().error('La domanda in italiano è obbligatoria.'),
    }),
    defineField({
      name: 'answer_it',
      title: 'Risposta (italiano)',
      description: 'Risposta chiara e diretta. 1-3 frasi. Evita gergo tecnico.',
      group: 'it',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().error('La risposta in italiano è obbligatoria.'),
    }),
    defineField({
      name: 'question_en',
      title: 'Question (English)',
      description: 'Domanda in inglese. Se vuota, viene usata quella italiana.',
      group: 'en',
      type: 'string',
    }),
    defineField({
      name: 'answer_en',
      title: 'Answer (English)',
      description: 'Risposta in inglese. Se vuota, viene usata quella italiana.',
      group: 'en',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza sulla home',
      description:
        'Quando attivo, la FAQ compare anche nella sezione compatta in home page. Altrimenti compare solo nella pagina /faq.',
      group: 'settings',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordinamento',
      description: 'I numeri più bassi compaiono prima (es. 10 prima di 100). Lascia 100 se non hai una preferenza.',
      group: 'settings',
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
      title: title || 'Domanda frequente',
      subtitle: [featured ? '★ home' : null, typeof order === 'number' ? `#${order}` : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
