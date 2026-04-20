# Code Review: Frontend Remediation Plan (2026-04-20)

**Date:** 2026-04-20
**Scope:** Full `src/` — 33 source files, 21 test files, config
**Based on:** TypeScript + React 19 code review after Phase 5 completion
**Quality Gates:** lint pass | 82 tests pass | build clean

---

## 1) Objectives

1. Eliminate theme flash on initial page load for light-mode users.
2. Remove dead code and duplicated validation logic.
3. Close remaining type-safety bypasses (`as never`, double casts).
4. Decouple cross-module CSS imports that create hidden fragility.
5. Reduce CSS duplication across components.
6. Tighten FieldRenderer's prop types.

---

## 2) Non-Goals

- No visual redesign.
- No new dependencies unless strictly required.
- No architectural restructuring.
- No behavior changes beyond the issues listed.

---

## 3) Cross-Reference: Previously Fixed Issues

All issues from prior reviews (`2026-04-19-frontend-*`) are resolved:

| Prior ID            | Issue                                            | Status |
| ------------------- | ------------------------------------------------ | ------ |
| CR-11/CR-12/CR-13   | formatDate, ID sanitization, index signature     | Fixed  |
| CR-14/CR-15/CR-16   | DetailPage loader, component extraction, useMemo | Fixed  |
| CR-17/CR-18/CR-19   | ErrorBoundary reset, header nav, FieldRenderer   | Fixed  |
| CR-20/CR-21/CR-22   | InstantSearch scope, env config, code splitting  | Fixed  |
| RR-01 through RR-12 | All remediated or accepted with documentation    | Fixed  |
| VR-01 through VR-07 | All remediated                                   | Fixed  |
| P0-1 through P2-3   | All remediated                                   | Fixed  |

---

## 4) Issue Map and Priority

### P1 — High (Type safety, correctness, coupling)

| ID   | Issue                                                   | File(s)                            | Effort  |
| ---- | ------------------------------------------------------- | ---------------------------------- | ------- |
| F-01 | Theme flash on initial load (FOUC for light-mode users) | `ThemeToggle.tsx`, `index.html`    | Small   |
| F-02 | Duplicate ID validation (`/^\d+$/` in two places)       | `meiliFilters.ts`, `validation.ts` | Trivial |
| F-03 | Dead code: `getDetailValidationError` never called      | `validation.ts`                    | Trivial |
| F-04 | Type bypasses: `as unknown as` and `as never`           | `HitList.tsx`, `FieldRenderer.tsx` | Medium  |
| F-05 | `NotFoundPage` imports CSS from `DetailPage.module.css` | `NotFoundPage.tsx`                 | Small   |
| F-06 | Loose `type?: string` prop in FieldRenderer             | `FieldRenderer.tsx`                | Trivial |

### P2 — Medium (CSS duplication, maintainability)

| ID   | Issue                                                            | File(s)                                            | Effort  |
| ---- | ---------------------------------------------------------------- | -------------------------------------------------- | ------- |
| F-07 | Duplicate `@keyframes spin` in two CSS modules                   | `PageLoader.module.css`, `SearchLoader.module.css` | Trivial |
| F-08 | Duplicate `.backButton` styles in three CSS modules              | `DetailPage`, `DetailError`, `NotFoundPage`        | Small   |
| F-09 | Duplicate `.container` layout in three CSS modules               | `DetailPage`, `DetailError`, `EnvError`            | Small   |
| F-10 | `SearchPage.module.css` too large (~200 lines, many `:global()`) | `SearchPage.module.css`                            | Medium  |
| F-11 | `z-index: 9999` on decorative noise overlay                      | `theme.css`                                        | Trivial |

### P3 — Low (Hygiene, optimization)

| ID   | Issue                                                          | File(s)                  | Effort  |
| ---- | -------------------------------------------------------------- | ------------------------ | ------- |
| F-12 | `animationDelay` inline style computed per hit on every render | `HitList.tsx`            | Small   |
| F-13 | Missing `exactOptionalPropertyTypes` in tsconfig               | `tsconfig.app.json`      | Medium  |
| F-14 | Broad index signature on `SearchHit` — intentional, document   | `search.ts`              | Trivial |
| F-15 | `ErrorWithStatus` type name hides Meilisearch coupling         | `errorClassification.ts` | Trivial |
| F-16 | `@j178/prek` in devDependencies — purpose unclear (from RR-11) | `package.json`           | Trivial |

