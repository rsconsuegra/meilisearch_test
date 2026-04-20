import { render, screen, waitFor } from "@testing-library/react";
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

function createErrorRouter(id: string) {
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

describe("DetailError", () => {
  it("displays validation error from loader", async () => {
    render(<RouterProvider router={createErrorRouter("abc")} />);

    await waitFor(() => {
      expect(screen.getByText("Invalid document ID.")).toBeInTheDocument();
    });
  });

  it("displays not found error from loader", async () => {
    mockSearch.mockResolvedValueOnce({ hits: [] });

    render(<RouterProvider router={createErrorRouter("9999999")} />);

    await waitFor(() => {
      expect(screen.getByText("Document not found.")).toBeInTheDocument();
    });
  });

  it("displays fetch error message", async () => {
    mockSearch.mockRejectedValueOnce(new Error("Network error"));

    render(<RouterProvider router={createErrorRouter("11")} />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("has a back button with CSS Module class", async () => {
    render(<RouterProvider router={createErrorRouter("abc")} />);

    await waitFor(() => {
      expect(screen.getByText(/Back to results/)).toBeInTheDocument();
    });

    const button = screen.getByText(/Back to results/).closest("button");
    expect(button).not.toBeNull();
    expect(button!.className).not.toBe("");
  });

  it("back button navigates back", async () => {
    mockNavigate.mockClear();
    render(<RouterProvider router={createErrorRouter("abc")} />);

    await waitFor(() => {
      expect(screen.getByText(/Back to results/)).toBeInTheDocument();
    });

    screen.getByText(/Back to results/).click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
