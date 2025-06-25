'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DragElements from '@/components/ui/DragElements';
import DraggableProjectCard from '@/components/ui/DraggableProjectCard';
import Typewriter from '@/components/ui/typewriter';
import { projects as fallbackProjects } from '@/lib/projects';
import { experiments as fallbackExperiments } from '@/lib/experiments';
import { Project, Experiment, Work } from '@/lib/types';
import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { homepageProjectsQuery } from '@/lib/sanity.queries';
import PixelTrail from '@/fancy/components/background/pixel-trail';

// Define size distribution
const sizeDistribution = {
  small: 3,
  medium: 3
};

// Function to get random items (projects and experiments) with size assignments
function getRandomItems(allItems: Work[], count: number): (Work & { size: 'small' | 'medium' })[] {
  const shuffled = allItems.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Create size array based on distribution
  const sizes: ('small' | 'medium')[] = [];
  Object.entries(sizeDistribution).forEach(([size, count]) => {
    for (let i = 0; i < count; i++) {
      sizes.push(size as 'small' | 'medium');
    }
  });
  
  // Shuffle sizes
  const shuffledSizes = sizes.sort(() => 0.5 - Math.random());
  
  // Assign sizes to items
  return selected.map((item, index) => ({
    ...item,
    size: shuffledSizes[index]
  }));
}

// Function to generate random positions
function generatePositions(count: number): Array<{x: number, y: number, rotation: number, zIndex: number}> {
  const positions: Array<{x: number, y: number, rotation: number, zIndex: number}> = [];
  const minDistance = 150; // Minimum distance between cards
  
  // Define safe zones to avoid headline collision
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Calculate headline area (center of screen with some padding)
  const headlineWidth = viewportWidth * 0.8; // Headline takes up ~80% of width
  const headlineHeight = viewportHeight * 0.3; // Headline takes up ~30% of height
  const headlineLeft = (viewportWidth - headlineWidth) / 2;
  const headlineRight = headlineLeft + headlineWidth;
  const headlineTop = (viewportHeight - headlineHeight) / 2;
  const headlineBottom = headlineTop + headlineHeight;
  
  // Add padding around headline to ensure clickability
  const padding = 50;
  const forbiddenZone = {
    left: headlineLeft - padding,
    right: headlineRight + padding,
    top: headlineTop - padding,
    bottom: headlineBottom + padding
  };
  
  for (let i = 0; i < count; i++) {
    let position: {x: number, y: number, rotation: number, zIndex: number};
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      // Generate positions avoiding the center headline area
      const side = Math.random(); // Determine which side/area to place the card
      
      if (side < 0.25) {
        // Left side
        position = {
          x: Math.random() * (forbiddenZone.left - 300),
          y: Math.random() * (viewportHeight - 300),
          rotation: Math.random() * 30 - 15,
          zIndex: 30 // Always in front
        };
      } else if (side < 0.5) {
        // Right side
        position = {
          x: forbiddenZone.right + Math.random() * (viewportWidth - forbiddenZone.right - 300),
          y: Math.random() * (viewportHeight - 300),
          rotation: Math.random() * 30 - 15,
          zIndex: 30 // Always in front
        };
      } else if (side < 0.75) {
        // Top area
        position = {
          x: Math.random() * (viewportWidth - 300),
          y: Math.random() * Math.max(forbiddenZone.top - 300, 100),
          rotation: Math.random() * 30 - 15,
          zIndex: 30 // Always in front
        };
      } else {
        // Bottom area
        position = {
          x: Math.random() * (viewportWidth - 300),
          y: forbiddenZone.bottom + Math.random() * (viewportHeight - forbiddenZone.bottom - 300),
          rotation: Math.random() * 30 - 15,
          zIndex: 30 // Always in front
        };
      }
      
      // Ensure position is within bounds
      position.x = Math.max(0, Math.min(position.x, viewportWidth - 300));
      position.y = Math.max(0, Math.min(position.y, viewportHeight - 300));
      
      // Check distance from other positions
      const tooClose = positions.some(pos => {
        const distance = Math.sqrt(
          Math.pow(position.x - pos.x, 2) + 
          Math.pow(position.y - pos.y, 2)
        );
        return distance < minDistance;
      });
      
      attempts++;
      
      if (!tooClose || attempts >= maxAttempts) {
        positions.push(position);
        break;
      }
    } while (attempts < maxAttempts);
  }
  
  return positions;
}

