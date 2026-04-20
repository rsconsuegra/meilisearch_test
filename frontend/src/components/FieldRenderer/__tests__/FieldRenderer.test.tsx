import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FieldRenderer from "../FieldRenderer";

describe("FieldRenderer", () => {
  it("renders badge values as individual spans", () => {
    render(<FieldRenderer value={["Adventure", "Action"]} type="badge" />);
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    const spans = screen.getAllByText(/Adventure|Action/);
    spans.forEach((span) => {
      expect(span.tagName).toBe("SPAN");
      expect(span.className).not.toBe("");
    });
  });

  it("renders text values in a div", () => {
    render(<FieldRenderer value="Hello world" type="text" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Hello world").tagName).toBe("DIV");
  });

  it("renders date values formatted", () => {
    render(<FieldRenderer value={233366400} type="date" />);
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
  });

  it("renders truncated text", () => {
    render(<FieldRenderer value="A very long text" truncate={5} />);
    expect(screen.getByText("A ver…")).toBeInTheDocument();
  });

  it("renders null as empty", () => {
    const { container } = render(<FieldRenderer value={null} />);
    expect(container.textContent).toBe("");
  });

  it("applies custom content class name", () => {
    render(<FieldRenderer value="test" contentClassName="custom-class" />);
    const el = screen.getByText("test");
    expect(el.className).toContain("custom-class");
  });
});
