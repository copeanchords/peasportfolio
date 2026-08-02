import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { ToolCard } from '../components/ToolCard'

const statChips = [
  { n: '4', l: 'Tools shipped' },
  { n: '1', l: 'Dev' },
  { n: '∞', l: 'Late nights' },
  { n: '0', l: 'Regrets' },
]

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function Lab() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <section className="relative isolate flex min-h-svh flex-col items-center justify-center px-5 pt-8 pb-16 text-center">
        <motion.div
          className="absolute -top-44 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-green opacity-55 blur-[90px]"
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 -bottom-40 -z-10 h-[420px] w-[420px] rounded-full bg-[#F72585] opacity-55 blur-[90px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-[40%] left-[60%] -z-10 h-[360px] w-[360px] rounded-full bg-[#7B2FF7] opacity-55 blur-[90px]"
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        <motion.div variants={heroStagger} initial="hidden" animate="show">
          <motion.span
            variants={heroItem}
            className="mb-7 inline-block rounded-full border border-green/40 bg-green/15 px-4.5 py-2 text-[13px] font-bold tracking-wider text-green uppercase"
          >
            2026 Wrapped
          </motion.span>

          <motion.h1
            variants={heroItem}
            className="mx-auto max-w-[16ch] font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.98] font-bold"
          >
            Here&apos;s what got <span className="text-green">vibecoded</span> this year
            👀
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mx-auto mt-6 max-w-[46ch] text-[clamp(1.05rem,2.4vw,1.35rem)] font-medium text-ink-dim"
          >
            No roadmap, no investors, no sleep. Just the lab where the side
            quests happen — pick a tool and go.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="mt-10 flex flex-wrap justify-center gap-3.5"
          >
            {statChips.map((s) => (
              <div
                key={s.l}
                className="min-w-[120px] rounded-2xl border border-white/8 bg-bg-soft px-5 py-3.5"
              >
                <div className="font-display text-2xl font-bold">{s.n}</div>
                <div className="mt-0.5 text-xs tracking-wide text-ink-dim uppercase">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.a
          href="#tools"
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-wider text-ink-dim uppercase no-underline"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll ↓
        </motion.a>
      </section>

      <section id="tools" className="mx-auto max-w-[1180px] px-5 pt-10 pb-28">
        <div className="mb-2 text-center text-[13px] font-semibold tracking-wider text-ink-dim uppercase">
          The lineup
        </div>
        <h2 className="mb-12 text-center font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold">
          Pick your tool
        </h2>

        <motion.div
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
          variants={gridStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-white/8 px-5 pt-10 pb-14 text-center">
        <p className="mb-3.5 text-sm text-ink-dim">
          Built on a whim. Hosted out of spite for empty portfolio sections.
        </p>
        <Link to="/" className="text-sm font-bold text-green no-underline hover:underline">
          ← Back to portfolio
        </Link>
      </footer>
    </div>
  )
}
