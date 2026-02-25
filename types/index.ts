export type StageIcon = 'compass' | 'blueprint' | 'layers' | 'camera' | 'sparkles' | 'flag';

export interface ProjectStage {
  id?: string;
  title: string;
  images: string[];
  description?: string;
  icon?: StageIcon;
  type?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  client?: string;
  description: string;
  thumbnail: string;
  stages: ProjectStage[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
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


