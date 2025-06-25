import { Experiment } from './types';

// Experiments data
export const experiments: Experiment[] = [
  {
    id: 'exp-1',
    title: "Color Playground",
    slug: "color-playground",
    description: "Interactive color mixing experiment",
    url: "https://example.com/color-playground",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
      alt: 'Color Playground'
    },
    gradient: "from-purple-500 to-pink-500",
    type: 'experiment'
  },
  {
    id: 'exp-2',
    title: "Generative Patterns",
    slug: "generative-patterns",
    description: "AI-powered pattern generation",
    url: "https://example.com/patterns",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
      alt: 'Generative Patterns'
    },
    gradient: "from-blue-500 to-cyan-500",
    type: 'experiment'
  },
  {
    id: 'exp-3',
    title: "Sound Visualizer",
    slug: "sound-visualizer",
    description: "Real-time audio visualization",
    url: "https://example.com/sound-viz",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      alt: 'Sound Visualizer'
    },
    gradient: "from-green-500 to-emerald-500",
    type: 'experiment'
  },
  {
    id: 'exp-4',
    title: "Typography Lab",
    slug: "typography-lab",
    description: "Experimental type animations",
    url: "https://example.com/type-lab",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop',
      alt: 'Typography Lab'
    },
    gradient: "from-orange-500 to-red-500",
    type: 'experiment'
  },
  {
    id: 'exp-5',
    title: "3D Sketches",
    slug: "3d-sketches",
    description: "WebGL experiments",
    url: "https://example.com/3d-sketches",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop',
      alt: '3D Sketches'
    },
    gradient: "from-indigo-500 to-purple-500",
    type: 'experiment'
  },
  {
    id: 'exp-6',
    title: "Motion Studies",
    slug: "motion-studies",
    description: "Physics-based animations",
    url: "https://example.com/motion",
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1446034730750-a0d466fdc221?w=800&h=600&fit=crop',
      alt: 'Motion Studies'
    },
    gradient: "from-yellow-500 to-orange-500",
    type: 'experiment'
  }
];

// Function to get all experiments
export async function getExperiments(): Promise<Experiment[]> {
  return Promise.resolve(experiments);
}

// Function to get single experiment
export async function getExperiment(slug: string): Promise<Experiment | null> {
  const experiment = experiments.find(e => e.slug === slug);
  return Promise.resolve(experiment || null);
} 