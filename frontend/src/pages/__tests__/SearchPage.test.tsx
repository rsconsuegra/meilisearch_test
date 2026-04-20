import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchPage from "../../pages/SearchPage";

vi.mock("react-instantsearch", () => ({
  ClearRefinements: () => <div data-testid="mock-clear-refinements" />,
  Configure: (props: Record<string, unknown>) => (
    <div data-testid="mock-configure" data-props={JSON.stringify(props)} />
  ),
  InstantSearch: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-instantsearch">{children}</div>
  ),
  RefinementList: ({ attribute }: { attribute: string }) => (
    <div data-testid={`mock-refinement-${attribute}`} data-attribute={attribute} />
  ),
  SearchBox: () => <div data-testid="mock-searchbox" />,
  SortBy: ({ items }: { items: { label: string; value: string }[] }) => (
    <div data-testid="mock-sortby" data-items={JSON.stringify(items)} />
  ),
  useHits: () => ({ hits: [] }),
  usePagination: () => ({
    canRefine: true,
    currentRefinement: 0,
    nbPages: 5,
    refine: vi.fn(),
  }),
  useSearchBox: () => ({ isSearchStalled: false }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useLocation: () => ({ state: null }) };
});

describe("SearchPage", () => {
  it("renders a Pagination widget", () => {
    render(<SearchPage />);
    expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
  });

  it("renders Configure with hitsPerPage from searchConfig", () => {
    render(<SearchPage />);
    const configure = screen.getByTestId("mock-configure");
    const props = JSON.parse(configure.dataset.props ?? "{}");
    expect(props.hitsPerPage).toBe(12);
  });

  it("passes attributesToHighlight from config displayFields", () => {
    render(<SearchPage />);
    const configure = screen.getByTestId("mock-configure");
    const props = JSON.parse(configure.dataset.props ?? "{}");
    expect(props.attributesToHighlight).toContain("overview");
    expect(props.attributesToHighlight).toContain("genres");
  });

  it("passes attributesToSnippet for fields with truncate", () => {
    render(<SearchPage />);
    const configure = screen.getByTestId("mock-configure");
    const props = JSON.parse(configure.dataset.props ?? "{}");
    expect(props.attributesToSnippet).toContain("overview:150");
  });

  it("renders SearchBox", () => {
    render(<SearchPage />);
    expect(screen.getByTestId("mock-searchbox")).toBeInTheDocument();
  });

  it("wraps SearchBox in a container with CSS Module class", () => {
    render(<SearchPage />);
    const searchbox = screen.getByTestId("mock-searchbox");
    const wrapper = searchbox.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).not.toBe("");
  });

  it("renders sidebar aside via FilterSidebar", () => {
    render(<SearchPage />);
    const aside = document.querySelector("aside");
    expect(aside).not.toBeNull();
  });

  it("renders search layout with CSS Module class", () => {
    render(<SearchPage />);
    const layout = document.querySelector("[class*='searchLayout']");
    expect(layout).not.toBeNull();
  });

  it("renders main content area with CSS Module class", () => {
    render(<SearchPage />);
    const main = document.querySelector("main");
    expect(main).not.toBeNull();
    expect(main!.className).not.toBe("");
  });

  it("renders sidebar toggle button via FilterSidebar", () => {
    render(<SearchPage />);
    const toggle = screen.getByRole("button", { name: /filters/i });
    expect(toggle).toBeInTheDocument();
  });

  it("renders one RefinementList per filterableField via FilterSidebar", () => {
    render(<SearchPage />);
    const refinements = screen.getByTestId("mock-refinement-genres");
    expect(refinements).toBeInTheDocument();
    expect(refinements.dataset.attribute).toBe("genres");
  });

  it("filter section headings use labels from config", () => {
    render(<SearchPage />);
    expect(screen.getByText("Genre")).toBeInTheDocument();
  });

  it("renders ClearRefinements in the sidebar", () => {
    render(<SearchPage />);
    expect(screen.getByTestId("mock-clear-refinements")).toBeInTheDocument();
  });

  it("renders SortBy widget when sortOptions is configured", () => {
    render(<SearchPage />);
    const sortby = screen.getByTestId("mock-sortby");
    expect(sortby).toBeInTheDocument();
    const items = JSON.parse(sortby.dataset.items ?? "[]");
    expect(items).toHaveLength(3);
    expect(items[0].label).toBe("Relevance");
    expect(items[1].label).toBe("Title (A-Z)");
    expect(items[2].label).toBe("Title (Z-A)");
  });
});
