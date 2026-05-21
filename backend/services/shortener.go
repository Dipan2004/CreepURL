package services

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/creepurl/backend/database"
	"github.com/creepurl/backend/generators"
	"github.com/creepurl/backend/models"
)

const maxCollisionRetries = 10

type ShortenerService struct {
	db         *database.DB
	slugEngine *generators.SlugEngine
}

func NewShortenerService(db *database.DB, baseURL string) *ShortenerService {
	return &ShortenerService{
		db:         db,
		slugEngine: generators.NewSlugEngine(),
	}
}

// Create generates N unique slugs, persists each, returns ShortLinkResults.
func (s *ShortenerService) Create(originalURL string, level int, count int, baseURL string) ([]models.ShortLinkResult, error) {
	results := make([]models.ShortLinkResult, 0, count)

	for i := 0; i < count; i++ {
		link, err := s.createOne(originalURL, level, baseURL)
		if err != nil {
			log.Printf("slug creation attempt %d failed: %v", i, err)
			continue
		}
		results = append(results, models.ShortLinkResult{
			Slug:         link.CreepySlug,
			FullShortURL: link.FullShortURL,
			DisplayURL:   link.FullShortURL,
		})
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("failed to generate any slugs")
	}

	return results, nil
}

// createOne generates a unique slug with collision retry, then persists it.
func (s *ShortenerService) createOne(originalURL string, level int, baseURL string) (*models.ShortLink, error) {
	var slug string
	var err error

	for attempt := 0; attempt < maxCollisionRetries; attempt++ {
		slug, err = s.slugEngine.GenerateSlug(originalURL, level)
		if err != nil {
			return nil, fmt.Errorf("slug generation failed: %w", err)
		}

		exists, checkErr := s.slugExists(slug)
		if checkErr != nil {
			return nil, checkErr
		}
		if !exists {
			break
		}
		// collision — append attempt index and retry
		slug = fmt.Sprintf("%s-%d", slug, attempt)
	}

	fullShortURL := fmt.Sprintf("%s/%s", baseURL, slug)

	link := &models.ShortLink{
		OriginalURL:      originalURL,
		CreepySlug:       slug,
		FullShortURL:     fullShortURL,
		DestructionLevel: level,
	}

	if err := s.persist(link); err != nil {
		return nil, err
	}

	return link, nil
}

// Lookup finds a ShortLink by slug, increments click_count, returns the row.
// SQLite has no RETURNING on UPDATE, so we do UPDATE then SELECT.
func (s *ShortenerService) Lookup(slug string) (*models.ShortLink, error) {
	updateQuery := `
		UPDATE short_links
		SET    click_count     = click_count + 1,
		       last_clicked_at = CURRENT_TIMESTAMP
		WHERE  creepy_slug = ?
	`
	res, err := s.db.Exec(updateQuery, slug)
	if err != nil {
		return nil, fmt.Errorf("click increment failed: %w", err)
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		return nil, nil // slug not found — caller sends 404
	}

	return s.fetchBySlug(slug)
}

// Stats returns a ShortLink without incrementing click_count.
func (s *ShortenerService) Stats(slug string) (*models.ShortLink, error) {
	return s.fetchBySlug(slug)
}

// persist inserts a new short_link row.
// SQLite has no RETURNING, so we use LastInsertId + a follow-up SELECT for created_at.
func (s *ShortenerService) persist(link *models.ShortLink) error {
	query := `
		INSERT INTO short_links (original_url, creepy_slug, full_short_url, destruction_level)
		VALUES (?, ?, ?, ?)
	`

	res, err := s.db.Exec(query, link.OriginalURL, link.CreepySlug, link.FullShortURL, link.DestructionLevel)
	if err != nil {
		return fmt.Errorf("persist failed: %w", err)
	}

	id, err := res.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}

	link.ID = id
	link.CreatedAt = time.Now()
	return nil
}

func (s *ShortenerService) slugExists(slug string) (bool, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(1) FROM short_links WHERE creepy_slug = ?`, slug).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("slug existence check failed: %w", err)
	}
	return count > 0, nil
}

// fetchBySlug runs a SELECT and scans into a ShortLink.
func (s *ShortenerService) fetchBySlug(slug string) (*models.ShortLink, error) {
	query := `
		SELECT id, original_url, creepy_slug, full_short_url,
		       destruction_level, click_count, created_at, last_clicked_at
		FROM   short_links
		WHERE  creepy_slug = ?
	`

	row := s.db.QueryRow(query, slug)
	link, err := scanShortLink(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("fetch failed: %w", err)
	}

	return link, nil
}

func scanShortLink(row *sql.Row) (*models.ShortLink, error) {
	link := &models.ShortLink{}
	err := row.Scan(
		&link.ID,
		&link.OriginalURL,
		&link.CreepySlug,
		&link.FullShortURL,
		&link.DestructionLevel,
		&link.ClickCount,
		&link.CreatedAt,
		&link.LastClickedAt,
	)
	if err != nil {
		return nil, err
	}
	return link, nil
}
