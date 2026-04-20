# US-03: Create `searchConfig.ts` — schema-agnostic config

**As a** developer, **I want** a single configuration file that defines how the UI maps to a MeiliSearch index **so that** swapping datasets requires editing only this file.

## Scope

- Create `/frontend/src/config/searchConfig.ts`
- Export a typed `SearchConfig` interface with:

```typescript
interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "badge" | "date";
  truncate?: number;
}

interface FilterConfig {
  key: string;
  label: string;
}

interface SearchConfig {
  indexName: string;
  appTitle: string;
  titleField: string;
  imageField: string | null;
  displayFields: FieldConfig[];
  filterableFields: FilterConfig[];
  hitsPerPage: number;
}
```

- Export a `searchConfig` constant matching the movies dataset:
  - `indexName: "movies"`
  - `appTitle: "Movie Search"`
  - `titleField: "title"`
  - `imageField: "poster"`
  - `displayFields`: overview (text, truncate 150), genres (badge), release_date (date)
  - `filterableFields`: genres
  - `hitsPerPage: 12`
- Export the `SearchConfig` type so consumers can import it

## Acceptance Criteria

- [ ] File compiles without TypeScript errors
- [ ] `searchConfig` is typed as `SearchConfig` and exported
- [ ] `SearchConfig` interface is exported
- [ ] No hardcoded field references exist outside this file in future stories
- [ ] The config can be changed to a different index/fields without touching component code
