'use client';

import { useRouter } from 'next/navigation';
import { Work } from '@/lib/types';
import { useState, useEffect } from 'react';

interface DraggableProjectCardProps {
  project: Work;
  style?: React.CSSProperties;
  isDraggable?: boolean;
  size?: 'small' | 'medium';
}

export default function DraggableProjectCard({ 
  project, 
  style, 
  isDraggable = false,
  size = 'medium' 
}: DraggableProjectCardProps) {
  const router = useRouter();
  const [dragStartTime, setDragStartTime] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [gradientId] = useState(`gradient-${Math.random().toString(36).substr(2, 9)}`);

  const handlePointerDown = () => {
    setDragStartTime(Date.now());
    setHasDragged(false);
  };

  const handlePointerMove = () => {
    if (isDraggable && Date.now() - dragStartTime > 100) {
      setHasDragged(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if it was a click without dragging
    if (!hasDragged && !isDraggable) {
      // Check if it's an experiment - they have external URLs
      if (project.type === 'experiment' && 'url' in project && project.url !== '#') {
        window.open(project.url, '_blank');
      } else {
        router.push(`/work/${project.slug}`);
      }
    } else if (isDraggable && !hasDragged) {
      e.stopPropagation();
      // Check if it's an experiment - they have external URLs
      if (project.type === 'experiment' && 'url' in project && project.url !== '#') {
        window.open(project.url, '_blank');
      } else {
        router.push(`/work/${project.slug}`);
      }
    }
  };

  // Size variations
  const sizeClasses = {
    small: 'w-[200px]',
    medium: 'w-[280px]',
    large: 'w-[340px]',
    xlarge: 'w-[380px]'
  };

  // Generate random movement values for gradient animation
  const gradientStyle = {
    '--tx-1': Math.random() - 0.5,
    '--ty-1': Math.random() - 0.5,
    '--tx-2': Math.random() - 0.5,
    '--ty-2': Math.random() - 0.5,
    '--tx-3': Math.random() - 0.5,
    '--ty-3': Math.random() - 0.5,
    '--tx-4': Math.random() - 0.5,
    '--ty-4': Math.random() - 0.5,
  } as React.CSSProperties;

  return (
    <div 
      className={`relative bg-gray-100 transition-all duration-300 ${
        isDraggable ? `${sizeClasses[size]} cursor-grab` : 'w-full cursor-pointer'
      }`}
      style={{
        ...style,
        transform: isHovered && isDraggable ? 'scale(1.02)' : style?.transform || 'scale(1)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] relative">
          {project.thumbnail.mimeType?.includes('video') ? (
            <video
              src={project.thumbnail.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              draggable={false}
            />
          ) : (
            <img
              src={project.thumbnail.url}
              alt={project.thumbnail.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          )}
          
          {/* SVG Animated Gradient Overlay */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={gradientStyle}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <filter id={`${gradientId}-blur`}>
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <filter id={`${gradientId}-grain`}>
                  <feTurbulence baseFrequency="3.5" numOctaves="4" seed="5" />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
                  <feComposite operator="over" in2="SourceGraphic" />
                </filter>
              </defs>
              
              {/* Animated circles for gradient effect */}
              <g filter={`url(#${gradientId}-blur)`}>
                <circle
                  cx="20"
                  cy="30"
                  r="40"
                  fill="#FF6606"
                  opacity="0.8"
                  className="animate-gradient-1"
                />
                <circle
                  cx="80"
                  cy="20"
                  r="35"
                  fill="#F24607"
                  opacity="0.7"
                  className="animate-gradient-2"
                />
                <circle
                  cx="40"
                  cy="70"
                  r="45"
                  fill="#F21B07"
                  opacity="0.8"
                  className="animate-gradient-3"
                />
                <circle
                  cx="70"
                  cy="80"
                  r="30"
                  fill="#F25C5C"
                  opacity="0.7"
                  className="animate-gradient-4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="#F4A10D"
                  opacity="0.6"
                  className="animate-gradient-1"
                />
              </g>
              
              {/* Grain overlay */}
              <rect
                width="100"
                height="100"
                fill="#FF6606"
                filter={`url(#${gradientId}-grain)`}
                opacity="0.2"
              />
            </svg>
          </div>
          
          {/* Title overlay */}
          <div className={`absolute inset-0 flex items-end p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="relative z-10">
              <h3 className="text-white font-medium text-base leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {project.title}
              </h3>
              {'category' in project && project.category && (
                <p className="text-white/90 text-sm leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {project.category}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 