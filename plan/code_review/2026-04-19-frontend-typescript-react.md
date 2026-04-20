# Code Review: Frontend TypeScript & React Quality

**Date:** 2026-04-19  
**Scope:** `frontend/src/`  
**Status:** Open

## Summary

The codebase is clean, well-structured, and has good test coverage. No critical runtime bugs were found. The main improvements are around **type safety** (strict mode + proper hit types), **consistency** (shared utils, using the configured search client), and **resilience** (error boundaries, standard cancellation patterns).

---

## CR-01: Enable strict TypeScript configuration

**Priority:** Critical  
**Files:** `frontend/tsconfig.app.json`  
**Problem:** `strict: true` is not enabled. Only a handful of individual lint flags are set (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). This bypasses important safety checks like `noImplicitAny`, `strictNullChecks`, and `strictFunctionTypes`.

Additionally, `noUncheckedIndexedAccess` is missing. Every property access like `hit[field.key]` or `doc[field.key]` returns `unknown | undefined`, but the code treats these values as if they're always defined.

**Action:**
```jsonc
// tsconfig.app.json — add to compilerOptions:
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true,
```

After enabling, fix any new type errors that surface (e.g., adding `undefined` checks on indexed access).

---

## CR-02: Extract shared `formatDate` utility

**Priority:** Critical  
**Files:** `frontend/src/components/HitCard/HitCard.tsx:24-26`, `frontend/src/pages/DetailPage.tsx:6-11`  
**Problem:** Date formatting logic (timestamp → `YYYY-MM-DD`) is duplicated. This is connascence of algorithm — changes to one must be mirrored in the other.

`HitCard.tsx` has it inside `formatFieldValue`:
```typescript
if (type === "date" && typeof value === "number") {
  return new Date(value * 1000).toISOString().split("T")[0];
}
```

`DetailPage.tsx` has a standalone `formatDate`:
```typescript
function formatDate(value: unknown): string {
  if (typeof value === "number") {
    return new Date(value * 1000).toISOString().split("T")[0];
  }
  return String(value ?? "");
}
```

**Action:**
1. Create `frontend/src/utils/formatDate.ts` with a single exported `formatDate` function
2. Import and use in both `HitCard.tsx` and `DetailPage.tsx`
3. Delete the duplicated logic from both files

---

## CR-03: Define a proper `SearchHit` type

**Priority:** Critical  
**Files:** `frontend/src/components/HitCard/HitCard.tsx:6`, `frontend/src/pages/DetailPage.tsx:15`  
**Problem:** Both components type their hit data as `Record<string, unknown>`. Every property access (`hit.id`, `hit[searchConfig.titleField]`, `doc[field.key]`) is unsafe. This is the primary type safety gap in the codebase.

`hit.id` at `HitCard.tsx:45` is `unknown` but passed to `<Link to={/detail/${hit.id}}>` which expects a `string`.

**Action:**
1. Create `frontend/src/types/search.ts` defining:
   ```typescript
   export interface SearchHit {
     id: string | number;
     [key: string]: unknown;
   }
   ```
2. Update `HitCardProps.hit` from `Record<string, unknown>` to `SearchHit`
3. Update `DetailPage`'s `doc` state from `Record<string, unknown> | null` to `SearchHit | null`
4. This ensures `hit.id` is typed correctly and indexed access is explicit about `unknown`

---

## CR-04: Use Meilisearch client consistently in DetailPage

**Priority:** High  
**Files:** `frontend/src/pages/DetailPage.tsx:22-34`  
**Problem:** `App.tsx` sets up `instantMeiliSearch` as the search client, but `DetailPage` bypasses it entirely with a raw `fetch` call. This creates:
- Different error handling patterns
- Duplicate auth header construction
- No shared caching with the search client

**Action:**
1. Extract the Meilisearch client initialization from `App.tsx` to `frontend/src/config/searchClient.ts`
2. In `DetailPage`, import and use the same client for the detail fetch, or use the Meilisearch JS client's `getDocument()` method
3. This centralizes API configuration and removes the duplicate header/env-variable logic

