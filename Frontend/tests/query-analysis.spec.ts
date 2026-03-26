import { test, expect } from "@playwright/test";

test.describe("QueryAnalysisPage", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByRole("heading", { name: "Query Analysis" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page).toHaveURL("/dashboard/query-analysis");
    });

    test("shows page subtitle", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByText("Paste your SQL to detect bottlenecks and generate optimised alternatives.")).toBeVisible();
    });

    test("shows Analyse Query button", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByRole("button", { name: /Analyse Query/i })).toBeVisible();
    });

    test("shows SQL editor with PostgreSQL badge", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByText("PostgreSQL")).toBeVisible();
        await expect(page.getByText("prod-main")).toBeVisible();
    });

    test("shows Format and Clear buttons", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByRole("button", { name: "Format" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
    });

    test("shows ready to optimise empty state", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        await expect(page.getByText("Ready to optimise")).toBeVisible();
    });

    test("accepts SQL input in the editor", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        const editor = page.getByRole("textbox", { name: "SQL editor" });
        await editor.fill("SELECT * FROM users;");
        await expect(editor).toHaveValue("SELECT * FROM users;");
    });

    test("Clear button resets the editor", async ({ page }) => {
        await page.goto("/dashboard/query-analysis");
        const editor = page.getByRole("textbox", { name: "SQL editor" });
        await editor.fill("SELECT 1;");
        await page.getByRole("button", { name: "Clear" }).click();
        await expect(editor).toHaveValue("");
    });
});
