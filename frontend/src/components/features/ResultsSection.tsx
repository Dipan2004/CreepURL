import { motion, AnimatePresence } from 'framer-motion'
import { URLCard } from './URLCard'
import { MetricsPanel } from './MetricsPanel'
import { TransformResponse } from '@/services/api'

interface ResultsSectionProps {
  result: TransformResponse
  onRegenerate: () => void
  isLoading: boolean
}

export function ResultsSection({ result, onRegenerate, isLoading }: ResultsSectionProps) {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35 }}
        className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="lg:pr-6">
          <div className="brutal-panel p-5" style={{ background: '#111111', color: '#f5f0e6' }}>
            <p className="kicker mb-3">Output stack</p>
            <h2 className="text-4xl sm:text-5xl">Freshly corrupted links.</h2>
            <p className="mt-4 text-sm uppercase tracking-wide text-[#d8cfbd]">
              {result.links.length} hostile redirects generated and ready for inspection.
            </p>

            <motion.button
              onClick={onRegenerate}
              disabled={isLoading}
              whileHover={!isLoading ? { y: -1 } : {}}
              whileTap={!isLoading ? { y: 0 } : {}}
              className="btn-secondary mt-6"
            >
              {isLoading ? 'Rebuilding...' : 'Regenerate batch'}
            </motion.button>
          </div>

          <div className="mt-6 lg:ml-8">
            <MetricsPanel metrics={result.metrics} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:mt-10">
          {result.links.map((link, i) => (
            <URLCard key={link.slug} link={link} index={i} />
          ))}

          <p className="mono-label px-1 text-[#423c35]">
            live redirects / click opens target / copy button writes the short URL to clipboard
          </p>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
