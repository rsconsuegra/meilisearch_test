# Code Review: Frontend TypeScript + React 19 (Final Audit)

**Date:** 2026-04-19
**Scope:** Full `src/` — 30 source files, 14 test files, config
**Reviewer:** TypeScript + React 19 Review Expert
**Status:** 82/82 tests pass, 0 lint errors, build clean

---

## Summary

The codebase has matured significantly through multiple review cycles. Architecture is sound: route loaders for data fetching, CSS Modules for styling, config-driven rendering, shared helpers, and good test coverage. No critical React anti-patterns remain. This review targets remaining type-safety gaps, coupling issues, missing UX patterns, and maintenance concerns.

**Overall assessment:** Well-structured, production-viable for current scope. Issues below are incremental improvements, not blockers.

---

## Issues

### RR-01: `DetailPage` uses unchecked `as SearchHit` cast on `useLoaderData()`

**File:** `src/pages/DetailPage.tsx:12`
**Severity:** High (Type Safety)

```typescript
const doc = useLoaderData() as SearchHit;
```

`useLoaderData()` returns `unknown` because the type chain breaks at the JSX `element: <DetailPage />` boundary in `App.tsx`. The `as` cast is unchecked — if the loader's return type ever diverges from `SearchHit`, the cast silently passes wrong data through.

**Fix:** Use the generic overload to preserve type inference:

```typescript
import { detailLoader } from "./detail/loader";
const doc = useLoaderData<typeof detailLoader>();
```

This eliminates the cast entirely by inferring `SearchHit` from the loader's return type.

---

### RR-02: Template literal CSS concatenation in two components

**Files:**

- `src/pages/DetailPage.tsx:49`
- `src/pages/SearchPage.tsx:53`
  **Severity:** Medium (Consistency)

```typescript
// DetailPage.tsx:49
className={`${styles.heroImageWrapper} ${orientation === "portrait" ? styles.heroImageWrapperPortrait : styles.heroImageWrapperLandscape}`}

// SearchPage.tsx:53
className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
```

`clsx` is already a project dependency and used in `CustomPagination.tsx`. These two files should use it for consistency and to avoid trailing-space class artifacts when the condition is falsy.

**Fix:**

```typescript
// DetailPage
className={clsx(styles.heroImageWrapper, orientation === "portrait" ? styles.heroImageWrapperPortrait : styles.heroImageWrapperLandscape)}

// SearchPage
className={clsx(styles.sidebar, sidebarOpen && styles.sidebarOpen)}
```

---

### RR-03: `sortOptions` hardcodes index name — duplicates `VITE_MEILISEARCH_INDEX`

**File:** `src/config/searchConfig.ts:60-64`
**Severity:** Medium (Connascence of Value)

```typescript
sortOptions: [
  { label: "Relevance", value: "movies" },
  { label: "Title (A-Z)", value: "movies:title:asc" },
  { label: "Title (Z-A)", value: "movies:title:desc" },
],
```

The string `"movies"` is hardcoded in three places here, duplicating the `indexName` config (which can be overridden via `VITE_MEILISEARCH_INDEX`). If the env var changes the index to `"books"`, sort options still reference `"movies"` and will silently fail at runtime.

**Fix:** Derive sort values from `indexName`:

```typescript
const indexName = import.meta.env.VITE_MEILISEARCH_INDEX ?? "movies";

sortOptions: [
  { label: "Relevance", value: indexName },
  { label: "Title (A-Z)", value: `${indexName}:title:asc` },
  { label: "Title (Z-A)", value: `${indexName}:title:desc` },
],
```

---

### RR-04: `loader.ts` uses non-null assertion on `id`

**File:** `src/pages/detail/loader.ts:14`
**Severity:** Medium (Type Safety)

```typescript
const hit = await fetchDetailDocument(id!, AbortSignal.timeout(10_000));
```

After validation passes, `id` is logically guaranteed to be a string, but TypeScript still sees it as `string | undefined`. The `!` assertion is a type-safety bypass. Validation already runs above, so this should narrow the type instead.

**Fix:**

