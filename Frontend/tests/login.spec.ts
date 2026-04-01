import { test, expect } from "@playwright/test";

test.describe("Login", () => {

    // ── Page load ──────────────────────────────────────────────────────────────

    test("loads successfully", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: "Sign in to Optimiser" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveURL("/login");
    });

    // ── UI elements ────────────────────────────────────────────────────────────

    test("shows email and password fields", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByLabel("Email Address")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
    });

    test("shows Sign In button", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    });

    test("shows Remember me checkbox", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByLabel("Remember me")).toBeVisible();
    });

    test("shows Forgot password link", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByText("Forgot password?")).toBeVisible();
    });

    // ── Validation ─────────────────────────────────────────────────────────────

    test("shows validation errors when submitted empty", async ({ page }) => {
        await page.goto("/login");
        await page.getByRole("button", { name: "Sign In" }).click();
        await expect(page.getByText("Please enter your email address.")).toBeVisible();
        await expect(page.getByText("Please enter your password.")).toBeVisible();
    });

    test("shows error message for invalid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("Email Address").fill("admin");
        await page.getByLabel("Password").fill("wrongpassword");
        await page.getByRole("button", { name: "Sign In" }).click();
        // Expect an error notification to appear
        await expect(page.locator(".ant-message-error, .ant-notification-notice-error")).toBeVisible({ timeout: 10_000 });
    });

    // ── Successful login ───────────────────────────────────────────────────────

    test("logs in with valid admin credentials and redirects to dashboard", async ({ page }) => {
        // Multiple login tests run concurrently; give extra headroom for backend latency
        test.setTimeout(60_000);

        await page.goto("/login");

        await page.getByLabel("Email Address").fill("admin");
        await page.getByLabel("Password").fill("123qwe");
        await page.getByRole("button", { name: "Sign In" }).click();

        await page.waitForURL("/dashboard", { timeout: 45_000 });
        await expect(page).toHaveURL("/dashboard");
    });

    test("sets auth cookie after successful login", async ({ page }) => {
        // Multiple login tests run concurrently; give extra headroom for backend latency
        test.setTimeout(60_000);

        await page.goto("/login");

        await page.getByLabel("Email Address").fill("admin");
        await page.getByLabel("Password").fill("123qwe");
        await page.getByRole("button", { name: "Sign In" }).click();

        await page.waitForURL("/dashboard", { timeout: 45_000 });

        const cookies = await page.context().cookies();
        const authCookie = cookies.find((c) => c.name === "access_token");
        expect(authCookie).toBeDefined();
        expect(authCookie?.value).toBeTruthy();
    });

    test("Sign In button shows loading state while authenticating", async ({ page }) => {
        await page.goto("/login");

        await page.getByLabel("Email Address").fill("admin");
        await page.getByLabel("Password").fill("123qwe");

        const signInButton = page.getByRole("button", { name: "Sign In" });
        await signInButton.click();

        // Button should briefly show loading state
        await expect(signInButton).toHaveClass(/ant-btn-loading/, { timeout: 3_000 });
    });

    // ── Route protection ───────────────────────────────────────────────────────

    test("unauthenticated user visiting /dashboard is redirected to /login", async ({ page }) => {
        // Fresh context — no cookies
        await page.goto("/dashboard");
        await page.waitForURL("/login", { timeout: 10_000 });
        await expect(page).toHaveURL("/login");
    });

    test("unauthenticated user visiting a nested dashboard route is redirected to /login", async ({ page }) => {
        await page.goto("/dashboard/databases");
        await page.waitForURL("/login", { timeout: 10_000 });
        await expect(page).toHaveURL("/login");
    });
});
