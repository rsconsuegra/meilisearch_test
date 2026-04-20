# US-19: Filter sidebar layout

**As a** user, **I want** a sidebar area for filters next to my search results **so that** I can see filtering options without leaving the results view.

## Scope

- Add a two-column layout to `SearchPage.tsx`: `<aside>` for filters + `<main>` for results
- The sidebar is conditionally rendered: only shows when `searchConfig.filterableFields` has entries or `searchConfig.sortOptions` is defined and non-empty
- SearchBox and Configure remain full-width above the two-column area
- On desktop (≥ 768px): sidebar ~240px width on the left, main content fills remaining space
- On mobile (< 768px): sidebar collapses into a toggle button labeled "Filters" that expands/collapses the filter panel
- Add layout styles to `SearchPage.module.css`
- Add a sidebar toggle for mobile (inline in SearchPage or a small component)

## Files

- MODIFY: `src/pages/SearchPage.tsx` — add sidebar/main layout structure, mobile toggle state
- MODIFY: `src/pages/SearchPage.module.css` — add `.searchLayout`, `.sidebar`, `.main`, `.sidebarToggle`, responsive rules
- MODIFY: `src/pages/__tests__/SearchPage.test.tsx` — update mocks, add layout tests

## Acceptance Criteria

- [ ] On desktop (≥ 768px), search page renders a two-column layout with sidebar and main areas
- [ ] Sidebar is `<aside>` element, main content is `<main>` element
- [ ] When `filterableFields` is empty AND `sortOptions` is undefined/empty, no sidebar renders (full-width results)
- [ ] When `filterableFields` has entries, sidebar is visible on desktop
- [ ] On mobile (< 768px), sidebar is hidden by default, replaced by a "Filters" toggle button
- [ ] Clicking "Filters" toggle on mobile expands/collapses the filter panel
- [ ] Sidebar width on desktop is ≤ 260px
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): when `filterableFields` is non-empty, `<aside>` element is rendered
- [ ] `SearchPage.test.tsx` (update): when `filterableFields` is empty and `sortOptions` is undefined, no `<aside>` element is rendered
- [ ] `SearchPage.test.tsx` (update): search layout container has CSS Module class
- [ ] `SearchPage.test.tsx` (update): main content area has CSS Module class
- [ ] `SearchPage.test.tsx` (update): sidebar toggle button is rendered (for mobile access)

## E2E Test Requirements

- [ ] On desktop (1280px): sidebar is visible alongside search results when filterableFields is configured
- [ ] On mobile (375px): sidebar is hidden, "Filters" toggle button is visible
- [ ] On mobile (375px): clicking "Filters" toggles the filter panel visibility
- [ ] On desktop: main content area takes remaining width after sidebar
