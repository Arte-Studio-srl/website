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

