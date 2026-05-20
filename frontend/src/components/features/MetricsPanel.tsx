import { motion } from 'framer-motion'
import { TrustMetrics } from '@/services/api'

interface MetricsPanelProps {
  metrics: TrustMetrics
}

const metricConfig = [
  { key: 'trust_stability', label: 'Trust Stability', tone: '#e54b2b' },
  { key: 'packet_integrity', label: 'Packet Integrity', tone: '#ff9f1c' },
  { key: 'machine_confidence', label: 'Machine Confidence', tone: '#ffd84d' },
  { key: 'human_readability', label: 'Human Readability', tone: '#78c26d' },
] as const

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const entries: Array<{ config: typeof metricConfig[number]; value: string }> = metricConfig.map(config => ({
    config,
    value: metrics[config.key],
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="brutal-panel p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="kicker">Machine diagnostics</p>
        <span className="ink-stamp">Critical</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(({ config, value }, i) => (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="border-[3px] border-black p-3"
            style={{ background: config.tone }}
          >
            <p className="mono-label mb-2 text-black">{config.label}</p>
            <p className="font-mono text-sm font-semibold uppercase text-black">{value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
