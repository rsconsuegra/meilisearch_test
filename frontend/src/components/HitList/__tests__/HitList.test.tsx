import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HitList from "../HitList";

vi.mock("react-instantsearch", () => ({
  useHits: () => ({ hits: [] }),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("HitList", () => {
  it("shows empty state when no hits", () => {
    render(<HitList />);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("empty state has a CSS Module class", () => {
    render(<HitList />);
    const el = screen.getByText("No results found.");
    expect(el.className).not.toBe("");
  });
});
