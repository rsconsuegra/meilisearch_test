# US-26: Configure widget search enhancements

**As a** user, **I want** search results to show highlighted matching terms **so that** I can quickly see why each result matched my query.

## Scope

- Add `attributesToHighlight` derived from `searchConfig.displayFields` (fields with `type: "text"` or `type: "badge"`)
- Add `attributesToSnippet` for text fields that have `truncate` defined, using the configured truncate value as snippet length
- Pass both to `<Configure>` in `SearchPage.tsx`
- Update `HitCard` and `FieldRenderer` to render InstantSearch `<Highlight>` and `<Snippet>` widgets for fields that have highlighting enabled
- Derive everything from existing `searchConfig.displayFields` — no config schema changes required

## Files

- MODIFY: `src/pages/SearchPage.tsx` — add `attributesToHighlight` and `attributesToSnippet` to `<Configure>`
- MODIFY: `src/components/FieldRenderer/FieldRenderer.tsx` — use `<Highlight>` / `<Snippet>` widgets for highlighted fields
- MODIFY: `src/components/HitCard/HitCard.tsx` — pass highlight/snippet hit attribute to FieldRenderer

## Acceptance Criteria

- [ ] `<Configure>` includes `attributesToHighlight` array containing all text and badge field keys from config (e.g. `["overview", "genres"]`)
- [ ] `<Configure>` includes `attributesToSnippet` array for fields with `truncate` defined (e.g. `["overview:150"]`)
- [ ] Search results show highlighted matching terms wrapped in `<em>` tags (InstantSearch default)
- [ ] Highlighted terms are visually distinct using `ais-Highlight` CSS with theme accent color
- [ ] Non-matching fields render unchanged (no highlight markup)
- [ ] Badge fields render highlighted individual items when a match occurs
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `SearchPage.test.tsx` (update): Configure mock receives `attributesToHighlight` array containing `"overview"` and `"genres"`
- [ ] `SearchPage.test.tsx` (update): Configure mock receives `attributesToSnippet` array containing `"overview:150"`
- [ ] `FieldRenderer.test.tsx` (update): renders `<Highlight>` widget for text fields when hit data contains `_highlightResult`
- [ ] `FieldRenderer.test.tsx` (update): renders `<Snippet>` widget for truncated text fields when hit data contains `_snippetResult`
- [ ] `FieldRenderer.test.tsx` (update): falls back to plain text when no highlight data is present

## E2E Test Requirements

- [ ] Search for a word present in movie overviews — matching term is highlighted in results (visible as `<em>` in DOM)
- [ ] Highlighted term has distinct styling (bold or colored via `ais-Highlight`)
- [ ] Snippeted text ends with `…` for long overview fields
- [ ] Badge fields show highlighted matching genre when search term matches a genre
