# US-13: Header visual styling

**As a** user, **I want** a visually distinct header bar with the app title **so that** the application identity is immediately recognizable.

## Scope

- Create `src/components/Header/Header.module.css`
- Apply CSS Module classes to `Header.tsx`
- Header is rendered outside `<Layout>` in `App.tsx` — verify it spans full viewport width

## Style Requirements

- Background: `var(--color-accent)` (#4f46e5)
- Text color: `#ffffff`
- Padding: `0.75rem 1rem`
- Title font-size: `1.25rem`, font-weight: `600`
- Link: white color, no text-decoration, hover opacity `0.85`
- Bottom shadow: `var(--shadow-md)`
- Full-width bar (display: block, width: 100%)

## Acceptance Criteria

- [ ] Header has accent background color (computed as `rgb(79, 70, 229)`)
- [ ] Header text is white (`#ffffff`)
- [ ] Header spans full viewport width
- [ ] Title link has no `text-decoration`
- [ ] Title link hover state reduces opacity
- [ ] Header has bottom box-shadow
- [ ] CSS Module file uses theme variables (`var(--color-accent)`, `var(--shadow-md)`)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `Header.test.tsx` (update): `<header>` element has CSS Module class applied
- [ ] `Header.test.tsx` (update): anchor element has CSS Module class applied

## E2E Test Requirements

- [ ] Header has accent background color (`rgb(79, 70, 229)`) on the search page
- [ ] Header has accent background color on the detail page
- [ ] Header spans full viewport width (width equals viewport width)
- [ ] Header title text is white
