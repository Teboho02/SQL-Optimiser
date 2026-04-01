import { test, expect } from "@playwright/test";

test.describe("Playground", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page.getByText("Schema", { exact: true })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page).toHaveURL("/dashboard/playground");
    });

    test("displays SQL editor", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page.getByRole("textbox", { name: "SQL editor" })).toBeVisible();
    });

    test("displays Run and Explain buttons", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page.getByRole("button", { name: /Run/i })).toBeVisible();
        await expect(page.getByRole("button", { name: "Explain" })).toBeVisible();
    });

    test("displays execution info panel", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page.getByText("Execution Info")).toBeVisible();
    });

    test("displays connection selector", async ({ page }) => {
        await page.goto("/dashboard/playground");
        // "Connection" label appears as a span above the Select; use first() to avoid strict-mode violation
        await expect(page.getByText("Connection", { exact: true }).first()).toBeVisible();
    });

    test("SchemaPanel shows placeholder when no connection is selected", async ({ page }) => {
        await page.goto("/dashboard/playground");
        await expect(page.getByText("Select a connection to view schema")).toBeVisible();
    });

    test("displays History panel", async ({ page }) => {
        await page.goto("/dashboard/playground");
        // "History" appears in both sidebar nav and the panel header; first() targets the panel
        await expect(page.getByText("History", { exact: true }).first()).toBeVisible();
    });

    test("History panel shows placeholder when no connection is selected", async ({ page }) => {
        await page.goto("/dashboard/playground");
        // Ant Design Empty renders description in both inner span and wrapper; use first()
        await expect(page.getByText("Select a connection", { exact: true }).first()).toBeVisible();
    });
});
