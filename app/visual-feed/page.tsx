'use client';

import { useState, useEffect, useRef } from 'react';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

// Fetch visual feed items from Sanity
async function getVisualFeedItems() {
  const query = groq`
    *[_type == "visualFeedItem" && visible == true] | order(coalesce(order, 999) asc, _createdAt desc) {
      _id,
      title,
      media {
        asset->{
          url,
          mimeType,
          metadata {
            dimensions,
            lqip
          }
        },
        alt
      },
      videoUrl,
      aspectRatio,
      caption,
      projectReference->{
        slug,
        title
      },
      tags
    }
  `;
  
  return client.fetch(query);
}

// Masonry item component with scroll animation
function MasonryItem({ item, index }: { item: any; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const imageUrl = item.media?.asset?.url;
  const isGif = imageUrl?.includes('.gif');
  const isVideo = item.media?.asset?.mimeType?.includes('video') || item.videoUrl;
  
  // Get height class based on aspect ratio
  const getHeightClass = () => {
    switch (item.aspectRatio || 'portrait') {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'tall':
        return 'aspect-[2/3]';
      case 'vertical':
        return 'aspect-[9/16]';
      case 'wide':
        return 'aspect-[4/3]';
      case 'ultrawide':
        return 'aspect-[16/9]';
      default:
        return 'aspect-[3/4]';
    }
  };
  
  return (
    <div 
      ref={itemRef}
      className={`group break-inside-avoid mb-[1px] transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      {/* Media container */}
      <div className={`relative ${getHeightClass()} bg-gray-100 overflow-hidden`}>
        {item.projectReference ? (
          <Link href={`/work/${item.projectReference.slug.current}`}>
            {isVideo ? (
              item.videoUrl ? (
                // External video (Vimeo/YouTube)
                <div className="w-full h-full">
                  {item.videoUrl.includes('vimeo') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${item.videoUrl.split('/').pop()}?background=1&autoplay=1&loop=1&muted=1`}
                      className="w-full h-full object-cover"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : item.videoUrl.includes('youtube') || item.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoUrl.includes('youtu.be') ? item.videoUrl.split('/').pop() : item.videoUrl.split('v=')[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${item.videoUrl.includes('youtu.be') ? item.videoUrl.split('/').pop() : item.videoUrl.split('v=')[1]}`}
                      className="w-full h-full object-cover"
                      allow="autoplay"
                      allowFullScreen
                    />
                  ) : null}
                </div>
              ) : (
                // Direct video file
                <video
                  src={imageUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )
            ) : (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.media.alt || item.caption || 'Visual feed item'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )
            )}
            {/* Hover overlay for linked items */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </Link>
        ) : (
          <>
            {isVideo ? (
              item.videoUrl ? (
                // External video (Vimeo/YouTube)
                <div className="w-full h-full">
                  {item.videoUrl.includes('vimeo') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${item.videoUrl.split('/').pop()}?background=1&autoplay=1&loop=1&muted=1`}
                      className="w-full h-full object-cover"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : item.videoUrl.includes('youtube') || item.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoUrl.includes('youtu.be') ? item.videoUrl.split('/').pop() : item.videoUrl.split('v=')[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${item.videoUrl.includes('youtu.be') ? item.videoUrl.split('/').pop() : item.videoUrl.split('v=')[1]}`}
                      className="w-full h-full object-cover"
                      allow="autoplay"
                      allowFullScreen
                    />
                  ) : null}
                </div>
              ) : (
                // Direct video file
                <video
                  src={imageUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )
            ) : (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.media.alt || item.caption || 'Visual feed item'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )
            )}
          </>
        )}
      </div>
      
      {/* Caption */}
      {item.caption && (
        <p className="text-sm text-black/70 mt-3 mb-4 px-2 leading-tight">
          {item.caption}
        </p>
      )}
      
      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 mb-3 px-2">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs text-black/40 bg-gray-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Project reference */}
      {item.projectReference && (
        <Link 
          href={`/work/${item.projectReference.slug.current}`}
          className="text-xs text-black/50 hover:text-black transition-colors mt-1 mb-3 px-2 block"
        >
          From: {item.projectReference.title}
        </Link>
      )}
    </div>
  );
}

export default function VisualFeedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getVisualFeedItems();
      setItems(data);
      setFilteredItems(data);
      
      // Extract all unique tags
      const tags = new Set<string>();
      data.forEach((item: any) => {
        item.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
      setLoading(false);
    };
    
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;
    
    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(item => item.tags?.includes(selectedTag));
    }
    
    setFilteredItems(filtered);
  }, [selectedTag, items]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-[1px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bg-gray-200 mb-[1px] ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-80' : 'h-96'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-normal mb-8 text-black opacity-0 animate-fade-in" style={{ fontFamily: 'Monigue, sans-serif' }}>
          Visual Feed
        </h1>
        
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('all')}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                  selectedTag === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-black'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-black'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Results count */}
        {selectedTag !== 'all' && (
          <p className="text-sm text-gray-500 mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Showing {filteredItems.length} of {items.length} items
          </p>
        )}
        
        {/* Masonry layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-[1px]">
          {filteredItems.map((item: any, index: number) => (
            <MasonryItem key={item._id} item={item} index={index} />
          ))}
        </div>
        
        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 opacity-0 animate-fade-in">
            {selectedTag !== 'all' ? (
              <>
                <p className="text-gray-500">No items match this tag.</p>
                <button
                  onClick={() => {
                    setSelectedTag('all');
                  }}
                  className="text-sm text-black underline mt-2"
                >
                  Show all
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500">No visual feed items yet.</p>
                <p className="text-sm text-gray-400 mt-2">Add items in Sanity Studio to see them here.</p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 