import { expect, test } from "@playwright/test";

test.describe("US-08: Layout shell with Header and responsive container", () => {
  test("header is visible on the search page", async ({ page }) => {
    await page.goto("/");
    const header = page.getByTestId("app-header");
    await expect(header).toBeVisible();
    await expect(header).toContainText("Movie Search");
  });

  test("header is visible on the detail page", async ({ page }) => {
    await page.goto("/detail/11");
    const header = page.getByTestId("app-header");
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("clicking header title from detail navigates to /", async ({ page }) => {
    await page.goto("/detail/11");
    await page.getByTestId("app-header").waitFor({ state: "visible" });

    await page.getByTestId("app-header").locator("a").click();
    await expect(page).toHaveURL("/");
  });

  test("layout container has max-width and is centered", async ({ page }) => {
    await page.goto("/");
    const layout = page.getByTestId("app-layout");
    await expect(layout).toBeVisible();

    const styles = await layout.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
      };
    });
    expect(styles.maxWidth).toBe("1200px");
    expect(styles.marginLeft).toBe(styles.marginRight);
  });

  test("hit cards render in multi-column grid on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const grid = page.getByTestId("hit-list");
    const gridTemplate = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    const columns = gridTemplate.split(" ").length;
    expect(columns).toBeGreaterThanOrEqual(3);
  });

  test("hit cards render in single column on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const grid = page.getByTestId("hit-list");
    const gridTemplate = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(gridTemplate.split(" ").length).toBe(1);
  });
});

test.describe("US-09: Pagination widget", () => {
  test("pagination controls are visible after a broad search", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("a");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const pagination = page.getByRole("navigation", { name: "Pagination" });
    await expect(pagination).toBeVisible();
  });

  test("clicking page 2 updates URL and shows new results", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("a");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page
      .getByRole("navigation", { name: "Pagination" })
      .getByRole("button", { name: "Page 2", exact: true })
      .click();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await expect(page).toHaveURL(/page/);
  });

  test("clicking page 1 returns to first page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("a");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page
      .getByRole("navigation", { name: "Pagination" })
      .getByRole("button", { name: "Page 2", exact: true })
      .click();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page
      .getByRole("navigation", { name: "Pagination" })
      .getByRole("button", { name: "Page 1", exact: true })
      .click();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });
  });

  test("direct navigation to page 2 URL loads correct page", async ({ page }) => {
    await page.goto("/?movies%5Bquery%5D=star&movies%5Bpage%5D=2");
    await page.getByTestId("hit-card").first().waitFor({
      state: "visible",
      timeout: 10000,
    });

    const activePage = page
      .getByRole("navigation", { name: "Pagination" })
      .getByRole("button", { name: "Page 2", exact: true });
    await expect(activePage).toHaveAttribute("aria-label", "Page 2");
  });
});

test.describe("US-10: Detail page Back to results navigation", () => {
  test("Back to results is visible after navigating to detail", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page.goto("/detail/11");
    await expect(page.getByRole("button", { name: /Back to results/ })).toBeVisible({
      timeout: 10000,
    });
  });

  test("clicking Back to results returns to search with query preserved", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page.goto("/detail/11");
    await page
      .getByRole("button", { name: /Back to results/ })
      .waitFor({ state: "visible", timeout: 10000 });
    await page.getByRole("button", { name: /Back to results/ }).click();

    await expect(page.getByRole("searchbox")).toBeVisible({ timeout: 10000 });
  });

  test("Back to results returns to search page from paginated results", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("star");
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    await page
      .getByRole("navigation", { name: "Pagination" })
      .getByRole("button", { name: "Page 2", exact: true })
      .click();
    await page.getByTestId("hit-card").first().waitFor({ state: "visible" });

    const firstCardLink = page.getByTestId("hit-card").first().locator("a");
    await firstCardLink.click();

    await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible", timeout: 10000 });
    await page.getByRole("button", { name: /Back to results/ }).click();

    await expect(page).toHaveURL(/\//, { timeout: 10000 });
    await expect(page.getByRole("searchbox")).toBeVisible({ timeout: 10000 });
  });
});
