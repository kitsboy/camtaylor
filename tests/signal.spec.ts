import { expect, test, type Page } from '@playwright/test';

// A dropped read used to blank the panels and print "offline" — blaming the reader's
// connection for what is usually a blocked request, and discarding a reading the browser
// had received a minute earlier. The reading is now kept with its own timestamp and the
// panel says which one it is showing. What must never happen is a cached number presented
// as current, so both halves are guarded here: the fallback arrives labelled, and a cold
// failure still says offline.

// Newest first, the way the API returns them — the panel takes the head of the list as
// the tip, so an ascending fixture would quietly test the wrong end of it.
const BLOCKS = Array.from({ length: 15 }, (_, index) => ({
  height: 900_014 - index,
  timestamp: 1_750_000_000 + index * 600,
  tx_count: 2_000 + index * 25,
  extras: { medianFee: 3 },
}));
const FEES = { fastestFee: 12, halfHourFee: 9, hourFee: 7, economyFee: 4 };
const MEMPOOL = { count: 60_000, vsize: 50_000_000 };
const LIGHTNING = Array.from({ length: 6 }, (_, index) => ({
  added: 1_750_000_000 + index * 86_400,
  channel_count: 40_000 + index,
  total_capacity: 500_000_000_000 + index * 1_000_000,
  tor_nodes: 1_200,
  clearnet_nodes: 800,
  unannounced_nodes: 300,
}));
const CANDLES = Array.from({ length: 26 }, (_, index) => [
  1_750_000_000 - (25 - index) * 3600,
  60_000,
  62_000,
  61_000,
  61_500,
  10,
]);

const ROUTES: Array<[string, string]> = [
  ['**/api/v1/blocks', JSON.stringify(BLOCKS)],
  ['**/api/v1/fees/recommended', JSON.stringify(FEES)],
  ['**/api/mempool', JSON.stringify(MEMPOOL)],
  ['**/api/v1/lightning/statistics/3m', JSON.stringify(LIGHTNING)],
  ['**/candles**', JSON.stringify(CANDLES)],
  ['**/api/v1/prices', JSON.stringify({ USD: 61_500, CAD: 84_000 })],
];

async function serveReadings(page: Page) {
  for (const [pattern, body] of ROUTES) {
    await page.route(pattern, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body }),
    );
  }
}

async function failReadings(page: Page) {
  for (const [pattern] of ROUTES) {
    await page.unroute(pattern);
    await page.route(pattern, (route) => route.abort('failed'));
  }
}

test('a failed read shows the last good reading, labelled with its own timestamp', async ({ page }) => {
  await serveReadings(page);
  await page.goto('/#signal');

  const state = page.locator('.live-state');
  await expect(state).toContainText('LIVE');
  await expect(page.locator('.live-stale')).toHaveCount(0);
  const tipBefore = await page.locator('.live-mini-stat', { hasText: 'Tip height' }).innerText();
  expect(tipBefore, 'the fixture should have produced a real tip height').not.toContain('—');

  await failReadings(page);
  await page.reload();

  await expect(state).toContainText('LAST GOOD');
  const stale = page.locator('.live-stale');
  await expect(stale).toBeVisible();
  await expect(stale).toContainText('showing the last reading this browser received');
  await expect(stale).toContainText('the chain reading');
  // The reading itself is still there — that is the point of keeping it.
  const tipAfter = await page.locator('.live-mini-stat', { hasText: 'Tip height' }).innerText();
  expect(tipAfter).toContain('900,014');
  await expect(page.locator('svg.live-chart')).toBeVisible();
});

test('a cold failure invents nothing and says so', async ({ page }) => {
  await failReadings(page);
  await page.goto('/#signal');

  await expect(page.locator('.live-state')).toContainText('OFFLINE');
  await expect(page.locator('.live-stale')).toHaveCount(0);
  await expect(page.locator('.live-offline')).toBeVisible();
  await expect(page.locator('.live-mini-stat', { hasText: 'Tip height' })).toContainText('—');
});
