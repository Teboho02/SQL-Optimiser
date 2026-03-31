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

    test("displays connection selector", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByPlaceholder("Select a connection...")).toBeVisible();
    });

    test("Scan Schema button is disabled when no connection is selected", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByRole("button", { name: "Scan Schema" })).toBeDisabled();
    });

    test("shows empty state prompt before scanning", async ({ page }) => {
        await page.goto("/dashboard/schema-advisor");
        await expect(page.getByText("Select a connection and click Scan Schema to get AI-powered recommendations.")).toBeVisible();
    });
});
