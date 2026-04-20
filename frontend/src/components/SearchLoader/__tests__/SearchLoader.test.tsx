import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-instantsearch", async () => {
  const actual = await vi.importActual("react-instantsearch");
  return {
    ...actual,
    useSearchBox: () => ({ isSearchStalled: false }),
  };
});

import SearchLoader from "../SearchLoader";

describe("SearchLoader", () => {
  it("returns null when isSearchStalled is false", () => {
    const { container } = render(<SearchLoader isSearchStalled={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders spinner when isSearchStalled is true", () => {
    const { container } = render(<SearchLoader isSearchStalled={true} />);

    expect(container.querySelector("[class*='container']")).toBeInTheDocument();
    expect(container.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it("spinner container has CSS module class", () => {
    const { container } = render(<SearchLoader isSearchStalled={true} />);
    expect(container.querySelector("[class*='container']")).toBeInTheDocument();
  });
});
