import { motion, AnimatePresence } from 'framer-motion'

interface GenerationStatusCardProps {
  visible: boolean
}

const cardAnimation = {
  hidden: {
    x: -220,
    rotate: -6,
    opacity: 0,
  },
  visible: {
    x: [ -220, 20, -10, 6, 0, -3, 0 ],
    rotate: [ -6, -2, -4, -2.5, -3.5, -3, -3 ],
    opacity: 1,
    transition: {
      duration: 0.72,
      times: [0, 0.5, 0.68, 0.8, 0.9, 0.96, 1],
      ease: 'easeOut',
    },
  },
  exit: {
    x: -220,
    rotate: -8,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: 'easeIn',
    },
  },
}

export function GenerationStatusCard({ visible }: GenerationStatusCardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          variants={cardAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-none fixed bottom-6 left-4 z-40 w-[min(18rem,calc(100vw-2rem))] sm:bottom-8 sm:left-6"
        >
          <div className="border-[4px] border-[#111111] bg-[#f6dd74] px-4 py-4 shadow-[10px_10px_0_#111111]">
            <div className="mb-3 inline-flex border-[3px] border-[#111111] bg-[#fff7dc] px-2 py-1 font-['IBM_Plex_Mono'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
              Status note
            </div>

            <p className="font-['IBM_Plex_Mono'] text-[1.05rem] font-semibold uppercase leading-tight text-[#111111]">
              Let&apos;s break some trust.
            </p>

            <p className="mt-3 font-['IBM_Plex_Mono'] text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#2b2b2b]">
              Scroll down ↓
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
