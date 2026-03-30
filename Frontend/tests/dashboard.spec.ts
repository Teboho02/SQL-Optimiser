import { test, expect } from "@playwright/test";

test.describe("DashboardPage", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByRole("heading", { name: "System Overview" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page).toHaveURL("/dashboard");
    });

    test("shows sidebar navigation", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByText("SQL Ninja")).toBeVisible();
        await expect(page.getByText("Dashboard")).toBeVisible();
        await expect(page.getByText("Query Analysis")).toBeVisible();
    });

    test("shows database health cards", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByText("Total Analyses")).toBeVisible();
    });

    test("shows alert banner for critical issues", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByText(/3 critical issues detected/)).toBeVisible();
    });

    test("shows recent analyses table", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByText("Recent Analyses")).toBeVisible();
        await expect(page.getByText("ANL-892")).toBeVisible();
    });

    test("shows activity feed", async ({ page }) => {
        await page.goto("/dashboard");
        await expect(page.getByText("Activity Feed")).toBeVisible();
        await expect(page.getByText(/idx_user_email/)).toBeVisible();
    });
});
