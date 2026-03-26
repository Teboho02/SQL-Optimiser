import { test, expect } from "@playwright/test";

test.describe("Schema Advisor", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByRole("heading", { name: "Schema Advisor" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page).toHaveURL("/dashboard/schema-advisor");
    });

    test("displays Scan Schema button", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByRole("button", { name: "Scan Schema" })).toBeVisible();
    });

    test("displays at least one recommendation card", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByText("Active Recommendations")).toBeVisible();
        await expect(page.getByText("Split Table: events")).toBeVisible();
    });

    test("displays the refactoring detail panel", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByText("Refactoring: events table")).toBeVisible();
    });

    test("displays Generate Migration button", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByRole("button", { name: "Generate Migration" })).toBeVisible();
    });
});
