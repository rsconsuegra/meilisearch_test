import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CustomPagination from "../CustomPagination";

const mockUsePagination = vi.fn();

vi.mock("react-instantsearch", () => ({
  usePagination: () => mockUsePagination(),
}));

function renderPagination(overrides: Record<string, unknown> = {}) {
  mockUsePagination.mockReturnValue({
    currentRefinement: 0,
    nbPages: 5,
    refine: vi.fn(),
    canRefine: true,
    ...overrides,
  });

  return render(<CustomPagination />);
}

describe("CustomPagination", () => {
  it("renders pagination nav with CSS Module class", () => {
    renderPagination();
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav.className).not.toBe("");
  });

  it("renders page buttons with CSS Module class", () => {
    renderPagination();
    const buttons = screen.getAllByRole("button").filter((b) => b.textContent?.match(/^\d+$/));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.className).not.toBe("");
    });
  });

  it("active page button has active CSS Module class", () => {
    renderPagination({ currentRefinement: 1 });
    const page2 = screen.getByRole("button", { name: "Page 2" });
    expect(page2.className).toContain("buttonActive");
  });

  it("previous/next buttons have CSS Module class", () => {
    renderPagination();
    const prev = screen.getByRole("button", { name: "Previous page" });
    const next = screen.getByRole("button", { name: "Next page" });
    expect(prev.className).not.toBe("");
    expect(next.className).not.toBe("");
  });

  it("disabled buttons have disabled CSS Module class", () => {
    renderPagination({ currentRefinement: 0 });
    const prev = screen.getByRole("button", { name: "Previous page" });
    expect(prev.className).toContain("buttonDisabled");
    expect(prev).toBeDisabled();
  });

  it("returns null when only one page", () => {
    renderPagination({ nbPages: 1 });
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
