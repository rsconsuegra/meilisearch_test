# US-25: Themed page loading spinner

**As a** user, **I want** a visually consistent loading indicator during page transitions **so that** route changes feel smooth and intentional rather than showing bare text.

## Scope

- Create `src/components/PageLoader/PageLoader.tsx` — reusable spinner component used as Suspense fallback
- Create `src/components/PageLoader/PageLoader.module.css` — centered spinner with theme variables, larger than SearchLoader to indicate page-level transition
- Replace bare `<p>Loading…</p>` in `App.tsx` Suspense fallback with `<PageLoader />`

## Files

- CREATE: `src/components/PageLoader/PageLoader.tsx` — page-level spinner component
- CREATE: `src/components/PageLoader/PageLoader.module.css` — centered spinner styles
- MODIFY: `src/App.tsx` — replace inline `<p>Loading…</p>` with `<PageLoader />`

## Style Requirements

- Spinner: `40px` circle, `var(--color-accent)` border (`3px`), transparent top section, `0.8s linear` rotation
- Container: `display: flex`, centered both axes (`justify-content: center; align-items: center`), `min-height: 50vh`
- Optional: `Loading…` text below spinner in `var(--color-text-secondary)`, `font-size: 0.875rem`

## Acceptance Criteria

- [ ] `<PageLoader>` component renders a themed spinner with centered layout
- [ ] `<PageLoader>` is used as the `fallback` prop on `<Suspense>` in `App.tsx`
- [ ] Spinner uses CSS `@keyframes` rotation animation
- [ ] Spinner border color uses `var(--color-accent)` from theme
- [ ] Spinner is vertically centered on the page (not top-aligned)
- [ ] No bare `<p>Loading…</p>` remains in `App.tsx`
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `src/components/PageLoader/__tests__/PageLoader.test.tsx` (new): renders a container with CSS module class
- [ ] `src/components/PageLoader/__tests__/PageLoader.test.tsx`: container has centered layout styles (`flex`, `center`)
- [ ] `src/components/PageLoader/__tests__/PageLoader.test.tsx`: spinner element exists with animation CSS module class
- [ ] `src/components/PageLoader/__tests__/PageLoader.test.tsx`: renders "Loading…" accessibility text (via `aria-label` or visible text)

## E2E Test Requirements

- [ ] Navigate to a detail page — themed spinner is visible during lazy-load transition
- [ ] Spinner disappears once page content renders
- [ ] Spinner is centered vertically on the page (not top-aligned)
