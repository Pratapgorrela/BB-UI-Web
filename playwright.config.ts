import { defineConfig, devices } from '@playwright/test';

/**
 * E2E critical-path suite (F12, step 127). Runs fully offline against the
 * in-repo mock layer (VITE_USE_MOCKS) — no backend required, deterministic
 * seeds. Mobile-first viewport per design.md (375px baseline).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:5180',
    viewport: { width: 375, height: 812 },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 5180 --strictPort',
    url: 'http://localhost:5180',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
