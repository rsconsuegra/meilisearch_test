# US-21: ClearRefinements widget

**As a** user, **I want** a "Clear filters" button in the sidebar **so that** I can remove all active filters in one click.

## Scope

- Import `ClearRefinements` from `react-instantsearch` (or use `useClearRefinements` hook)
- Add to the sidebar, positioned at the top or bottom of the filter section
- Only visible when at least one refinement is active
- Styled as a themed button (accent color, border-radius)

## Files

- MODIFY: `src/pages/SearchPage.tsx` — add ClearRefinements in sidebar
- MODIFY: `src/pages/SearchPage.module.css` — add `.clearButton` styles

## Acceptance Criteria

- [ ] "Clear filters" button is present in the sidebar
- [ ] Button is not visible (or disabled) when no refinements are active
- [ ] Button becomes visible when at least one refinement is active
- [ ] Clicking the button removes all active refinements and results return to unfiltered state
- [ ] Button uses accent color from theme variables
- [ ] Button has border-radius from theme variables
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): ClearRefinements component is rendered in the sidebar
- [ ] `SearchPage.test.tsx` (update): clear button wrapper has CSS Module class

## E2E Test Requirements

- [ ] "Clear filters" button is not visible on initial page load (no filters active)
- [ ] After selecting a genre filter, "Clear filters" button appears
- [ ] Clicking "Clear filters" removes the active genre filter and shows unfiltered results
- [ ] After clearing, "Clear filters" button is no longer visible
