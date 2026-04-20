import { describe, expect, it } from "vitest";

import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("formats unix timestamps in seconds", () => {
    expect(formatDate(233366400)).toBe("1977-05-25");
  });

  it("formats ISO date strings", () => {
    expect(formatDate("1977-05-25T00:00:00.000Z")).toBe("1977-05-25");
  });

  it("returns invalid strings unchanged", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("does not throw for invalid numbers", () => {
    expect(() => formatDate(Number.NaN)).not.toThrow();
    expect(formatDate(Number.NaN)).toBe("");
  });
});
