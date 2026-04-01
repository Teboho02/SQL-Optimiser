import { test, expect } from "@playwright/test";

test.describe("DatabasesPage", () => {

    // ── Page load ───────────────────────────────────────────────────────────

    test("loads successfully", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("heading", { name: "Databases" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page).toHaveURL("/dashboard/databases");
    });

    test("shows page subtitle", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByText("Manage connections to your database clusters.")).toBeVisible();
    });

    test("shows Add Connection button", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("button", { name: /Add Connection/i })).toBeVisible();
    });

    // ── Connection list ─────────────────────────────────────────────────────

    test("shows database connection cards or empty state", async ({ page }) => {
        await page.goto("/dashboard/databases");
        const hasCards = await page.locator('[class*="ConnectionCard"]').count() > 0;
        if (!hasCards) {
            await expect(page.getByRole("heading", { name: "Add New Connection" })).toBeVisible();
        }
    });

    // ── Add New Connection form ─────────────────────────────────────────────

    test("shows Add New Connection form section", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("heading", { name: "Add New Connection" })).toBeVisible();
    });

    test("shows all required form fields", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByLabel("Connection Name")).toBeVisible();
        await expect(page.getByLabel("Host")).toBeVisible();
        await expect(page.getByLabel("Port")).toBeVisible();
        await expect(page.getByLabel("Username")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
        await expect(page.getByLabel("Database Name")).toBeVisible();
    });

    test("Port field defaults to 5432", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByLabel("Port")).toHaveValue("5432");
    });

    test("shows Schema Only toggle", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByLabel("Schema only (copy structure, no data)")).toBeVisible();
    });

    test("shows Test Connection and Save Connection buttons", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("button", { name: /Test Connection/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /Save Connection/i })).toBeVisible();
    });

    // ── Form validation ─────────────────────────────────────────────────────

    test("Save Connection shows warning when name or host is empty", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await page.getByRole("button", { name: /Save Connection/i }).click();
        await expect(page.locator(".ant-notification-notice")).toBeVisible({ timeout: 5_000 });
    });

    test("Test Connection shows warning when credentials are missing", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await page.getByRole("button", { name: /Test Connection/i }).click();
        await expect(page.locator(".ant-notification-notice")).toBeVisible({ timeout: 5_000 });
    });
});
