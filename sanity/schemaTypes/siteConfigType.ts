import { defineArrayMember, defineField, defineType } from 'sanity';

const DAY_OPTIONS = [
  { title: 'Lunedì', value: 'monday' },
  { title: 'Martedì', value: 'tuesday' },
  { title: 'Mercoledì', value: 'wednesday' },
  { title: 'Giovedì', value: 'thursday' },
  { title: 'Venerdì', value: 'friday' },
  { title: 'Sabato', value: 'saturday' },
  { title: 'Domenica', value: 'sunday' },
];

export const siteConfigType = defineType({
  name: 'siteConfig',
  title: 'Configurazione del sito',
  type: 'document',
  groups: [
    { name: 'general', title: 'Generale', default: true },
    { name: 'contact', title: 'Contatti e sede' },
    { name: 'hours', title: 'Orari' },
    { name: 'social', title: 'Social' },
    { name: 'legal', title: 'Dati legali' },
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Carosello home' },
  ],
  fields: [
    // -------- Generale --------
    defineField({
      name: 'siteName',
      title: 'Nome del sito',
      description: 'Nome dello studio così come compare in alto al sito e nelle email. Esempio: "ArteStudio".',
      group: 'general',
      type: 'string',
      validation: (rule) => rule.required().error('Il nome del sito è obbligatorio.'),
    }),
    defineField({
      name: 'tagline_it',
      title: 'Sottotitolo / Tagline (italiano)',
      description:
        'Frase breve sotto il logo. Riassume cosa fate. Esempio: "Architettura, Scenografia e Design degli spazi". Compare in home, footer e meta tag.',
      group: 'general',
      type: 'string',
      validation: (rule) => rule.required().error('Il sottotitolo in italiano è obbligatorio.'),
    }),
    defineField({
      name: 'tagline_en',
      title: 'Tagline (English)',
      description: 'Sottotitolo in inglese. Se vuoto, viene usato quello italiano sulla versione inglese.',
      group: 'general',
      type: 'string',
    }),
    defineField({
      name: 'faviconUrl',
      title: 'URL della favicon',
      description:
        'Percorso dell\'icona del sito (la piccola icona nella scheda del browser). Lascia "/favicon.svg" se non sai cosa cambiare.',
      group: 'general',
      type: 'string',
      initialValue: '/favicon.svg',
    }),

    // -------- Contatti e sede --------
    defineField({
      name: 'contactEmail',
      title: 'Email di contatto',
      description: 'Email mostrata sul sito e usata come destinazione delle richieste di contatto.',
      group: 'contact',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .email()
          .error('Inserisci un\'email valida.'),
    }),
    defineField({
      name: 'phone',
      title: 'Telefono',
      description: 'Numero di telefono mostrato sul sito. Includi il prefisso internazionale (es. "+39 02 1234567").',
      group: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Indirizzo (visualizzato)',
      description:
        'Indirizzo completo della sede, libero su più righe. Mostrato nella pagina contatti e nel footer. Esempio: "Via Esempio 1\\n20100 Milano (MI)".',
      group: 'contact',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'addressLocality',
      title: 'Città',
      description:
        'Solo il nome della città (es. "Milano"). Serve per Google e altri motori di ricerca (dati strutturati) — separato dall\'indirizzo visualizzato sopra.',
      group: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'addressRegion',
      title: 'Provincia o regione',
      description:
        'Sigla a due lettere della provincia (es. "MI") oppure nome della regione. Serve per i dati strutturati di Google.',
      group: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'CAP',
      description: 'Codice di avviamento postale (es. "20100").',
      group: 'contact',
      type: 'string',
    }),
    defineField({
      name: 'addressCountry',
      title: 'Codice paese',
      description:
        'Codice paese a 2 lettere ISO 3166-1 (es. "IT" per Italia). Serve per i dati strutturati di Google.',
      group: 'contact',
      type: 'string',
      initialValue: 'IT',
    }),
    defineField({
      name: 'geo',
      title: 'Coordinate geografiche',
      description:
        'Latitudine e longitudine della sede. Migliora la visibilità della scheda Google "Vicino a te". Trovale su Google Maps facendo clic destro sulla posizione.',
      group: 'contact',
      type: 'object',
      fields: [
        defineField({ name: 'latitude', title: 'Latitudine', type: 'number' }),
        defineField({ name: 'longitude', title: 'Longitudine', type: 'number' }),
      ],
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'URL di Google Maps',
      description:
        'Link a Google Maps della sede. Apri Google Maps, cerca l\'indirizzo, clicca "Condividi" e copia il link.',
      group: 'contact',
      type: 'url',
    }),

    // -------- Orari --------
    defineField({
      name: 'openingHours',
      title: 'Orari di apertura',
      description:
        'Orari di apertura settimanali. Aggiungi una riga per ogni giorno. Per i giorni di chiusura, spunta "Chiuso" e lascia gli orari vuoti.',
      group: 'hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Giorno',
              type: 'string',
              options: { list: DAY_OPTIONS, layout: 'dropdown' },
              validation: (rule) => rule.required().error('Seleziona un giorno.'),
            }),
            defineField({
              name: 'open',
              title: 'Apertura',
              description: 'Orario di apertura nel formato HH:MM (es. "09:00"). Lascia vuoto se chiuso.',
              type: 'string',
            }),
            defineField({
              name: 'close',
              title: 'Chiusura',
              description: 'Orario di chiusura nel formato HH:MM (es. "18:00"). Lascia vuoto se chiuso.',
              type: 'string',
            }),
            defineField({
              name: 'closed',
              title: 'Chiuso',
              description: 'Spunta se in questo giorno la sede è chiusa.',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'note',
              title: 'Nota',
              description: 'Testo libero opzionale (es. "Solo su appuntamento").',
              type: 'string',
            }),
          ],
          preview: {
            select: { day: 'day', open: 'open', close: 'close', closed: 'closed' },
            prepare: ({ day, open, close, closed }) => {
              const dayLabel = DAY_OPTIONS.find((o) => o.value === day)?.title || day;
              return {
                title: dayLabel,
                subtitle: closed ? 'Chiuso' : [open, close].filter(Boolean).join(' - '),
              };
            },
          },
        }),
      ],
    }),

    // -------- Social --------
    defineField({
      name: 'social',
      title: 'Profili social',
      description: 'Link ai profili social ufficiali. Lascia vuoti i campi che non usi — non compariranno sul sito.',
      group: 'social',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook', description: 'URL completo (https://facebook.com/...).', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', description: 'URL completo (https://instagram.com/...).', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', description: 'URL completo (https://linkedin.com/...).', type: 'url' }),
      ],
    }),

    // -------- Legale --------
    defineField({
      name: 'legal',
      title: 'Dati societari',
      description: 'Ragione sociale, partita IVA e indirizzo legale. Mostrati nel footer per obbligo di legge.',
      group: 'legal',
      type: 'object',
      fields: [
        defineField({
          name: 'companyName',
          title: 'Ragione sociale',
          description: 'Denominazione legale dell\'azienda (es. "ArteStudio S.r.l.").',
          type: 'string',
        }),
        defineField({
          name: 'piva',
          title: 'Partita IVA',
          description: '11 cifre, senza spazi (es. "12345678901").',
          type: 'string',
        }),
        defineField({
          name: 'legalAddress',
          title: 'Sede legale',
          description: 'Indirizzo legale completo, se diverso dalla sede operativa. Lascia vuoto se coincide.',
          type: 'text',
          rows: 2,
        }),
      ],
    }),

    // -------- SEO --------
    defineField({
      name: 'seo',
      title: 'SEO (motori di ricerca)',
      description: 'Configurazione visibile a Google, social network e link in chat. In dubbio, lascia i valori predefiniti.',
      group: 'seo',
      type: 'object',
      fields: [
        defineField({
          name: 'defaultMetaTitle_it',
          title: 'Titolo SEO predefinito (italiano)',
          description:
            'Titolo della scheda nei risultati di Google e nelle anteprime social. Max ~60 caratteri. Se vuoto, viene composto come "Nome del sito | Tagline".',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaTitle_en',
          title: 'Default meta title (English)',
          description: 'Titolo SEO in inglese. Se vuoto, viene usato quello italiano.',
          type: 'string',
        }),
        defineField({
          name: 'defaultMetaDescription_it',
          title: 'Descrizione SEO predefinita (italiano)',
          description:
            'Testo della scheda nei risultati di Google. Max ~160 caratteri. Se vuoto, viene usato il sottotitolo.',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'defaultMetaDescription_en',
          title: 'Default meta description (English)',
          description: 'Descrizione SEO in inglese. Se vuota, viene usata quella italiana.',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'siteUrl',
          title: 'URL canonico del sito',
          description:
            'Indirizzo principale del sito (es. "https://progettoartestudio.it"). Usato per link assoluti, sitemap e meta tag.',
          type: 'url',
        }),
        defineField({
          name: 'ogImage',
          title: 'Immagine di anteprima social',
          description:
            'Immagine mostrata quando il sito viene condiviso su WhatsApp, Facebook, LinkedIn, ecc. Consigliato: 1200×630 px.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'locale',
          title: 'Lingua principale',
          description: 'Lingua predefinita del sito. Influenza i meta tag e l\'attributo lang dell\'HTML.',
          type: 'string',
          options: {
            list: [
              { title: 'Italiano', value: 'it' },
              { title: 'English', value: 'en' },
            ],
          },
          initialValue: 'it',
        }),
        defineField({
          name: 'keywords',
          title: 'Parole chiave',
          description:
            'Lista opzionale di parole chiave separate da virgola (es. "scenografia, allestimenti, eventi"). Oggi i motori di ricerca le ignorano: lascia vuoto se non hai esigenze specifiche.',
          type: 'string',
        }),
      ],
    }),

    // -------- Hero carosello --------
    defineField({
      name: 'heroCarousel',
      title: 'Carosello in home',
      description:
        'Slide grandi mostrate in alto nella home. Aggiungi qui i progetti che vuoi mettere in vetrina. L\'ordine delle slide è l\'ordine in cui le inserisci.',
      group: 'hero',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'project',
              title: 'Progetto collegato',
              description:
                'Progetto a cui punta la slide. Cliccando lo slide il visitatore arriva sulla pagina di questo progetto.',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
            defineField({
              name: 'image',
              title: 'Immagine della slide',
              description:
                'Immagine grande della slide. Se vuoto, viene usata la copertina del progetto collegato sopra. Consigliato: 1920×1080 px o più.',
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
            defineField({
              name: 'title',
              title: 'Titolo personalizzato',
              description: 'Solo se vuoi sovrascrivere il titolo del progetto. Lascia vuoto per usare il titolo del progetto.',
              type: 'string',
            }),
            defineField({
              name: 'category',
              title: 'Categoria personalizzata',
              description: 'Solo se vuoi sovrascrivere la categoria mostrata. Lascia vuoto per usare quella del progetto.',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              projectTitle: 'project.title_it',
              media: 'image',
            },
            prepare: ({ title, projectTitle, media }) => ({
              title: title || projectTitle || 'Slide carosello',
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configurazione del sito' }),
  },
});
