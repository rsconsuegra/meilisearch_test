# Code Review: Frontend Follow-up (Post CR-01 through CR-10)

**Date:** 2026-04-19
**Scope:** All files in `src/` after CR-01 through CR-10 fixes
**Reviewer:** TypeScript + React 19 Review Expert

---

## Summary

The previous round of fixes addressed 10 issues and improved the codebase significantly. The code is now stricter (`strict: true`, `noUncheckedIndexedAccess`), uses the Meilisearch client consistently, has an ErrorBoundary, and has better type safety.

This follow-up review identifies **12 remaining issues** across critical, high, and architecture categories.

---

## Critical Issues

### CR-11: `formatDate` does not actually parse string dates

**File:** `src/utils/formatDate.ts:1-5`
**Severity:** Critical (Bug)

```typescript
export function formatDate(value: unknown): string {
  if (typeof value === "number") {
    return new Date(value * 1000).toISOString().split("T")[0] ?? "";
  }
  return String(value ?? "");
}
```

If `value` is a string like `"1977-05-25"`, the function returns it as-is. But if the value is a numeric timestamp (seconds), it converts correctly. The issue is that `DetailPage.tsx:82` and `HitCard.tsx:27` both route to `formatDate` for the `"date"` type, but string-formatted dates bypass all formatting and are returned raw. This means `formatDate` is a no-op for ISO date strings.

**Impact:** If any date field contains an ISO string, it passes through unmodified. If dates are always epoch seconds from Meilisearch, this works but the function name is misleading — it only formats numeric timestamps.

**Recommendation:**

```typescript
export function formatDate(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "number") {
    return new Date(value * 1000).toISOString().split("T")[0]!;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0]!;
    }
    return value;
  }
  return String(value);
}
```

---

### CR-12: `DetailPage` uses `id` directly in Meilisearch filter without sanitization

**File:** `src/pages/DetailPage.tsx:25`
**Severity:** Critical (Injection Risk)

```typescript
.search<SearchHit>("", { filter: `id = ${id}`, hitsPerPage: 1 }, { signal: controller.signal });
```

The `id` comes from `useParams` (URL parameter) and is interpolated directly into a filter string. While Meilisearch filters aren't SQL, crafted values like `1 OR 1=1` or injection of special filter syntax could cause unexpected behavior.

**Recommendation:** Validate `id` is a number or UUID before using it in the filter, or use Meilisearch's parameterized filter API if available.

```typescript
if (!/^\d+$/.test(id)) {
  setError("Invalid document ID.");
  setLoading(false);
  return;
}
```

---

### CR-13: `SearchHit` index signature allows access to non-existent properties without `undefined`

**File:** `src/types/search.ts:1-4`
**Severity:** Critical (Type Safety Hole)

```typescript
export interface SearchHit {
  id: string | number;
  [key: string]: unknown;
}
```

With `noUncheckedIndexedAccess` enabled, accessing `doc["title"]` should return `unknown | undefined`, but the index signature `[key: string]: unknown` tells TypeScript that _any_ string key maps to `unknown`. This means `doc[searchConfig.titleField]` returns `unknown` (not `unknown | undefined`) — the `noUncheckedIndexedAccess` protection is bypassed for index signatures.

**Impact:** The `?? ""` and `?? "Untitled"` fallbacks in `HitCard.tsx:39` and `DetailPage.tsx:53` are unreachable from TypeScript's perspective, meaning the type system believes access always succeeds.

**Recommendation:** Accept this as a known limitation of TypeScript's index signature + `noUncheckedIndexedAccess` interaction, and document it. Alternatively, define known fields explicitly:

```typescript
export interface SearchHit {
  id: string | number;
  [key: string]: unknown;
}

// For safe access:
export function getField(hit: SearchHit, key: string): unknown {
  return key in hit ? hit[key] : undefined;
}
```

---

## High Priority Issues

### CR-14: `DetailPage` fetches data in `useEffect` — should use `react-router-dom` loader or a data-fetching pattern

**File:** `src/pages/DetailPage.tsx:16-46`
**Severity:** High (Architecture)

The component uses the `useEffect` + `useState` pattern for data fetching with manual loading/error/abort handling. This is the canonical anti-pattern from the checklist:

