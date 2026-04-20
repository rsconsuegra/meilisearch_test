# US-24: Search loading indicator

**As a** user, **I want** to see a loading indicator while search results are being fetched **so that** I know the app is processing my query and hasn't frozen.

## Scope

- Create `src/components/SearchLoader/SearchLoader.tsx` — custom component that reads `isSearchStalled` from `react-instantsearch` and renders a themed spinner when true
- Create `src/components/SearchLoader/SearchLoader.module.css` — spinner animation using CSS `@keyframes`, themed with CSS variables
- Add `<SearchLoader />` to `SearchPage.tsx` above the `<HitList />` component
- Spinner visible only while `isSearchStalled` is `true`, returns `null` when `false`
- Animate with pure CSS `@keyframes` rotation — no JS animation library

## Files

- CREATE: `src/components/SearchLoader/SearchLoader.tsx` — loading indicator component
- CREATE: `src/components/SearchLoader/SearchLoader.module.css` — spinner animation styles
- MODIFY: `src/pages/SearchPage.tsx` — add `<SearchLoader />` above `<HitList />`

## Style Requirements

- Spinner: `24px` circle, `var(--color-accent)` border (`3px`), transparent top section, `0.6s linear` rotation
- Container: centered horizontally, `padding: 1rem 0`
- Fade-in with `opacity` transition (100ms) when `isSearchStalled` becomes `true`

## Acceptance Criteria

- [ ] `SearchLoader` component exists and reads `isSearchStalled` from InstantSearch
- [ ] Spinner is not visible when no search is in progress (`isSearchStalled === false`)
- [ ] Spinner appears when search is stalled (`isSearchStalled === true`)
- [ ] Spinner disappears when results arrive
- [ ] Spinner uses CSS `@keyframes` rotation animation (no JS animation)
- [ ] Spinner border color uses `var(--color-accent)` from theme
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `src/components/SearchLoader/__tests__/SearchLoader.test.tsx` (new): renders spinner element when `isSearchStalled` is `true`
- [ ] `src/components/SearchLoader/__tests__/SearchLoader.test.tsx`: returns `null` when `isSearchStalled` is `false`
- [ ] `src/components/SearchLoader/__tests__/SearchLoader.test.tsx`: spinner element has CSS module class on container
- [ ] `src/components/SearchLoader/__tests__/SearchLoader.test.tsx`: spinner inner element has animation CSS module class

## E2E Test Requirements

- [ ] Type a search query — loading spinner appears briefly during query execution
- [ ] After results load, spinner is not visible in the DOM
- [ ] Clear search box — spinner appears during empty-query results fetch, then disappears when results arrive
