import { expect, test } from '@playwright/test';

// The one test that can prove the last link in the chain: that a submission actually arrives
// in the inbox Kimi monitors. Everything else in `public.spec.ts` stops at the browser, and
// its submissions are intercepted precisely so a test run cannot post mail anywhere.
//
// This one does post mail, so it is opt-in and never part of CI:
//
//   LIVE_FORM_TEST=1 npx playwright test tests/live-form.spec.ts
//
// It sends exactly one marked submission — the subject and the body carry a `CT-TEST-…`
// marker, so the line it leaves in hello@giveabit.io is unmistakable and deletable. Run it
// when the endpoint or the production variables change; the first real inquiry is not a test.
const LIVE = process.env.LIVE_FORM_TEST === '1';
const MARKER = `CT-TEST-${Date.now()}`;
const SITE = process.env.LIVE_SITE ?? 'https://camtaylor.ca/';

test.describe('live submission', () => {
  test.skip(!LIVE, 'posts real mail — set LIVE_FORM_TEST=1 to run it against the live endpoint');

  test('the live form accepts a marked submission', async ({ page }) => {
    await page.goto(`${SITE}#contact`);

    // If production is still a private build the button is disabled and this is the reason,
    // rather than a timeout further down.
    await expect(page.locator('.form-preview-notice')).toHaveCount(0);
    const submit = page.getByRole('button', { name: 'Send message' });
    await expect(submit).toBeEnabled();

    await page.locator('#name').fill('CT live-form test');
    await page.locator('#email').fill('live-form-test@giveabit.io');
    await page.locator('#message').fill(
      `${MARKER} — automated delivery check for camtaylor.ca. Nothing here needs a reply; ` +
        'this line exists only to prove the contact form reaches hello@giveabit.io.',
    );
    await submit.click();

    // The endpoint accepting it is the assertion; whether it then lands in the inbox is
    // Kimi's side of the chain, and the marker is how she finds it.
    await expect(page.locator('.contact-success')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.contact-success')).toContainText('hello@giveabit.io');
    await expect(page.locator('.form-failure')).toHaveCount(0);
  });
});
