import { motion } from 'framer-motion'

interface SliderProps {
  value: number
  onChange: (value: number) => void
}

const levels = [
  { level: 1, label: 'Suspicious', color: '#78c26d' },
  { level: 2, label: 'Corrupted', color: '#ffd84d' },
  { level: 3, label: 'Hostile', color: '#ff9f1c' },
  { level: 4, label: 'Unstable', color: '#f06a3a' },
  { level: 5, label: 'Collapse', color: '#e54b2b' },
]

export function DestructionSlider({ value, onChange }: SliderProps) {
  const current = levels[value - 1]
  const progress = ((value - 1) / 4) * 100

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono-label mb-1">Destruction level</p>
          <p className="text-sm uppercase">Choose how broken the machine should sound.</p>
        </div>
        <span className="border-[3px] border-black px-3 py-2 font-mono text-xs font-semibold uppercase" style={{ background: current.color }}>
          {current.label}
        </span>
      </div>

      <div className="border-[3px] border-black bg-white p-3">
        <div className="relative h-5 border-[3px] border-black bg-[#d8cfbd]">
          <motion.div
            className="absolute left-0 top-0 h-full border-r-[3px] border-black"
            style={{ background: current.color }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
          <input
            type="range"
            min={1}
            max={5}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <motion.div
            className="absolute top-1/2 h-7 w-7 -translate-y-1/2 border-[3px] border-black"
            style={{ left: `calc(${progress}% - 14px)`, background: '#111111' }}
            animate={{ left: `calc(${progress}% - 14px)` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {levels.map(level => (
            <button
              key={level.level}
              type="button"
              onClick={() => onChange(level.level)}
              className="border-[3px] border-black px-2 py-2 text-[0.68rem] font-mono font-semibold uppercase transition-transform hover:-translate-y-[1px]"
              style={{ background: value === level.level ? level.color : '#f5f0e6' }}
            >
              {level.level}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
