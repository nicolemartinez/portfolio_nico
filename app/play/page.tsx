"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { experiments as fallbackExperiments } from '@/lib/experiments';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';
import PixelTrail from '@/fancy/components/background/pixel-trail';

// Define different content types
type BentoItem = {
  id: string;
  type: 'image' | 'link' | 'internal-link';
  size: 'small' | 'wide' | 'full';
  content: any;
};

export default function PlayPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiments() {
      try {
        const query = groq`
          *[_type == "project" && type == "experiment" && visible == true] | order(order asc, _createdAt desc) {
            _id,
            title,
            slug,
            "thumbnail": thumbnail.asset->url,
            "thumbnailType": thumbnail.asset->mimeType,
            externalLinks,
            gridSize
          }
        `;
        const sanityExperiments = await client.fetch(query);
        
        // Transform Sanity data to match expected format
        const transformedExperiments = sanityExperiments.map((exp: any) => ({
          id: exp._id,
          title: exp.title,
          slug: exp.slug,
          thumbnail: exp.thumbnail || '/placeholder.jpg',
          thumbnailType: exp.thumbnailType,
          url: exp.externalLinks?.[0]?.url || '#',
          gridSize: exp.gridSize
        }));
        
        setExperiments(transformedExperiments.length > 0 ? transformedExperiments : fallbackExperiments);
      } catch (error) {
        // Error fetching experiments
        setExperiments(fallbackExperiments);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExperiments();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }
  
  // Create a structured layout with grid patterns
  const bentoItems: BentoItem[] = [];
  
  // Add all experiments
  experiments.forEach((experiment, index) => {
    // Use gridSize from Sanity if available, otherwise use pattern
    let size: 'small' | 'wide' | 'full' = 'small';
    
    if (experiment.gridSize === 'wide') {
      size = 'wide';
    } else if (experiment.gridSize === 'full') {
      size = 'full';
    } else if (!experiment.gridSize) {
      // Fallback pattern if gridSize not set
      size = index % 3 === 0 ? 'wide' : 'small';
    }
    
    bentoItems.push({
      id: experiment.id,
      type: 'internal-link', // Always use internal links for experiments
      size: size,
      content: experiment
    });
  });

  return (
    <main className="min-h-screen pt-20 pb-20 bg-white relative overflow-hidden">
      {/* Pixel Trail Effect */}
      <PixelTrail 
        pixelSize={20} 
        fadeDuration={800} 
        delay={50}
        pixelClassName="rainbow-pixel"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-normal mb-1 text-black" style={{ fontFamily: 'Monigue, sans-serif' }}>
            Play
          </h1>
          <p className="text-lg text-black/70">art and experiments</p>
        </div>
        
        {/* Tight grid - mobile stacks, desktop 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[320px] lg:auto-rows-[380px] gap-[1px]">
          {bentoItems.map((item, index) => {
            let gridClasses = 'col-span-1';
            if (item.size === 'wide') {
              gridClasses = 'col-span-1 md:col-span-2';
            } else if (item.size === 'full') {
              gridClasses = 'col-span-1 md:col-span-3';
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`${gridClasses} relative bg-gray-100`}
              >
                <div className="h-full">
                  {item.type === 'image' && (
                    <ImageBox item={item.content} />
                  )}
                  {item.type === 'link' && (
                    <LinkBox item={item.content} />
                  )}
                  {item.type === 'internal-link' && (
                    <InternalLinkBox item={item.content} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </main>
  );
}

// Image Box Component
function ImageBox({ item }: { item: any }) {
  const isVideo = item.thumbnailType?.startsWith('video/');
  
  return (
    <div className="relative h-full overflow-hidden group">
      {isVideo ? (
        <video
          src={item.thumbnail}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={item.thumbnail + (item.thumbnail.includes('?') ? '&' : '?') + 'w=800&q=80&auto=format'}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
      
      {/* Title overlay - appears on hover */}
      <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white text-base md:text-lg font-medium leading-tight drop-shadow-lg">
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

// Internal Link Box Component (links to project detail pages)
function InternalLinkBox({ item }: { item: any }) {
  const isVideo = item.thumbnailType?.startsWith('video/');
  
  return (
    <Link
      href={`/work/${item.slug.current}`}
      className="block h-full"
    >
      <div className="relative h-full overflow-hidden group">
        {isVideo ? (
          <video
            src={item.thumbnail}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={item.thumbnail + (item.thumbnail.includes('?') ? '&' : '?') + 'w=800&q=80&auto=format'}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Title overlay - no arrow for internal links */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white text-base md:text-lg font-medium leading-tight drop-shadow-lg">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Link Box Component (external links)
function LinkBox({ item }: { item: any }) {
  const isVideo = item.thumbnailType?.startsWith('video/');
  
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className="relative h-full overflow-hidden group">
        {isVideo ? (
          <video
            src={item.thumbnail}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={item.thumbnail + (item.thumbnail.includes('?') ? '&' : '?') + 'w=800&q=80&auto=format'}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Title overlay with arrow - appears on hover */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white text-base md:text-lg font-medium leading-tight drop-shadow-lg">
              {item.title} ↗
            </h3>
          </div>
        </div>
      </div>
    </a>
  );
}

 