> "Server/async data → TanStack Query (never copy to local state)"

While TanStack Query may be overkill here, `react-router-dom` v7 supports route loaders that handle this natively with `useLoaderData()`.

**Current pattern:**

- 3 pieces of state (`doc`, `loading`, `error`)
- Manual AbortController
- IIFE async inside useEffect
- 30 lines of fetch logic

**Recommendation:** Use a route loader:

```typescript
// In App.tsx or a routes file
const routes = createBrowserRouter([
  {
    path: "/detail/:id",
    element: <DetailPage />,
    loader: async ({ params }) => {
      const id = params.id;
      if (!id) throw new Error("Missing ID");
      const result = await meiliSearchInstance
        .index(searchConfig.indexName)
        .search<SearchHit>("", { filter: `id = ${id}`, hitsPerPage: 1 });
      const hit = result.hits[0];
      if (!hit) throw new Response("Not Found", { status: 404 });
      return hit;
    },
  },
]);
```

This eliminates all loading/error/abort state from the component.

---

### CR-15: `SearchPage` contains 3 component definitions in one file

**File:** `src/pages/SearchPage.tsx`
**Severity:** High (Maintainability)

`HitList`, `CustomPagination`, and `SearchPage` are all defined in one file (119 lines). `CustomPagination` alone is 70 lines. This violates the single-responsibility principle and makes testing and reuse harder.

**Recommendation:** Extract to separate files:

- `src/components/HitList/HitList.tsx`
- `src/components/Pagination/CustomPagination.tsx`

---

### CR-16: `CustomPagination` computes pages outside React rendering — no `useMemo`

**File:** `src/pages/SearchPage.tsx:32-102`
**Severity:** Medium (Performance)

The pagination component recalculates `startPage`, `endPage`, and `pages` array on every render. While the computation is cheap, the `Array.from` creates a new reference each time.

**Recommendation:** Wrap the computation in `useMemo` if the component is ever wrapped in `React.memo`, or leave as-is since the computation is trivial. Low priority.

---

### CR-17: `ErrorBoundary` does not reset on route changes

**File:** `src/components/ErrorBoundary/ErrorBoundary.tsx`
**Severity:** High (UX Bug)

If the ErrorBoundary catches an error on `/detail/11`, clicking the back button or navigating to `/` (via the Header link) will still show the error state. The ErrorBoundary wraps the entire Routes component, so it never remounts on route changes.

**Recommendation:** Add a `key` based on location, or use `componentDidUpdate` to reset on navigation:

```typescript
// Option 1: Key on location
import { useLocation } from "react-router-dom";
// Wrap ErrorBoundary in a component that passes location.key

// Option 2: Reset on location change (class component)
componentDidUpdate(prevProps: ErrorBoundaryProps) {
  if (this.props.children !== prevProps.children) {
    this.setState({ hasError: false, error: null });
  }
}
```

Or wrap `ErrorBoundary` in a wrapper that uses `useLocation` and passes `location.key` as a key prop to force remount.

---

### CR-18: `Header` uses `<a href="/">` instead of `<Link to="/">`

**File:** `src/components/Header/Header.tsx:6`
**Severity:** High (SPA Navigation Broken)

```typescript
<a href="/">{searchConfig.appTitle}</a>
```

This causes a full page reload instead of client-side navigation, defeating the SPA routing. All internal links should use React Router's `<Link>` component.

**Recommendation:**

```typescript
import { Link } from "react-router-dom";
// ...
<Link to="/">{searchConfig.appTitle}</Link>
```

---

### CR-19: Duplicated field rendering logic between `HitCard` and `DetailPage`

**Files:**

- `src/components/HitCard/HitCard.tsx:38-60`
- `src/pages/DetailPage.tsx:53-101`

**Severity:** High (DRY Violation)

Both components:

1. Extract `title` from `searchConfig.titleField` with `String(... ?? "")`
2. Extract `imageUrl` from `searchConfig.imageField` with the same conditional
3. Iterate `searchConfig.displayFields` and format values with `formatDate` / `Array.isArray` join

The `formatFieldValue` helper in `HitCard.tsx` is not shared — `DetailPage` has its own inline version.

**Recommendation:** Extract shared helpers:

