# US-06: Build detail page for a single entry

**As a** user, **I want** to view all available information for a single search result **so that** I can see the full details without truncation.

## Scope

- Create `/frontend/src/pages/DetailPage.tsx`
- On mount, extract the `id` param from the URL via `useParams()`
- Fetch the full document from MeiliSearch using the search client's `getDocuments()` or a direct API call to `GET /indexes/{indexName}/documents/{id}`
- Render the full document using `searchConfig`:
  - Title from `titleField` as an `<h1>`
  - Image from `imageField` as a full-size `<img>` (if not null)
  - All `displayFields` rendered without truncation, using their `label` as a heading
  - Any additional fields present in the document that aren't in `displayFields` are rendered in a "More Info" section as key-value pairs
- Show a loading state while fetching
- Show an error state if the document is not found (404) or the request fails

## Acceptance Criteria

- [ ] Navigating to `/detail/11` loads and displays the "Star Wars" movie entry
- [ ] All `displayFields` render with their configured `label` as a subheading
- [ ] Text is NOT truncated in the detail view (full `overview` shown)
- [ ] Fields not listed in `displayFields` (e.g., `id`) are rendered in a "More Info" section
- [ ] A loading indicator appears while the document is being fetched
- [ ] Navigating to `/detail/9999999` (non-existent ID) shows a "Not found" message
- [ ] No hardcoded field names in the component — all driven by `searchConfig`
