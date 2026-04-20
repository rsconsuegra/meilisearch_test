import { describe, expect, it } from "vitest";

import { getExtraFields } from "../fieldFormatter";

describe("getExtraFields", () => {
  const doc = {
    id: 11,
    title: "Star Wars",
    poster: "https://example.com/starwars.jpg",
    overview: "Princess Leia is captured.",
    genres: ["Adventure"],
    release_date: 233366400,
    someExtraField: "extra value",
  };

  const displayFields = [
    { key: "overview", label: "Synopsis" },
    { key: "genres", label: "Genres" },
    { key: "release_date", label: "Release Date" },
  ];

  it("excludes titleField, imageField, and displayFields", () => {
    const result = getExtraFields(doc, "title", "poster", displayFields);
    const keys = result.map(([key]) => key);
    expect(keys).not.toContain("title");
    expect(keys).not.toContain("poster");
    expect(keys).not.toContain("overview");
    expect(keys).not.toContain("genres");
    expect(keys).not.toContain("release_date");
  });

  it("includes fields not in config", () => {
    const result = getExtraFields(doc, "title", "poster", displayFields);
    const keys = result.map(([key]) => key);
    expect(keys).toContain("id");
    expect(keys).toContain("someExtraField");
  });

  it("handles null imageField", () => {
    const result = getExtraFields(doc, "title", null, displayFields);
    const keys = result.map(([key]) => key);
    expect(keys).not.toContain("title");
    expect(keys).toContain("poster");
  });

  it("returns empty array when all fields are configured", () => {
    const allDoc = { id: 1, title: "Test", poster: "img.jpg" };
    const result = getExtraFields(allDoc, "title", "poster", []);
    expect(result).toEqual([["id", 1]]);
  });
});
