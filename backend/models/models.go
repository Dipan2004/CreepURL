package models

import "time"

// TransformRequest — POST /api/transform body
type TransformRequest struct {
	URL              string `json:"url"`
	DestructionLevel int    `json:"destruction_level"`
}

// ShortLink — one persisted row in short_links table
// ID is int64 — SQLite AUTOINCREMENT
type ShortLink struct {
	ID               int64      `json:"id"`
	OriginalURL      string     `json:"original_url"`
	CreepySlug       string     `json:"creepy_slug"`
	FullShortURL     string     `json:"full_short_url"`
	DestructionLevel int        `json:"destruction_level"`
	ClickCount       int64      `json:"click_count"`
	CreatedAt        time.Time  `json:"created_at"`
	LastClickedAt    *time.Time `json:"last_clicked_at"`
}

// ShortLinkResult — one variant returned to frontend
type ShortLinkResult struct {
	Slug         string `json:"slug"`
	FullShortURL string `json:"full_short_url"`
	DisplayURL   string `json:"display_url"`
}

// TransformResponse — POST /api/transform response
type TransformResponse struct {
	Links   []ShortLinkResult `json:"links"`
	Metrics TrustMetrics      `json:"metrics"`
}

// TrustMetrics — fake diagnostic panel
type TrustMetrics struct {
	TrustStability    string `json:"trust_stability"`
	PacketIntegrity   string `json:"packet_integrity"`
	MachineConfidence string `json:"machine_confidence"`
	HumanReadability  string `json:"human_readability"`
}

// StatsResponse — GET /api/stats/:slug
type StatsResponse struct {
	Slug          string     `json:"slug"`
	OriginalURL   string     `json:"original_url"`
	FullShortURL  string     `json:"full_short_url"`
	ClickCount    int64      `json:"click_count"`
	CreatedAt     time.Time  `json:"created_at"`
	LastClickedAt *time.Time `json:"last_clicked_at"`
}

// HealthResponse — GET /health
type HealthResponse struct {
	Status  string `json:"status"`
	Version string `json:"version"`
}

// ErrorResponse — any error
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}