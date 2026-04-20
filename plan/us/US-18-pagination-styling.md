# US-18: Pagination visual styling

**As a** user, **I want** visually styled pagination controls **so that** the current page is immediately identifiable and navigation feels responsive.

## Scope

- Create `src/components/Pagination/CustomPagination.module.css`
- Apply CSS Module classes to `CustomPagination.tsx`
- Replace `ais-Pagination*` class names with CSS Module classes

## Style Requirements

- Nav: text-align center, margin `2rem 0 1rem`
- List: display flex, gap `0.25rem`, justify-content center, list-style none, padding 0, margin 0
- Page buttons: border-radius `var(--radius-sm)`, padding `0.5rem 0.75rem`, border `1px solid var(--color-border)`, background `var(--color-surface)`, color `var(--color-text)`, cursor pointer, font-size `0.875rem`
- Active page button: background `var(--color-accent)`, color `#ffffff`, border-color `var(--color-accent)`
- Hover (non-active): background `var(--color-bg)`, border-color `var(--color-accent)`
- Focus: outline `2px solid var(--color-accent)`, outline-offset `2px`
- Disabled (prev/next): opacity `0.5`, cursor `not-allowed`

## Acceptance Criteria

- [ ] Pagination is centered horizontally
- [ ] Page buttons have visible borders and border-radius
- [ ] Active page button has accent background with white text
- [ ] Non-active page buttons have hover state with background change
- [ ] Previous/Next buttons have same style as page number buttons
- [ ] Disabled buttons have opacity ≤ 0.5
- [ ] All buttons have focus outline using accent color
- [ ] All CSS uses theme variables
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `CustomPagination.test.tsx` (new or update): pagination `<nav>` has CSS Module class
- [ ] `CustomPagination.test.tsx`: page `<button>` elements have CSS Module class
- [ ] `CustomPagination.test.tsx`: active page button has selected CSS Module class
- [ ] `CustomPagination.test.tsx`: previous/next buttons have CSS Module class
- [ ] `CustomPagination.test.tsx`: disabled buttons have disabled CSS Module class

## E2E Test Requirements

- [ ] Pagination is centered below search results
- [ ] Active page button has accent background color
- [ ] Clicking a non-active page changes which button has the accent background
- [ ] Previous button on page 1 has reduced opacity
