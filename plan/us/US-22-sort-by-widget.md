# US-22: SortBy widget with config

**As a** user, **I want** to sort search results by title **so that** I can browse results alphabetically instead of by relevance.

## Scope

- Add optional `sortOptions` to `SearchConfig` interface: `{ label: string; value: string }[]`
- Configure movie defaults: Relevance (`"movies"`), Title A-Z (`"movies:title:asc"`), Title Z-A (`"movies:title:desc"`)
- Add `<SortBy>` widget above the results area (or in sidebar), conditionally rendered when `sortOptions` is non-empty
- Style with CSS Modules (override satellite.css `.ais-SortBy*` styles)
- Requires `title` to be a `sortableAttribute` in MeiliSearch (document setup step)

## Files

- MODIFY: `src/config/searchConfig.ts` — add `sortOptions` to interface and config
- MODIFY: `src/pages/SearchPage.tsx` — add SortBy widget
- MODIFY: `src/pages/SearchPage.module.css` — add `.sortByWrapper` styles, override `ais-SortBy*`

## MeiliSearch Setup (one-time)

```bash
curl -X PUT 'http://localhost:7700/indexes/movies/settings/sortable-attributes' \
  -H 'Authorization: Bearer ADMIN_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '["title"]'
```

## Acceptance Criteria

- [ ] `sortOptions` field is optional on `SearchConfig` (typed as `{ label: string; value: string }[] | undefined`)
- [ ] Movie config includes 3 sort options: Relevance, Title A-Z, Title Z-A
- [ ] SortBy dropdown is visible when `sortOptions` is non-empty
- [ ] SortBy dropdown is not rendered when `sortOptions` is undefined or empty
- [ ] Selecting "Title A-Z" sorts results alphabetically ascending
- [ ] Selecting "Relevance" returns to default relevance sorting
- [ ] SortBy styling uses theme variables (border, radius, surface colors)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): when `sortOptions` is non-empty, SortBy widget is rendered
- [ ] `SearchPage.test.tsx` (update): when `sortOptions` is undefined/empty, no SortBy widget renders
- [ ] `SearchPage.test.tsx` (update): SortBy receives correct `items` prop from config

## E2E Test Requirements

- [ ] SortBy dropdown is visible on the search page
- [ ] SortBy dropdown shows 3 options: Relevance, Title A-Z, Title Z-A
- [ ] Selecting "Title A-Z" reorders results alphabetically
- [ ] Selecting "Relevance" returns results to relevance order
- [ ] SortBy selection persists when paginating
