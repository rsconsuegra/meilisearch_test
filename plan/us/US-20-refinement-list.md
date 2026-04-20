# US-20: RefinementList widget with styling

**As a** user, **I want** to filter results by genre (or other configured fields) using a refinement list in the sidebar **so that** I can narrow down results to what interests me.

## Scope

- Import `RefinementList` from `react-instantsearch`
- In `SearchPage.tsx`, render one `<RefinementList>` per entry in `searchConfig.filterableFields`
- Each RefinementList uses `attribute={field.key}` and is wrapped in a section with the field's `label` as heading
- Style refinement lists with CSS Modules (override satellite.css `.ais-RefinementList*` styles)
- Each list item: checkbox + label + count
- Active items visually indicated (accent color)
- Searchable refinement list for fields with many items (optional: `searchable` prop when items > 10)

## Files

- MODIFY: `src/pages/SearchPage.tsx` — add RefinementList widgets in sidebar
- MODIFY: `src/pages/SearchPage.module.css` — add `.filterSection`, `.filterHeading`, override `ais-RefinementList*` styles

## Acceptance Criteria

- [ ] One `<RefinementList>` renders per entry in `searchConfig.filterableFields`
- [ ] Each refinement section has a heading with the field's `label` (e.g., "Genre")
- [ ] Clicking a refinement option filters the search results immediately
- [ ] Active refinement items are visually distinct (accent color or checked state)
- [ ] Each item shows the facet count (number of matching results)
- [ ] No refinement lists render if `searchConfig.filterableFields` is empty
- [ ] Refinement styling uses theme CSS variables (accent, surface, border colors)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): mock `RefinementList` and verify it renders with correct `attribute` prop for each filterableField
- [ ] `SearchPage.test.tsx` (update): verify the number of RefinementList instances matches `filterableFields.length`
- [ ] `SearchPage.test.tsx` (update): filter section headings use labels from config

## E2E Test Requirements

- [ ] After searching for "star", the "Genre" refinement list is visible in the sidebar
- [ ] The "Genre" list shows at least 1 genre option with a count
- [ ] Clicking a genre checkbox filters results to only matching items
- [ ] Active genre shows a visual indicator (checked state)
- [ ] Clicking an active genre again removes the filter
