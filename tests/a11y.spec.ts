import { expect, test } from '@playwright/test';

// The keyboard and screen-reader pass, as guards. These are the faults the pass actually
// found — a closed mobile sheet whose fourteen controls were still tabbable while every
// label in it was hidden from a screen reader, and a heading outline that jumped h2 → h4
// straight into the contact sidebar.

test.describe('nothing hidden from assistive tech is still in the tab order', () => {
  for (const [label, viewport] of [
    ['phone', { width: 390, height: 844 }],
    ['desktop', { width: 1440, height: 900 }],
  ] as const) {
    test(label, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForTimeout(1200);

      const orphans = await page.evaluate(() => {
        const focusable = [
          ...document.querySelectorAll<HTMLElement>(
            'a[href], button, input, select, textarea, [tabindex]',
          ),
        ].filter((el) => el.getAttribute('tabindex') !== '-1');
        // Hidden from a screen reader *and* still reachable by keyboard. If the subtree is
        // `inert` as well, it is out of reach and this is not a fault — which is the whole
        // difference the fix makes.
        return focusable
          .filter((el) => {
            const hidden = el.closest('[aria-hidden="true"]') as HTMLElement | null;
            return !!hidden && !hidden.hasAttribute('inert');
          })
          .map((el) => {
            const where = el.closest('[aria-hidden="true"]') as HTMLElement;
            return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} inside aria-hidden .${where.className.toString().split(' ')[0]}`;
          });
      });

      expect(orphans, `unreachable-by-labelling but tabbable:\n  ${orphans.join('\n  ')}`).toEqual([]);
    });
  }
});

test('the heading outline never skips a level', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200);

  const jumps = await page.evaluate(() => {
    const headings = [...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')].filter(
      // Only what a reader is actually served: headings inside a closed dialog or an
      // aria-hidden subtree are not part of the outline they hear.
      (h) => h.getClientRects().length > 0 && !h.closest('[aria-hidden="true"]'),
    );
    const found: string[] = [];
    for (let i = 1; i < headings.length; i += 1) {
      const from = Number(headings[i - 1].tagName[1]);
      const to = Number(headings[i].tagName[1]);
      if (to - from > 1) {
        found.push(
          `h${from} "${headings[i - 1].innerText.trim().slice(0, 30)}" → h${to} "${headings[i].innerText.trim().slice(0, 30)}"`,
        );
      }
    }
    return found;
  });

  expect(jumps, `the outline skips:\n  ${jumps.join('\n  ')}`).toEqual([]);
});

test('every control is named and every image is labelled or deliberately empty', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200);

  const { nameless, unlabelled } = await page.evaluate(() => {
    const controls = [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [role="button"]',
      ),
    ].filter((el) => !el.closest('[aria-hidden="true"]') && el.getClientRects().length > 0);
    return {
      nameless: controls
        .filter((el) => {
          const labelledBy = el.getAttribute('aria-labelledby');
          return !(
            el.getAttribute('aria-label')?.trim() ||
            el.getAttribute('title')?.trim() ||
            el.getAttribute('placeholder')?.trim() ||
            (labelledBy && document.getElementById(labelledBy)?.textContent?.trim()) ||
            el.textContent?.trim()
          );
        })
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`),
      // `alt=""` is a statement — "this image is decorative". A missing attribute is not.
      unlabelled: [...document.querySelectorAll<HTMLImageElement>('img:not([alt])')].map(
        (img) => img.getAttribute('src') ?? '(no src)',
      ),
    };
  });

  expect(nameless, `controls with no accessible name:\n  ${nameless.join('\n  ')}`).toEqual([]);
  expect(unlabelled, `images with no alt attribute:\n  ${unlabelled.join('\n  ')}`).toEqual([]);
});

test('the route sheet is a modal that keeps focus and hands it back', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(1200);

  const toggle = page.locator('.nav-menu-btn').first();
  const sheet = page.locator('#mobile-nav-menu');
  const closed = await sheet.evaluate((el) => ({
    hidden: el.getAttribute('aria-hidden'),
    inert: el.hasAttribute('inert'),
  }));
  expect(closed).toEqual({ hidden: 'true', inert: true });

  await toggle.click();
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await expect(sheet).toHaveAttribute('aria-modal', 'true');
  await expect(sheet).toHaveAttribute('role', 'dialog');

  // A trap is only a trap if it wraps: the sheet holds ~14 controls, so twelve tabs
  // proves nothing. Walk further than the count and watch for an escape.
  const escapes: string[] = [];
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        inside: !!el?.closest('#mobile-nav-menu'),
        label: `${el?.tagName.toLowerCase()}.${(el?.className || '').toString().split(' ')[0]}`,
      };
    });
    if (!active.inside) escapes.push(`${i + 1}: ${active.label}`);
  }
  expect(escapes, `focus escaped the sheet at:\n  ${escapes.join('\n  ')}`).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
  await expect(toggle).toBeFocused();
});

test('the charts say what they are, and the skip link is the first stop', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200);

  const unnamedCharts = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[role="img"], figure > svg')]
      .filter((el) => !el.getAttribute('aria-label')?.trim() && !el.querySelector('title'))
      .map((el) => el.className.toString().split(' ')[0] || el.tagName.toLowerCase()),
  );
  expect(unnamedCharts, `unnamed graphics: ${unnamedCharts.join(', ')}`).toEqual([]);

  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  const target = await skip.getAttribute('href');
  expect(target).toBeTruthy();
  await expect(page.locator(target!)).toHaveCount(1);
});
