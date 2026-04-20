import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { RESET_STATE_KEY } from "../../../types/navigation";
import Header from "../Header";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock("../../ThemeToggle/ThemeToggle", () => ({
  default: () => <button type="button">Toggle</button>,
}));

describe("Header", () => {
  it("renders the app title from searchConfig", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByText("Movie Search")).toBeInTheDocument();
  });

  it("renders an anchor with href /", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "Movie Search" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("calls navigate with state on click", () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Movie Search" }));

    expect(navigate).toHaveBeenCalledWith("/", {
      state: expect.objectContaining({ [RESET_STATE_KEY]: expect.any(Number) }),
    });
  });

  it("renders inside a header element", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const header = screen.getByTestId("app-header");
    expect(header.tagName).toBe("HEADER");
  });

  it("header element has a CSS Module class", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const header = screen.getByTestId("app-header");
    expect(header.className).not.toBe("");
  });

  it("link element has a CSS Module class", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "Movie Search" });
    expect(link.className).not.toBe("");
  });
});
