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
});
