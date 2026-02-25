import { SiteConfig } from '@/types';

export const fallbackSiteConfig: SiteConfig = {
  siteName: "ArteStudio",
  tagline: "Architettura, Scenografia e Design degli spazi",
  faviconUrl: "/favicon.ico",
  contactEmail: "info@progettoartestudio.it",
  phone: "+39 02 1234567",
  address: "Via Example, 1\n20100 Milano (MI)",
  googleMapsUrl: "https://maps.google.com",
  legal: {
    companyName: "ArteStudio S.r.l.",
    piva: "12345678901",
  },
  openingHours: [
    { day: "Lunedì", open: "09:00", close: "18:00" },
    { day: "Martedì", open: "09:00", close: "18:00" },
    { day: "Mercoledì", open: "09:00", close: "18:00" },
    { day: "Giovedì", open: "09:00", close: "18:00" },
    { day: "Venerdì", open: "09:00", close: "18:00" },
    { day: "Sabato", open: "10:00", close: "13:00" },
    { day: "Domenica", open: "", close: "", closed: true }
  ],
  social: {
    facebook: "https://facebook.com/artestudio",
    instagram: "https://instagram.com/artestudio"
  },
  seo: {
    defaultMetaTitle: "ArteStudio | Architettura e Scenografia",
    defaultMetaDescription: "Progettazione e realizzazione di spazi espositivi, scenografie ed eventi.",
    siteUrl: "https://progettoartestudio.it",
    locale: "it",
  },
  heroCarousel: []
};