```typescript
const validationError = getDetailValidationError(id);
if (validationError) {
  throw new Response(validationError, { status: 400 });
}

// id is now guaranteed to be defined after validation
const hit = await fetchDetailDocument(id as string, AbortSignal.timeout(10_000));
```

Or better, restructure validation to narrow:

```typescript
export function validateDetailId(id: string | undefined): string {
  if (!id) throw new Response("Missing document ID.", { status: 400 });
  if (!/^\d+$/.test(id)) throw new Response("Invalid document ID.", { status: 400 });
  return id;
}
```

---

### RR-05: `HitList` has no empty-state UI

**File:** `src/components/HitList/HitList.tsx`
**Severity:** Medium (UX)

When search returns zero hits, the component renders `<ol className={styles.hitList}></ol>` — an empty ordered list with no feedback to the user. This is a poor experience.

**Fix:** Add a conditional empty state:

```typescript
if (hits.length === 0) {
  return <p className={styles.emptyState}>No results found.</p>;
}
```

---

### RR-06: No catch-all/404 route

**File:** `src/App.tsx`
**Severity:** Medium (UX / Routing)

The router only handles `/` and `/detail/:id`. Navigating to any undefined path (e.g., `/about`, `/detail/`) shows the header and layout with a blank content area — the `<Outlet>` renders nothing.

**Fix:** Add a catch-all route:

```typescript
{ path: "*", element: <NotFoundPage /> }
```

---

### RR-07: `DetailError` imports CSS from `DetailPage.module.css` — cross-module coupling

**File:** `src/pages/DetailError.tsx:3`
**Severity:** Medium (Coupling)

```typescript
import styles from "../pages/DetailPage.module.css";
```

`DetailError` imports CSS from `DetailPage.module.css`, creating a hidden dependency. If `DetailPage`'s CSS is refactored (renamed classes for `.container`, `.backButton`, `.sectionContent`), `DetailError` silently breaks.

**Fix:** Either:

1. Move shared error styles to their own CSS module (e.g., `DetailError.module.css`)
2. Or extract shared layout classes to a common CSS module

---

### RR-08: `toDatePart` helper recreated on every `formatDate` call

**File:** `src/utils/formatDate.ts:4-7`
**Severity:** Low (Performance / Clarity)

```typescript
export function formatDate(value: unknown): string {
  if (value == null) return "";

  const toDatePart = (date: Date): string | null => { ... }; // recreated every call
```

The `toDatePart` closure is defined inside `formatDate` and recreated on every invocation. For a pure function with no closure captures, this is unnecessary.

**Fix:** Extract to module level:

```typescript
function toDatePart(date: Date): string | null {
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0] ?? null;
}

export function formatDate(value: unknown): string { ... }
```

---

### RR-09: Bundle size warning — no route-level code splitting

**File:** `src/App.tsx`, build output
**Severity:** Low (Performance)

```
dist/assets/index-CPt4spPT.js   513.36 kB │ gzip: 152.19 kB
```

The build produces a single 513KB JS chunk. `react-instantsearch` (the main contributor) is loaded even on the detail page where only the Meilisearch JS client is needed. Route-level code splitting with `React.lazy` would reduce the initial bundle for the detail route.

**Fix:**

```typescript
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const DetailPage = React.lazy(() => import("./pages/DetailPage"));
```

Wrap in `<Suspense>` in the route config. Lower priority since the app is small and the gzip size (152KB) is acceptable.

---

### RR-10: `eslint-plugin-tailwindcss` configured but project uses CSS Modules

**File:** `eslint.config.js:8,42`
**Severity:** Low (Config Hygiene)

```javascript
import tailwindcss from "eslint-plugin-tailwindcss";
// ...
...tailwindcss.configs["flat/recommended"].rules,
```

The project uses CSS Modules with CSS custom properties, not Tailwind. The plugin adds unnecessary lint overhead and could produce false positives on class name patterns.

**Fix:** Remove the tailwindcss plugin and its rules from `eslint.config.js`. Also remove `eslint-plugin-tailwindcss` from `devDependencies`.

---

### RR-11: `@j178/prek` in devDependencies — unknown purpose

