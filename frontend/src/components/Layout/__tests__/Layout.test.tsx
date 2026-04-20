import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Layout from "../Layout";

describe("Layout", () => {
  it("renders children inside the layout", () => {
    render(
      <Layout>
        <p>Child content</p>
      </Layout>,
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("has a CSS Module class applied", () => {
    render(
      <Layout>
        <p>Content</p>
      </Layout>,
    );
    const layout = screen.getByTestId("app-layout");
    expect(layout.className).not.toBe("");
  });
});
