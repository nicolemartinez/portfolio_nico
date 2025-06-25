import { Project } from './types';

// Placeholder data - will be replaced with Sanity queries later
export const projects: Project[] = [
  {
    id: '1',
    title: 'Shopify Editions | Winter \'25',
    slug: 'shopify-editions-winter-25',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&h=600&fit=crop',
      alt: 'Shopify Editions Winter 2025'
    },
    category: 'Brand Experience',
    year: '2025',
    client: 'Shopify'
  },
  {
    id: '2',
    title: 'Shopify Editions | Summer \'24',
    slug: 'shopify-editions-summer-24',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      alt: 'Shopify Editions Summer 2024'
    },
    category: 'Brand Experience',
    year: '2024',
    client: 'Shopify'
  },
  {
    id: '3',
    title: 'Square Online',
    slug: 'square-online',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      alt: 'Square Online',
      isGif: true // Placeholder - you'll add actual GIFs later
    },
    category: 'Digital Product',
    year: '2024',
    client: 'Square'
  },
  {
    id: '4',
    title: 'Content Studio @ Meta',
    slug: 'content-studio-meta',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=600&fit=crop',
      alt: 'Content Studio at Meta'
    },
    category: 'Platform Design',
    year: '2023',
    client: 'Meta'
  },
  {
    id: '5',
    title: 'Instagram for Business',
    slug: 'instagram-for-business',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
      alt: 'Instagram for Business'
    },
    category: 'Brand Campaign',
    year: '2023',
    client: 'Meta'
  },
  {
    id: '6',
    title: '#buyBlack Friday Show',
    slug: 'buyblack-friday-show',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
      alt: '#buyBlack Friday Show',
      isGif: true
    },
    category: 'Live Experience',
    year: '2022',
    client: 'Facebook'
  },
  {
    id: '7',
    title: 'Curated by Facebook',
    slug: 'curated-by-facebook',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      alt: 'Curated by Facebook'
    },
    category: 'Pop-up Experience',
    year: '2022',
    client: 'Facebook'
  },
  {
    id: '8',
    title: 'Cannes 2022',
    slug: 'cannes-2022',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Cannes 2022'
    },
    category: 'Event Design',
    year: '2022',
    client: 'Meta'
  },
  {
    id: '9',
    title: 'Making Progress',
    slug: 'making-progress',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
      alt: 'Making Progress'
    },
    category: 'Brand Campaign',
    year: '2021'
  },
  {
    id: '10',
    title: 'Social Skills',
    slug: 'social-skills',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
      alt: 'Social Skills',
      isGif: true
    },
    category: 'Digital Experience',
    year: '2021'
  },
  {
    id: '11',
    title: 'Spotify',
    slug: 'spotify',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
      alt: 'Spotify Campaign'
    },
    category: 'Brand Campaign',
    year: '2020',
    client: 'Spotify'
  },
  {
    id: '12',
    title: 'Ode to the Underground',
    slug: 'ode-to-underground',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800&h=600&fit=crop',
      alt: 'Ode to the Underground'
    },
    category: 'Art Direction',
    year: '2019'
  }
];

// Function to get all projects - will be replaced with Sanity query
export async function getProjects(): Promise<Project[]> {
  // Simulate async call
  return Promise.resolve(projects);
}

// Function to get single project - will be replaced with Sanity query
export async function getProject(slug: string): Promise<Project | null> {
  const project = projects.find(p => p.slug === slug);
  return Promise.resolve(project || null);
} 