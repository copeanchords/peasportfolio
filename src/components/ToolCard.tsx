import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Tool } from '../data/tools'

const MotionLink = motion.create(Link)

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <MotionLink
      to={`/tools/${tool.slug}`}
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.015,
        rotate: tool.tilt,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      style={{ background: tool.gradient }}
      className="group relative isolate flex min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl p-8 text-white no-underline shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.18), transparent 55%)',
        }}
      />
      <div className="text-sm font-bold tracking-wide opacity-75">{tool.rank}</div>
      <div>
        <div className="mb-2 text-4xl">{tool.icon}</div>
        <h3 className="mb-2.5 font-display text-2xl leading-tight font-bold">
          {tool.title}
        </h3>
        <p className="max-w-[34ch] text-sm leading-snug font-medium opacity-90">
          {tool.description}
        </p>
        <p className="mt-2.5 max-w-[34ch] text-xs leading-snug font-medium italic opacity-70">
          {tool.origin}
        </p>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
        Open tool
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
          →
        </span>
      </span>
    </MotionLink>
  )
}
