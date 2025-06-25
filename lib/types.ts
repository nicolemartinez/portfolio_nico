export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: {
    url: string;
    alt: string;
    isGif?: boolean;
    mimeType?: string;
  };
  category?: string;
  year?: string;
  client?: string;
  description?: string;
  featured?: boolean;
  type?: 'project';
  gridLayout?: '1' | '2' | '3';
}

export interface Experiment {
  id: string;
  title: string;
  slug: string;
  description: string;
  url: string;
  thumbnail: {
    url: string;
    alt: string;
    mimeType?: string;
  };
  gradient?: string;
  type: 'experiment';
}

export type Work = Project | Experiment; 