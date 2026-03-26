import { test, expect } from "@playwright/test";

test.describe("DatabasesPage", () => {
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

    test("shows database connection cards", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByText("prod-main")).toBeVisible();
        await expect(page.getByText("prod-analytics")).toBeVisible();
        await expect(page.getByText("staging-1")).toBeVisible();
    });

    test("shows connection status badges", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByText("connected").first()).toBeVisible();
        await expect(page.getByText("disconnected")).toBeVisible();
    });

    test("shows host and latency details on cards", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByText("db-main.internal.aws")).toBeVisible();
        await expect(page.getByText("12ms")).toBeVisible();
    });

    test("shows Add New Connection form section", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("heading", { name: "Add New Connection" })).toBeVisible();
    });

    test("shows form fields for new connection", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByLabel("Connection Name")).toBeVisible();
        await expect(page.getByLabel("Host")).toBeVisible();
        await expect(page.getByLabel("Username")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
    });

    test("shows Test Connection and Save Connection buttons", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await expect(page.getByRole("button", { name: /Test Connection/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /Save Connection/i })).toBeVisible();
    });
});
