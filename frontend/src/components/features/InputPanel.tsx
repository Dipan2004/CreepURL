import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { DestructionSlider } from './DestructionSlider'
import { isValidURL } from '@/lib/utils'

interface InputPanelProps {
  onSubmit: (url: string, level: number) => void
  isLoading: boolean
}

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [url, setUrl] = useState('')
  const [level, setLevel] = useState(3)
  const [touched, setTouched] = useState(false)

  const isValid = isValidURL(url) || url.trim().length === 0
  const showError = touched && url.trim().length > 0 && !isValidURL(url)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const cleaned = url.trim()
    if (!cleaned) return
    const withScheme = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`
    if (!isValidURL(withScheme)) return
    onSubmit(withScheme, level)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="brutal-panel paper-stack relative w-full"
      style={{ background: '#efe5d1' }}
    >
      <div className="border-b-[3px] border-black bg-black px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#f5f0e6]">
        Input bay / corruption console
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="grid gap-2">
          <label className="mono-label">Feed a clean URL</label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={e => {
                setUrl(e.target.value)
                setTouched(false)
              }}
              onBlur={() => setTouched(true)}
              placeholder="https://company.com/looks-legit"
              className="input-field pr-12"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl('')
                  setTouched(false)
                }}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-2 border-black bg-[#ffd84d] font-black"
              >
                X
              </button>
            )}
          </div>
          {showError && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mono-label text-[#cf3d1f]">
              invalid input / scheme missing / format rejected
            </motion.p>
          )}
        </div>

        <div className="divider" />

        <DestructionSlider value={level} onChange={setLevel} />

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="brutal-panel-alt p-3 text-sm" style={{ background: '#ffd84d' }}>
            <p className="mono-label mb-1">Machine note</p>
            <p>Higher levels produce weirder slugs, lower trust, and more visible digital rot.</p>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !url.trim() || !isValid}
            whileHover={!isLoading ? { y: -1 } : {}}
            whileTap={!isLoading ? { y: 0 } : {}}
            className="btn-primary min-w-[220px]"
          >
            {isLoading ? 'Corrupting link...' : 'Destroy trust'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
