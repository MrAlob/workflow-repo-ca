import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5500";
const API_PATTERN = "**/api/v1/holidaze";

async function mockLoginSuccess(page, email) {
  await page.route(`${API_PATTERN}/auth/login`, async (route) => {
    const request = route.request();
    if (request.method() !== "POST") {
      return route.fallback();
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accessToken: "test-token",
        name: "Test User",
        email: email,
      }),
    });
  });
}

async function mockLoginFailure(page) {
  await page.route(`${API_PATTERN}/auth/login`, async (route) => {
    const request = route.request();
    if (request.method() !== "POST") {
      return route.fallback();
    }

    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        errors: [{ message: "Invalid email or password" }],
      }),
    });
  });
}

async function mockVenues(page) {
  const venue = {
    id: "venue-1",
    name: "Test Venue",
    media: ["https://placehold.co/600x400"],
  };

  await page.route(`${API_PATTERN}/venues`, async (route) => {
    if (route.request().method() !== "GET") {
      return route.fallback();
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([venue]),
    });
  });

  await page.route(`${API_PATTERN}/venues/*`, async (route) => {
    if (route.request().method() !== "GET") {
      return route.fallback();
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(venue),
    });
  });
}

test.describe("Login functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test("users with valid credentials can log in", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL || "tester@stud.noroff.no";
    const password = process.env.TEST_USER_PASSWORD || "password123";

    await mockLoginSuccess(page, email);

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Successful login redirects to home page
    await page.waitForURL(`${BASE_URL}/`);
    await expect(page).toHaveURL("/");
  });

  test("users with invalid credentials see an error message", async ({ page }) => {
    await mockLoginFailure(page);
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
    await mockVenues(page);
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
