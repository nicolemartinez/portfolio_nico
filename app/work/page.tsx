import { client } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import Link from "next/link";

export const revalidate = 0; // Force dynamic rendering

// Fetch only projects (not experiments) from Sanity
async function getProjects() {
  const query = groq`
    *[_type == "project" && type == "project" && visible == true] | order(date desc, _createdAt desc) {
      _id,
      title,
      slug,
      "thumbnail": thumbnail.asset->url + "?w=800&q=80&auto=format",
      category,
      gridSize,
      thumbnailRatio,
      date
    }
  `;
  
  return client.fetch(query);
}

// Get object position based on thumbnail ratio preference
function getImageStyles(ratio: string) {
  // Always fill the container with object-cover
  let styles = 'object-cover';
  
  // Adjust object-position based on ratio preference
  switch (ratio) {
    case '1:1':
      styles += ' object-center'; // Center the square crop
      break;
    case '16:9':
      styles += ' object-center'; // Center for wide images
      break;
    case '4:3':
      styles += ' object-center'; // Center for classic ratio
      break;
    case '3:4':
      styles += ' object-top'; // Show top portion for portraits
      break;
    case 'original':
    default:
      styles += ' object-center'; // Default center position
      break;
  }
  
  return styles;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-normal mb-8 text-black" style={{ fontFamily: 'Monigue, sans-serif' }}>
          Work
        </h1>
        
        {/* Responsive grid: 1 column on mobile, 3 columns on md and up */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[320px] lg:auto-rows-[380px] gap-[1px]">
          {projects.map((project: any, index: number) => {
            // Determine grid classes based on gridSize
            const gridSize = project.gridSize || 'square';
            const thumbnailRatio = project.thumbnailRatio || 'original';
            let gridClasses = '';
            
            switch (gridSize) {
              case 'square':
                gridClasses = 'col-span-1';
                break;
              case 'wide':
                // On mobile, wide items still take full width (1 column)
                // On desktop, they take 2 columns
                gridClasses = 'col-span-1 md:col-span-2';
                break;
              default:
                // Default pattern for variety
                // Create patterns like: wide+square, square+wide, 3 squares
                const patterns = [
                  ['wide', 'square'], // 2+1
                  ['square', 'wide'], // 1+2
                  ['square', 'square', 'square'], // 1+1+1
                ];
                const patternIndex = Math.floor(index / 3) % patterns.length;
                const pattern = patterns[patternIndex];
                const positionInPattern = index % pattern.length;
                gridClasses = pattern[positionInPattern] === 'wide' ? 'col-span-1 md:col-span-2' : 'col-span-1';
            }
            
            return (
              <Link
                key={project._id}
                href={`/work/${project.slug.current}`}
                className={`group block ${gridClasses} relative bg-gray-100`}
              >
                <div className="relative overflow-hidden h-full">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className={`w-full h-full ${getImageStyles(thumbnailRatio)} transition-all duration-700 group-hover:scale-105`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors duration-500" />
                  
                  {/* Title overlay - appears on hover */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h2 className="text-white text-base md:text-lg font-medium leading-tight drop-shadow-lg">
                        {project.title}
                      </h2>
                      {project.category && (
                        <p className="text-white/80 text-sm mt-1 drop-shadow-lg">{project.category}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
} 