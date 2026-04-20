/**
 * Navigation reset protocol.
 *
 * When navigating from the detail page back to search via the Header link,
 * InstantSearch must be remounted to pick up the correct URL routing state.
 * This is achieved by passing a unique `key` prop to `<InstantSearch>`.
 *
 * Flow:
 *   1. Header link calls `navigate("/", { state: createResetState() })`
 *   2. SearchPage reads `getResetKey(location.state)` from router state
 *   3. The returned timestamp is used as `<InstantSearch key={resetKey}>`
 *   4. React unmounts the old InstantSearch and mounts a fresh instance
 *   5. The new instance reads the current URL and restores search state correctly
 *
 * Without this protocol, navigating back via the Header link would cause
 * InstantSearch to lose URL routing state (page number, query, etc.).
 */

export const RESET_STATE_KEY = "_ts" as const;

export interface ResetState {
  [RESET_STATE_KEY]: number;
}

export function createResetState(): ResetState {
  return { [RESET_STATE_KEY]: Date.now() };
}

function isResetState(state: unknown): state is ResetState {
  if (!state || typeof state !== "object") return false;

  const value = (state as Record<string, unknown>)[RESET_STATE_KEY];
  return typeof value === "number" && Number.isFinite(value);
}

export function getResetKey(state: unknown): number | "stable" {
  if (!isResetState(state)) return "stable";
  return state[RESET_STATE_KEY];
}
