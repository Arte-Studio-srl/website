import { defineArrayMember, defineField, defineType } from 'sanity';

const stageIconOptions = [
  { title: 'Concept / Idea iniziale', value: 'compass' },
  { title: 'Progetto / Disegno tecnico', value: 'blueprint' },
  { title: 'Realizzazione / Costruzione', value: 'layers' },
  { title: 'Foto / Documentazione', value: 'camera' },
  { title: 'Risultato finale', value: 'sparkles' },
  { title: 'Traguardo / Evento', value: 'flag' },
];

export const projectType = defineType({
  name: 'project',
  title: 'Progetto',
  type: 'document',
  groups: [
    { name: 'it', title: 'Italiano', default: true },
    { name: 'en', title: 'English' },
    { name: 'info', title: 'Dati progetto' },
    { name: 'media', title: 'Immagini e fasi' },
    { name: 'settings', title: 'Impostazioni' },
  ],
  fields: [
    defineField({
      name: 'title_it',
      title: 'Titolo (italiano)',
      description:
        'Titolo del progetto in italiano. Compare nella card del progetto e nella pagina di dettaglio. Esempio: "Vetrina Vodafone Stoccolma".',
      group: 'it',
      type: 'string',
      validation: (rule) => rule.required().error('Il titolo in italiano è obbligatorio.'),
    }),
    defineField({
      name: 'description_it',
      title: 'Descrizione (italiano)',
      description:
        'Breve descrizione del progetto in italiano (1-3 frasi). Compare nella pagina del progetto. Spiega cosa è stato fatto e per chi.',
      group: 'it',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().error('La descrizione in italiano è obbligatoria.'),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      description: 'Titolo in inglese. Se vuoto, viene usato quello italiano anche sulla versione inglese del sito.',
      group: 'en',
      type: 'string',
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      description: 'Descrizione in inglese. Se vuota, viene usata quella italiana.',
      group: 'en',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      description: 'Categoria a cui appartiene il progetto. Scegli dalla lista — crea prima la categoria se non esiste.',
      group: 'info',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Seleziona una categoria.'),
    }),
    defineField({
      name: 'year',
      title: 'Anno',
      description: 'Anno di realizzazione del progetto. Usato per ordinare i progetti (i più recenti compaiono prima).',
      group: 'info',
      type: 'number',
      validation: (rule) =>
        rule
          .min(2000)
          .max(2100)
          .error('Inserisci un anno tra il 2000 e il 2100.'),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      description: 'Nome del cliente o del brand per cui è stato realizzato il progetto. Esempio: "Vodafone", "Telecom Italia".',
      group: 'info',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Immagine di copertina',
      description:
        'Immagine principale che rappresenta il progetto. Compare nella card del progetto nelle liste e nelle anteprime. Usa un\'immagine orizzontale di buona qualità (consigliato: 1600×1000 px).',
      group: 'media',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt_it',
          title: 'Testo alternativo (italiano)',
          description:
            'Descrizione dell\'immagine in italiano per accessibilità (lettori di schermo) e SEO. Esempio: "Allestimento vetrina Vodafone a Stoccolma". Compila sempre.',
          type: 'string',
        }),
        defineField({
          name: 'alt_en',
          title: 'Alt text (English)',
          description:
            'Descrizione dell\'immagine in inglese. Esempio: "Vodafone Stockholm window installation". Se vuota, viene usata quella italiana.',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required().error('L\'immagine di copertina è obbligatoria.'),
    }),
    defineField({
      name: 'stages',
      title: 'Fasi del progetto',
      description:
        'Le fasi del progetto raccontano la lavorazione (es. concept → progetto → realizzazione → risultato). Ogni fase ha un titolo, una descrizione e una o più immagini. Aggiungi le fasi nell\'ordine in cui vuoi mostrarle.',
      group: 'media',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'projectStage',
          title: 'Fase',
          type: 'object',
          fields: [
            defineField({
              name: 'title_it',
              title: 'Titolo della fase (italiano)',
              description: 'Esempio: "Concept", "Sopralluogo", "Allestimento", "Inaugurazione".',
              type: 'string',
              validation: (rule) => rule.required().error('Il titolo della fase è obbligatorio.'),
            }),
            defineField({
              name: 'title_en',
              title: 'Stage title (English)',
              description: 'Titolo in inglese. Se vuoto, viene usato quello italiano.',
              type: 'string',
            }),
            defineField({
              name: 'description_it',
              title: 'Descrizione della fase (italiano)',
              description: 'Breve testo che racconta cosa è stato fatto in questa fase.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'description_en',
              title: 'Stage description (English)',
              description: 'Descrizione in inglese. Se vuota, viene usata quella italiana.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icon',
              title: 'Icona della fase',
              description: 'Icona simbolo della fase. Scegli quella più adatta al contenuto.',
              type: 'string',
              options: {
                list: stageIconOptions,
                layout: 'radio',
              },
              initialValue: 'blueprint',
            }),
            defineField({
              name: 'images',
              title: 'Immagini della fase',
              description:
                'Una o più immagini per questa fase. Vengono mostrate nella galleria del progetto. Almeno un\'immagine è obbligatoria.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'alt_it',
                      title: 'Testo alternativo (italiano)',
                      description: 'Descrizione dell\'immagine per accessibilità e SEO.',
                      type: 'string',
                    }),
                    defineField({
                      name: 'alt_en',
                      title: 'Alt text (English)',
                      description: 'Descrizione in inglese. Se vuota, viene usata quella italiana.',
                      type: 'string',
                    }),
                  ],
                }),
              ],
              validation: (rule) => rule.min(1).error('Aggiungi almeno un\'immagine alla fase.'),
            }),
          ],
          preview: {
            select: {
              title: 'title_it',
              media: 'images.0',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description:
        'Codice univoco usato nell\'indirizzo della pagina (es. "vodafone-stoccolma" → /it/project/vodafone-stoccolma). Generato automaticamente dal titolo italiano: clicca "Generate" se modifichi il titolo. Modificalo a mano solo se sai cosa stai facendo — cambiare lo slug rompe i link esistenti.',
      group: 'settings',
      type: 'slug',
      options: { source: 'title_it', maxLength: 96 },
      validation: (rule) => rule.required().error('Lo slug è obbligatorio.'),
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
