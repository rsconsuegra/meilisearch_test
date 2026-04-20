# US-16: DetailPage layout styling

**As a** user, **I want** a well-structured detail page layout with a prominent hero image and clear back navigation **so that** the page has visual hierarchy and readability.

## Scope

- Create `src/pages/DetailPage.module.css` (or `src/pages/detail/DetailPage.module.css`)
- Apply CSS Module classes to `DetailPage.tsx` for: container, back button, hero image, title
- Content max-width ≤ 800px for readability

## Style Requirements

- Container: max-width `800px`, centered, padding `2rem 1rem`
- Back button: color `var(--color-accent)`, no border, no background, font-size `0.875rem`, cursor pointer, padding `0`, margin-bottom `1.5rem`, hover underline
- Hero image: full-width, max-height `400px`, object-fit `cover`, border-radius `var(--radius-md)`, margin-bottom `1rem`
- Title (h1): font-size `1.75rem`, font-weight `700`, color `var(--color-text)`, margin `0 0 1rem`

## Acceptance Criteria

- [ ] Detail page container has max-width ≤ 800px and is centered
- [ ] Back button has accent color and no visible border or background
- [ ] Back button cursor is pointer
- [ ] Hero image has max-height 400px with object-fit cover
- [ ] Hero image has border-radius using theme variable
- [ ] Title (h1) has font-size ≥ 1.5rem and font-weight 700
- [ ] All CSS uses theme variables for colors and radii
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `DetailPage.test.tsx` (update): detail container has CSS Module class
- [ ] `DetailPage.test.tsx` (update): back button has CSS Module class
- [ ] `DetailPage.test.tsx` (update): hero image has CSS Module class
- [ ] `DetailPage.test.tsx` (update): title (h1) has CSS Module class

## E2E Test Requirements

- [ ] Detail page content is constrained to ≤ 800px width
- [ ] Hero image renders with max-height 400px
- [ ] Back button has accent color text
- [ ] Back button shows pointer cursor
