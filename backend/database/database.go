package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

type DB struct {
	*sql.DB
}

// Connect opens (or creates) the SQLite file at dbPath.
// No external server required — file is created automatically.
func Connect(dbPath string) (*DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite: %w", err)
	}

	// SQLite tuning: WAL mode for concurrent reads, foreign keys on
	pragmas := []string{
		"PRAGMA journal_mode=WAL;",
		"PRAGMA foreign_keys=ON;",
		"PRAGMA busy_timeout=5000;",
	}
	for _, p := range pragmas {
		if _, err := db.Exec(p); err != nil {
			return nil, fmt.Errorf("pragma failed (%s): %w", p, err)
		}
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping sqlite: %w", err)
	}

	log.Printf("SQLite connected: %s", dbPath)
	return &DB{db}, nil
}

// Migrate creates tables if they don't exist. Safe to call on every startup.
func (db *DB) Migrate() error {
	query := `
		CREATE TABLE IF NOT EXISTS short_links (
			id                INTEGER  PRIMARY KEY AUTOINCREMENT,
			original_url      TEXT     NOT NULL,
			creepy_slug       TEXT     NOT NULL UNIQUE,
			full_short_url    TEXT     NOT NULL,
			destruction_level INTEGER  NOT NULL DEFAULT 3
			                           CHECK (destruction_level BETWEEN 1 AND 5),
			click_count       INTEGER  NOT NULL DEFAULT 0,
			created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_clicked_at   DATETIME
		);

		CREATE UNIQUE INDEX IF NOT EXISTS idx_short_links_slug
			ON short_links(creepy_slug);

		CREATE INDEX IF NOT EXISTS idx_short_links_created_at
			ON short_links(created_at DESC);
	`

	if _, err := db.Exec(query); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("SQLite migration complete")
	return nil
}