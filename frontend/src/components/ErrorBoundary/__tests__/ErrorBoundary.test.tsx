import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorBoundary } from "../ErrorBoundary";

function ThrowPage(): React.ReactElement {
  throw new Error("Test error");
}

describe("ErrorBoundary", () => {
  it("fallback has CSS Module classes", () => {
    render(
      <ErrorBoundary>
        <ThrowPage />
      </ErrorBoundary>,
    );

    const heading = screen.getByText("Something went wrong");
    expect(heading.className).not.toBe("");

    const message = screen.getByText("Test error");
    expect(message.className).not.toBe("");

    const button = screen.getByRole("button", { name: "Try again" });
    expect(button.className).not.toBe("");
  });
});
