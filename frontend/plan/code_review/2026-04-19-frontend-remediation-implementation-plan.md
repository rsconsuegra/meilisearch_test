# Frontend Remediation Implementation Plan

**Date:** 2026-04-19
**Scope:** `src/` + tests + selected config usage hardening
**Based on:** Latest TypeScript + React 19 code review findings

---

## 1) Objectives

1. Remove remaining runtime-risk bugs in data rendering and route transitions.
2. Close type-safety gaps that still rely on unchecked assertions.
3. Stabilize routing/search reset behavior without hidden contracts.
4. Reduce coupling between UI, router state, and backend filter syntax.
5. Keep all current behavior intact unless explicitly improved (no product-scope expansion).

---

## 2) Non-Goals

- No visual redesign.
- No migration to a new state-management library.
- No broad router rewrite unless needed for a specific fix.
- No backend API contract changes.

---

## 3) Issue Map and Priority

## P0 (Critical)

- **P0-1**: Stale detail state when `:id` changes (`DetailPage` fetch lifecycle not reset).
- **P0-2**: `formatDate` may throw on invalid dates due to direct `toISOString()`.
- **P0-3**: `asSearchHit` still ends with assertion cast (`as SearchHit`).

## P1 (High)

- **P1-1**: ErrorBoundary does not reset on route changes.
- **P1-2**: Header reset navigation depends on anchor + `preventDefault` workaround.
- **P1-3**: Detail query string filter logic coupled in page component.
- **P1-4**: `hitsPerPage` env parsing is permissive and unvalidated.

## P2 (Medium)

- **P2-1**: `getResetKey` uses unchecked cast from `unknown`.
- **P2-2**: Header test hardcodes `_ts` contract instead of shared constant.
- **P2-3**: `DetailPage` still mixes route validation, fetching, and presentation.

---

## 4) Implementation Plan

### Phase 1 - Runtime correctness and type safety (P0)

### Task P0-1: Reset detail fetch state on id transition

**Files:**

- `src/pages/DetailPage.tsx`

**Changes:**

- At effect start (after validation passes), reset transient state:
  - `setLoading(true)`
  - `setError(null)`
  - `setDoc(null)`
- Keep current `AbortController` cleanup.
- Ensure no stale data renders between id changes.

**Acceptance criteria:**

- Navigating `/detail/11 -> /detail/12` never shows previous doc while loading.
- Invalid id path still returns validation message immediately.

---

### Task P0-2: Harden date formatting against invalid inputs

**Files:**

- `src/utils/formatDate.ts`

**Changes:**

- Add safe date normalization helper:
  - Build `Date` instance.
  - Validate with `Number.isNaN(date.getTime())`.
  - Only call `toISOString()` for valid dates.
- Keep output contract stable: `YYYY-MM-DD`, fallback to original string (or `""` for nullish).

**Acceptance criteria:**

- No throw for invalid numeric/string values.
- Existing valid timestamps/ISO strings still format identically.

---

### Task P0-3: Remove terminal cast from `asSearchHit`

**Files:**

- `src/types/search.ts`
- `src/components/HitList/HitList.tsx`

**Changes:**

- Replace `as SearchHit` with a typed constructor path:
  - Validate `raw` has an `id` candidate (`objectID` or `id`) as `string | number`.
  - Return a structurally built `SearchHit` object without broad assertion.
- Add narrow runtime guards (`typeof` checks) before constructing output.

**Acceptance criteria:**

- No `as unknown as` and no terminal broad cast in adapter.
- Invalid hits fail fast with explicit error.

---

### Phase 2 - Routing and coupling hardening (P1)

### Task P1-1: Reset ErrorBoundary on route transitions

**Files:**

- `src/App.tsx`
- `src/components/ErrorBoundary/ErrorBoundary.tsx` (only if needed)

**Preferred approach:**

- Introduce a tiny wrapper that reads `useLocation()` and keys `ErrorBoundary` by location key/pathname.
- Keep class boundary implementation intact.

**Acceptance criteria:**

- If an error occurs on one route, navigation to another route recovers automatically.
- Retry button behavior remains unchanged.

---

### Task P1-2: Formalize search reset navigation contract

**Files:**

- `src/components/Header/Header.tsx`
- `src/types/navigation.ts`
- `src/pages/SearchPage.tsx`

**Changes:**

- Keep current behavior (needed for InstantSearch limitation) but harden semantics:
  - Centralize state shape and runtime validation in `navigation.ts`.
  - Ensure `getResetKey` is a true type guard flow (not cast-based).
