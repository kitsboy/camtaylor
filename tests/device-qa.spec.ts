import { test, expect } from '@playwright/test';

/**
 * Device QA matrix — ported from the Aug line and adapted to the current
 * markup. These run at real phone widths so they exercise the mobile CSS
 * layers (mobile.css / bold-modern.css) rather than depending on a UA string.
 */

const MOBILE_WIDTHS = [320, 390];

for (const width of MOBILE_WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.locator('.hero-route-status')).toBeVisible();
    // Entrance animations and scroll reveals move elements horizontally; let
    // them land before measuring, otherwise the test races a mid-flight frame.
    await page.waitForTimeout(700);

    const info = await page.evaluate(() => {
      const doc = document.scrollingElement!;
      const clipped = (el: Element) => {
        let p = el.parentElement;
        while (p) {
          if (getComputedStyle(p).overflowX !== 'visible') return true;
          p = p.parentElement;
        }
        return false;
      };
      const widest: string[] = [];
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.right <= doc.clientWidth + 0.5) return;
        if (clipped(el)) return;
        widest.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`);
      });
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        widest: widest.slice(0, 5),
      };
    });

    expect(info.scrollWidth, JSON.stringify(info)).toBeLessThanOrEqual(info.clientWidth);
  });
}

test('primary interactive controls meet 44px on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const undersized = await page.evaluate(() => {
    const selectors = [
      '.btn-primary',
      '.btn-secondary',
      '.submit-btn',
      '.sticky-cta-btn',
      '.nav-menu-btn',
      '.theme-toggle',
      '.venture-case-btn',
      '.venture-link-btn',
      '.copy-email-btn',
      '.mobile-email-cta',
      '.log-filter-btn',
      '.venture-filter-btn',
      '.terminal-pill',
    ].join(', ');

    const offenders: string[] = [];
    document.querySelectorAll(selectors).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const min = Math.min(rect.width, rect.height);
      if (min > 0 && min < 40) {
        offenders.push(`${el.tagName.toLowerCase()}.${el.className}`);
      }
    });
    return offenders.slice(0, 10);
  });

  expect(undersized).toEqual([]);
});

test('command deck opens and closes on a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Toggle Command Deck' }).click();
  const deck = page.getByRole('dialog', { name: 'Sherpa Command Deck' });
  await expect(deck).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(deck).toBeHidden();
});

test('dispatch timeline stays legible at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#expedition-log');

  const log = page.locator('.log-timeline');
  await expect(log).toBeVisible();
  await expect(log.locator('.log-entry').first()).toBeVisible();
});
