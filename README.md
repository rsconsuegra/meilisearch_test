# Searcher

A schema-agnostic search frontend powered by [Meilisearch](https://www.meilisearch.com/), built with React 19, TypeScript, and Vite.

The default dataset is movies, but swapping to books, products, or any other index requires editing a single config file.

## Quick start

```bash
# 1. Start Meilisearch
cp .env.example .env           # fill in MEILISEARCH_ADMIN_API_KEY
docker compose up -d

# 2. Install and run the frontend
cd frontend
npm install
cp .env.example .env           # fill in VITE_MEILISEARCH_API_KEY
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment variables

| Variable | Where | Description |
|---|---|---|
| `MEILISEARCH_PORT` | Root `.env` | Host port for Meilisearch (default `7700`) |
| `MEILISEARCH_ADMIN_API_KEY` | Root `.env` | Admin key for indexing via `make curl-post` |
| `VITE_MEILISEARCH_URL` | `frontend/.env` | Meilisearch URL (e.g. `http://localhost:7700`) |
| `VITE_MEILISEARCH_API_KEY` | `frontend/.env` | Search-only API key |
| `VITE_MEILISEARCH_INDEX` | `frontend/.env` | Index name (default `movies`) |
| `VITE_APP_TITLE` | `frontend/.env` | App header title (default `Movie Search`) |
| `VITE_HITS_PER_PAGE` | `frontend/.env` | Results per page (default `12`) |

## Architecture

```
frontend/src/
├── config/
│   ├── searchConfig.ts          # Schema definition (single source of truth)
│   └── searchClient.ts          # Meilisearch client instance
├── components/
│   ├── AppLayout/               # Header + Outlet wrapper
│   ├── ErrorBoundary/           # Error boundary + route-aware variant
│   ├── FieldRenderer/           # Shared badge/text/date rendering
│   ├── Header/                  # App title + navigation
│   ├── HitCard/                 # Search result card
│   ├── HitList/                 # Hit list with empty state
│   ├── Layout/                  # Max-width container
│   └── Pagination/              # Configurable page navigation
├── pages/
│   ├── SearchPage.tsx           # InstantSearch + widgets
│   ├── DetailPage.tsx           # Full record view via route loader
│   ├── DetailError.tsx          # Loader error display
│   ├── NotFoundPage.tsx         # 404 catch-all
│   └── detail/
│       ├── loader.ts            # Route loader with ID validation
│       ├── validation.ts        # ID format validation
│       └── fetchDetailDocument.ts
├── types/
│   ├── search.ts                # SearchHit interface + getField helper
│   └── navigation.ts            # Reset state contract
├── utils/
│   ├── formatDate.ts            # Date formatting (timestamps + ISO strings)
│   ├── fieldFormatter.ts        # Field value formatting (truncate, badges, dates)
│   └── meiliFilters.ts          # Meilisearch filter builder with sanitization
└── styles/
    └── theme.css                # CSS custom properties (theme)
```

## Changing the dataset

Edit `frontend/src/config/searchConfig.ts`:

```typescript
export const searchConfig = {
  indexName: "books",
  appTitle: "Book Search",
  titleField: "title",
  imageField: "cover",
  displayFields: [
    { key: "description", label: "Synopsis", type: "text", truncate: 200 },
    { key: "authors", label: "Authors", type: "badge" },
    { key: "published_date", label: "Published", type: "date" },
  ],
  filterableFields: [{ key: "authors", label: "Author" }],
  hitsPerPage: 12,
  // ...
};
```

No component code changes required.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint check |
| `npm run test` | Vitest unit tests (92 tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run format` | Prettier format all files |
| `npm run format:check` | Prettier check without writing |

## Pre-commit hooks

This project uses [prek](https://github.com/j178/prek) (drop-in pre-commit alternative). Hooks run automatically on `git commit`:

| Hook | Scope | Description |
|---|---|---|
| Prettier | Staged files | Auto-format |
| ESLint | Staged `.ts`/`.tsx` | Lint + auto-fix |
| TypeScript | Full project | `tsc --noEmit` type check |
| Vitest | Full project | 92 unit tests |
| trailing-whitespace | Staged files | Fix trailing whitespace |
| end-of-file-fixer | Staged files | Ensure newline at EOF |
| markdownlint | Staged `.md` | Lint markdown files |

Install hooks: `npx @j178/prek install` (from repo root or `frontend/`)

## Makefile shortcuts

| Target | Description |
|---|---|
| `make lint` | Run ESLint |
| `make lint-fix` | Run ESLint with auto-fix |
| `make test` | Run unit tests |
| `make test-e2e` | Run Playwright e2e tests |
| `make curl-get ROUTE="/indexes"` | GET request to Meilisearch |
| `make curl-post ROUTE="/indexes/movies/documents?primaryKey=id" FILE="movies.json"` | POST data to Meilisearch |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Search UI | react-instantsearch + @meilisearch/instant-meilisearch |
| Routing | React Router 7 |
| Styling | CSS Modules + theme variables |
| Linting | ESLint 9 (flat config) + Prettier |
| Testing | Vitest + Playwright |
| Hooks | prek (pre-commit compatible) |
| Search engine | Meilisearch (Docker) |
