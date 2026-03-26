import { test, expect } from "@playwright/test";

test.describe("History", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page.getByRole("heading", { name: "Analysis History" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page).toHaveURL("/dashboard/history");
    });

    test("displays expected table column headers", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Query Preview" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Database" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Improvement" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: "Date" })).toBeVisible();
    });

    test("displays Filter button", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page.getByRole("button", { name: "Filter" })).toBeVisible();
    });

    test("displays Export CSV button", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page.getByRole("button", { name: "Export CSV" })).toBeVisible();
    });

    test("displays pagination entry count", async ({ page }) => {
        await page.goto("/dashboard/history");
        await expect(page.getByText(/Showing 1 to 6 of/)).toBeVisible();
    });
});
