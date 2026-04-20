import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FilterSidebar from "../FilterSidebar";

vi.mock("react-instantsearch", () => ({
  ClearRefinements: () => <div data-testid="mock-clear-refinements" />,
  RefinementList: ({ attribute }: { attribute: string }) => (
    <div data-testid={`mock-refinement-${attribute}`} data-attribute={attribute} />
  ),
}));

describe("FilterSidebar", () => {
  it("renders sidebar aside element", () => {
    render(<FilterSidebar />);
    const aside = document.querySelector("aside");
    expect(aside).not.toBeNull();
  });

  it("renders sidebar toggle button", () => {
    render(<FilterSidebar />);
    expect(screen.getByRole("button", { name: /filters/i })).toBeInTheDocument();
  });

  it("renders ClearRefinements", () => {
    render(<FilterSidebar />);
    expect(screen.getByTestId("mock-clear-refinements")).toBeInTheDocument();
  });

  it("renders RefinementList for each filterableField", () => {
    render(<FilterSidebar />);
    const refinement = screen.getByTestId("mock-refinement-genres");
    expect(refinement).toBeInTheDocument();
    expect(refinement.dataset.attribute).toBe("genres");
  });

  it("renders filter heading labels from config", () => {
    render(<FilterSidebar />);
    expect(screen.getByText("Genre")).toBeInTheDocument();
  });

  it("applies CSS Module classes to sidebar", () => {
    render(<FilterSidebar />);
    const aside = document.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside!.className).not.toBe("");
  });

  it("applies CSS Module class to toggle button", () => {
    render(<FilterSidebar />);
    const toggle = screen.getByRole("button", { name: /filters/i });
    expect(toggle.className).not.toBe("");
  });
});
