import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FieldRenderer from "../FieldRenderer";

vi.mock("react-instantsearch", () => ({
  Highlight: ({ attribute }: { attribute: string | string[] }) => (
    <span data-testid="mock-highlight" data-attribute={JSON.stringify(attribute)} />
  ),
  Snippet: ({ attribute }: { attribute: string | string[] }) => (
    <span data-testid="mock-snippet" data-attribute={JSON.stringify(attribute)} />
  ),
}));

describe("FieldRenderer", () => {
  it("renders badge values as individual spans", () => {
    render(<FieldRenderer attribute="genres" value={["Adventure", "Action"]} type="badge" />);
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    const spans = screen.getAllByText(/Adventure|Action/);
    spans.forEach((span) => {
      expect(span.tagName).toBe("SPAN");
      expect(span.className).not.toBe("");
    });
  });

  it("renders text values in a div", () => {
    render(<FieldRenderer attribute="overview" value="Hello world" type="text" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Hello world").tagName).toBe("DIV");
  });

  it("renders date values formatted", () => {
    render(<FieldRenderer attribute="release_date" value={233366400} type="date" />);
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
  });

  it("renders truncated text", () => {
    render(<FieldRenderer attribute="overview" value="A very long text" truncate={5} />);
    expect(screen.getByText("A ver…")).toBeInTheDocument();
  });

  it("renders null as empty", () => {
    const { container } = render(<FieldRenderer attribute="overview" value={null} />);
    expect(container.textContent).toBe("");
  });

  it("applies custom content class name", () => {
    render(<FieldRenderer attribute="overview" value="test" contentClassName="custom-class" />);
    const el = screen.getByText("test");
    expect(el.className).toContain("custom-class");
  });

  it("renders Highlight when _highlightResult is present", () => {
    const hit = {
      _highlightResult: {
        overview: { value: "Hello <em>world</em>" },
      },
    };
    render(<FieldRenderer attribute="overview" hit={hit} value="Hello world" type="text" />);
    expect(screen.getByTestId("mock-highlight")).toBeInTheDocument();
    expect(screen.getByTestId("mock-highlight").dataset.attribute).toBe('"overview"');
  });

  it("renders Snippet when _snippetResult is present and truncate is set", () => {
    const hit = {
      _snippetResult: {
        overview: { value: "Princess Leia…" },
      },
    };
    render(
      <FieldRenderer attribute="overview" hit={hit} truncate={150} value="Long text" type="text" />,
    );
    expect(screen.getByTestId("mock-snippet")).toBeInTheDocument();
    expect(screen.getByTestId("mock-snippet").dataset.attribute).toBe('"overview"');
  });

  it("falls back to plain text when no highlight data is present", () => {
    render(<FieldRenderer attribute="overview" value="Hello world" type="text" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-highlight")).not.toBeInTheDocument();
  });
});
