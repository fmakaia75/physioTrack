"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedBackgroundProps {
  children: ReactNode
  className?: string
  pathOpacity?: number
  pathCount?: number
  pathColor?: string
  backgroundColor?: string
}

function FloatingPaths({
  position,
  pathCount = 36,
  pathOpacity = 0.03,
  pathColor = "currentColor",
}: {
  position: number
  pathCount?: number
  pathOpacity?: number
  pathColor?: string
}) {
  const paths = Array.from({ length: pathCount }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={pathColor}
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * pathOpacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function AnimatedBackground({
  children,
  className = "",
  pathOpacity = 0.03,
  pathCount = 36,
  pathColor = "currentColor",
  backgroundColor = "bg-white dark:bg-neutral-950",
}: AnimatedBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${backgroundColor} ${className}`}>
      <div className="absolute inset-0">
        <FloatingPaths position={1} pathCount={pathCount} pathOpacity={pathOpacity} pathColor={pathColor} />
        <FloatingPaths position={-1} pathCount={pathCount} pathOpacity={pathOpacity} pathColor={pathColor} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

