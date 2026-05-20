import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Hero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 pb-6"
    >
      <motion.div variants={item} className="mb-5 flex flex-wrap items-center gap-3">
        <span className="badge">URL Corruption Engine</span>
        <span className="ink-stamp">Trust Failure Since 2026</span>
      </motion.div>

      <motion.h1
        variants={item}
        className="max-w-4xl"
        style={{ fontSize: 'clamp(3.25rem, 10vw, 7rem)', marginBottom: '1rem' }}
      >
        A brutalist internet machine for turning clean URLs into suspicious artifacts.
      </motion.h1>

      <motion.p
        variants={item}
        className="max-w-2xl text-base sm:text-lg"
        style={{ color: '#2f2a25' }}
      >
        Thick borders. Flat surfaces. Zero startup polish. Feed it a normal link and it kicks back a stack of loud, hostile, click-me-if-you-dare outputs.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-8 grid gap-4 md:max-w-3xl md:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="brutal-panel paper-stack p-5">
          <p className="kicker mb-3">Operational brief</p>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="mono-label mb-1">Structure</p>
              <p>Asymmetric sections, exposed rails, poster rhythm.</p>
            </div>
            <div>
              <p className="mono-label mb-1">Surface</p>
              <p>Printed cream, hard black, industrial red, no blur.</p>
            </div>
            <div>
              <p className="mono-label mb-1">Behavior</p>
              <p>Buttons press like blocks. Cards stack like machine parts.</p>
            </div>
          </div>
        </div>

        <div
          className="brutal-panel-alt p-5"
          style={{ background: '#ff9f1c', transform: 'translateY(22px)' }}
        >
          <p className="kicker mb-3">Output mood</p>
          <p className="text-xl font-black uppercase leading-tight">
            Computational
            <br />
            sludge
          </p>
          <p className="mt-3 text-sm uppercase">Readable enough to click. Wrong enough to regret.</p>
        </div>
      </motion.div>
    </motion.section>
  )
}