- `getFieldTitle(hit: SearchHit): string`
- `getFieldImage(hit: SearchHit): string | null`
- `formatFieldValue(value: unknown, type?: string, truncate?: number): string` (already in HitCard, make shared)

---

## Architecture / Style Issues

### CR-20: `SearchPage` creates a second `InstantSearch` context — `App` could be the single provider

**File:** `src/pages/SearchPage.tsx:104-117`

`InstantSearch` is initialized inside `SearchPage`, not in `App`. This means the search client is re-initialized on every mount of SearchPage (on every navigation back to `/`). The search state (query, page) is lost on navigation.

**Recommendation:** Move `InstantSearch` to `App` level so search state persists across route changes. Or accept this as intentional (fresh search on each visit).

---

### CR-21: `searchConfig` is a hardcoded constant — should support environment override

**File:** `src/config/searchConfig.ts:23-35`

The config is hardcoded with `indexName: "movies"`, `appTitle: "Movie Search"`, etc. For a generic search UI, this should support environment variables or runtime configuration.

**Recommendation:** Merge with env vars:

```typescript
export const searchConfig: SearchConfig = {
  indexName: import.meta.env.VITE_MEILISEARCH_INDEX ?? "movies",
  appTitle: import.meta.env.VITE_APP_TITLE ?? "Movie Search",
  // ...
};
```

---

### CR-22: No code splitting — all pages bundled together

**File:** `src/App.tsx`
**Severity:** Medium (Performance)

Both `SearchPage` and `DetailPage` are eagerly imported. For a production app, route-level code splitting with `React.lazy` would reduce initial bundle size.

```typescript
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const DetailPage = React.lazy(() => import("./pages/DetailPage"));
```

With `<Suspense>` fallback wrapping the Routes.

---

## Positive Findings

These patterns are well-implemented:

1. **Strict TypeScript config** — `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns` all enabled
2. **Proper AbortController cleanup** in `DetailPage` useEffect
3. **ErrorBoundary** present with retry mechanism
4. **Config-driven rendering** — `searchConfig` drives field display, making the UI adaptable
5. **Good test coverage** — 16 tests across 3 test files covering loading, error, display, and navigation states
6. **Semantic HTML** — Uses `<article>`, `<nav>`, `<section>`, `<header>`, `<dl>`, proper heading hierarchy
7. **`aria-label`** on pagination and buttons
8. **`type="button"`** on all non-submit buttons
9. **`loading="lazy"`** on images in HitCard
10. **No `any` types** anywhere in the codebase
11. **No `React.FC`** — all components use explicit props
12. **No derived state in useEffect** — data fetching is the only useEffect use
13. **No state mutations** — all state updates use proper immutable patterns
14. **No `key={index}`** — all list items use stable IDs

---

## Issue Summary

| ID    | Severity | File                   | Issue                                               |
| ----- | -------- | ---------------------- | --------------------------------------------------- |
| CR-11 | Critical | `utils/formatDate.ts`  | `formatDate` no-op for string dates                 |
| CR-12 | Critical | `pages/DetailPage.tsx` | Unsanitized `id` in Meilisearch filter              |
| CR-13 | Critical | `types/search.ts`      | Index signature bypasses `noUncheckedIndexedAccess` |
| CR-14 | High     | `pages/DetailPage.tsx` | Manual data fetching in useEffect instead of loader |
| CR-15 | High     | `pages/SearchPage.tsx` | 3 components in one file                            |
| CR-16 | Medium   | `pages/SearchPage.tsx` | Pagination recomputes on every render               |
| CR-17 | High     | `ErrorBoundary.tsx`    | Error state persists across route changes           |
| CR-18 | High     | `Header.tsx`           | `<a href>` causes full page reload                  |
| CR-19 | High     | HitCard + DetailPage   | Duplicated field extraction/formatting logic        |
| CR-20 | Medium   | `SearchPage.tsx`       | InstantSearch re-initialized on navigation          |
| CR-21 | Low      | `searchConfig.ts`      | Hardcoded config, no env override                   |
| CR-22 | Medium   | `App.tsx`              | No route-level code splitting                       |

**Total: 3 Critical, 5 High, 3 Medium, 1 Low**