export default function Home() {
  const [displayItems, setDisplayItems] = useState<(Work & { size: 'small' | 'medium' })[]>([]);
  const [positions, setPositions] = useState<Array<{x: number, y: number, rotation: number, zIndex: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch projects from Sanity
        const sanityProjects = await client.fetch(homepageProjectsQuery);
        
        // Convert Sanity data to match our Project type
        const formattedProjects: Project[] = sanityProjects.map((project: any) => ({
          id: project._id,
          title: project.title,
          slug: project.slug.current,
          type: project.type,
          thumbnail: {
            url: project.thumbnail?.asset?.url || '/api/placeholder/400/300',
            alt: project.title,
            mimeType: project.thumbnail?.asset?.mimeType
          },
          category: project.category || 'other',
          url: project.type === 'experiment' ? '#' : `/work/${project.slug.current}`
        }));

        // If we have Sanity projects, use them; otherwise use fallback
        let allItems: Work[] = formattedProjects.length > 0 
          ? formattedProjects 
          : [...fallbackProjects, ...fallbackExperiments];

        const selectedItems = getRandomItems(allItems, 6);
        setDisplayItems(selectedItems);
        setPositions(generatePositions(6));
      } catch (error) {
        // Error fetching projects
        // Use fallback data if Sanity fetch fails
        const allItems = [...fallbackProjects, ...fallbackExperiments];
        const selectedItems = getRandomItems(allItems, 6);
        setDisplayItems(selectedItems);
        setPositions(generatePositions(6));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Pixel Trail Effect */}
      <PixelTrail 
        pixelSize={20} 
        fadeDuration={800} 
        delay={50}
        pixelClassName="rainbow-pixel"
      />
      
      {/* Desktop: Hero Text - Fixed position */}
      <div className="hidden md:flex fixed inset-0 items-center justify-center pointer-events-none z-20">
        <h1 
          className="text-[18vw] font-normal tracking-[-0.02em] text-black leading-none select-none pointer-events-auto cursor-pointer flex items-baseline justify-center"
          style={{ fontFamily: 'Monigue, sans-serif' }}
        >
          <span>SOME</span>
          <span style={{ width: '0.15em' }}></span>
          <span className="inline-block text-left" style={{ width: '4.5ch', minWidth: '4.5ch' }}>
            <Typewriter
              text={["WORK", "PLAY"]}
              as="span"
              speed={150}
              deleteSpeed={75}
              waitTime={2000}
              showCursor={false}
              className="inline-block text-left"
            />
          </span>
        </h1>
      </div>

      {/* Mobile: Hero Text at Top */}
                <div className="md:hidden pt-20 pb-8 px-4">
        <h1 
          className="text-[25vw] font-normal tracking-[-0.02em] text-black leading-none select-none text-center"
          style={{ fontFamily: 'Monigue, sans-serif' }}
        >
          <span>SOME</span>
          <span style={{ width: '0.15em', display: 'inline-block' }}></span>
          <span className="inline-block text-left" style={{ width: '4.5ch', minWidth: '4.5ch' }}>
            <Typewriter
              text={["WORK", "PLAY"]}
              as="span"
              speed={150}
              deleteSpeed={75}
              waitTime={2000}
              showCursor={false}
              className="inline-block text-left"
            />
          </span>
        </h1>
      </div>

      {/* Desktop: Draggable Project Cards */}
      <div className="hidden md:block">
        <DragElements
          dragConstraints={{
            left: -2000,
            right: 2000,
            top: -2000,
            bottom: 2000
          }}
          dragElastic={0}
        >
          {displayItems.map((item, index) => (
            <DraggableProjectCard 
              key={item.id} 
              project={item as Project} 
              size={item.size}
              isDraggable={true}
              style={{
                position: 'absolute',
                left: positions[index]?.x || 0,
                top: positions[index]?.y || 0,
                transform: `rotate(${positions[index]?.rotation || 0}deg)`,
                zIndex: positions[index]?.zIndex || 20,
                opacity: 0,
                animation: `fadeInRotate 0.6s ease-out ${index * 0.1}s forwards`
              }}
            />
          ))}
        </DragElements>
      </div>

      {/* Mobile: Scrollable Project Cards */}
      <div className="md:hidden pb-20 px-4">
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.type === 'experiment' ? item.url : `/work/${item.slug}`}>
                <div className="bg-black">
                  <div className="relative aspect-[4/3]">
                    {item.thumbnail.mimeType?.includes('video') ? (
                      <video
                        src={item.thumbnail.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.thumbnail.url}
                        alt={item.thumbnail.alt}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
