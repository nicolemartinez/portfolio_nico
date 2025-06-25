"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

type DragElementsProps = {
  children: React.ReactNode
  dragElastic?: number | boolean
  dragConstraints?:
    | { top?: number; left?: number; right?: number; bottom?: number }
    | React.RefObject<Element>
  selectedOnTop?: boolean
  className?: string
}

const DragElements: React.FC<DragElementsProps> = ({
  children,
  dragElastic = 0,
  dragConstraints,
  selectedOnTop = true,
  className,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [zIndices, setZIndices] = useState<number[]>([])

  useEffect(() => {
    setZIndices(
      Array.from({ length: React.Children.count(children) }, (_, i) => i)
    )
  }, [children])

  const bringToFront = (index: number) => {
    if (selectedOnTop) {
      setZIndices((prevIndices) => {
        const newIndices = [...prevIndices]
        const currentIndex = newIndices.indexOf(index)
        newIndices.splice(currentIndex, 1)
        newIndices.push(index)
        return newIndices
      })
    }
  }

  return (
    <div ref={constraintsRef} className={`relative w-full h-full ${className || ''}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          drag
          dragElastic={dragElastic}
          dragConstraints={dragConstraints || constraintsRef}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 0, bounceDamping: 0 }}
          style={{
            zIndex: zIndices.indexOf(index),
            width: 'fit-content',
            height: 'fit-content'
          }}
          onDragStart={() => {
            bringToFront(index)
          }}
          whileDrag={{ scale: 1.02 }}
          className="absolute"
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default DragElements 