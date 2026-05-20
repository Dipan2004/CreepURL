import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className="relative z-10 px-4 pb-8 pt-12 sm:px-6"
    >
      <div className="mx-auto max-w-7xl grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="brutal-panel p-5">
          <p className="kicker mb-3">Afterword</p>
          <p className="max-w-3xl text-sm sm:text-base">
            This interface is intentionally loud: cream paper, hard black lines, offset shadows, exposed labels, and a layout that refuses to behave like a polite SaaS landing page.
          </p>
        </div>

        <div className="brutal-panel-alt p-5" style={{ background: '#111111', color: '#f5f0e6' }}>
          <p className="mono-label mb-2 text-[#d8cfbd]">Legal fiction</p>
          <p className="font-mono text-xs uppercase">Generated links are fictional outputs for satirical demo use.</p>
        </div>
      </div>
    </motion.footer>
  )
}
