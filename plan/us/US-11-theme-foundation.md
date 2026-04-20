# US-11: Theme CSS variables foundation

**As a** developer, **I want** a centralized theme system with CSS custom properties **so that** all Phase 3 styling stories reference a single source of truth for colors, spacing, and visual tokens.

## Scope

- Create `src/styles/theme.css` with CSS custom properties on `:root`
- Import `theme.css` in `main.tsx` **before** `satellite.css`
- Add base `body` styles (font-family, background color) using theme variables
- No component changes — purely additive

## Theme Variables

```
--color-accent: #4f46e5
--color-accent-hover: #4338ca
--color-bg: #f9fafb
--color-surface: #ffffff
--color-text: #111827
--color-text-secondary: #6b7280
--color-border: #e5e7eb
--color-badge-bg: #eef2ff
--color-badge-text: #4f46e5
--font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

## Acceptance Criteria

- [ ] `src/styles/theme.css` exists and declares all 16 CSS custom properties listed above on `:root`
- [ ] `body` rule in `theme.css` sets `background-color: var(--color-bg)` and `font-family: var(--font-family)`
- [ ] `theme.css` is imported in `main.tsx` before `satellite.css`
- [ ] No component files are modified
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] Verify `theme.css` file exists at `src/styles/theme.css`
- [ ] Verify `main.tsx` imports `./styles/theme.css` before `instantsearch.css`

## E2E Test Requirements

- [ ] Body element has `background-color` computed value matching `rgb(249, 250, 251)`
- [ ] Body element has `font-family` starting with `system-ui`
