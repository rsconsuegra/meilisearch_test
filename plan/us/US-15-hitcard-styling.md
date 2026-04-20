# US-15: HitCard visual styling with badge rendering

**As a** user, **I want** polished hit cards with image thumbnails, structured content, and genre badge pills **so that** I can quickly scan and identify relevant results.

## Scope

- Create `src/components/HitCard/HitCard.module.css`
- Apply CSS Module classes to `HitCard.tsx`
- **Code change**: Modify `HitCard.tsx` to render `type: "badge"` fields as individual `<span>` elements instead of comma-joined text
- Update `HitCard.test.tsx` to reflect new badge rendering

## Style Requirements

- Card: background `var(--color-surface)`, border-radius `var(--radius-md)`, box-shadow `var(--shadow-sm)`, overflow hidden
- Image: full-width, height `200px`, object-fit `cover`
- Content area: padding `1rem`
- Title: font-size `1rem`, font-weight `600`, color `var(--color-text)`, margin-bottom `0.5rem`
- Text fields: font-size `0.875rem`, color `var(--color-text-secondary)`
- Badge pills: individual `<span>` with background `var(--color-badge-bg)`, color `var(--color-badge-text)`, border-radius `var(--radius-sm)`, padding `0.125rem 0.5rem`, font-size `0.75rem`, margin-right `0.25rem`, display `inline-block`
- Hover: card transitions box-shadow to `var(--shadow-md)`, transform `translateY(-2px)`
- Focus (link): outline `2px solid var(--color-accent)`, outline-offset `2px`
- Link: no underline, color inherit

## Acceptance Criteria

- [ ] HitCard renders as a card with white background, border-radius, and box-shadow
- [ ] Image renders full-width at 200px height with object-fit cover
- [ ] Content area has 1rem padding
- [ ] Title has font-weight 600
- [ ] `type: "badge"` fields render as individual `<span>` elements (e.g., 3 genres → 3 spans), not comma-separated text
- [ ] Each badge span has badge background and text color from theme variables
- [ ] Each badge has border-radius, padding, and font-size ≤ 0.875rem
- [ ] Text fields render with secondary text color
- [ ] Card has CSS hover transition: shadow change + translateY
- [ ] Card link has no text-decoration
- [ ] Card link has focus outline using accent color
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `HitCard.test.tsx` (update): `<article>` has CSS Module class applied
- [ ] `HitCard.test.tsx` (update): `<img>` has CSS Module class applied
- [ ] `HitCard.test.tsx` (update): badge fields render as 3 individual `<span>` elements (for 3 genres)
- [ ] `HitCard.test.tsx` (update): each badge `<span>` has CSS Module class
- [ ] `HitCard.test.tsx` (update): update "renders badge fields as comma-separated" test → expect individual `<span>` elements with text "Adventure", "Action", "Science Fiction"
- [ ] `HitCard.test.tsx` (update): non-badge fields (text, date) still render as plain text, not spans

## E2E Test Requirements

- [ ] Hit cards render with white background and visible box-shadow
- [ ] Hit card images are visible with correct dimensions
- [ ] Genre badges render as individual pill-shaped elements (not comma-separated text)
- [ ] Hovering a hit card shows visual change (shadow/transform)
