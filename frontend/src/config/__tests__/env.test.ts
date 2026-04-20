import { describe, expect, it } from "vitest";

import { validateEnv } from "../env";

describe("validateEnv", () => {
  it("returns config when all vars are valid", () => {
    const config = validateEnv({
      VITE_MEILISEARCH_URL: "http://localhost:7700",
      VITE_MEILISEARCH_API_KEY: "test-key",
    });

    expect(config.meilisearchUrl).toBe("http://localhost:7700");
    expect(config.meilisearchApiKey).toBe("test-key");
  });

  it("throws when VITE_MEILISEARCH_URL is undefined", () => {
    expect(() => validateEnv({ VITE_MEILISEARCH_API_KEY: "test-key" })).toThrow(
      "VITE_MEILISEARCH_URL",
    );
  });

  it("throws when VITE_MEILISEARCH_API_KEY is empty string", () => {
    expect(() =>
      validateEnv({
        VITE_MEILISEARCH_URL: "http://localhost:7700",
        VITE_MEILISEARCH_API_KEY: "",
      }),
    ).toThrow("VITE_MEILISEARCH_API_KEY");
  });

  it("throws when VITE_MEILISEARCH_URL is not a valid URL", () => {
    expect(() =>
      validateEnv({
        VITE_MEILISEARCH_URL: "not-a-url",
        VITE_MEILISEARCH_API_KEY: "test-key",
      }),
    ).toThrow("Invalid URL");
  });

  it("accepts http://localhost:7700 as a valid URL", () => {
    expect(() =>
      validateEnv({
        VITE_MEILISEARCH_URL: "http://localhost:7700",
        VITE_MEILISEARCH_API_KEY: "key",
      }),
    ).not.toThrow();
  });

  it("accepts https://meilisearch.example.com as a valid URL", () => {
    expect(() =>
      validateEnv({
        VITE_MEILISEARCH_URL: "https://meilisearch.example.com",
        VITE_MEILISEARCH_API_KEY: "key",
      }),
    ).not.toThrow();
  });

  it("rejects ftp:// URLs", () => {
    expect(() =>
      validateEnv({
        VITE_MEILISEARCH_URL: "ftp://example.com",
        VITE_MEILISEARCH_API_KEY: "key",
      }),
    ).toThrow("Invalid URL");
  });
});
