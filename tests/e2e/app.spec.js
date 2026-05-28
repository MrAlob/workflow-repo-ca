import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5500";

test.describe("Login functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test("users with valid credentials can log in", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Successful login redirects to home page
    await page.waitForURL(`${BASE_URL}/`);
    await expect(page).toHaveURL("/");
  });

  test("users with invalid credentials see an error message", async ({ page }) => {
    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL(/login/);

    // Error message should be displayed
    const alert = page.locator('[role="alert"]');
    await expect(alert).toBeVisible();
  });
});

test.describe("Navigation functionality", () => {
  test("navigate to venue details page", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Wait for the venue list to load
    const venueContainer = page.locator("#venue-container");
    await venueContainer.waitFor({ state: "visible", timeout: 10000 });

    // Click the first venue link
    const firstVenue = page.locator("#venue-container a").first();
    await firstVenue.click();

    // Verify venue details page loads
    const heading = page.locator("h1");
    await expect(heading).toContainText("Venue details", { timeout: 10000 });
  });
});
