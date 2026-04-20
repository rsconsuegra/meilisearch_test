import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnvError from "../EnvError";

describe("EnvError", () => {
  it("renders the error message passed as prop", () => {
    render(<EnvError message="Missing environment variable: VITE_MEILISEARCH_URL" />);
    expect(
      screen.getByText("Missing environment variable: VITE_MEILISEARCH_URL"),
    ).toBeInTheDocument();
  });

  it("renders Configuration Error heading", () => {
    render(<EnvError message="test" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Configuration Error");
  });

  it("renders with themed CSS module class on container", () => {
    const { container } = render(<EnvError message="test" />);
    expect(container.querySelector("[class*='container']")).toBeInTheDocument();
  });

  it("renders hint text referencing env files", () => {
    render(<EnvError message="test" />);
    expect(screen.getByText(/check your/i)).toBeInTheDocument();
  });
});
