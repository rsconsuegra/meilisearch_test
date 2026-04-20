# US-14: SearchBox visual styling

**As a** user, **I want** a prominent, centered search input **so that** search is the clear focal point of the page.

## Scope

- Create `src/pages/SearchPage.module.css`
- Wrap `<SearchBox />` in a styled container `<div>` in `SearchPage.tsx`
- Override InstantSearch `satellite.css` defaults for `.ais-SearchBox` elements

## Style Requirements

- Search section: centered, max-width `640px`, margin `2rem auto`
- Input: font-size `1.125rem`, padding `0.75rem 1rem`, border `2px solid var(--color-border)`, border-radius `var(--radius-md)`
- Focus state: border-color `var(--color-accent)`, box-shadow `0 0 0 3px rgba(79, 70, 229, 0.15)`
- Submit/reset buttons: hidden or minimal styling

## Acceptance Criteria

- [ ] Search input is centered on the page (container max-width ≤ 640px)
- [ ] Search input font-size is `1.125rem`
- [ ] Search input has padding ≥ `0.75rem 1rem`
- [ ] Input border uses `var(--color-border)` (2px solid)
- [ ] Input border-radius uses `var(--radius-md)`
- [ ] Focus state shows accent border color and focus ring
- [ ] CSS Module uses theme variables for colors and radii
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): SearchBox wrapper div has CSS Module class applied
- [ ] `SearchPage.test.tsx` (update): verify search section container renders with module class

## E2E Test Requirements

- [ ] Search input is visible and centered on page load
- [ ] Search input font-size is ≥ `1.125rem` (computed as `18px`)
- [ ] Clicking the search input shows accent-colored focus border
