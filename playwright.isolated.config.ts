import { defineConfig } from '@playwright/test';

// Sibling config for isolated runs that must NOT touch the ports the other
// camtaylor/slip sessions use (4174/4181 are taken). Same two-build model.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4384',
  },
  projects: [
    {
      name: 'preview',
      testIgnore: '**/public.spec.ts',
      use: { baseURL: 'http://127.0.0.1:4384' },
    },
  ],
  webServer: [
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4384',
      url: 'http://127.0.0.1:4384',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
