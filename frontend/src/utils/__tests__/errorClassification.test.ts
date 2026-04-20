import { describe, expect, it } from "vitest";

import { getErrorMessage, isMeilisearchError, isNetworkError } from "../errorClassification";

describe("isMeilisearchError", () => {
  it("returns true for TypeError with 'Failed to fetch'", () => {
    expect(isMeilisearchError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("returns true for TypeError with 'NetworkError'", () => {
    expect(isMeilisearchError(new TypeError("NetworkError when attempting to fetch"))).toBe(true);
  });

  it("returns true for error with statusCode 401", () => {
    const err = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    expect(isMeilisearchError(err)).toBe(true);
  });

  it("returns true for error with statusCode 403", () => {
    const err = Object.assign(new Error("Forbidden"), { statusCode: 403 });
    expect(isMeilisearchError(err)).toBe(true);
  });

  it("returns true for error with statusCode 503", () => {
    const err = Object.assign(new Error("Service Unavailable"), { statusCode: 503 });
    expect(isMeilisearchError(err)).toBe(true);
  });

  it("returns false for generic Error", () => {
    expect(isMeilisearchError(new Error("random"))).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("returns connection message for network TypeError", () => {
    const msg = getErrorMessage(new TypeError("Failed to fetch"));
    expect(msg).toContain("Unable to connect to the search engine");
  });

  it("returns auth message for 401 error", () => {
    const err = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    expect(getErrorMessage(err)).toContain("Authentication failed");
  });

  it("returns auth message for 403 error", () => {
    const err = Object.assign(new Error("Forbidden"), { statusCode: 403 });
    expect(getErrorMessage(err)).toContain("Authentication failed");
  });

  it("returns generic message for non-Meilisearch error", () => {
    expect(getErrorMessage(new Error("random"))).toBe("random");
  });
});

describe("isNetworkError", () => {
  it("returns true for TypeError with 'Failed to fetch'", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("returns false for generic Error", () => {
    expect(isNetworkError(new Error("random"))).toBe(false);
  });
});
