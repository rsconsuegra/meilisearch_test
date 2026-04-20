# US-08: Layout shell with Header and responsive container

**As a** user, **I want** a consistent page layout with a header and properly spaced content **so that** the application feels organized and readable on any screen size.

## Scope

- Create `src/components/Header/Header.tsx`:
  - Renders `searchConfig.appTitle` as the page heading
  - Title is a `<Link>` to `/` (home)
  - Semantic `<header>` element
- Create `src/components/Layout/Layout.tsx`:
  - Wraps children in a centered container with `max-width: 1200px` and auto margins
  - Adds horizontal padding (e.g. `1rem`)
- Update `App.tsx`:
  - Render `<Header>` above `<Routes>` (outside route matching so it's always visible)
  - Wrap `<Routes>` in `<Layout>`
- Add responsive CSS for the hits container in `SearchPage.tsx`:
  - Hit cards render in a CSS grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
  - Gap between cards: `1.5rem`
  - On viewports < 640px: single column (minmax handles this naturally)
- Use inline styles or a shared CSS file (no CSS Modules yet — Phase 3)
- Update `SearchPage.tsx` to wrap `<Hits>` in a container element with the grid styles

## Acceptance Criteria

- [ ] `<header>` element is present in the DOM on every page (search and detail)
- [ ] Header displays the value of `searchConfig.appTitle` ("Movie Search")
- [ ] Clicking the header title navigates to `/`
- [ ] Main content is wrapped in a container with `max-width: 1200px` and centered via `margin: 0 auto`
- [ ] Container has horizontal padding of at least `1rem`
- [ ] On viewports ≥ 1024px: hit cards display in a multi-column grid (≥ 3 columns)
- [ ] On viewports 641–1023px: hit cards display in a 2-column grid
- [ ] On viewports ≤ 640px: hit cards display in a single column
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `Header.test.tsx`: Header renders `searchConfig.appTitle` text
- [ ] `Header.test.tsx`: Title text is wrapped in a `<Link>` pointing to `/`
- [ ] `Header.test.tsx`: Renders inside a `<header>` element
- [ ] `Layout.test.tsx`: Layout renders children inside the component
- [ ] `Layout.test.tsx`: Container element has `maxWidth: "1200px"` and `margin: "0 auto"`

## E2E Test Requirements

- [ ] Header is visible on the search page (`/`)
- [ ] Header is visible on the detail page (`/detail/11`)
- [ ] Clicking header title from `/detail/11` navigates to `/`
- [ ] On desktop viewport (1280px): hit cards render in a grid with ≥ 3 columns
- [ ] On mobile viewport (375px): hit cards render in a single column
