# US-07: End-to-end integration verification

**As a** developer, **I want** the complete Phase 1 flow to work end-to-end **so that** the MVP is ready for layout work in Phase 2.

## Scope

- Ensure MeiliSearch Docker container is running with the `movies` index loaded
- Start the frontend dev server
- Verify the full user flow:
  1. App loads at `/` with an empty search box
  2. Typing "star" shows results including "Star Wars"
  3. Results display title, poster thumbnail, truncated overview, genres, and release date
  4. Clicking "Star Wars" navigates to `/detail/11`
  5. Detail page shows full title, poster, synopsis, genres, release date, and "More Info" with `id`
  6. Browser back button returns to search results with query preserved
- Verify `npm run build` produces a clean production build

## Acceptance Criteria

- [ ] The 6-step user flow above completes without console errors
- [ ] `npm run build` exits with code 0 and no TypeScript errors
- [ ] Production build serves correctly via `npm run preview`
- [ ] No hardcoded field names found in any component file (grep for `"title"`, `"overview"`, `"genres"` in component TSX files — only `searchConfig.ts` should contain them as string literals)
