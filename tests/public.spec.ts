import { expect, test } from '@playwright/test';

// These run against `VITE_PRIVATE_PREVIEW=false` — the build visitors get, and the only
// build in which the contact form is enabled at all. Nothing here may reach Formspree:
// every submission is intercepted, so a test run cannot post mail into a real inbox.

const FORMSPREE = '**formspree.io/**';

test('no third-party script arrives when no analytics domain is configured', async ({ page }) => {
  const external = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!url.hostname.endsWith('127.0.0.1') && !['data:', 'blob:'].includes(url.protocol)) {
      external.push(url.hostname);
    }
  });
  await page.goto('/');
  await page.waitForTimeout(2000);
  // The data APIs are the site's own readings; an analytics host here would mean the
  // loader does not respect its own switch.
  expect(external).not.toContain('plausible.io');
  await expect(page.locator('script[data-analytics]')).toHaveCount(0);
});

test('the published build switches the form on and names the monitored inbox', async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.locator('.form-preview-notice')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  const note = page.locator('.contact-delivery-note');
  await expect(note).toContainText('hello@giveabit.io');
  await expect(note).not.toContainText('private preview');
  await expect(note).not.toContainText('cam@camtaylor.ca');
});

test('a refused submission hands the reader the address instead of a dead end', async ({ page }) => {
  await page.route(FORMSPREE, (route) => route.fulfill({ status: 500, body: '{}' }));
  await page.goto('/#contact');

  await page.locator('#name').fill('Ada Lovelace');
  await page.locator('#organization').fill('Analytical Engines');
  await page.locator('#email').fill('ada@example.com');
  await page.locator('#message').fill('Structure: a difference engine. Assets: none yet. Timeline: Q4.');
  await page.getByRole('button', { name: 'Send message' }).click();

  const failure = page.locator('.form-failure');
  await expect(failure).toBeVisible();
  await expect(failure).toContainText('nothing was delivered');

  // The whole brief has to survive the failure: the link carries the name, the address,
  // the tier and the message, so nothing typed is lost.
  const href = await page.getByTestId('form-failure-mailto').getAttribute('href');
  expect(href).toContain('mailto:hello@giveabit.io?subject=');
  const body = decodeURIComponent(href!.split('&body=')[1]);
  expect(body).toContain('Ada Lovelace');
  expect(body).toContain('ada@example.com');
  expect(body).toContain('Analytical Engines');
  expect(body).toContain('Structure: a difference engine');

  // And it must be retryable: the button comes back rather than staying spent.
  await expect(page.getByRole('button', { name: 'Send again' })).toBeEnabled();
});

test('a delivered submission says where it went and retires the form', async ({ page }) => {
  let posted = '';
  // `@formspree/core` only calls a response a success if it parses to an object carrying
  // a `next` string — anything else is a SubmissionError, including a plain `{}`.
  await page.route(FORMSPREE, async (route) => {
    posted = route.request().postData() ?? '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"next":"/thanks"}',
    });
  });
  await page.goto('/#contact');

  await page.locator('#name').fill('Ada Lovelace');
  await page.locator('#email').fill('ada@example.com');
  await page.locator('#message').fill('One paragraph, sent on purpose.');
  await page.getByRole('button', { name: 'Send message' }).click();

  const success = page.locator('.contact-success');
  await expect(success).toBeVisible();
  await expect(success).toContainText('hello@giveabit.io');
  await expect(success).toContainText('Ada Lovelace');
  // The payload carries the honeypot and the tier the reader chose, and no other address.
  expect(posted).toContain('_gotcha');
  expect(posted).toContain('dealTier');
  expect(posted).not.toContain('cam@camtaylor.ca');
});
