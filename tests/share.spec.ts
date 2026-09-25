import { expect, test, type Page } from '@playwright/test';

// One card served every page, so a shared dispatch was indistinguishable from the homepage
// in a feed — same image, same words, no idea which dispatch you were being shown. Each page
// now points at a card generated from its own title, summary and date.
//
// These guards check the whole chain, because every link in it fails silently: a page whose
// `og:image` is never updated looks perfect in a browser, and so does a card that was never
// generated.

async function shareImage(page: Page) {
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  return {
    url: await page.locator('meta[property="og:image"]').getAttribute('content'),
    type: await page.locator('meta[property="og:image:type"]').getAttribute('content'),
    twitter: await page.locator('meta[name="twitter:image"]').getAttribute('content'),
  };
}

test('a dispatch and a venture route each share their own card', async ({ page }) => {
  await page.goto('/');
  const dispatchHref = await page.locator('#expeditions .log-title a').first().getAttribute('href');
  const slug = dispatchHref!.split('/').pop();

  await page.goto(dispatchHref!);
  await expect.poll(async () => (await shareImage(page)).url).toContain(`/og/${slug}.jpg`);
  const dispatch = await shareImage(page);
  expect(dispatch.type).toBe('image/jpeg');
  expect(dispatch.twitter).toBe(dispatch.url);

  const served = await page.request.get(new URL(dispatch.url!).pathname);
  expect(served.status(), 'the card the meta tag points at is not served').toBe(200);
  expect(served.headers()['content-type']).toContain('image/jpeg');
  expect((await served.body()).length, 'the card is too small to be a real card').toBeGreaterThan(10_000);

  await page.goto('/route/satohash');
  await expect.poll(async () => (await shareImage(page)).url).toContain('/og/satohash.jpg');
});

test('the homepage still shares the site card', async ({ page }) => {
  await page.goto('/');
  const home = await shareImage(page);
  expect(home.url).toBe('https://camtaylor.ca/og-image.png');
  expect(home.type).toBe('image/png');
  const served = await page.request.get('/og-image.png');
  expect(served.status()).toBe(200);
});
