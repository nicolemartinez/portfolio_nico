'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageTrailProps {
  images: string[];
  className?: string;
  imageClassName?: string;
  fadeOutDuration?: number;
  maxImages?: number;
}

interface TrailImage {
  id: number;
  src: string;
  x: number;
  y: number;
  opacity: number;
}

export function ImageTrail({
  images,
  className,
  imageClassName,
  fadeOutDuration = 1000,
  maxImages = 10,
}: ImageTrailProps) {
  const [trailImages, setTrailImages] = useState<TrailImage[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageIdRef = useRef(0);
  const lastImageTimeRef = useRef(0);
  const currentImageIndexRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const now = Date.now();
      if (now - lastImageTimeRef.current > 100) { // Add new image every 100ms
        lastImageTimeRef.current = now;
        
        const newImage: TrailImage = {
          id: imageIdRef.current++,
          src: images[currentImageIndexRef.current],
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
        };
        
        currentImageIndexRef.current = (currentImageIndexRef.current + 1) % images.length;
        
        setTrailImages(prev => {
          const updated = [...prev, newImage];
          if (updated.length > maxImages) {
            return updated.slice(-maxImages);
          }
          return updated;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [images, maxImages]);

  // Fade out images
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailImages(prev => {
        return prev
          .map(img => ({
            ...img,
            opacity: img.opacity - 0.02,
          }))
          .filter(img => img.opacity > 0);
      });
    }, fadeOutDuration / 50);

    return () => clearInterval(interval);
  }, [fadeOutDuration]);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-40', className)}>
      {trailImages.map(img => (
        <div
          key={img.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: img.x,
            top: img.y,
            opacity: img.opacity,
          }}
        >
          <div className={cn('relative w-48 h-48', imageClassName)}>
            <Image
              src={img.src}
              alt=""
              fill
              sizes="192px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ))}
    </div>
  );
} 