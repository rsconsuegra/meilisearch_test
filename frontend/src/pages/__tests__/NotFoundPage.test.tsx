import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import NotFoundPage from "../../pages/NotFoundPage";

function renderAtNotFound() {
  return render(
    <MemoryRouter initialEntries={["/nonexistent"]}>
      <Routes>
        <Route path="/nonexistent" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("NotFoundPage", () => {
  it("renders page not found heading", () => {
    renderAtNotFound();
    expect(screen.getByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });

  it("renders explanation text", () => {
    renderAtNotFound();
    expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();
  });

  it("renders a link back to search", () => {
    renderAtNotFound();
    const link = screen.getByRole("link", { name: /back to search/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("has a CSS Module class on the container", () => {
    renderAtNotFound();
    const heading = screen.getByRole("heading", { level: 1 });
    const container = heading.closest("div");
    expect(container).not.toBeNull();
    expect(container!.className).not.toBe("");
  });
});
