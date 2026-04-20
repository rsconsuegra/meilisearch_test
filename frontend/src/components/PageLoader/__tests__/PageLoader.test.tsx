import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageLoader from "../PageLoader";

describe("PageLoader", () => {
  it("renders a container with CSS module class", () => {
    const { container } = render(<PageLoader />);
    expect(container.querySelector("[class*='container']")).toBeInTheDocument();
  });

  it("renders spinner element with animation class", () => {
    const { container } = render(<PageLoader />);
    expect(container.querySelector("[class*='spinner']")).toBeInTheDocument();
  });

  it("renders Loading accessibility text", () => {
    render(<PageLoader />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading\u2026");
  });

  it("renders visible Loading label", () => {
    render(<PageLoader />);
    expect(screen.getByText("Loading\u2026")).toBeInTheDocument();
  });
});
