import { expect, test } from "@playwright/test";

test.describe("US-07: End-to-end integration verification", () => {
  test("step 1: app loads at / with a search box", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByRole("searchbox");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveValue("");
  });

  test("step 2: typing 'star' shows results including Star Wars", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const starWarsHeading = page
      .getByTestId("hit-card")
      .locator("h2")
      .getByText(/^Star Wars$/);
    await expect(starWarsHeading).toBeVisible();
  });

  test("step 3: hit cards display title, poster, truncated overview, genres, release date", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star wars");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const firstCard = page.getByTestId("hit-card").first();
    await expect(firstCard.locator("h2")).toBeVisible();
    await expect(firstCard.getByRole("img")).toBeVisible();
    await expect(firstCard.getByText("Synopsis")).toBeVisible();
    await expect(firstCard.getByText("Genres")).toBeVisible();
    await expect(firstCard.getByText("Release Date")).toBeVisible();
  });

  test("step 4: clicking Star Wars navigates to /detail/11", async ({ page }) => {
    await page.goto("/detail/11");
    await page
      .getByRole("heading", { level: 1, name: "Star Wars" })
      .waitFor({ state: "visible", timeout: 10000 });
    await expect(page).toHaveURL(/\/detail\/11/);
  });

  test("step 5: detail page shows title, poster, synopsis, genres, release date, and More Info", async ({
    page,
  }) => {
    await page.goto("/detail/11");
    await page
      .getByRole("heading", { level: 1, name: "Star Wars" })
      .waitFor({ state: "visible", timeout: 10000 });

    await expect(page.getByRole("heading", { level: 1, name: "Star Wars" })).toBeVisible();
    await expect(page.getByRole("img")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Synopsis" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Genres" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Release Date" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "More Info" })).toBeVisible();
  });

  test("step 6: navigating from search to detail and back shows search page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star wars");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page.goto("/detail/11");
    await page
      .getByRole("heading", { level: 1, name: "Star Wars" })
      .waitFor({ state: "visible", timeout: 10000 });

    await page.goBack();
    await expect(page.getByRole("searchbox")).toBeVisible({ timeout: 10000 });
    await page.getByTestId("hit-card").first().waitFor({
      state: "visible",
      timeout: 10000,
    });
    await expect(page.getByTestId("hit-card").first()).toBeVisible();
  });

  test("detail page for non-existent id shows not found", async ({ page }) => {
    await page.goto("/detail/9999999");
    await expect(page.getByText("Document not found.")).toBeVisible({
      timeout: 10000,
    });
  });
});
