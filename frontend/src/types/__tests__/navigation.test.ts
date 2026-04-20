import { describe, expect, it } from "vitest";

import { createResetState, getResetKey, RESET_STATE_KEY } from "../navigation";

describe("navigation reset state", () => {
  it("creates reset state with shared key", () => {
    const state = createResetState();

    expect(state).toHaveProperty(RESET_STATE_KEY);
    expect(typeof state[RESET_STATE_KEY]).toBe("number");
  });

  it("returns stable for invalid states", () => {
    expect(getResetKey(null)).toBe("stable");
    expect(getResetKey({})).toBe("stable");
    expect(getResetKey({ [RESET_STATE_KEY]: "bad" })).toBe("stable");
  });

  it("returns numeric reset key for valid state", () => {
    expect(getResetKey({ [RESET_STATE_KEY]: 42 })).toBe(42);
  });
});
