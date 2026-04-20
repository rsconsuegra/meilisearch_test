import { describe, expect, it } from "vitest";

import { asSearchHit } from "../search";

describe("asSearchHit", () => {
  it("uses objectID when present", () => {
    const hit = asSearchHit({ objectID: "abc", title: "Alien" });
    expect(hit.id).toBe("abc");
  });

  it("falls back to id when objectID is missing", () => {
    const hit = asSearchHit({ id: 11, title: "Star Wars" });
    expect(hit.id).toBe(11);
  });

  it("throws when objectID/id are invalid", () => {
    expect(() => asSearchHit({ title: "Missing id" })).toThrow(
      "Hit is missing a valid objectID or id",
    );
    expect(() => asSearchHit({ objectID: null })).toThrow("Hit is missing a valid objectID or id");
  });
});
