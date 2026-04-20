import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HitCard from "../HitCard";

vi.mock("react-router-dom", () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
}));

const movieHit = {
  id: 11,
  title: "Star Wars",
  overview:
    "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire.",
  genres: ["Adventure", "Action", "Science Fiction"],
  poster: "https://example.com/starwars.jpg",
  release_date: 233366400,
};

describe("HitCard", () => {
  it("renders the title from config", () => {
    render(<HitCard hit={movieHit} />);
    expect(screen.getByText("Star Wars")).toBeInTheDocument();
  });

  it("renders the image from config", () => {
    render(<HitCard hit={movieHit} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/starwars.jpg");
    expect(img).toHaveAttribute("alt", "Star Wars");
  });

  it("links to the detail page using hit id", () => {
    render(<HitCard hit={movieHit} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/detail/11");
  });

  it("renders badge fields as individual span elements", () => {
    render(<HitCard hit={movieHit} />);
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Science Fiction")).toBeInTheDocument();
  });

  it("renders date fields as YYYY-MM-DD", () => {
    render(<HitCard hit={movieHit} />);
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
  });

  it("truncates text fields per config", () => {
    const longHit = {
      ...movieHit,
      overview:
        "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
    };
    render(<HitCard hit={longHit} />);
    const synopsisText = screen.getByText(/Princess Leia.*…$/);
    expect(synopsisText).toBeInTheDocument();
    expect(synopsisText.textContent!.length).toBeLessThan(200);
  });

  it("renders all display field labels", () => {
    render(<HitCard hit={movieHit} />);
    expect(screen.getByText("Synopsis")).toBeInTheDocument();
    expect(screen.getByText("Genres")).toBeInTheDocument();
    expect(screen.getByText("Release Date")).toBeInTheDocument();
  });

  it("does not hardcode field names in the component", () => {
    const { container } = render(<HitCard hit={movieHit} />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/"overview"/);
    expect(html).not.toMatch(/"genres"/);
    expect(html).not.toMatch(/"release_date"/);
  });

  it("article has a CSS Module class", () => {
    const { container } = render(<HitCard hit={movieHit} />);
    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(article!.className).not.toBe("");
  });

  it("image has a CSS Module class", () => {
    render(<HitCard hit={movieHit} />);
    const img = screen.getByRole("img");
    expect(img.className).not.toBe("");
  });

  it("badge spans have CSS Module class", () => {
    render(<HitCard hit={movieHit} />);
    const badges = screen.getAllByText(/Adventure|Action|Science Fiction/);
    expect(badges).toHaveLength(3);
    for (const badge of badges) {
      expect(badge.className).not.toBe("");
    }
  });

  it("non-badge fields render as plain text without badge spans", () => {
    const { container } = render(<HitCard hit={movieHit} />);
    const badgeElements = container.querySelectorAll("[data-badge]");
    expect(badgeElements).toHaveLength(0);
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
  });
});