**File:** `package.json:26`
**Severity:** Low (Dependency Hygiene)

```json
"@j178/prek": "^0.3.9",
```

This package is not referenced anywhere in config files, scripts, or source. If it was added accidentally or for a one-time check, it should be removed.

---

### RR-12: `CrashPage` in test has unreachable code

**File:** `src/components/ErrorBoundary/__tests__/RouteAwareErrorBoundary.test.tsx:7-9`
**Severity:** Low (Test Hygiene)

```typescript
function CrashPage() {
  throw new Error("Boom");
  return null; // unreachable
}
```

The `return null` after `throw` is unreachable. TypeScript compiles it fine but it's dead code. Can be removed or replaced with a type-safe pattern.

---

## Positive Findings

| Area                              | Assessment                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Strict TypeScript config          | `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `erasableSyntaxOnly` — all enabled                                       |
| No `any` types                    | Zero instances in source code                                                                                                       |
| No `React.FC`                     | All components use explicit props interfaces                                                                                        |
| No `useEffect` for server data    | Route loader pattern used correctly                                                                                                 |
| No `useEffect` for derived state  | All computed values derived during render                                                                                           |
| No state mutations                | All state updates are immutable                                                                                                     |
| No `key={index}` in dynamic lists | All list items use stable keys                                                                                                      |
| No `eslint-disable` directives    | Zero suppression comments                                                                                                           |
| Error handling                    | Route error boundary + global error boundary with route-aware reset                                                                 |
| Config-driven rendering           | Fields, filters, sort options all from `searchConfig`                                                                               |
| CSS architecture                  | CSS Modules with custom properties, consistent theming                                                                              |
| Component extraction              | `FieldRenderer`, `HitList`, `CustomPagination` properly separated                                                                   |
| Type guards                       | `isResetState()`, `asSearchHit()` use runtime validation                                                                            |
| AbortController                   | Loader uses `AbortSignal.timeout(10_000)`                                                                                           |
| ID sanitization                   | `buildIdFilter()` validates numeric format before filter construction                                                               |
| Test coverage                     | 82 tests across 14 files covering all major components, edge cases, and helpers                                                     |
| Navigation reset                  | Well-designed pattern with shared `RESET_STATE_KEY` constant                                                                        |
| Accessibility                     | Semantic HTML (`<nav>`, `<article>`, `<section>`, `<aside>`, `<main>`), ARIA labels on pagination, `aria-expanded` on filter toggle |

---

## Issue Summary

| ID    | Severity | Description                                                | Effort  |
| ----- | -------- | ---------------------------------------------------------- | ------- |
| RR-01 | High     | `useLoaderData() as SearchHit` cast — use generic overload | Small   |
| RR-02 | Medium   | Template literal CSS — use `clsx`                          | Small   |
| RR-03 | Medium   | `sortOptions` hardcodes index name                         | Small   |
| RR-04 | Medium   | Non-null assertion `id!` in loader                         | Small   |
| RR-05 | Medium   | No empty-state in HitList                                  | Small   |
| RR-06 | Medium   | No catch-all/404 route                                     | Small   |
| RR-07 | Medium   | DetailError cross-module CSS import                        | Small   |
| RR-08 | Low      | `toDatePart` recreated per call                            | Trivial |
| RR-09 | Low      | No route-level code splitting                              | Medium  |
| RR-10 | Low      | Tailwind ESLint plugin unused                              | Trivial |
| RR-11 | Low      | `@j178/prek` dependency unexplained                        | Trivial |
| RR-12 | Low      | Unreachable code in test                                   | Trivial |

**Total: 1 High, 6 Medium, 5 Low**

---

## Recommended Implementation Order

1. **RR-01** — Type safety fix, eliminates unchecked cast
2. **RR-03** — Potential silent runtime failure on config change
3. **RR-04** — Eliminates non-null assertion
4. **RR-02** — Consistency with existing `clsx` usage
5. **RR-05 + RR-06** — UX improvements, can be done together
6. **RR-07** — Decouple error page styling
7. **RR-08 through RR-12** — Cleanup, low priority
