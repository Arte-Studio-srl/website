export type StageIcon = 'compass' | 'blueprint' | 'layers' | 'camera' | 'sparkles' | 'flag';

export interface ProjectImage {
  url: string;
  /** Localized alt text — empty string if editor hasn't filled it in (component falls back to title) */
  alt: string;
}

export interface ProjectStage {
  id?: string;
  title: string;
  images: ProjectImage[];
  description?: string;
  icon?: StageIcon;
  type?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  year: number;
  client?: string;
  description: string;
  thumbnail: string;
  /** Localized alt text for the thumbnail */
  thumbnailAlt?: string;
  stages: ProjectStage[];
  /** ISO timestamp from Sanity `_updatedAt`, used for sitemap lastmod */
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  /** ISO timestamp from Sanity `_updatedAt`, used for sitemap lastmod */
  updatedAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
  sortOrder: number;
  /** ISO timestamp from Sanity `_updatedAt`, used for sitemap lastmod */
  updatedAt?: string;
}

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
  imageAlt?: string;
  title: string;
  category?: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  faviconUrl: string;
  contactEmail: string;
  phone: string;
  address: string;
  /** Optional structured address fields — used by Organization JSON-LD for rich results */
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  /** Optional geo coordinates — used by LocalBusiness JSON-LD for map-pack eligibility */
  geo?: {
    latitude?: number;
    longitude?: number;
  };
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
    /** Canonical site URL (e.g. https://progettoartestudio.it) - falls back to NEXT_PUBLIC_SITE_URL */
    siteUrl?: string;
    /** Default Open Graph image (relative or absolute) for social sharing */
    ogImage?: string;
    /** Primary locale: "it" | "en" - affects html lang and og:locale */
    locale?: "it" | "en";
    /** Comma-separated meta keywords (optional) */
    keywords?: string;
  };
  heroCarousel: HeroSlide[];
};


