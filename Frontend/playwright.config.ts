import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const ADMIN_AUTH_FILE = path.join(__dirname, 'tests/.auth/admin.json');

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        // Login once and save auth state
        {
            name: 'auth-setup',
            testMatch: 'auth.setup.ts',
        },
        // Unauthenticated tests (login page, landing page)
        {
            name: 'unauthenticated',
            testMatch: ['login.spec.ts', 'landing.spec.ts'],
            use: { ...devices['Desktop Chrome'] },
        },
        // Authenticated tests — all dashboard pages
        {
            name: 'authenticated',
            testIgnore: ['login.spec.ts', 'landing.spec.ts', 'auth.setup.ts'],
            use: {
                ...devices['Desktop Chrome'],
                storageState: ADMIN_AUTH_FILE,
            },
            dependencies: ['auth-setup'],
        },
    ],
    webServer: process.env.CI ? undefined : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
    },
});
