import { test, expect } from "@playwright/test";

test.describe("LoginPage", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: "Sign in to Optimiser" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveURL("/login");
    });

    test("shows email and password fields", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByPlaceholder("engineer@company.com")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
    });

    test("shows Sign In button", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    });

    test("shows social sign-in buttons", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("button", { name: "GitHub" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
    });

    test("shows validation errors when submitted empty", async ({ page }) => {
        await page.goto("/login");
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page.getByText("Please enter your email address.")).toBeVisible();
        await expect(page.getByText("Please enter your password.")).toBeVisible();
    });
});
