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

/**
 * Standalone controls a thumb has to hit clear 44px in both dimensions.
 *
 * This replaced a curated selector list measured at a 40px threshold, which is
 * why 102 of 194 controls on a phone were passing while sitting under 44px.
 * The only carve-out is a link inside a sentence — the same exception WCAG 2.5.8
 * makes — so the sweep skips anything inside flowing prose. Offenders print
 * with their measured box so a failure is actionable without a rerun.
 */
const INLINE_PROSE = 'p, li, blockquote, figcaption, h1, h2, h3, h4, h5, h6, label, .legal-content';

for (const width of MOBILE_WIDTHS) {
  test(`every standalone control clears 44px at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');

    // Walk the whole page, then walk each horizontal carousel, so every
    // `whileInView` reveal has fired before anything is measured. A control
    // still sitting at its `initial` scale(0.95) reports ~4% under its real
    // size — that is a mid-animation reading, not a layout fault. Walking the
    // carousels rather than excluding them keeps the sweep honest: the off-cut
    // cards are measured once they have revealed, the same way a thumb meets
    // them after a swipe.
    await page.evaluate(async () => {
      const html = document.documentElement;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      const settle = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await settle(120);
      }
      window.scrollTo(0, 0);

      for (const slider of document.querySelectorAll<HTMLElement>('.ventures-slider')) {
        slider.scrollLeft = slider.scrollWidth;
        await settle(500);
        slider.scrollLeft = 0;
      }

      html.style.scrollBehavior = previous;
    });
    // The card reveals are staggered (delay up to ~0.5s + 0.4s), so the last
    // cards are still scaling when a shorter wait returns.
    await page.waitForTimeout(1600);

    const undersized = await page.evaluate((prose: string) => {
      const offenders: string[] = [];
      const controls = document.querySelectorAll<HTMLElement>(
        'a[href], button, [role="button"], input, select, textarea',
      );
      controls.forEach((el) => {
        if (el.closest('[aria-hidden="true"], .sr-only, .skip-link')) return;
        if (el.closest(prose)) return;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w >= 44 && h >= 44) return;
        const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 18);
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 32)} ${w}x${h} "${label}"`);
      });
      return [...new Set(offenders)].sort();
    }, INLINE_PROSE);

    expect(undersized.length, `${undersized.length} control(s) under 44px:\n${undersized.join('\n')}`).toBe(0);
  });
}

/**
 * Reduced motion is an accessibility setting, not a preference to interpret.
 * The audit that already exists (`contrast.spec.ts`) runs with it on, but
 * nothing asserted it was honoured — 13 elements kept animating under it.
 */
test('reduced motion stops every ambient loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(1200);

  const stillMoving = await page.evaluate(() => {
    const rows: string[] = [];
    const pseudos = [null, '::before', '::after'] as const;
    document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
      pseudos.forEach((pseudo) => {
        const style = getComputedStyle(el, pseudo);
        if (style.animationName === 'none') return;
        if (parseFloat(style.animationDuration) <= 0.05) return;
        rows.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} ${style.animationName} ${style.animationDuration}`,
        );
      });
    });
    return [...new Set(rows)].sort().slice(0, 20);
  });

  expect(stillMoving, `still animating under reduced motion:\n${stillMoving.join('\n')}`).toEqual([]);
});

/**
 * The default ambient set is a budget, not an accident: one loop per region.
 * These three were the loudest repeats and carry no information.
 */
test('the decorative loops stay parked by default', async ({ page }) => {
  await page.goto('/');

  const parked = await page.evaluate(() => {
    const bars = document.querySelector('.intelligence-bars span');
    const orb = document.querySelector('.glow-orb-cyan');
    const shine = document.querySelector('.hero-video-shine');
    const name = (el: Element | null) => (el ? getComputedStyle(el).animationName : 'absent');
    return { bars: name(bars), orb: name(orb), shine: name(shine) };
  });

  expect(parked).toEqual({ bars: 'none', orb: 'none', shine: 'none' });
});

/**
 * The ventures carousel is a horizontal snap scroller, and its cards used to
 * reveal on their own `whileInView`. A card parked off the viewport never
 * fires that, so a fast flick left five of seven cards at opacity 0 —
 * permanently blank. The reveal is now driven by the section, so no card can
 * be skipped. This asserts the outcome a user would notice: nothing blank.
 */
test('a hard flick through the ventures carousel strands no blank cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelector('.ventures-scroll-wrap')?.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 900));
  });

  // Jump straight to the far end: the cards in between are never intersected,
  // which is exactly what a flick does.
  await page.evaluate(async () => {
    const slider = document.querySelector<HTMLElement>('.ventures-slider');
    if (!slider) return;
    const snap = slider.style.scrollSnapType;
    slider.style.scrollSnapType = 'none';
    slider.scrollLeft = slider.scrollWidth;
    await new Promise((r) => setTimeout(r, 1400));
    slider.style.scrollSnapType = snap;
  });

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('.venture-card')]
      .map((card, index) => ({ index, name: card.querySelector('.venture-name')?.textContent ?? '', opacity: getComputedStyle(card).opacity }))
      .filter((card) => Number(card.opacity) < 1),
  );

  expect(hidden, `cards left invisible: ${JSON.stringify(hidden)}`).toEqual([]);
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
