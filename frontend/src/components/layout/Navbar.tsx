import { motion } from 'framer-motion'

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-50 px-4 pt-4 sm:px-6"
    >
      <div className="mx-auto max-w-7xl brutal-panel flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-[3px] border-black bg-[#e54b2b] text-xl font-black text-[#f5f0e6]">
            C
          </div>
          <div>
            <p className="text-xl font-black uppercase leading-none">CreepURL</p>
            <p className="mono-label mt-1 text-[#423c35]">Brutalist corruption terminal</p>
          </div>
        </div>

        <div className="hidden md:block">
          <span className="ink-stamp">Trust destruction v1.0</span>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary px-4 py-3 text-xs"
        >
          Source code
        </a>
      </div>
    </motion.nav>
  )
}
