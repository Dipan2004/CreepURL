# CreepURL

> **"Destroy trust beautifully."**

A full-stack URL shortener that transforms normal URLs into computationally cursed, infrastructure-style slugs. Built with Go + SQLite (zero external dependencies) and React + Framer Motion.

All generated URLs are **real working redirects** — click one and it sends you back to the original URL.

---

## Instant Start (No database setup required)

```bash
# Clone
git clone https://github.com/yourname/creepurl.git
cd creepurl

# Backend — SQLite file auto-created on first run
cd backend
cp .env.example .env
go mod tidy
go run main.go

# Frontend — open a new terminal
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Done.

The backend creates `backend/creepurl.db` automatically on first startup. No Postgres. No pgAdmin. No Docker. No setup.

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Vite | Build tooling |
| Axios | HTTP client |

### Backend
| Tech | Purpose |
|---|---|
| Go 1.21 | Server language |
| Fiber v2 | HTTP framework |
| SQLite (modernc.org/sqlite) | Embedded database — zero install |
| godotenv | Env config |

---

## Project Structure

```
creepurl/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── features/
│   │   │       ├── BackgroundEffects.tsx
│   │   │       ├── Hero.tsx
│   │   │       ├── InputPanel.tsx
│   │   │       ├── DestructionSlider.tsx
│   │   │       ├── URLCard.tsx
│   │   │       ├── ResultsSection.tsx
│   │   │       ├── MetricsPanel.tsx
│   │   │       └── ErrorState.tsx
│   │   ├── hooks/
│   │   │   └── useTransform.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── backend/
    ├── config/
    │   └── config.go          ← DB_PATH env var
    ├── database/
    │   ├── database.go        ← SQLite connect + migrate
    │   └── migrations.sql     ← Reference schema (auto-runs on startup)
    ├── generators/
    │   ├── corruption.go      ← Display URL generator
    │   └── slug.go            ← URL-safe slug generator
    ├── handlers/
    │   ├── transform.go       ← POST /api/transform
    │   └── redirect.go        ← GET /:slug + GET /api/stats/:slug
    ├── middleware/
    │   └── middleware.go
    ├── models/
    │   └── models.go
    ├── routes/
    │   └── routes.go
    ├── services/
    │   ├── shortener.go       ← DB persistence + lookup + click tracking
    │   └── transform.go       ← Business logic + trust metrics
    ├── main.go
    ├── go.mod
    ├── .env.example
    └── creepurl.db            ← Auto-created on first run (gitignored)
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server port |
| `BASE_URL` | `http://localhost:8080` | Used to build full short URLs |
| `DB_PATH` | `./creepurl.db` | SQLite file path |
| `ENVIRONMENT` | `development` | Runtime label |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Backend API base path |

---

## API Documentation

### `POST /api/transform`

Generates cursed slugs, persists them, returns real short URLs.

**Request:**
```json
{
  "url": "https://google.com",
  "destruction_level": 4
}
```

**Response:**
```json
{
  "links": [
    {
      "slug": "sh-g00g__relay882--voidxr09",
      "full_short_url": "http://localhost:8080/sh-g00g__relay882--voidxr09",
      "display_url": "http://localhost:8080/sh-g00g__relay882--voidxr09"
    }
  ],
  "metrics": {
    "trust_stability": "14%",
    "packet_integrity": "Corrupted",
    "machine_confidence": "Collapsed",
    "human_readability": "Terminal"
  }
}
```

---

### `GET /:slug`

Redirects to the original URL. Increments click count.

```
GET /sh-g00g__relay882--voidxr09
→ 301 https://google.com
```

---

### `GET /api/stats/:slug`

Returns analytics for a slug without redirecting.

```json
{
  "slug": "sh-g00g__relay882--voidxr09",
  "original_url": "https://google.com",
  "full_short_url": "http://localhost:8080/sh-g00g__relay882--voidxr09",
  "click_count": 42,
  "created_at": "2025-01-01T00:00:00Z",
  "last_clicked_at": "2025-01-02T12:00:00Z"
}
```

---

### `GET /health`

```json
{ "status": "operational", "version": "1.0.0" }
```

---

## Destruction Levels

| Level | Name | Slug style |
|---|---|---|
| 1 | Slightly Suspicious | `google-rel-x77` |
| 2 | Corrupted | `g00gle-relay-x77` |
| 3 | Infrastructure Horror | `g00g__relay-shad-x77` |
| 4 | Machine Corruption | `sh-g00g__relay882-void` |
| 5 | Computational Collapse | `s-g0__re882__voidxr09` |

---

## How the Slug Engine Works

```
Input: https://google.com
  ↓
Extract domain fragment: "google" → "g00g"   (char mutation)
  ↓
Inject infra word: relay, cache, frag, sync...
  ↓
Inject corruption word: shadow, void, echo...
  ↓
Inject machine ID: x77, xr09, 882, v0id...
  ↓
Combine with separator: __, --, -
  ↓
Slug: sh-g00g__relay882--void
  ↓
Store in SQLite → return http://localhost:8080/sh-g00g__relay882--void
  ↓
Click link → 301 → https://google.com
```

---

## Building for Production

### Backend binary

```bash
cd backend
go build -o creepurl-server main.go
./creepurl-server
```

### Frontend static build

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set `VITE_API_URL` to your backend URL in Vercel dashboard.

### Backend → Fly.io

```bash
cd backend
fly launch
fly deploy
```

Set `BASE_URL` to your deployed domain in Fly secrets:
```bash
fly secrets set BASE_URL=https://your-app.fly.dev
```

SQLite works great on single-instance deployments. For multi-instance scaling, swap `modernc.org/sqlite` driver for `lib/pq` and point `DB_PATH` at a Postgres connection string — the `database/sql` interface is identical, so only `database.go` changes.

---

## Gitignore additions

Add to your `.gitignore`:

```
backend/creepurl.db
backend/creepurl.db-shm
backend/creepurl.db-wal
backend/.env
frontend/.env
```

---

## License

MIT

---

> ⚠️ All generated slugs and display URLs are for satirical/portfolio purposes. The redirect system is real and functional.