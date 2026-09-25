import { expect, test, type Page } from '@playwright/test';

// Two things nothing in this suite could see: how much the page ships, and whether its own
// links go anywhere. Javascript grew a dependency at a time with no ceiling to notice
// (framer-motion, lucide and a router all arrived that way), and a link is only checked by
// a human clicking it — the SPA answers 200 for every path, including the ones that do not
// exist, so a `page.request.get` status proves nothing here.

// Measured on the built site with gzip, because that is what a phone downloads: 166kB of
// JavaScript, a 69kB largest chunk, 668kB of imagery and 98kB of webfonts. The ceilings sit
// about a third above those — loose enough never to fire on a legitimate change, tight
// enough that the next dependency has to be argued for.
const JS_TOTAL_BUDGET = 240 * 1024;
const JS_CHUNK_BUDGET = 110 * 1024;
const IMAGE_TOTAL_BUDGET = 800 * 1024;
const FONT_TOTAL_BUDGET = 150 * 1024;

async function resourceSizes(page: Page) {
  return page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const bytes = (list: PerformanceResourceTiming[]) => list.reduce((sum, entry) => sum + entry.encodedBodySize, 0);
    // Filter by what the file *is*, not by `initiatorType`: the bundler fetches the vendor
    // chunks as dynamic imports, which reports as `other`, and filtering on `script` quietly
    // measured one file out of five — a budget that cannot see three quarters of the
    // JavaScript is worse than no budget, because it reads as a pass.
    const path = (name: string) => new URL(name).pathname;
    const scripts = entries.filter((entry) => /\.m?js$/.test(path(entry.name)));
    const images = entries.filter((entry) => /\.(png|jpe?g|webp|avif|svg)$/.test(path(entry.name)));
    const fonts = entries.filter((entry) => /\.woff2?$/.test(path(entry.name)));
    return {
      js: bytes(scripts),
      jsChunks: scripts.map((entry) => ({ name: path(entry.name).split('/').pop() ?? entry.name, size: entry.encodedBodySize })),
      images: bytes(images),
      fonts: bytes(fonts),
    };
  });
}

test('the homepage keeps its script and image weight inside the budget', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  const { js, jsChunks, images, fonts } = await resourceSizes(page);
  expect(js, 'no JavaScript was measured at all — the budget is blind').toBeGreaterThan(50 * 1024);

  const fat = jsChunks.filter((chunk) => chunk.size > JS_CHUNK_BUDGET);
  expect(
    fat.map((chunk) => `${chunk.name} ${(chunk.size / 1024).toFixed(0)}kB`),
    `a single chunk is over ${JS_CHUNK_BUDGET / 1024}kB — code-split it or move it off the first load`,
  ).toEqual([]);

  expect(
    js,
    `the homepage ships ${(js / 1024).toFixed(0)}kB of JavaScript against a ${JS_TOTAL_BUDGET / 1024}kB budget`,
  ).toBeLessThan(JS_TOTAL_BUDGET);

  expect(
    images,
    `the homepage ships ${(images / 1024).toFixed(0)}kB of imagery against a ${IMAGE_TOTAL_BUDGET / 1024}kB budget`,
  ).toBeLessThan(IMAGE_TOTAL_BUDGET);

  expect(
    fonts,
    `the homepage ships ${(fonts / 1024).toFixed(0)}kB of webfonts against a ${FONT_TOTAL_BUDGET / 1024}kB budget`,
  ).toBeLessThan(FONT_TOTAL_BUDGET);
});

test('every internal link lands on a page that exists', async ({ page }) => {
  test.slow();
  // Nothing off this origin is needed to answer "does this route render": no YouTube
  // frame, no data API, no webfont. Blocking them is the difference between a crawl that
  // takes a minute and one that does not finish.
  await page.route('**', (route) =>
    new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('h1').first().waitFor();
  await page.waitForTimeout(500);

  const { routes, files } = await page.evaluate(() => {
    const all = new Set<string>();
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      const href = anchor.getAttribute('href') ?? '';
      if (!href.startsWith('/')) continue;
      const path = href.split('#')[0].split('?')[0];
      if (path && path !== '/') all.add(path);
    }
    // `/feed.xml` and friends are files the server serves, not routes the app renders —
    // they are checked with a request instead of a navigation.
    const isFile = (path: string) => /\.[a-z0-9]{2,5}$/i.test(path);
    return {
      routes: [...all].filter((path) => !isFile(path)).sort(),
      files: [...all].filter(isFile).sort(),
    };
  });
  expect(routes.length, 'no internal links found to check').toBeGreaterThan(5);

  const missing = [];
  for (const file of files) {
    const response = await page.request.get(file);
    if (!response.ok()) missing.push(`${file} → ${response.status()}`);
  }
  expect(missing, `linked files the server does not serve:\n  ${missing.join('\n  ')}`).toEqual([]);

  const broken: string[] = [];
  for (const path of routes) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const rendered = await page
      .locator('h1')
      .first()
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    const heading = rendered ? (await page.locator('h1').first().innerText()).trim() : '';
    const offTheMap = await page.locator('.not-found-page').count();
    const title = await page.title();
    if (!rendered || offTheMap > 0 || !heading || /not found/i.test(title)) {
      broken.push(`${path} → "${heading}" (${title})`);
    }
  }

  expect(
    broken,
    `internal links that land off the map:\n  ${broken.join('\n  ')}`,
  ).toEqual([]);
});
