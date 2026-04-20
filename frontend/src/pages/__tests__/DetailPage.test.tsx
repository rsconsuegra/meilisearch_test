import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { detailLoader } from "../../pages/detail/loader";
import DetailError from "../../pages/DetailError";
import DetailPage from "../../pages/DetailPage";

const mockSearch = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../config/searchClient", () => ({
  meiliSearchInstance: {
    index: () => ({
      search: mockSearch,
    }),
  },
}));

function createDetailRouter(id: string) {
  return createMemoryRouter(
    [
      {
        path: "/detail/:id",
        element: <DetailPage />,
        loader: detailLoader,
        errorElement: <DetailError />,
      },
    ],
    { initialEntries: [`/detail/${id}`] },
  );
}

function renderDetailPage(id: string) {
  return render(<RouterProvider router={createDetailRouter(id)} />);
}

const starWarsHit = {
  id: 11,
  title: "Star Wars",
  overview: "Princess Leia is captured.",
  genres: ["Adventure", "Action"],
  poster: "https://example.com/starwars.jpg",
  release_date: 233366400,
};

describe("DetailPage", () => {
  it("renders document details from config", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Star Wars");
    });

    expect(screen.getByText("Synopsis")).toBeInTheDocument();
    expect(screen.getByText("Princess Leia is captured.")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("1977-05-25")).toBeInTheDocument();
  });

  it("renders extra fields in More Info section", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("More Info")).toBeInTheDocument();
    });

    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("shows not found for missing document", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [] });

    renderDetailPage("9999999");

    await waitFor(() => {
      expect(screen.getByText("Document not found.")).toBeInTheDocument();
    });
  });

  it("shows error on fetch failure", async () => {
    mockSearch.mockRejectedValueOnce(new Error("Network error"));

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("shows error for invalid id", async () => {
    renderDetailPage("abc");

    await waitFor(() => {
      expect(screen.getByText("Invalid document ID.")).toBeInTheDocument();
    });
  });

  it("shows Back to results button when document is loaded", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText(/Back to results/)).toBeInTheDocument();
    });
  });

  it("calls navigate(-1) when Back to results is clicked", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });
    mockNavigate.mockClear();

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText(/Back to results/)).toBeInTheDocument();
    });

    screen.getByText(/Back to results/).click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("container has a CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("Star Wars")).toBeInTheDocument();
    });

    const container = screen.getByText("Star Wars").closest("div");
    expect(container).not.toBeNull();
    expect(container!.className).not.toBe("");
  });

  it("back button has a CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText(/Back to results/)).toBeInTheDocument();
    });

    const button = screen.getByText(/Back to results/).closest("button");
    expect(button).not.toBeNull();
    expect(button!.className).not.toBe("");
  });

  it("hero image has a CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    const img = screen.getByRole("img");
    expect(img.className).not.toBe("");
  });

  it("hero image wrapper defaults to portrait class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    const wrapper = screen.getByRole("img").closest("div");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).not.toBe("");
  });

  it("hero image uses contain object-fit", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    const img = screen.getByRole("img");
    expect(img.className).toMatch(/heroImage/);
  });

  it("hero image applies portrait container dimensions by default", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.style.maxWidth).toBe("400px");
    expect(img.style.maxHeight).toBe("600px");
  });

  it("hero image switches to landscape after load for wide images", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    const img = screen.getByRole("img") as HTMLImageElement;
    Object.defineProperty(img, "naturalWidth", { value: 1200, configurable: true });
    Object.defineProperty(img, "naturalHeight", { value: 675, configurable: true });
    fireEvent.load(img);

    expect(img.style.maxWidth).toBe("800px");
    expect(img.style.maxHeight).toBe("450px");
  });

  it("title has a CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).not.toBe("");
  });

  it("renders badge fields as individual span elements", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("Adventure")).toBeInTheDocument();
    });

    const badges = screen.getAllByText(/^(Adventure|Action)$/);
    expect(badges).toHaveLength(2);
    badges.forEach((badge) => {
      expect(badge.tagName).toBe("SPAN");
      expect(badge.className).not.toBe("");
    });
  });

  it("metadata sections have CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("Synopsis")).toBeInTheDocument();
    });

    const synopsisHeading = screen.getByText("Synopsis");
    const section = synopsisHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section!.className).not.toBe("");
  });

  it("extra fields section has CSS Module class", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("More Info")).toBeInTheDocument();
    });

    const section = screen.getByText("More Info").closest("section");
    expect(section).not.toBeNull();
    expect(section!.className).not.toBe("");

    const dl = section!.querySelector("dl");
    expect(dl).not.toBeNull();
    expect(dl!.className).not.toBe("");
  });

  it("non-badge fields render as plain text in div elements", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [starWarsHit] });

    renderDetailPage("11");

    await waitFor(() => {
      expect(screen.getByText("Princess Leia is captured.")).toBeInTheDocument();
    });

    const synopsis = screen.getByText("Princess Leia is captured.");
    expect(synopsis.tagName).toBe("DIV");
  });
});