---

## 5) Implementation Plan

### Phase 1 — Quick wins and type safety (P1)

---

#### Task F-03: Remove dead code `getDetailValidationError`

**Files:** `src/pages/detail/validation.ts`

**Changes:**

- Delete the `getDetailValidationError` function (lines 8-11).
- Update any tests that reference it.

**Acceptance criteria:**

- [ ] `getDetailValidationError` removed from `validation.ts`
- [ ] All tests pass
- [ ] No remaining references to the function

---

#### Task F-06: Tighten FieldRenderer `type` prop

**Files:** `src/components/FieldRenderer/FieldRenderer.tsx`

**Changes:**

- Change `type?: string` to `type?: "text" | "badge" | "date"`.
- Import the `FieldConfig` type from `searchConfig.ts` and use `FieldConfig["type"]` if preferred.

**Acceptance criteria:**

- [ ] `FieldRendererProps.type` is `"text" | "badge" | "date" | undefined`
- [ ] All callers already pass valid types — no code changes needed elsewhere
- [ ] Build succeeds

---

#### Task F-02: Deduplicate ID validation

**Files:** `src/utils/meiliFilters.ts`, `src/pages/detail/validation.ts`

**Changes:**

- Import `validateDetailId` from `validation.ts` inside `meiliFilters.ts`.
- In `buildIdFilter`, call `validateDetailId(id)` to validate (it throws on invalid IDs).
- Remove the duplicate `/^\d+$/` regex from `buildIdFilter`.

**Acceptance criteria:**

- [ ] Single source of truth for ID validation in `validation.ts`
- [ ] `meiliFilters.ts` delegates to `validateDetailId`
- [ ] Existing tests for both modules still pass

---

#### Task F-01: Eliminate theme flash on initial load

**Files:** `src/components/ThemeToggle/ThemeToggle.tsx`, `index.html`

**Changes:**

- Add an inline `<script>` block in `index.html` (in `<head>`, before CSS links) that reads `localStorage.getItem("searcher-theme")` and sets `document.documentElement.setAttribute("data-theme", ...)` synchronously.
- This blocks rendering until the attribute is set, preventing the flash.
- Keep the React-based `applyTheme` in `ThemeToggle.tsx` for subsequent toggles.
- Fall back to `prefers-color-scheme` media query check in the inline script.

**Inline script logic:**

```
(function() {
  var stored = localStorage.getItem("searcher-theme");
  var theme = stored === "light" || stored === "dark" ? stored :
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
})();
```

**Acceptance criteria:**

- [ ] No flash of wrong theme on page load for light-mode users
- [ ] `data-theme` attribute set before first paint
- [ ] React `ThemeToggle` still works for runtime toggling
- [ ] E2E: page loads with correct `data-theme` attribute in HTML

---

#### Task F-04: Remove type safety bypasses

**Files:** `src/components/HitList/HitList.tsx`, `src/components/FieldRenderer/FieldRenderer.tsx`

**Changes for HitList.tsx:**

- Replace `hit as unknown as SearchHit & Record<string, unknown>` with a proper adapter.
- Create a typed `adaptInstantSearchHit(hit: Hit): SearchHit & Record<string, unknown>` function that validates the shape.
- Alternatively, use the existing `asSearchHit` which already validates, and pass the result down.

**Changes for FieldRenderer.tsx:**

- Replace `hit as never` with a more targeted cast.
- InstantSearch's `Highlight`/`Snippet` expect `Hit<Record<string, unknown>>`. Create a type alias:

  ```typescript
  type InstantSearchHit = Record<string, unknown>;
  ```

- Cast to `InstantSearchHit` instead of `never` — this is narrower and self-documenting.

**Acceptance criteria:**

- [ ] No `as never` in FieldRenderer
- [ ] No `as unknown as` double cast in HitList
- [ ] All tests pass
- [ ] Build succeeds

---

#### Task F-05: Decouple NotFoundPage CSS

**Files:** `src/pages/NotFoundPage.tsx`

**Changes:**

- Create `src/pages/NotFoundPage.module.css`.
- Move the CSS classes used by NotFoundPage (`.container`, `.title`, `.sectionContent`, `.backButton`) into the new module.
- Update `NotFoundPage.tsx` to import from its own module.

**Note:** This is the same pattern that was fixed for `DetailError` in RR-07.

**Acceptance criteria:**

