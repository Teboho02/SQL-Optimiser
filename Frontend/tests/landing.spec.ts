import { test, expect } from "@playwright/test";

test.describe("LandingPage", () => {

    // ── Page load ───────────────────────────────────────────────────────────

    test("loads successfully", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("heading", { name: /stop guessing why your/i })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
    });

    // ── Navbar ──────────────────────────────────────────────────────────────

    test("shows SQL Ninja logo in navbar", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("SQL Ninja")).toBeVisible();
    });

    test("shows Sign in link in navbar", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    });

    test("shows Get Started button in navbar", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
    });

    // ── Hero section ────────────────────────────────────────────────────────

    test("shows v2.0 Engine badge", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("v2.0 Engine Now Live")).toBeVisible();
    });

    test("shows hero subheading", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText(/AI-powered SQL analysis/i)).toBeVisible();
    });

    test("shows Start Optimising Free CTA button", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("button", { name: /Start Optimising Free/i })).toBeVisible();
    });

    test("shows View Documentation button", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("button", { name: "View Documentation" })).toBeVisible();
    });

    // ── Features section ────────────────────────────────────────────────────

    test("shows feature cards", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("Schema-Aware AI")).toBeVisible();
        await expect(page.getByText("Intent Detection")).toBeVisible();
        await expect(page.getByText("Verified Correctness").first()).toBeVisible();
        await expect(page.getByText("Index Recommendations")).toBeVisible();
    });

    // ── Navigation ──────────────────────────────────────────────────────────

    test("Get Started button navigates to /login", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: /Start Optimising Free/i }).click();
        await page.waitForURL("/login");
        await expect(page).toHaveURL("/login");
    });

    test("Sign in link navigates to /login", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("link", { name: "Sign in" }).click();
        await page.waitForURL("/login");
        await expect(page).toHaveURL("/login");
    });
});
