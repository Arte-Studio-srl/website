import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  groups: [
    { name: 'it', title: 'Italiano', default: true },
    { name: 'en', title: 'English' },
    { name: 'settings', title: 'Impostazioni' },
  ],
  fields: [
    defineField({
      name: 'name_it',
      title: 'Nome (italiano)',
      description:
        'Nome della categoria mostrato sul sito in italiano. Esempi: "Sfilate", "Vetrine retail", "Eventi corporate".',
      group: 'it',
      type: 'string',
      validation: (rule) => rule.required().error('Il nome in italiano è obbligatorio.'),
    }),
    defineField({
      name: 'description_it',
      title: 'Descrizione (italiano)',
      description:
        'Breve frase che descrive la categoria. Compare nelle pagine di elenco progetti. Lascia vuoto se non serve.',
      group: 'it',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      description:
        'Nome della categoria in inglese. Se vuoto, viene usato il nome italiano anche sulla versione inglese del sito.',
      group: 'en',
      type: 'string',
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      description: 'Descrizione in inglese. Se vuota, viene usata la descrizione italiana.',
      group: 'en',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description:
        'Codice univoco usato nell\'indirizzo della pagina (es. "sfilate" → /it/projects/sfilate). Generato automaticamente dal nome italiano: clicca "Generate" se modifichi il nome. Modificalo a mano solo se sai cosa stai facendo — cambiare lo slug rompe i link esistenti.',
      group: 'settings',
      type: 'slug',
      options: { source: 'name_it', maxLength: 96 },
      validation: (rule) => rule.required().error('Lo slug è obbligatorio.'),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordinamento',
      description:
        'Numero che decide l\'ordine nelle liste. I valori più bassi compaiono prima (es. 10 prima di 100). Lascia 100 se non hai una preferenza.',
      group: 'settings',
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
