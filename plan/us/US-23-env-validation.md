# US-23: Runtime environment variable validation

**As a** developer, **I want** required environment variables validated at app startup **so that** missing or invalid configuration fails immediately with a clear error message instead of a cryptic runtime crash.

## Scope

- Create `src/config/env.ts` with a `validateEnv()` function that checks:
  - `VITE_MEILISEARCH_URL` is present, non-empty, and a valid URL (has protocol and hostname)
  - `VITE_MEILISEARCH_API_KEY` is present and non-empty
  - Returns a typed `EnvConfig` object or throws with a specific error message per variable
- Create `src/components/EnvError/EnvError.tsx` — themed error screen displayed when env validation fails, listing which variables are missing or invalid
- Create `src/components/EnvError/EnvError.module.css` — styled with theme CSS variables, centered layout, error-specific styling
- Modify `src/main.tsx` — call `validateEnv()` before `createRoot()`, catch errors and render `<EnvError>` on failure

## Files

- CREATE: `src/config/env.ts` — `validateEnv()` function + `EnvConfig` type
- CREATE: `src/components/EnvError/EnvError.tsx` — error display component
- CREATE: `src/components/EnvError/EnvError.module.css` — themed error styles
- MODIFY: `src/main.tsx` — wrap app init in try/catch with env validation

## Acceptance Criteria

- [ ] When `VITE_MEILISEARCH_URL` is missing, a themed error screen shows "Missing environment variable: VITE_MEILISEARCH_URL"
- [ ] When `VITE_MEILISEARCH_API_KEY` is empty, a themed error screen shows "Missing environment variable: VITE_MEILISEARCH_API_KEY"
- [ ] When `VITE_MEILISEARCH_URL` is not a valid URL (e.g. `"not-a-url"`), error screen shows "Invalid URL format: VITE_MEILISEARCH_URL"
- [ ] When both required vars are valid, the app renders normally with no error
- [ ] `validateEnv()` runs synchronously before React mounts
- [ ] Error screen uses theme CSS variables (colors, font, radius)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` produces no errors

## Unit Test Requirements

- [ ] `src/config/__tests__/env.test.ts` (new): `validateEnv()` returns config object when all vars are valid
- [ ] `src/config/__tests__/env.test.ts`: `validateEnv()` throws with message containing "VITE_MEILISEARCH_URL" when the variable is `undefined`
- [ ] `src/config/__tests__/env.test.ts`: `validateEnv()` throws with message containing "VITE_MEILISEARCH_API_KEY" when the variable is empty string
- [ ] `src/config/__tests__/env.test.ts`: `validateEnv()` throws with message containing "Invalid URL" when `VITE_MEILISEARCH_URL` is `"not-a-url"`
- [ ] `src/config/__tests__/env.test.ts`: `validateEnv()` accepts `"http://localhost:7700"` as a valid URL
- [ ] `src/components/EnvError/__tests__/EnvError.test.tsx` (new): renders the error message passed as prop
- [ ] `src/components/EnvError/__tests__/EnvError.test.tsx`: renders with themed CSS module class on container
- [ ] `src/components/EnvError/__tests__/EnvError.test.tsx`: renders "Configuration Error" heading

## E2E Test Requirements

- [ ] With valid env vars, search page loads normally and search box is visible
- [ ] With `VITE_MEILISEARCH_URL` unset, app shows error screen containing "VITE_MEILISEARCH_URL"
- [ ] With `VITE_MEILISEARCH_API_KEY` empty, app shows error screen containing "VITE_MEILISEARCH_API_KEY"
