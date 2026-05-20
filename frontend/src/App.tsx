import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BackgroundEffects } from '@/components/features/BackgroundEffects'
import { GenerationStatusCard } from '@/components/features/GenerationStatusCard'
import { Hero } from '@/components/features/Hero'
import { InputPanel } from '@/components/features/InputPanel'
import { ResultsSection } from '@/components/features/ResultsSection'
import { ErrorState } from '@/components/features/ErrorState'
import { useTransform } from '@/hooks/useTransform'

export default function App() {
  const { state, result, error, transform, reset } = useTransform()
  const [lastUrl, setLastUrl] = useState('')
  const [lastLevel, setLastLevel] = useState(3)

  const handleSubmit = useCallback((url: string, level: number) => {
    setLastUrl(url)
    setLastLevel(level)
    transform(url, level)
  }, [transform])

  const handleRegenerate = useCallback(() => {
    if (lastUrl) transform(lastUrl, lastLevel)
  }, [lastUrl, lastLevel, transform])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundEffects />
      <Navbar />
      <GenerationStatusCard visible={state === 'success' && !!result} />

      <main className="relative z-10 pb-16 pt-24">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <Hero />
            <InputPanel
              onSubmit={handleSubmit}
              isLoading={state === 'loading'}
            />
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {(state === 'success' || state === 'loading') && result && (
              <ResultsSection
                key="results"
                result={result}
                onRegenerate={handleRegenerate}
                isLoading={state === 'loading'}
              />
            )}
            {state === 'error' && error && (
              <ErrorState
                key="error"
                message={error}
                onRetry={reset}
              />
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  )
}
