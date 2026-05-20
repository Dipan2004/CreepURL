import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
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
  const { data } = await api.post<TransformResponse>('/transform', req)
  return data
}

export const fetchStats = async (slug: string): Promise<StatsResponse> => {
  const { data } = await api.get<StatsResponse>(`/stats/${slug}`)
  return data
}
