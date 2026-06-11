import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — NamThuEdu full-system E2E + animation + visual tests.
 *
 * Chạy với mock data (VITE_USE_MOCK_DATA=true) nên không cần backend live.
 * Dev server tự khởi động qua `webServer`.
 *
 * Lệnh:
 *   npx playwright test                 # toàn bộ
 *   npx playwright test public          # 1 nhóm
 *   npx playwright test --project=mobile
 *   npx playwright test --update-snapshots
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Vite dev server biên dịch on-demand → giới hạn worker để tránh quá tải
  // gây navigation timeout khi chạy song song nhiều spec.
  workers: process.env.CI ? 2 : 3,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: './e2e/.report', open: 'never' }],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },

  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet',          use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile',          use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
