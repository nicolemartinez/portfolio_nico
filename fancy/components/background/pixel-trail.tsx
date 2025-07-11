"use client"

import React, { useCallback, useMemo, useRef, RefObject } from "react"
import { motion, useAnimationControls } from "motion/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef as RefObject<HTMLElement>)
  const trailId = useRef(uuidv4())

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`
      )
      if (pixelElement) {
        const animatePixel = (pixelElement as any).__animatePixel
        if (animatePixel) animatePixel()
      }
    },
    [pixelSize]
  )

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
              row={rowIndex}
              col={colIndex}
              totalRows={rows}
              totalCols={columns}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
  row: number
  col: number
  totalRows: number
  totalCols: number
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className, row, col, totalRows, totalCols }) => {
    const controls = useAnimationControls()

    // Calculate hue based on position - creates a rainbow effect across the grid
    // Using different patterns for more interesting color distribution
    const hue = ((col / totalCols) * 360 + (row / totalRows) * 120) % 360

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        backgroundColor: [`hsl(${hue}, 100%, 50%)`, `hsl(${hue}, 100%, 50%)`],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      })
    }, [hue, fadeDuration, delay, controls])

    // Attach the animatePixel function to the DOM element
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          ;(node as any).__animatePixel = animatePixel
        }
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"
