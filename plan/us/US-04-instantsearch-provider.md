# US-04: Wire up InstantSearch provider with MeiliSearch client

**As a** developer, **I want** the `<InstantSearch>` root provider connected to the self-hosted MeiliSearch instance **so that** all child components can query the index.

## Scope

- In `App.tsx`, initialize the MeiliSearch client using `instantMeiliSearch()` with:
  - URL from `import.meta.env.VITE_MEILISEARCH_URL`
  - API key from `import.meta.env.VITE_MEILISEARCH_API_KEY`
- Wrap the app content in `<InstantSearch>` with `indexName` from `searchConfig.indexName` and `searchClient`
- Import `instantsearch.css/themes/satellite.css` in `main.tsx` (global base styles)
- Add basic React Router structure: `<BrowserRouter>` with two routes:
  - `/` → placeholder `SearchPage`
  - `/detail/:id` → placeholder `DetailPage`
- Create placeholder page components in `/frontend/src/pages/`

## Acceptance Criteria

- [ ] `App.tsx` renders `<InstantSearch>` with `searchClient` and `indexName` from config
- [ ] Environment variables are read at build time via `import.meta.env`
- [ ] `instantsearch.css/themes/satellite.css` is imported and applied globally
- [ ] React Router is configured with `/` and `/detail/:id` routes
- [ ] Placeholder pages render at both routes
- [ ] `npm run build` succeeds with no TS errors
