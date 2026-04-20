import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import RouteAwareErrorBoundary from "../RouteAwareErrorBoundary";

function CrashPage(): React.ReactElement {
  throw new Error("Boom");
}

function SafePage() {
  return <p>Safe page</p>;
}

describe("RouteAwareErrorBoundary", () => {
  it("resets after navigation to a different route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Link to="/safe">Go to safe</Link>
        <RouteAwareErrorBoundary>
          <Routes>
            <Route path="/" element={<CrashPage />} />
            <Route path="/safe" element={<SafePage />} />
          </Routes>
        </RouteAwareErrorBoundary>
      </MemoryRouter>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Go to safe" }));

    expect(screen.getByText("Safe page")).toBeInTheDocument();
  });
});
