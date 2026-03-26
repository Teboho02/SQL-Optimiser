# Team 3 — Claude Guidelines

## Project Structure

```
team-3/
├── backend/aspnet-core/   # ASP.NET Core / ABP Framework (.NET 9)
└── frontend/              # Next.js / React (TypeScript)
```

## Standards

All code contributions must follow the team standards defined in:

- **Backend**: [.claude/standards/backend-standards.md](.claude/standards/backend-standards.md)
- **Frontend**: [.claude/standards/frontend-standards.md](.claude/standards/frontend-standards.md)

Read the relevant standards file before making changes to either layer.

## Frontend — New Pages

Whenever a new frontend page is created, also create a matching Playwright test file in `frontend/tests/` named after the page (e.g. `dashboard.spec.ts`).

All tests for that page must be grouped in a single `test.describe` block. Include boilerplate tests that cover:
- The page loads and the correct heading or key element is visible
- The page URL is correct

Example structure:
```ts
import { test, expect } from '@playwright/test';

test.describe('PageName', () => {
    test('loads successfully', async ({ page }) => {
        await page.goto('/route');
        await expect(page.getByRole('heading', { name: 'Page Title' })).toBeVisible();
    });

    test('has correct URL', async ({ page }) => {
        await page.goto('/route');
        await expect(page).toHaveURL('/route');
    });
});
```