---

## CR-05: Add React Error Boundary

**Priority:** High  
**Files:** `frontend/src/App.tsx`  
**Problem:** If any component throws during render (e.g., malformed hit data, unexpected `undefined`), the entire app crashes to a white screen. The V1 plan (`Phase 5`) calls for this, but it's not yet implemented.

**Action:**
1. Create `frontend/src/components/ErrorBoundary/ErrorBoundary.tsx` as a class component
2. Wrap `<Routes>` in `App.tsx` with the error boundary
3. Render a user-friendly fallback UI with a "Try again" button

---

## CR-06: Replace `cancelled` flag with `AbortController`

**Priority:** High  
**Files:** `frontend/src/pages/DetailPage.tsx:28-58`  
**Problem:** The `cancelled` boolean flag is a manual cancellation pattern. It doesn't abort the in-flight network request — it only ignores the response. `AbortController` is the standard web API and actually cancels the request.

**Action:**
Replace the `cancelled` flag pattern:
```typescript
const controller = new AbortController();
fetch(url, { signal: controller.signal, ...opts });
return () => controller.abort();
```

---

## CR-07: Add `vite-env.d.ts` for typed environment variables

**Priority:** Medium  
**Files:** Create `frontend/src/vite-env.d.ts`  
**Problem:** `import.meta.env.VITE_MEILISEARCH_URL` and `VITE_MEILISEARCH_API_KEY` are used without type declarations. They're typed as `any`, losing autocomplete and safety.

**Action:**
Create `frontend/src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MEILISEARCH_URL: string;
  readonly VITE_MEILISEARCH_API_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## CR-08: Remove non-null assertion in `main.tsx`

**Priority:** Medium  
**Files:** `frontend/src/main.tsx:8`  
**Problem:** `document.getElementById("root")!` uses a non-null assertion that silently fails if the element is missing.

**Action:**
```typescript
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(...);
```

---

## CR-09: Add `SearchPage` unit test

**Priority:** Medium  
**Files:** Create `frontend/src/pages/__tests__/SearchPage.test.tsx`  
**Problem:** `HitCard` and `DetailPage` have unit tests, but `SearchPage` has none. It renders `SearchBox` + `Hits` via InstantSearch widgets — a smoke test should confirm it renders without errors.

**Action:**
Create a smoke test that wraps `SearchPage` in `InstantSearch` with a mock client and verifies:
- SearchBox renders
- No console errors
- Component structure is correct

---

## CR-10: Refactor `DetailPage` fetch to `async/await`

**Priority:** Low  
**Files:** `frontend/src/pages/DetailPage.tsx:30-54`  
**Problem:** The `.then()` chain is harder to follow than the equivalent `async/await` pattern, especially with the `cancelled` flag interleaved.

**Action:**
After implementing CR-06 (AbortController), refactor to:
```typescript
useEffect(() => {
  if (!id) return;
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(url, { signal: controller.signal, ... });
      if (!res.ok) throw new Error(`Request failed (${res.status}).`);
      const data = await res.json();
      // ... set state
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      // ... setError
    }
  })();

  return () => controller.abort();
}, [id]);
```

---

## Dependency Map

Some items should be done in order:

```
CR-01 (strict mode)
  └── CR-03 (SearchHit type)  — fixing strict mode errors is easier with proper types

CR-02 (shared formatDate)
  └── independent, can be done first

CR-06 (AbortController)
  └── CR-10 (async/await)     — refactor after AbortController is in place

CR-04 (shared search client)  — independent
CR-05 (Error Boundary)        — independent
CR-07 (vite-env.d.ts)         — independent, quick win
CR-08 (main.tsx assertion)    — independent, quick win
CR-09 (SearchPage test)       — independent
```

## Quick Wins

These can be done in minutes with minimal risk:
- CR-07: `vite-env.d.ts`
- CR-08: Remove non-null assertion
- CR-02: Extract `formatDate`
