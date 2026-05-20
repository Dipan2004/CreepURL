import { useState } from 'react'
import { motion } from 'framer-motion'
import { copyToClipboard } from '@/lib/utils'
import { ShortLinkResult } from '@/services/api'

interface URLCardProps {
  link: ShortLinkResult
  index: number
}

export function URLCard({ link, index }: URLCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(link.full_short_url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="neo-card overflow-hidden"
      style={{ background: index % 2 === 0 ? '#f5f0e6' : '#efe5d1' }}
    >
      <div className="grid gap-4 border-b-[3px] border-black px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="flex h-10 w-10 items-center justify-center border-[3px] border-black bg-[#e54b2b] text-lg font-black text-[#f5f0e6]">
          {index + 1}
        </div>

        <div>
          <p className="mono-label mb-1">Corrupted output</p>
          <a
            href={link.full_short_url}
            target="_blank"
            rel="noreferrer"
            className="mono-url font-semibold underline decoration-[3px] underline-offset-4"
            title="Redirects to original URL"
          >
            {link.full_short_url}
          </a>
        </div>

        <button onClick={handleCopy} className="btn-secondary px-4 py-3 text-xs">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="text-sm">
          <p className="mono-label mb-1">Slug signature</p>
          <p className="font-mono break-all text-[0.83rem]">{link.slug}</p>
        </div>

        <div className="border-[3px] border-black bg-[#ffd84d] px-3 py-2 text-right">
          <p className="mono-label">Status</p>
          <p className="text-sm font-bold uppercase">Click at own risk</p>
        </div>
      </div>
    </motion.div>
  )
}
