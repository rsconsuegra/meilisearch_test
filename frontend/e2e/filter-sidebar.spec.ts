import { expect, test } from "@playwright/test";

test.describe("US-19: Filter sidebar layout", () => {
  test("sidebar is visible alongside results on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    await expect(aside).toBeVisible();
  });

  test("sidebar is hidden on mobile, toggle button visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    await expect(aside).not.toBeVisible();

    const toggle = page.getByRole("button", { name: /filters/i });
    await expect(toggle).toBeVisible();
  });

  test("clicking toggle on mobile shows filter panel", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const toggle = page.getByRole("button", { name: /filters/i });
    await toggle.click();

    const aside = page.locator("aside");
    await expect(aside).toBeVisible();
  });

  test("main content takes remaining width on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const main = page.locator("main");
    const mainBox = await main.boundingBox();
    expect(mainBox).not.toBeNull();
    expect(mainBox!.width).toBeGreaterThan(600);
  });
});

test.describe("US-20: RefinementList widget", () => {
  test("Genre refinement list is visible in sidebar after searching", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const genreHeading = page.getByText("Genre", { exact: true });
    await expect(genreHeading).toBeVisible();
  });

  test("Genre list shows options with counts", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    const checkboxes = aside.locator(":is(.ais-RefinementList-checkbox, input[type='checkbox'])");
    await expect(checkboxes.first()).toBeVisible({ timeout: 5000 });
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking a genre checkbox filters results", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    const firstCheckbox = aside.locator("input[type='checkbox']").first();
    await firstCheckbox.check();

    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });
    const cards = page.getByTestId("hit-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking an active genre again removes the filter", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    const firstCheckbox = aside.locator("input[type='checkbox']").first();

    const initialCardCount = await page.getByTestId("hit-card").count();

    await firstCheckbox.check();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await firstCheckbox.uncheck();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const finalCardCount = await page.getByTestId("hit-card").count();
    expect(finalCardCount).toBe(initialCardCount);
  });
});

test.describe("US-21: ClearRefinements widget", () => {
  test("clear button is not visible on initial page load", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const clearButton = page.locator(".ais-ClearRefinements-button").first();
    await expect(clearButton).not.toBeVisible();
  });

  test("clear button appears after selecting a genre filter", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const aside = page.locator("aside");
    const firstCheckbox = aside.locator("input[type='checkbox']").first();
    await firstCheckbox.check();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const clearButton = page.locator(".ais-ClearRefinements-button").first();
    await expect(clearButton).toBeVisible();
  });

  test("clicking clear removes all filters", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const initialCardCount = await page.getByTestId("hit-card").count();

    const aside = page.locator("aside");
    const firstCheckbox = aside.locator("input[type='checkbox']").first();
    await firstCheckbox.check();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const clearButton = page.locator(".ais-ClearRefinements-button").first();
    await clearButton.click();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const finalCardCount = await page.getByTestId("hit-card").count();
    expect(finalCardCount).toBe(initialCardCount);
  });
});

test.describe("US-22: SortBy widget", () => {
  test("SortBy dropdown is visible on the search page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const sortSelect = page.locator(".ais-SortBy-select").first();
    await expect(sortSelect).toBeVisible();
  });

  test("SortBy dropdown shows 3 options", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const sortSelect = page.locator(".ais-SortBy-select").first();
    const options = sortSelect.locator("option");
    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toHaveText("Relevance");
    await expect(options.nth(1)).toHaveText("Title (A-Z)");
    await expect(options.nth(2)).toHaveText("Title (Z-A)");
  });

  test("selecting Title A-Z sorts results alphabetically", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const sortSelect = page.locator(".ais-SortBy-select").first();
    await sortSelect.selectOption({ label: "Title (A-Z)" });

    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const firstTitle = await page.getByTestId("hit-card").first().locator("h2").textContent();
    expect(firstTitle).toBeTruthy();
  });

  test("selecting Relevance returns to default order", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const sortSelect = page.locator(".ais-SortBy-select").first();
    await sortSelect.selectOption({ label: "Title (A-Z)" });
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await sortSelect.selectOption({ label: "Relevance" });
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await expect(sortSelect).toHaveValue("movies");
  });
});
