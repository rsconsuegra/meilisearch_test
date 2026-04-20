import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "../ErrorBoundary";

function ThrowPage({ error }: { error: Error }): React.ReactElement {
  throw error;
}

describe("ErrorBoundary", () => {
  it("renders generic fallback for non-Meilisearch errors", () => {
    render(
      <ErrorBoundary>
        <ThrowPage error={new Error("Test error")} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders connection message for network TypeError", () => {
    render(
      <ErrorBoundary>
        <ThrowPage error={new TypeError("Failed to fetch")} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Search service error")).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to the search engine/)).toBeInTheDocument();
  });

  it("renders auth message for 401 error", () => {
    const err = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    render(
      <ErrorBoundary>
        <ThrowPage error={err} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Search service error")).toBeInTheDocument();
    expect(screen.getByText(/Authentication failed/)).toBeInTheDocument();
  });

  it("retry button reloads page for network errors", () => {
    const reloadMock = vi.fn();
    vi.stubGlobal("location", { reload: reloadMock });

    render(
      <ErrorBoundary>
        <ThrowPage error={new TypeError("Failed to fetch")} />
      </ErrorBoundary>,
    );

    screen.getByRole("button", { name: "Try again" }).click();
    expect(reloadMock).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });

  it("retry button resets state for non-network errors", () => {
    let shouldThrow = true;

    function ConditionalThrow(): React.ReactElement {
      if (shouldThrow) throw new Error("Test error");
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    shouldThrow = false;
    act(() => {
      screen.getByRole("button", { name: "Try again" }).click();
    });

    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });

  it("fallback has CSS Module classes", () => {
    render(
      <ErrorBoundary>
        <ThrowPage error={new Error("Test error")} />
      </ErrorBoundary>,
    );

    const heading = screen.getByText("Something went wrong");
    expect(heading.className).not.toBe("");

    const button = screen.getByRole("button", { name: "Try again" });
    expect(button.className).not.toBe("");
  });

  it("contextual error has distinct CSS class", () => {
    render(
      <ErrorBoundary>
        <ThrowPage error={new TypeError("Failed to fetch")} />
      </ErrorBoundary>,
    );

    const container = screen.getByText("Search service error").closest("div");
    expect(container!.className).toMatch(/contextual/);
  });
});
