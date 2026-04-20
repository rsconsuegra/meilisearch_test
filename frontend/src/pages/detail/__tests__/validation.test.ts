import { describe, expect, it } from "vitest";

import { validateDetailId } from "../validation";

describe("validateDetailId", () => {
  it("returns valid numeric id", () => {
    expect(validateDetailId("11")).toBe("11");
  });

  it("throws for undefined", () => {
    expect(() => validateDetailId(undefined)).toThrow();
  });

  it("throws for non-numeric id", () => {
    expect(() => validateDetailId("abc")).toThrow();
  });

  it("throws for SQL injection attempt", () => {
    expect(() => validateDetailId("11 OR 1=1")).toThrow();
  });
});
