# US-05: Build search page with SearchBox and Hits

**As a** user, **I want** to type a query and see matching results from the MeiliSearch index **so that** I can find entries by keyword.

## Scope

- In `SearchPage.tsx`, add `<SearchBox>` widget from `react-instantsearch`
- Add `<Hits>` widget with a custom `hitComponent` that renders a `<HitCard>`
- Create `/frontend/src/components/HitCard/HitCard.tsx`:
  - Renders the title field value from `searchConfig.titleField`
  - Renders the image from `searchConfig.imageField` (if not null) as a small thumbnail
  - Renders each field in `searchConfig.displayFields` dynamically:
    - `text`: plain text, optionally truncated to `truncate` chars
    - `badge`: comma-separated values as inline text
    - `date`: formatted as readable date string (YYYY-MM-DD)
  - Each hit card is clickable — navigates to `/detail/{hit.id}`
- No custom CSS beyond `satellite.css` defaults

## Acceptance Criteria

- [ ] Typing in the search box returns results from the `movies` index within 500ms on localhost
- [ ] Each hit card shows the title, image thumbnail, and all configured display fields
- [ ] Text fields respect the `truncate` config value (truncated with `…`)
- [ ] Badge fields render comma-separated values
- [ ] Date fields render as human-readable dates (e.g., `1988-10-21`)
- [ ] Clicking a hit card navigates to `/detail/{id}`
- [ ] No field names (like "title", "overview", "genres") are hardcoded in the component — all read from config
- [ ] Search works with the MeiliSearch `searchKey` (not admin key)
