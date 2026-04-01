import { test as setup, expect } from "@playwright/test";
import path from "path";

export const ADMIN_AUTH_FILE = path.join(__dirname, ".auth/admin.json");

/**
 * Logs in as the admin user and saves the resulting cookie state to disk.
 * All authenticated test projects depend on this setup step so that each
 * test suite starts already logged in without repeating the login flow.
 */
setup("authenticate as admin", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email Address").fill("admin");
    await page.getByLabel("Password").fill("123qwe");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Wait for the redirect to complete
    await page.waitForURL("/dashboard", { timeout: 15_000 });
    await expect(page).toHaveURL("/dashboard");

    // Save the auth cookies so other test projects can reuse this session
    await page.context().storageState({ path: ADMIN_AUTH_FILE });
});
