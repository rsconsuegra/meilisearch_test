# US-02: Install search and routing dependencies

**As a** developer, **I want** all required packages installed **so that** InstantSearch, MeiliSearch client, and routing are available.

## Scope

- In `/frontend`, install:
  - `react-instantsearch`
  - `@meilisearch/instant-meilisearch`
  - `instantsearch.css`
  - `react-router-dom`
- Verify no peer dependency warnings or version conflicts
- Lock versions are recorded in `package-lock.json`

## Acceptance Criteria

- [ ] All 4 packages appear in `package.json` dependencies
- [ ] `npm ls` shows no unmet peer dependencies
- [ ] `npm run build` still succeeds after install
