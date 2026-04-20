# US-12: Migrate existing styles to CSS Modules

**As a** developer, **I want** existing global CSS and inline styles migrated to CSS Modules **so that** Phase 3 styling stories follow a consistent component-scoped pattern.

## Scope

- Create `src/components/HitList/HitList.module.css` — move grid styles from `hits-grid.css`
- Create `src/components/Layout/Layout.module.css` — replace inline styles in `Layout.tsx`
- Update `HitList.tsx` to import and use CSS Module classes (replace `ais-Hits-list`/`ais-Hits-item` with module classes)
- Update `Layout.tsx` to use CSS Module class instead of inline `style` prop
- Delete `src/styles/hits-grid.css`
- Remove `hits-grid.css` import from `main.tsx`
- **No visual changes** — output must look identical

## Acceptance Criteria

- [ ] `src/styles/hits-grid.css` is deleted
- [ ] `main.tsx` no longer imports `./styles/hits-grid.css`
- [ ] `src/components/HitList/HitList.module.css` exists with the same grid styles (auto-fill, 280px min, 1.5rem gap)
- [ ] `src/components/Layout/Layout.module.css` exists with `max-width: 1200px`, `margin: 0 auto`, `padding: 0 1rem`
- [ ] `HitList.tsx` imports CSS Module and applies class to `<ol>` and `<li>` elements
- [ ] `Layout.tsx` imports CSS Module and applies class instead of using inline `style` prop
- [ ] Grid layout renders identically: multi-column on desktop, single column on mobile
- [ ] Layout renders identically: centered, max-width 1200px, padding 1rem
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `Layout.test.tsx` (update): verify container element has a CSS Module class (not empty className)
- [ ] `Layout.test.tsx` (update): remove inline style assertions (`maxWidth`, `margin`) — replace with className check
- [ ] `HitList` structure test: verify `<ol>` has a CSS Module class (not literal string `"ais-Hits-list"`)
- [ ] `HitList` structure test: verify `<li>` elements have CSS Module class (not literal string `"ais-Hits-item"`)

## E2E Test Requirements

- [ ] On desktop (1280px): hit cards render in a multi-column grid (≥ 3 columns) — same as before
- [ ] On mobile (375px): hit cards render in a single column — same as before
- [ ] Layout container is centered with max-width on desktop — same as before
