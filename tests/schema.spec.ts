import { expect, test } from '@playwright/test';

// Everything below the homepage carried no structured data at all: a dated, attributed
// dispatch was plain HTML to anything reading it mechanically, and a case file arrived with
// no indication of where it sits in the site. Pages now declare themselves. The failure
// mode worth guarding is accumulation — client-side navigation that leaves the previous
// page's schema in the head, so the next page is described as the one before it.

async function pageSchema(page: import('@playwright/test').Page) {
  // `page.goto` resolves on load, which for a single-page app is before the route's effect
  // has run — so read the head only once the page has rendered and the count has settled.
  await expect(page.locator('h1').first()).toBeVisible();
  await page.waitForTimeout(200);
  return page.evaluate(() => {
    const blocks = [...document.querySelectorAll('script[data-page-schema]')];
    return { count: blocks.length, json: blocks[0]?.textContent ?? null };
  });
}

test('a dispatch describes itself as a dated article, with a breadcrumb', async ({ page }) => {
  await page.goto('/');
  // The log's first entry is a real dispatch, whatever the seed content happens to be.
  const href = await page.locator('#expeditions .log-title a').first().getAttribute('href');
  expect(href).toMatch(/^\/dispatch\//);
  await page.goto(href!);

  const { count, json } = await pageSchema(page);
  expect(count, 'a dispatch should carry exactly one page schema').toBe(1);
  const graph = JSON.parse(json!)['@graph'];
  const article = graph.find((node: { '@type': string }) => node['@type'] === 'BlogPosting');
  expect(article, 'no BlogPosting node').toBeTruthy();
  expect(article.headline).toBe((await page.locator('h1').first().innerText()).trim());
  expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(article.author.name).toBe('Cam Taylor');
  expect(article.url).toBe(`https://camtaylor.ca${href}`);

  const breadcrumb = graph.find((node: { '@type': string }) => node['@type'] === 'BreadcrumbList');
  expect(breadcrumb.itemListElement.map((item: { name: string }) => item.name)).toEqual([
    'Home',
    'Sherpa',
    article.headline,
  ]);
});

test('navigating between pages replaces the schema instead of piling it up', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('#expeditions .log-title a').first().getAttribute('href');
  await page.goto(href!);
  const first = await pageSchema(page);

  await page.goto('/route/satohash');
  const second = await pageSchema(page);
  expect(second.count).toBe(1);
  expect(second.json, 'the previous page’s schema is still in the head').not.toBe(first.json);

  // And a page with nothing to declare must not inherit one either.
  await page.goto('/privacy');
  expect((await pageSchema(page)).count).toBe(0);
});
