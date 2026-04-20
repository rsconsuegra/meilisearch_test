import { describe, expect, it } from "vitest";

import { buildIdFilter } from "../meiliFilters";

describe("buildIdFilter", () => {
  it("builds an id filter for valid numeric ids", () => {
    expect(buildIdFilter("11")).toBe("id = 11");
  });

  it("throws for non-numeric ids", () => {
    expect(() => buildIdFilter("11 OR 1=1")).toThrow("Invalid document ID.");
  });
});
