import { useState } from 'react'
import { transformURL, TransformResponse } from '@/services/api'

export type GenerationState = 'idle' | 'loading' | 'success' | 'error'

export function useTransform() {
  const [state, setState] = useState<GenerationState>('idle')
  const [result, setResult] = useState<TransformResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const transform = async (url: string, destructionLevel: number) => {
    setState('loading')
    setError(null)

    try {
      const data = await transformURL({ url, destruction_level: destructionLevel })
      setResult(data)
      setState('success')
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. The packet was lost.'
      setError(message)
      setState('error')
    }
  }

  const reset = () => {
    setState('idle')
    setResult(null)
    setError(null)
  }

  return { state, result, error, transform, reset }
}
