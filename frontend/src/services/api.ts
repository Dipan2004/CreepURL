import axios, { AxiosError } from 'axios'

function stripTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '')
}

function stripLeadingSlashes(value: string) {
  return value.replace(/^\/+/, '')
}

function normalizeApiBaseUrl(raw: string | undefined) {
  const configured = raw?.trim()
  if (!configured) return '/api'

  const normalized = stripTrailingSlashes(configured)
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`
}

function joinApiUrl(base: string, path: string) {
  const normalizedBase = stripTrailingSlashes(base)
  const normalizedPath = stripLeadingSlashes(path)

  if (!normalizedBase) return `/${normalizedPath}`
  if (normalizedBase.startsWith('/')) return `${normalizedBase}/${normalizedPath}`

  return `${normalizedBase}/${normalizedPath}`
}

function getPublicWorkerOrigin(apiBaseUrl: string) {
  if (apiBaseUrl.startsWith('/')) {
    if (typeof window === 'undefined') return ''
    return window.location.origin
  }

  try {
    return new URL(apiBaseUrl).origin
  } catch {
    return ''
  }
}

function normalizeShortUrl(url: string, slug: string, publicOrigin: string) {
  if (!publicOrigin) return url
  return `${stripTrailingSlashes(publicOrigin)}/${encodeURIComponent(slug)}`
}

function normalizeTransformResponse(data: TransformResponse, publicOrigin: string): TransformResponse {
  return {
    ...data,
    links: data.links.map((link) => {
      const canonical = normalizeShortUrl(link.full_short_url, link.slug, publicOrigin)
      return {
        ...link,
        full_short_url: canonical,
        display_url: canonical,
      }
    }),
  }
}

function normalizeStatsResponse(data: StatsResponse, publicOrigin: string): StatsResponse {
  return {
    ...data,
    full_short_url: normalizeShortUrl(data.full_short_url, data.slug, publicOrigin),
  }
}

function getAuthHeader(secret: string | undefined) {
  const trimmed = secret?.trim()
  return trimmed ? { Authorization: `Bearer ${trimmed}` } : {}
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = (error as AxiosError<{ message?: string }>).response?.data?.message
    if (responseMessage) return responseMessage
    return error.message
  }

  return error instanceof Error ? error.message : 'Something went wrong. The packet was lost.'
}

const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
const publicWorkerOrigin = getPublicWorkerOrigin(apiBaseUrl)
const transformPath = 'transform'
const statsPathPrefix = 'stats'

console.debug('[api] final base', apiBaseUrl)
console.debug('[api] final transform url', joinApiUrl(apiBaseUrl, transformPath))
console.debug('[api] final stats url template', joinApiUrl(apiBaseUrl, `${statsPathPrefix}/:slug`))

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(import.meta.env.VITE_CREATION_SECRET),
  },
})

export interface TransformRequest {
  url: string
  destruction_level: number
}

export interface TrustMetrics {
  trust_stability: string
  packet_integrity: string
  machine_confidence: string
  human_readability: string
}

export interface ShortLinkResult {
  slug: string
  full_short_url: string
  display_url: string
}

export interface TransformResponse {
  links: ShortLinkResult[]
  metrics: TrustMetrics
}

export interface StatsResponse {
  slug: string
  original_url: string
  full_short_url: string
  click_count: number
  created_at: string
  last_clicked_at: string | null
}

export const transformURL = async (req: TransformRequest): Promise<TransformResponse> => {
  const endpoint = transformPath
  console.debug('[api] request transform', joinApiUrl(apiBaseUrl, endpoint))
  const { data } = await api.post<TransformResponse>(endpoint, req)
  return normalizeTransformResponse(data, publicWorkerOrigin)
}

export const fetchStats = async (slug: string): Promise<StatsResponse> => {
  const endpoint = `${statsPathPrefix}/${encodeURIComponent(slug)}`
  console.debug('[api] request stats', joinApiUrl(apiBaseUrl, endpoint))
  const { data } = await api.get<StatsResponse>(endpoint)
  return normalizeStatsResponse(data, publicWorkerOrigin)
}
