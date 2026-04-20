# US-27: Meilisearch-specific error detection in ErrorBoundary

**As a** user, **I want** to see a contextual error message when the search engine is unreachable **so that** I understand the problem is with the search service, not the application.

## Scope

- Create `src/utils/errorClassification.ts` with:
  - `isMeilisearchError(error: Error): boolean` — type guard for Meilisearch-related errors
  - `getErrorMessage(error: Error): string` — returns contextual message based on error type
- Detection patterns:
  - Network errors: `TypeError` with message `"Failed to fetch"`, `NetworkError`, `ERR_CONNECTION_REFUSED`
  - Auth errors: objects with `statusCode: 401` or `statusCode: 403` (Meilisearch `MeiliSearchApiError`)
  - Server errors: objects with `statusCode >= 500`
- Extend `ErrorBoundary.tsx` to use error classification for contextual fallback messages:
  - Network/unreachable: "Unable to connect to the search engine. Please check that Meilisearch is running."
  - Auth failure: "Authentication failed. Please check your API key configuration."
  - Generic: existing "Something went wrong" fallback
- "Retry" button on network errors performs `window.location.reload()` (full page refresh)
- Update `ErrorBoundary.module.css` with a network-error variant (distinct color or icon border)

## Files

- CREATE: `src/utils/errorClassification.ts` — `isMeilisearchError()`, `getErrorMessage()` helpers
- MODIFY: `src/components/ErrorBoundary/ErrorBoundary.tsx` — use error classification for contextual messages
- MODIFY: `src/components/ErrorBoundary/ErrorBoundary.module.css` — add variant styles for network errors

## Acceptance Criteria

- [ ] `isMeilisearchError` returns `true` for `TypeError` with message containing `"Failed to fetch"`
- [ ] `isMeilisearchError` returns `true` for error objects with `statusCode: 401`
- [ ] `isMeilisearchError` returns `true` for error objects with `statusCode: 403`
- [ ] `isMeilisearchError` returns `true` for error objects with `statusCode >= 500`
- [ ] `isMeilisearchError` returns `false` for generic `Error` instances
- [ ] ErrorBoundary shows "Unable to connect to the search engine" for network errors
- [ ] ErrorBoundary shows "Authentication failed" for 401/403 errors
- [ ] ErrorBoundary shows generic "Something went wrong" for non-Meilisearch errors (existing behavior unchanged)
- [ ] Network error variant has distinct visual treatment in CSS (e.g., `var(--color-error)` border or icon)
- [ ] "Retry" button on network errors calls `window.location.reload()`
- [ ] Existing ErrorBoundary and RouteAwareErrorBoundary tests still pass without modification
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `src/utils/__tests__/errorClassification.test.ts` (new): `isMeilisearchError` returns `true` for `new TypeError("Failed to fetch")`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `isMeilisearchError` returns `true` for object with `statusCode: 401`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `isMeilisearchError` returns `true` for object with `statusCode: 403`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `isMeilisearchError` returns `true` for object with `statusCode: 503`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `isMeilisearchError` returns `false` for `new Error("random")`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `getErrorMessage` returns connection message for network `TypeError`
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `getErrorMessage` returns auth message for 401 error
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `getErrorMessage` returns auth message for 403 error
- [ ] `src/utils/__tests__/errorClassification.test.ts`: `getErrorMessage` returns generic message for non-Meilisearch error
- [ ] `ErrorBoundary.test.tsx` (update): renders "Unable to connect" message for network `TypeError`
- [ ] `ErrorBoundary.test.tsx` (update): renders "Authentication failed" message for 401 error
- [ ] `ErrorBoundary.test.tsx` (update): renders generic message for non-Meilisearch `Error`
- [ ] `ErrorBoundary.test.tsx` (update): retry button calls `window.location.reload` for network errors

## E2E Test Requirements

- [ ] With Meilisearch stopped (`docker compose down`), app shows "Unable to connect to the search engine" message
- [ ] With invalid API key, app shows "Authentication failed" message
- [ ] Clicking "Retry" reloads the page (verify via navigation event)
