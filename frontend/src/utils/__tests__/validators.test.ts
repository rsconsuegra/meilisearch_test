import { describe, expect, it } from "vitest";

import { isValidNumericId } from "../validators";

describe("isValidNumericId", () => {
  it("returns true for numeric strings", () => {
    expect(isValidNumericId("1")).toBe(true);
    expect(isValidNumericId("123")).toBe(true);
  });

  it("returns false for non-numeric strings", () => {
    expect(isValidNumericId("abc")).toBe(false);
    expect(isValidNumericId("11 OR 1=1")).toBe(false);
    expect(isValidNumericId("")).toBe(false);
  });

  it("returns false for strings with spaces or special chars", () => {
    expect(isValidNumericId(" 11")).toBe(false);
    expect(isValidNumericId("11 ")).toBe(false);
    expect(isValidNumericId("1.1")).toBe(false);
  });
});
