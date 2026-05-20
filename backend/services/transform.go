package services

import (
	"fmt"
	"math/rand"
	"net/url"
	"strings"
	"time"

	"github.com/creepurl/backend/database"
	"github.com/creepurl/backend/models"
)

type TransformService struct {
	shortener *ShortenerService
	rng       *rand.Rand
}

func NewTransformService(db *database.DB, baseURL string) *TransformService {
	return &TransformService{
		shortener: NewShortenerService(db, baseURL),
		rng:       rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// Transform accepts plain args (no models.TransformRequest) so handlers need not import models
func (s *TransformService) Transform(rawURL string, destructionLevel int) (*models.TransformResponse, error) {
	if err := validateURL(rawURL); err != nil {
		return nil, err
	}

	level := clampLevel(destructionLevel)
	count := variantCount(level)

	links, err := s.shortener.Create(rawURL, level, count)
	if err != nil {
		return nil, fmt.Errorf("generation failed: %w", err)
	}

	return &models.TransformResponse{
		Links:   links,
		Metrics: s.generateMetrics(level),
	}, nil
}

func (s *TransformService) generateMetrics(level int) models.TrustMetrics {
	trustPct := max(0, 100-level*18-s.rng.Intn(12))

	packetStates    := []string{"Lost", "Fragmented", "Corrupted", "Void", "Null", "Decaying"}
	machineStates   := []string{"Corrupted", "Unstable", "Collapsed", "Void", "Failing", "Critical"}
	readabilityStates := []string{"Declining", "Critical", "Terminal", "Lost", "Gone", "Deleted"}

	return models.TrustMetrics{
		TrustStability:    fmt.Sprintf("%d%%", trustPct),
		PacketIntegrity:   packetStates[min(level-1, len(packetStates)-1)],
		MachineConfidence: machineStates[min(level-1, len(machineStates)-1)],
		HumanReadability:  readabilityStates[min(level-1, len(readabilityStates)-1)],
	}
}

func validateURL(rawURL string) error {
	if strings.TrimSpace(rawURL) == "" {
		return fmt.Errorf("url is required")
	}
	if !strings.HasPrefix(rawURL, "http://") && !strings.HasPrefix(rawURL, "https://") {
		rawURL = "https://" + rawURL
	}
	parsed, err := url.Parse(rawURL)
	if err != nil || parsed.Host == "" {
		return fmt.Errorf("invalid URL format")
	}
	return nil
}

func clampLevel(level int) int {
	if level < 1 { return 1 }
	if level > 5 { return 5 }
	return level
}

func variantCount(level int) int {
	switch level {
	case 1: return 3
	case 2: return 4
	case 3: return 5
	case 4: return 6
	case 5: return 7
	}
	return 4
}

func max(a, b int) int {
	if a > b { return a }
	return b
}

func min(a, b int) int {
	if a < b { return a }
	return b
}