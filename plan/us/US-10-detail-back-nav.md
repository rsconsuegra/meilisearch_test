# US-10: Detail page "Back to results" navigation

**As a** user, **I want** a "Back to results" link on the detail page **so that** I can return to my search results with my query and page position preserved.

## Scope

- In `DetailPage.tsx`, add a "Back to results" link above the content
- Uses `useNavigate(-1)` from react-router-dom to go back in browser history
- This preserves the InstantSearch routing state (query, page, refinements) stored in the URL
- The link is a semantic `<a>` or `<button>` element with clear affordance
- No custom styling (Phase 3)

## Acceptance Criteria

- [ ] "Back to results" link is visible on the detail page
- [ ] Clicking "Back to results" navigates back to the search page with the previous query and page state intact
- [ ] The link is keyboard-accessible (focusable, activatable with Enter)
- [ ] The link uses `useNavigate(-1)` or equivalent to preserve full browser history context
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `DetailPage.test.tsx` (update existing): "Back to results" element is present in the rendered detail view
- [ ] `DetailPage.test.tsx` (update existing): Clicking "Back to results" calls `navigate(-1)`

## E2E Test Requirements

- [ ] After searching for "star" → clicking a result → detail page shows "Back to results"
- [ ] Clicking "Back to results" returns to the search page with the query "star" still in the search box
- [ ] After searching for "star" → clicking page 2 → clicking a result → clicking "Back to results" returns to page 2 of results
