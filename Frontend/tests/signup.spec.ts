import { test, expect } from '@playwright/test';

test.describe('SignUp', () => {
    test('loads successfully', async ({ page }) => {
        await page.goto('/signup');
        await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
    });

    test('has correct URL', async ({ page }) => {
        await page.goto('/signup');
        await expect(page).toHaveURL('/signup');
    });

    test('shows link back to login', async ({ page }) => {
        await page.goto('/signup');
        await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    });
});
