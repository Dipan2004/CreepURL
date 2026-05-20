-- CreepURL SQLite Migration
-- This runs automatically on startup via database.Migrate()
-- You do NOT need to run this manually.

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

CREATE INDEX IF NOT EXISTS idx_short_links_original_url
    ON short_links(original_url);