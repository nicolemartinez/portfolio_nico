'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import { ImageTrail } from '@/components/ui/ImageTrail';

// Query to get about page content
const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    bio,
    contactEmail,
    socialLinks
  }
`;

// Optimized about images
const aboutImages = [
  '/about-images/image1.png',
  '/about-images/image2.png',
  '/about-images/image3.png',
  '/about-images/image4.png',
  '/about-images/image5.png',
  '/about-images/image6.png',
  '/about-images/image7.png',
  '/about-images/image8.png',
  '/about-images/image9.png',
];

// Custom components for PortableText
const portableTextComponents = {
  marks: {
    link: ({children, value}: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = value.blank ? '_blank' : undefined;
      return (
        <a 
          href={value.href} 
          target={target} 
          rel={rel}
          className="underline hover:text-black/60 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  hardBreak: () => <br />,
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const data = await client.fetch(aboutPageQuery);
        setAboutData(data);
      } catch (error) {
        // Error fetching about data
      } finally {
        setIsLoading(false);
      }
    }
    fetchAboutData();
  }, []);
  
  // Fallback content if no data in Sanity yet
  const content = aboutData || {
    bio: [],
    contactEmail: 'hello@example.com',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
      { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
    ]
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black pt-20 pb-20 relative overflow-hidden">
      {/* Image Trail Effect */}
      <ImageTrail 
        images={aboutImages}
        imageClassName="w-32 h-32 md:w-48 md:h-48"
        maxImages={8}
        fadeOutDuration={1500}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        <h1 className="text-4xl md:text-6xl font-normal mb-16 text-black" style={{ fontFamily: 'Monigue, sans-serif' }}>
          About
        </h1>
        
        {/* Main bio text */}
        <div className="mb-20">
          {content.bio && content.bio.length > 0 ? (
            <div className="prose prose-xl prose-black max-w-none">
              <PortableText 
                value={content.bio}
                components={portableTextComponents}
              />
            </div>
          ) : (
            <div className="text-xl leading-relaxed space-y-6">
              <p>
                Creative Director crafting memorable brand experiences at the intersection of strategy, design, and culture.
              </p>
              <p>
                With over a decade of experience leading creative teams and building brands from the ground up, 
                I specialize in transforming complex ideas into compelling visual narratives that resonate with audiences 
                and drive business results.
              </p>
              <p>
                My approach combines strategic thinking with hands-on creative execution, ensuring that every project 
                not only looks beautiful but also serves a clear purpose.
              </p>
            </div>
          )}
        </div>
        
        {/* Social links */}
        <div className="flex flex-wrap gap-6 text-base">
          {content.contactEmail && (
            <a 
              href={`mailto:${content.contactEmail}`} 
              className="text-black hover:text-black/60 transition-colors"
            >
              Email
            </a>
          )}
          {content.socialLinks && content.socialLinks.map((link: any, index: number) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-black hover:text-black/60 transition-colors"
            >
              {link.label || link.platform}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
} 