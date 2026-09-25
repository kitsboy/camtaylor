import { expect, test } from '@playwright/test';

// Night mode used to arrive late: `useTheme` wrote `data-theme` in a React effect, so a
// reader who had chosen night got the warm ground painted first and the dark one a frame
// later — a flash on every load. And the default was hard-coded `'warm'`, so a dark-OS
// visitor was never offered the dark ground at all. `index.html` now resolves the theme
// inline, before the bundle, and the hook only starts from that decision.

test('the theme is decided before the bundle runs, from the OS when nothing is stored', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  // Abort the bundle: nothing React can run, so whatever set the attribute was the inline
  // script and nothing else. This is what makes the test about *pre-paint* rather than
  // about the theme being right eventually.
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#12100e');
});

test('a stored choice beats the operating system', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('camtaylor-theme', 'warm'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'warm');
});

test('a first visit does not freeze the OS preference, a toggle does', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  // Following the OS is not a decision, so it must not be written down as one.
  expect(await page.evaluate(() => localStorage.getItem('camtaylor-theme'))).toBeNull();

  await page.locator('.theme-toggle:visible').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'warm');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#ddd6cb');
  expect(await page.evaluate(() => localStorage.getItem('camtaylor-theme'))).toBe('warm');
});

test('the pre-paint script ships ahead of the app bundle', async ({ page }) => {
  const html = await (await page.request.get('/')).text();
  const inline = html.indexOf('prefers-color-scheme');
  // In a built page the bundle is `<script type="module" crossorigin src="/assets/index-*.js">`
  // — `/src/main.tsx` only exists while Vite is serving dev — so match the tag, not the path.
  const bundle = html.search(/<script[^>]*type="module"/);
  const style = html.search(/<link[^>]*rel="stylesheet"/);
  expect(inline, 'index.html has no inline theme script').toBeGreaterThan(-1);
  expect(bundle, 'no module bundle in the served document').toBeGreaterThan(-1);
  expect(inline, 'the theme script must run before the bundle, or the ground is painted first')
    .toBeLessThan(bundle);
  if (style > -1) expect(inline, 'the theme script must run before the first stylesheet').toBeLessThan(style);
});
