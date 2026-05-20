import { motion } from 'framer-motion'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-3xl brutal-panel p-6"
      style={{ background: '#e54b2b', color: '#111111' }}
    >
      <p className="kicker mb-3">Transmission failure</p>
      <h2 className="text-4xl sm:text-5xl">Packet lost.</h2>
      <p className="mt-4 max-w-2xl font-mono text-sm uppercase">{message}</p>

      <motion.button
        onClick={onRetry}
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className="btn-secondary mt-6"
      >
        Retry system
      </motion.button>
    </motion.div>
  )
}
