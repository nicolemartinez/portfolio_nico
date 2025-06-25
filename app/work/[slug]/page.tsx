import { client } from '@/lib/sanity.client';
import { projectBySlugQuery } from '@/lib/sanity.queries';
import { groq } from 'next-sanity';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';

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

// Helper function to get grid classes based on width
function getGridClasses(width: string) {
  switch (width) {
    case 'small':
      return 'col-span-1';
    case 'medium':
      return 'col-span-1 md:col-span-2';
    case 'large':
      return 'col-span-1 md:col-span-3';
    case 'full':
      return 'col-span-full';
    default:
      return 'col-span-1';
  }
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && /^[a-zA-Z0-9_-]{11}$/.test(lastSegment)) {
    return lastSegment;
  }
  
  // Could not extract YouTube video ID from URL
  return '';
}

// Helper function to get Vimeo ID
function getVimeoId(url: string): string {
  // Handle various Vimeo URL formats
  const patterns = [
    /vimeo\.com\/(\d+)(?:\/([0-9a-f]+))?/, // Standard and unlisted videos
    /player\.vimeo\.com\/video\/(\d+)/,     // Player URLs
    /vimeo\.com\/channels\/[\w]+\/(\d+)/,   // Channel videos
    /vimeo\.com\/groups\/[\w]+\/videos\/(\d+)/, // Group videos
    /vimeo\.com\/ondemand\/[\w]+\/(\d+)/    // On-demand videos
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Extracted Vimeo ID
      return match[1];
    }
  }
  
  // Could not extract Vimeo ID from URL
  return '';
}

