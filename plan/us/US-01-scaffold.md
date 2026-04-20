# US-01: Scaffold React + TypeScript app with Vite

**As a** developer, **I want** a React + TypeScript project scaffolded in `/frontend` **so that** I have a working build pipeline for the search UI.

## Scope

- Run `npm create vite@latest frontend -- --template react-ts` from the repo root
- Verify the scaffold compiles and runs with `npm run dev` in `/frontend`
- Create `/frontend/.env.example` with:
  ```
  VITE_MEILISEARCH_URL=http://localhost:7700
  VITE_MEILISEARCH_API_KEY=
  ```
- Create `/frontend/.env` with actual values (gitignored)
- Add `/frontend/.env` to `frontend/.gitignore` (or extend root `.gitignore`)
- Ensure Node 24.13.0 is used (per root `.nvmrc`)
- Delete any Vite boilerplate that isn't needed (default `App.css`, `index.css` content, `App.tsx` demo code)

## Acceptance Criteria

- [ ] `npm run dev` starts the Vite dev server without errors
- [ ] `npm run build` completes without TypeScript errors
- [ ] `/frontend/.env` exists with both `VITE_` variables populated
- [ ] `/frontend/.env` is gitignored
- [ ] No Vite boilerplate content renders — `App.tsx` contains a minimal empty component
