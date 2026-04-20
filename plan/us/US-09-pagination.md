# US-09: Add Pagination widget

**As a** user, **I want** to navigate between pages of search results **so that** I can browse more results than fit on a single page.

## Scope

- In `SearchPage.tsx`, add `<Pagination>` widget from `react-instantsearch` below `<Hits>`
- Ensure `<Configure hitsPerPage={searchConfig.hitsPerPage} />` is present to control page size from config
- The `<Pagination>` widget uses `satellite.css` default styling
- No custom pagination styling (Phase 3)

## Acceptance Criteria

- [ ] Pagination controls appear below search results when results exceed `searchConfig.hitsPerPage` (12)
- [ ] Clicking "Next" loads the next page of results, replacing the current hits
- [ ] Clicking "Previous" loads the previous page of results
- [ ] Current page number is visually indicated (satellite.css default)
- [ ] Page size matches `searchConfig.hitsPerPage` (12 results per page)
- [ ] Pagination updates the URL search parameters (via InstantSearch routing)
- [ ] Navigating directly to a URL with pagination params (e.g. `/?q=star&page=2`) loads the correct page
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx`: SearchPage renders a `<Pagination>` widget
- [ ] `SearchPage.test.tsx`: SearchPage renders `<Configure>` with `hitsPerPage` from `searchConfig`

## E2E Test Requirements

- [ ] After searching for "a" (broad query), pagination controls are visible
- [ ] Clicking page 2 updates the URL to contain `page=2` and displays a new set of results
- [ ] Clicking page 1 returns to the first page of results
- [ ] Direct navigation to `/?q=star&page=2` shows page 2 results
- [ ] Pagination is hidden or shows only 1 page when results fit in one page
