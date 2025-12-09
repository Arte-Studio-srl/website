export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
  note?: string;
};

export type HeroSlide = {
  projectId: string;
  image: string;
  title: string;
  category?: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  faviconUrl: string;
  contactEmail: string;
  phone: string; // store as E.164-ish, e.g. +390289031657
  address: string;
  googleMapsUrl: string;
  legal: {
    companyName: string;
    piva: string;
    legalAddress?: string;
  };
  openingHours: OpeningHour[];
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
  };
  heroCarousel: HeroSlide[];
};

export const siteConfig: SiteConfig = {
  "siteName": "ArteStudio",
  "tagline": "Professional scenography and event structures for conventions, exhibitions, fashion shows, and theater productions.",
  "faviconUrl": "/favicon.svg",
  "contactEmail": "info@progettoartestudio.it",
  "phone": "+393357041512",
  "address": "ArteStudio s.r.l.\nVicolo San Giorgio 5\n20090 Buccinasco (MI)\nItaly",
  "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Vicolo+San+Giorgio+5,+Buccinasco,+MI",
  "legal": {
    "companyName": "ArteStudio s.r.l.",
    "piva": "02513970182",
    "legalAddress": "Via Porro, 14 - 27100 - Pavia"
  },
  "openingHours": [
    {
      "day": "Monday",
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": "Tuesday",
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": "Wednesday",
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": "Thursday",
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": "Friday",
      "open": "09:00",
      "close": "18:00"
    },
    {
      "day": "Saturday",
      "open": "By appointment",
      "close": "",
      "note": "By appointment",
      "closed": false
    },
    {
      "day": "Sunday",
      "open": "",
      "close": "",
      "closed": true
    }
  ],
  "social": {
    "facebook": "https://www.facebook.com/ArteStudioSrl/",
    "instagram": "https://www.instagram.com/artestudiosrl/",
    "linkedin": ""
  },
  "seo": {
    "defaultMetaTitle": "ArteStudio - Event Structures & Scenography",
    "defaultMetaDescription": "Professional event structures, stages, exhibition stands, and scenography for conventions, exhibitions, fashion shows, and theater productions."
  },
  "heroCarousel": [
    {
      "projectId": "siemens",
      "image": "/images/projects/siemens/final-1.jpg",
      "title": "International Corporate Summit",
      "category": "Conventions"
    },
    {
      "projectId": "resort-show",
      "image": "/images/projects/resort-show/final-1.jpg",
      "title": "Resort Event Experience",
      "category": "Events"
    },
    {
      "projectId": "resort-fashion-show",
      "image": "/images/projects/resort-fashion-show/final-1.jpg",
      "title": "Fashion Show Runway",
      "category": "Fashion Shows"
    }
  ]
};

