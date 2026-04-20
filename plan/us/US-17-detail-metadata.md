# US-17: DetailPage metadata styling with badge rendering

**As a** user, **I want** clearly structured metadata sections with styled genre badges on the detail page **so that** I can easily read all information about a result.

## Scope

- Add metadata section styles to `DetailPage.module.css` (created in US-16)
- Apply CSS Module classes to metadata sections, genre badges, and extra fields in `DetailPage.tsx`
- **Code change**: Modify `DetailPage.tsx` to render `type: "badge"` fields as individual `<span>` elements (same pattern as US-15 HitCard)
- Update `DetailPage.test.tsx` to reflect new badge rendering

## Style Requirements

- Metadata sections: margin-bottom `1.5rem`
- Section headings (h2): font-size `0.75rem`, text-transform `uppercase`, color `var(--color-text-secondary)`, letter-spacing `0.05em`, margin-bottom `0.5rem`
- Section content (p): font-size `1rem`, color `var(--color-text)`, line-height `1.6`
- Badge pills: same style as HitCard badges (background `var(--color-badge-bg)`, color `var(--color-badge-text)`, border-radius `var(--radius-sm)`, padding `0.125rem 0.5rem`, font-size `0.75rem`)
- Extra fields section: `<dl>` as CSS grid with `grid-template-columns: auto 1fr`, gap `0.5rem 1rem`
- `<dt>`: font-weight `600`, color `var(--color-text-secondary)`, font-size `0.875rem`
- `<dd>`: margin `0`, color `var(--color-text)`, font-size `0.875rem`

## Acceptance Criteria

- [ ] `type: "badge"` fields in detail page render as individual `<span>` elements, not comma-separated text
- [ ] Each badge span has the same pill styling as HitCard badges
- [ ] Metadata section headings are uppercase with secondary text color
- [ ] Metadata section content has 1.6 line-height
- [ ] Extra fields `<dl>` uses grid layout with auto/1fr columns
- [ ] `<dt>` elements have font-weight 600
- [ ] `<dd>` elements have margin 0
- [ ] All CSS uses theme variables
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `DetailPage.test.tsx` (update): badge fields render as individual `<span>` elements (for 3 genres → 3 spans)
- [ ] `DetailPage.test.tsx` (update): each badge `<span>` has CSS Module class
- [ ] `DetailPage.test.tsx` (update): metadata sections have CSS Module class
- [ ] `DetailPage.test.tsx` (update): extra fields section has CSS Module class
- [ ] `DetailPage.test.tsx` (update): non-badge fields still render as plain text in `<p>` elements

## E2E Test Requirements

- [ ] Genre badges on detail page render as individual pills (not comma-separated)
- [ ] Metadata section headings have secondary text color
- [ ] Extra fields section uses a structured layout (not plain block flow)
- [ ] Detail page content is readable with clear visual hierarchy
