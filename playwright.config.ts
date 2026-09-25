import { defineConfig } from '@playwright/test';

// Two servers, because the site has two builds and only one of them has ever been
// tested. `VITE_PRIVATE_PREVIEW` defaults to true, so every test in this repo until now
// ran against the *preview* build: the contact form disabled, the banner up, analytics
// off. The published site is the other build — which is exactly how it spent a release
// with a disabled form and its own copy promising delivery "once camtaylor.ca goes
// public", on a domain that was already public. `tests/public.spec.ts` runs against the
// build that visitors actually get.
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
  projects: [
    {
      name: 'preview',
      testIgnore: '**/public.spec.ts',
      use: { baseURL: 'http://127.0.0.1:4174' },
    },
    {
      name: 'public',
      testMatch: '**/public.spec.ts',
      use: { baseURL: 'http://127.0.0.1:4181' },
    },
  ],
  webServer: [
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // The public build, to its own directory so it cannot overwrite the preview one.
      command:
        'VITE_PRIVATE_PREVIEW=false npm run build -- --outDir dist-live && npx vite preview --outDir dist-live --host 127.0.0.1 --port 4181 --strictPort',
      url: 'http://127.0.0.1:4181',
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
