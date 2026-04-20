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