- [ ] `NotFoundPage.tsx` no longer imports `DetailPage.module.css`
- [ ] `NotFoundPage.module.css` exists with all needed styles
- [ ] Visual appearance unchanged
- [ ] Build succeeds

---

### Phase 2 — CSS deduplication and maintainability (P2)

---

#### Task F-11: Lower noise overlay z-index

**Files:** `src/styles/theme.css`

**Changes:**

- Change `z-index: 9999` to `z-index: 1` on `body::after`.
- The overlay has `pointer-events: none` — it's purely decorative and doesn't need to be above modals, tooltips, or future overlays.

**Acceptance criteria:**

- [ ] `z-index` on `body::after` is ≤ 1
- [ ] Noise texture still visible
- [ ] `pointer-events: none` preserved

---

#### Task F-07: Deduplicate `@keyframes spin`

**Files:** `src/styles/theme.css`, `src/components/PageLoader/PageLoader.module.css`, `src/components/SearchLoader/SearchLoader.module.css`

**Changes:**

- Add `@keyframes spin` to `theme.css` as a global animation.
- Remove the duplicate `@keyframes spin` definitions from both CSS modules.
- Both modules already reference `spin` by name — the global definition makes it available.

**Acceptance criteria:**

- [ ] Single `@keyframes spin` definition in `theme.css`
- [ ] Both spinners still animate correctly
- [ ] No duplicate keyframes in CSS modules

---

#### Task F-08: Extract shared `.backButton` styles

**Files:** Create `src/styles/shared.module.css`, update `DetailPage.module.css`, `DetailError.module.css`, `NotFoundPage.module.css`

**Changes:**

- Create `src/styles/shared.module.css` with a `.backButton` class containing the common styles:

  ```css
  .backButton {
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    gap: 0.25rem;
    padding: 0;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }
  .backButton:hover {
    opacity: 0.8;
  }
  ```

- Import and use `sharedStyles.backButton` in DetailPage, DetailError, and NotFoundPage.
- Remove the duplicated `.backButton` definitions from each module.

**Acceptance criteria:**

- [ ] Single `.backButton` definition in `shared.module.css`
- [ ] Three components import from shared module
- [ ] Visual appearance unchanged

---

#### Task F-09: Extract shared `.pageContainer` layout

**Files:** `src/styles/shared.module.css`, `DetailPage.module.css`, `DetailError.module.css`, `EnvError.module.css`

**Changes:**

- Add to `shared.module.css`:

  ```css
  .pageContainer {
    margin: 0 auto;
    max-width: 800px;
    padding: 2.5rem 1rem;
  }
  ```

- Import and use in the three components.
- Remove duplicated `.container` layout from each module (keep component-specific overrides).

**Acceptance criteria:**

- [ ] Single `.pageContainer` definition
- [ ] All three pages use shared layout
- [ ] Visual appearance unchanged

---

#### Task F-10: Split SearchPage.module.css

**Files:** `src/pages/SearchPage.module.css`

**Changes:**

- Extract search box overrides into `src/components/SearchBox/SearchBoxOverrides.module.css`.
- Extract sidebar/filter overrides into `src/components/Sidebar/SidebarOverrides.module.css`.
- Keep search layout and main area styles in `SearchPage.module.css`.
- Import the extracted modules in `SearchPage.tsx` and pass appropriate class names.

**Acceptance criteria:**

- [ ] `SearchPage.module.css` is ≤ 80 lines
- [ ] InstantSearch widget overrides are in dedicated modules
- [ ] Visual appearance unchanged
- [ ] Build succeeds

---

### Phase 3 — Hygiene and optimization (P3)

---

#### Task F-12: Replace `animationDelay` inline styles with CSS

**Files:** `src/components/HitList/HitList.tsx`, `src/components/HitList/HitList.module.css`

**Changes:**

- Remove `style={{ animationDelay:`${index \* 60}ms`}}` from `HitList.tsx`.
- Add CSS rules in `HitList.module.css`:

  ```css
  .hitItem:nth-child(1) {
    animation-delay: 0ms;
  }
  .hitItem:nth-child(2) {
    animation-delay: 60ms;
  }
  .hitItem:nth-child(3) {
    animation-delay: 120ms;
  }
  .hitItem:nth-child(4) {
    animation-delay: 180ms;
  }
  .hitItem:nth-child(5) {
    animation-delay: 240ms;
  }
  .hitItem:nth-child(6) {
    animation-delay: 300ms;
  }
  ```

  (Cover up to `hitsPerPage` — currently 12.)

