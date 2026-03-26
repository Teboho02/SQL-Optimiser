import { test, expect } from "@playwright/test";

test.describe("LandingPage", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("heading", { name: /stop guessing why your/i })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
    });

    test("shows SQL Optimiser logo in navbar", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("SQL Optimiser")).toBeVisible();
    });

    test("shows Get Started button", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
    });

    test("shows feature cards", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("Schema-Aware AI")).toBeVisible();
        await expect(page.getByText("Intent Detection")).toBeVisible();
        await expect(page.getByText("Verified Correctness")).toBeVisible();
        await expect(page.getByText("Index Recommendations")).toBeVisible();
    });
});
