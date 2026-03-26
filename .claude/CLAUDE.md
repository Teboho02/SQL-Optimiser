# Team 3 — Claude Guidelines

## Project Structure

```
team-3/
├── backend/aspnet-core/   # ASP.NET Core / ABP Framework (.NET 9)
└── frontend/              # Next.js / React (TypeScript)
```

## GitHub Issues

Every piece of work — new features, bug fixes, pages, refactors, or any other task — must have a corresponding GitHub issue **before** work begins.

- If no issue exists for the task, create one first using `gh issue create`.
- Use the project's feature request or bug report format as appropriate.
- Reference the issue number in commit messages and pull requests.

## Standards

All code contributions must follow the team standards defined in:

- **Backend**: [.claude/standards/backend-standards.md](.claude/standards/backend-standards.md)
- **Frontend**: [.claude/standards/frontend-standards.md](.claude/standards/frontend-standards.md)

Read the relevant standards file before making changes to either layer.

## Backend — New Features

Whenever a new backend entity or service is added, follow the six-step ABP/DDD scaffold process defined in the `add-backend-feature` skill:

1. Define the domain entity in `Core/Domains/` extending `FullAuditedEntity<Guid>`
2. Add a `DbSet<T>` to the `DbContext`
3. Generate a migration with `dotnet ef migrations add`
4. Create the DTO with `[AutoMap(typeof(TEntity))]`
5. Create the service interface `I{Entity}AppService`
6. Implement the service `{Entity}AppService` with `[AbpAuthorize]`

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