- Alternatively, use a CSS custom property `--i` set via `style` and reference it in CSS: `animation-delay: calc(var(--i) * 60ms)`.

**Acceptance criteria:**

- [ ] No inline `style` prop on `<li>` in HitList
- [ ] Stagger animation still works
- [ ] All tests pass

---

#### Task F-15: Rename `ErrorWithStatus` to clarify Meilisearch coupling

**Files:** `src/utils/errorClassification.ts`

**Changes:**

- Rename `ErrorWithStatus` to `MeilisearchClientError`.
- Update the `statusCode` property comment to note it's Meilisearch-specific.

**Acceptance criteria:**

- [ ] Type name reflects its Meilisearch-specific nature
- [ ] Build succeeds

---

#### Task F-13: Add `exactOptionalPropertyTypes` to tsconfig

**Files:** `tsconfig.app.json`

**Changes:**

- Add `"exactOptionalPropertyTypes": true` to `compilerOptions`.
- Fix any surfaced issues (optional properties that explicitly allow `undefined`).

**Warning:** This may surface existing issues. Review before committing.

**Acceptance criteria:**

- [ ] Flag enabled in tsconfig
- [ ] All source files compile without errors
- [ ] Build succeeds

---

#### Task F-14: Document `SearchHit` index signature tradeoff

**Files:** `src/types/search.ts`

**Changes:**

- Add a JSDoc comment to `SearchHit` explaining why the broad index signature exists and that it's intentional for the schema-agnostic design.

**Acceptance criteria:**

- [ ] Comment explains the tradeoff
- [ ] `getField` helper documented as the safe access pattern

---

#### Task F-16: Clarify or remove `@j178/prek` dependency

**Files:** `package.json`

**Changes:**

- If `@j178/prek` is intentional (e.g., for pre-commit), document its purpose in a comment or in `package.json` description.
- If unused, remove from `devDependencies`.

**Acceptance criteria:**

- [ ] Dependency either has documented purpose or is removed
- [ ] `npm run build` succeeds after removal (if removed)

---

## 6) Test Plan

### Unit tests to add/update

| Task | Tests                                                               |
| ---- | ------------------------------------------------------------------- |
| F-03 | Remove `getDetailValidationError` tests if they exist               |
| F-02 | Update `meiliFilters` tests to verify delegation to `validation.ts` |
| F-04 | Update HitList tests for new adapter pattern                        |
| F-05 | Add NotFoundPage CSS module class assertions                        |
| F-01 | Add E2E test: `data-theme` set before first paint                   |

### Regression commands

```bash
npm run lint
npm run test
npm run build
```

---

## 7) Rollout Order

1. **F-03 → F-06 → F-02** — Trivial quick wins, no risk
2. **F-11** — Trivial CSS fix
3. **F-01** — Theme flash fix (small, high impact)
4. **F-04** — Type safety (medium effort, needs careful testing)
5. **F-05** — NotFoundPage CSS decoupling
6. **F-07 → F-08 → F-09** — CSS deduplication (can be done together)
7. **F-10** — SearchPage CSS split (medium effort)
8. **F-12 → F-15 → F-14 → F-16** — Low priority hygiene
9. **F-13** — `exactOptionalPropertyTypes` (last, may surface issues)

---

## 8) Risk and Mitigation

| Risk                                                            | Mitigation                                                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Inline script in `index.html` breaks CSP                        | Script is inline and synchronous — compatible with strict CSP. No external loads.                       |
| CSS deduplication changes specificity                           | Extract to shared module preserves class names; test visually after each change.                        |
| `exactOptionalPropertyTypes` surfaces many issues               | Run last; review each surfaced issue individually.                                                      |
| FieldRenderer type narrowing breaks InstantSearch widget typing | Test with `Highlight` and `Snippet` components — may need `Record<string, unknown>` instead of `never`. |
| SearchPage CSS split changes override specificity               | Extracted modules may need `:global()` wrappers preserved exactly as-is.                                |

---

## 9) Definition of Done

- All P1 items implemented.
- P2 items implemented or explicitly deferred with rationale.
- P3 items implemented or deferred.
- `lint`, `test`, and `build` pass.
- No new type assertions introduced.
- No new `any` types introduced.
- No cross-module CSS imports remain.
- Visual regression verified (manual spot-check on search + detail pages).
