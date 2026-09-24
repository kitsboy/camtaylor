import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The homepage is heavy (video, canvas, live external reads), so give tests
  // and assertions room instead of tripping over slow network under parallel load.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // More workers than this starve each other on a busy machine and turn plain
  // assertions into 60s timeouts. CI gets the same cap; it only has more room.
  workers: 3,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
});