- Optional ergonomic improvement: replace anchor with button-styled control for explicit action semantics if product allows.

**Acceptance criteria:**

- Header click always resets SearchPage pagination/query state as currently intended.
- No raw magic key usage outside `navigation.ts`.

---

### Task P1-3: Decouple Meilisearch filter construction

**Files:**

- `src/pages/DetailPage.tsx`
- `src/config/searchClient.ts` or new helper (recommended: `src/utils/meiliFilters.ts`)

**Changes:**

- Extract filter expression construction to a single helper (e.g., `buildIdFilter(id: string)`), including validation/escaping policy.
- Page calls helper; helper owns filter syntax details.

**Acceptance criteria:**

- `DetailPage` no longer contains raw `id = ${id}` string template.
- Filter generation is unit-testable in isolation.

---

### Task P1-4: Validate env-derived numeric config

**Files:**

- `src/config/searchConfig.ts`

**Changes:**

- Replace `Number(...) || 12` with explicit parser:
  - Parse integer.
  - Enforce positive range (`>= 1`), fallback otherwise.
- Keep default value at `12`.

**Acceptance criteria:**

- Invalid env values cannot silently produce unexpected values.
- `hitsPerPage` is always a positive integer.

---

### Phase 3 - Maintainability cleanup (P2)

### Task P2-1: Replace cast in `getResetKey` with runtime type guard

**Files:**

- `src/types/navigation.ts`

**Changes:**

- Add `isResetState(value: unknown): value is ResetState` guard.
- `getResetKey` uses guard, returns `"stable"` on mismatch.

**Acceptance criteria:**

- No cast required from `unknown` for reset-key read.

---

### Task P2-2: Align tests with shared navigation contract

**Files:**

- `src/components/Header/__tests__/Header.test.tsx`

**Changes:**

- Import `RESET_STATE_KEY` from `src/types/navigation.ts`.
- Assert navigate state via shared constant rather than literal `_ts`.

**Acceptance criteria:**

- Contract rename in one place updates test expectations automatically.

---

### Task P2-3: Separate DetailPage concerns incrementally

**Files:**

- `src/pages/DetailPage.tsx`
- optional new modules:
  - `src/pages/detail/validation.ts`
  - `src/pages/detail/fetchDetail.ts`

**Changes:**

- Move id validation and fetch routine into pure helpers.
- Keep component focused on rendering + orchestrating hook calls.
- Avoid full architectural rewrite; keep behavior stable.

**Acceptance criteria:**

- `DetailPage` logic becomes easier to test and reason about.
- Existing UI output and route behavior unchanged.

---

## 5) Test Plan

### Unit tests to add/update

1. **`formatDate` tests**
   - invalid number/string does not throw
   - valid timestamp and valid ISO still produce `YYYY-MM-DD`

2. **`asSearchHit` tests**
   - prefers `objectID`, falls back to `id`
   - throws for missing/invalid identifiers

3. **`navigation` tests**
   - `createResetState` shape
   - `getResetKey` returns `"stable"` for invalid states

4. **`DetailPage` tests**
   - id change resets loading state and clears stale content
   - filter helper integration path

5. **Error boundary integration test**
   - simulate error on route A, navigate to route B, confirm recovery

### Regression commands

- `npm run lint`
- `npm run test`
- `npm run build`

---

## 6) Rollout Order

1. Implement all P0 tasks first and run full regression.
2. Implement P1 tasks in this order: P1-4 -> P1-3 -> P1-1 -> P1-2.
3. Implement P2 cleanup tasks.
4. Final full verification and diff review for accidental behavior drift.

---

## 7) Risk and Mitigation

- **Risk:** Search reset behavior regresses due to router/InstantSearch interplay.
  **Mitigation:** Keep existing reset behavior contract; add dedicated interaction test.

- **Risk:** ErrorBoundary reset could mask recurring errors.
  **Mitigation:** preserve `componentDidCatch` logging and ensure retry path still explicit.

- **Risk:** Strict adapter validation may reject edge-case backend hits.
  **Mitigation:** fail with descriptive error and add fixture-based tests covering expected hit shapes.

---

## 8) Definition of Done

- All P0 + P1 items implemented.
- P2 items implemented or explicitly deferred with rationale.
- `lint`, `test`, and `build` pass.
- No new broad type assertions introduced.
- Navigation reset and route recovery behaviors are covered by tests.
