# Searcher Frontend

React 19 + TypeScript search frontend powered by Meilisearch via `react-instantsearch`.

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_MEILISEARCH_API_KEY
npm run dev
```

## Configuration

All UI behavior is driven by `src/config/searchConfig.ts`. See the [root README](../README.md#changing-the-dataset) for details on swapping datasets.

### Environment variables

| Variable                   | Required | Default        |
| -------------------------- | -------- | -------------- |
| `VITE_MEILISEARCH_URL`     | Yes      | —              |
| `VITE_MEILISEARCH_API_KEY` | Yes      | —              |
| `VITE_MEILISEARCH_INDEX`   | No       | `movies`       |
| `VITE_APP_TITLE`           | No       | `Movie Search` |
| `VITE_HITS_PER_PAGE`       | No       | `12`           |

## Scripts

```bash
npm run dev            # dev server
npm run build          # type-check + production build
npm run lint           # ESLint
npm run test           # unit tests (92 tests)
npm run test:watch     # vitest watch mode
npm run test:e2e       # Playwright e2e
npm run format         # Prettier format
npm run format:check   # Prettier check
```

## Testing

- **Unit tests**: `npm run test` — 92 tests with Vitest + Testing Library
- **E2E tests**: `npm run test:e2e` — Playwright specs for search, detail, filters, layout, and pagination

## Pre-commit hooks

Prek hooks run automatically on commit. Install with:

```bash
npx @j178/prek install
```

Hooks: Prettier, ESLint, TypeScript check, Vitest, trailing-whitespace, end-of-file-fixer, markdownlint.