// Query to get all projects for navigation
const allProjectsQuery = groq`
  *[_type == "project" && type == $type && visible == true] | order(date desc, _createdAt desc) {
    _id,
    title,
    slug,
    date
  }
`;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // First fetch the project to determine its type
  const project = await client.fetch(projectBySlugQuery, { slug });
  
  if (!project) {
    notFound();
  }
  
  // Then fetch projects of the same type for navigation
  const allProjects = await client.fetch(allProjectsQuery, { type: project.type || 'project' });

  // Find current project index and get prev/next
  const currentIndex = allProjects.findIndex((p: any) => p.slug.current === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  
  // Determine if this is an experiment
  const isExperiment = project.type === 'experiment';

  return (
    <main className="min-h-screen bg-white text-black pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          href={isExperiment ? "/play" : "/work"} 
          className="inline-flex items-center text-black/70 hover:text-black transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {isExperiment ? 'Back to play' : 'Back to work'}
        </Link>

        {/* Project header */}
        <header className="mb-8 relative">
          {/* Award Badges - Top Right Corner */}
          {project.awardBadges && project.awardBadges.length > 0 && (
            <div className="absolute top-0 right-0 flex gap-3">
              {project.awardBadges.map((badge: any, index: number) => (
                <div key={index} className="w-16 h-16 md:w-20 md:h-20">
                  {badge.link ? (
                    <a href={badge.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <img
                        src={badge.url}
                        alt={badge.alt}
                        className="w-full h-full object-contain hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ) : (
                    <img
                      src={badge.url}
                      alt={badge.alt}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-normal mb-2 pr-24 md:pr-48" style={{ fontFamily: 'Monigue, sans-serif' }}>{project.title}</h1>
          <div className="flex flex-wrap gap-4 text-black/70 mb-4">
            {project.date && (
              <span>{new Date(project.date).getFullYear()}</span>
            )}
            {project.tags && project.tags.length > 0 && (
              <span>{project.tags.join(', ')}</span>
            )}
          </div>
          
          {/* External Links */}
          {project.externalLinks && project.externalLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {project.externalLinks.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-black underline hover:no-underline transition-all"
                >
                  {link.label || link.title || link.url}
                  {link.openInNewTab && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Project description */}
        {project.description && (
          <div className="max-w-4xl mb-12">
            <div className="prose prose-lg prose-black">
              <PortableText value={project.description} components={portableTextComponents} />
            </div>
          </div>
        )}

        {/* Content Blocks with advanced masonry grid */}
        {project.contentBlocks && project.contentBlocks.length > 0 ? (
          <div className="space-y-[1px]">
            {/* Group blocks by row based on width */}
            {(() => {
              const rows: any[] = [];
              let currentRow: any[] = [];
              let currentRowWidth = 0;
              
              project.contentBlocks.forEach((block: any, index: number) => {
                // Determine block width in columns (out of 6 for better flexibility)
                let blockWidth = 2; // default small
                if (block.width === 'medium') blockWidth = 3;
                if (block.width === 'large') blockWidth = 4;
                if (block.width === 'full') blockWidth = 6;
                
                // If adding this block exceeds row capacity, start new row
                if (currentRowWidth + blockWidth > 6) {
                  if (currentRow.length > 0) {
                    rows.push([...currentRow]);
                    currentRow = [];
                    currentRowWidth = 0;
                  }
                }
                
                currentRow.push({ ...block, originalIndex: index, columnWidth: blockWidth });
                currentRowWidth += blockWidth;
                
                // If row is full, push it
                if (currentRowWidth === 6) {
                  rows.push([...currentRow]);
                  currentRow = [];
                  currentRowWidth = 0;
                }
              });
              
              // Push any remaining blocks
              if (currentRow.length > 0) {
                rows.push(currentRow);
              }
              
              return rows.map((row: any[], rowIndex: number) => {
                // For each row, use masonry if all items are small, otherwise use grid
                const allSmall = row.every(block => block.columnWidth === 2);
                
                if (allSmall && row.length > 1) {
                  // Use masonry for small items
                  return (
                    <div key={`row-${rowIndex}`} className="columns-1 md:columns-2 lg:columns-3 gap-[1px]">
                      {row.map((block: any) => {
                        const index = block.originalIndex;
                        
                        switch (block._type) {
                          case 'textBlock':
                            return (
                              <div key={index} className="break-inside-avoid mb-[1px] bg-gray-50 p-8">
                                <div className="prose prose-black max-w-none">
                                  <PortableText value={block.content} components={portableTextComponents} />
                                </div>
                              </div>
                            );

                          case 'imageBlock':
                            let imageUrl = null;
                            if (block.image?.asset?._ref) {
                              imageUrl = urlFor(block.image).url();
                            } else if (block.image?.asset?.url) {
                              imageUrl = block.image.asset.url;
                            }
                            
                            if (!imageUrl) return null;
                            
                            // Get aspect ratio if specified
                            const aspectClass = block.aspectRatio === '1:1' ? 'aspect-square' :
                                              block.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                                              block.aspectRatio === '16:9' ? 'aspect-video' :
                                              block.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                                              block.aspectRatio === '3:4' ? 'aspect-[3/4]' :
                                              block.aspectRatio === '2:3' ? 'aspect-[2/3]' :
                                              ''; // Natural aspect ratio if not specified
                            
                            return (
                              <div key={index} className="break-inside-avoid mb-[1px]">
                                <div className={aspectClass}>
                                  <img
                                    src={imageUrl}
                                    alt={block.alt || 'Project image'}
                                    className={`w-full ${aspectClass ? 'h-full object-cover' : ''}`}
                                  />
                                </div>
                                {block.caption && (
                                  <p className="text-sm text-black/60 mt-2 px-2">{block.caption}</p>
                                )}
                              </div>
                            );

                          case 'videoBlock':
                            const videoAspectClass = block.aspectRatio === '9:16' ? 'aspect-[9/16]' : 
                                              block.aspectRatio === '1:1' ? 'aspect-square' :
                                              block.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                                              block.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-video';
                            
                            let videoEmbed = null;
                            
                            if (block.url.includes('vimeo.com') || block.url.includes('player.vimeo.com')) {
                              const vimeoId = getVimeoId(block.url);
                              if (vimeoId) {
                                const hashMatch = block.url.match(/vimeo\.com\/\d+\/([0-9a-f]+)/);
                                const hash = hashMatch ? hashMatch[1] : '';
                                
                                videoEmbed = (
                                  <iframe
                                    src={`https://player.vimeo.com/video/${vimeoId}${hash ? `?h=${hash}&` : '?'}title=0&byline=0&portrait=0`}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                  />
                                );
                              }
                            } else if (block.url.includes('youtube.com') || block.url.includes('youtu.be')) {
                              const youtubeId = getYouTubeVideoId(block.url);
                              if (youtubeId) {
                                videoEmbed = (
                                  <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                );
                              }
                            }
                            
                            if (!videoEmbed) return null;
                            
                            return (
                              <div key={index} className={`break-inside-avoid mb-[1px] ${videoAspectClass}`}>
                                {videoEmbed}
                              </div>
                            );

                          default:
                            return null;
                        }
                      })}
                    </div>
                  );
                } else {
                  // Use grid for mixed sizes
                  return (
                    <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-6 gap-[1px]">
                      {row.map((block: any) => {
                        const index = block.originalIndex;
                        const colSpanClass = block.columnWidth === 2 ? 'col-span-1 md:col-span-2' : 
                                          block.columnWidth === 3 ? 'col-span-1 md:col-span-3' : 
                                          block.columnWidth === 4 ? 'col-span-1 md:col-span-4' : 
                                          block.columnWidth === 6 ? 'col-span-1 md:col-span-6' : 'col-span-1 md:col-span-2';
                        
                        switch (block._type) {
                          case 'textBlock':
                            return (
                              <div key={index} className={`${colSpanClass} bg-gray-50 p-8`}>
                                <div className="prose prose-black max-w-none">
                                  <PortableText value={block.content} components={portableTextComponents} />
                                </div>
                              </div>
                            );

                          case 'imageBlock':
                            let imageUrl = null;
                            if (block.image?.asset?._ref) {
                              imageUrl = urlFor(block.image).url();
                            } else if (block.image?.asset?.url) {
                              imageUrl = block.image.asset.url;
                            }
                            
                            if (!imageUrl) return null;
                            
                            return (
                              <div key={index} className={colSpanClass}>
                                <img
                                  src={imageUrl}
                                  alt={block.alt || 'Project image'}
                                  className="w-full h-full object-cover"
                                />
                                {block.caption && (
                                  <p className="text-sm text-black/60 mt-2 px-2">{block.caption}</p>
                                )}
                              </div>
                            );

                          case 'videoBlock':
                            const aspectClass = block.aspectRatio === '9:16' ? 'aspect-[9/16]' : 
                                              block.aspectRatio === '1:1' ? 'aspect-square' :
                                              block.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                                              block.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-video';
                            
                            let videoEmbed = null;
                            
                            if (block.url.includes('vimeo.com') || block.url.includes('player.vimeo.com')) {
                              const vimeoId = getVimeoId(block.url);
                              if (vimeoId) {
                                const hashMatch = block.url.match(/vimeo\.com\/\d+\/([0-9a-f]+)/);
                                const hash = hashMatch ? hashMatch[1] : '';
                                
                                videoEmbed = (
                                  <iframe
                                    src={`https://player.vimeo.com/video/${vimeoId}${hash ? `?h=${hash}&` : '?'}title=0&byline=0&portrait=0`}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                  />
                                );
                              }
                            } else if (block.url.includes('youtube.com') || block.url.includes('youtu.be')) {
                              const youtubeId = getYouTubeVideoId(block.url);
                              if (youtubeId) {
                                videoEmbed = (
                                  <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                );
                              }
                            }
                            
                            if (!videoEmbed) return null;
                            
                            return (
                              <div key={index} className={`${colSpanClass} ${aspectClass}`}>
                                {videoEmbed}
                              </div>
                            );

                          case 'gridBlock':
                            const cols = block.columns || 3;
                            const gridColsClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
                            return (
                              <div key={index} className={`col-span-1 md:col-span-6 grid grid-cols-1 ${gridColsClass} gap-[1px]`}>
                                {block.images?.map((image: any, imgIndex: number) => {
                                  const gridImageUrl = image.asset?._ref ? urlFor(image).url() : null;
                                  if (!gridImageUrl) return null;
                                  
                                  return (
                                    <div key={imgIndex}>
                                      <img
                                        src={gridImageUrl}
                                        alt={image.alt || `Grid image ${imgIndex + 1}`}
                                        className="w-full"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            );

                          default:
                            return null;
                        }
                      })}
                    </div>
                  );
                }
              });
            })()}
          </div>
        ) : (
          /* Fallback to old gallery system if no content blocks */
          <div className={`grid grid-cols-1 ${
            project.gridLayout === '3' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : project.gridLayout === '2'
                ? 'md:grid-cols-2'
                : ''
          } gap-6`}>
            {/* Old gallery and video system here for backwards compatibility */}
            {project.gallery && project.gallery.map((image: any, index: number) => (
              <div key={`gallery-${index}`}>
                <img
                  src={image.url || image.externalUrl}
                  alt={image.alt || `${project.title} image ${index + 1}`}
                  className="w-full"
                />
                {image.caption && (
                  <p className="text-sm text-black/60 mt-2">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prevProject ? (
              <Link href={`/work/${prevProject.slug.current}`} className="group">
                <p className="text-sm text-gray-500 mb-2">{isExperiment ? 'Previous Experiment' : 'Previous Project'}</p>
                <h3 className="text-2xl font-medium group-hover:underline">{prevProject.title}</h3>
              </Link>
            ) : (
              <div /> // Empty div to maintain grid layout
            )}
            {nextProject ? (
              <Link href={`/work/${nextProject.slug.current}`} className="group text-right md:text-right">
                <p className="text-sm text-gray-500 mb-2">{isExperiment ? 'Next Experiment' : 'Next Project'}</p>
                <h3 className="text-2xl font-medium group-hover:underline">{nextProject.title}</h3>
              </Link>
            ) : (
              <div /> // Empty div to maintain grid layout
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 