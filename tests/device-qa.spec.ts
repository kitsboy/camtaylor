import { test, expect } from '@playwright/test';

/**
 * Device QA matrix — ported from the Aug line and adapted to the current
 * markup. These run at real phone widths so they exercise the mobile CSS
 * layers (mobile.css / bold-modern.css) rather than depending on a UA string.
 */

const MOBILE_WIDTHS = [320, 390];

/**
 * The document may never be wider than the viewport — at any width, not just
 * the two phones.
 *
 * This ran at 320 and 390 only, because `body { overflow-x: hidden }` was
 * covering everything else. That rule propagates to the viewport, so it does
 * not clip anything the page can see: it only suppresses the scrollbar that a
 * too-wide page earns. Underneath it, two decorative tints bled 105–124px past
 * the right edge at 900–1280px — a hidden horizontal scrollbar, and a guard
 * that could never fail. The bleed is bounded at its source now
 * (`.glow-field`) and the rule is gone, so this measures the real thing.
 *
 * Two exclusions, both deliberate:
 *   - anything inside an `overflow: hidden` ancestor is clipped on purpose (the
 *     hero's contour art, the ticker's marquee);
 *   - `position: fixed` cannot extend the document, and the route bar has its own
 *     guard that measures the bar itself rather than the page.
 *
 * A *left* bleed is fine and used on purpose — the about photo's offset and the
 * contact form's honeypot both sit outside the left edge, and neither can make
 * a left-to-right page scroll sideways. The right edge is the one that counts.
 */
const OVERFLOW_WIDTHS = [1440, 1280, 1024, 900, 768, 430, 390, 320];

for (const width of OVERFLOW_WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.locator('.hero-route-status')).toBeVisible();
    // Entrance animations and scroll reveals move elements horizontally; let
    // them land before measuring, otherwise the test races a mid-flight frame.
    await page.waitForTimeout(900);

    const info = await page.evaluate(() => {
      const doc = document.scrollingElement!;
      const viewport = document.documentElement.clientWidth;
      const clipped = (el: Element) => {
        let p = el.parentElement;
        while (p) {
          if (getComputedStyle(p).overflowX !== 'visible') return true;
          p = p.parentElement;
        }
        return false;
      };
      const past = (el: Element) => Math.round(el.getBoundingClientRect().right - viewport);
      const widest: string[] = [];
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (past(el) <= 1) return;
        if (getComputedStyle(el).position === 'fixed') return;
        if (clipped(el)) return;
        widest.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} +${past(el)}px`);
      });
      return { scrollWidth: doc.scrollWidth, clientWidth: viewport, widest: widest.slice(0, 6) };
    });

    expect(
      info.scrollWidth,
      `past the right edge: ${JSON.stringify(info.widest)}`,
    ).toBeLessThanOrEqual(info.clientWidth);
    expect(info.widest, 'elements past the right edge').toEqual([]);
  });
}

/**
 * The rule that was removed was global, so the guard cannot live on one page.
 */
for (const path of ['/route/giveabit', '/privacy']) {
  for (const width of [1280, 390]) {
    test(`${path} does not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await page.waitForTimeout(700);

      const info = await page.evaluate(() => ({
        scrollWidth: document.scrollingElement!.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(info.scrollWidth).toBeLessThanOrEqual(info.clientWidth);
    });
  }
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

const BAR_WIDTHS = [320, 360, 390, 430];

/**
 * The bar is `display: none` above 768px, so the pixel audit in
 * `contrast.spec.ts` never sees it — and that blind spot was hiding a real
 * fault: the active label was drawn in `--green`, a fixed token that does not
 * flip with the theme, which is 7.7:1 on the light bar and **1.6:1** on the
 * night one. The camp you are standing on was nearly invisible in the dark.
 *
 * This composes the tokens the way the browser does rather than rastering a
 * 23,000px page at a phone width, so it is cheap enough to run per theme.
 */
test('the route bar stays legible in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-quick-nav')).toBeVisible();
  await page.waitForTimeout(600);

  for (const theme of ['warm', 'night'] as const) {
    // Set the theme, then let it settle before reading anything. A theme flip
    // does not land in one frame: the tokens resolve immediately, the bar's
    // own background repaints on the next one, and the button's colour
    // transitions. Measure inside that window and the guard reads a
    // half-switched bar — warm ink on the warm background, which passes, which
    // is exactly how this check can be green while the night theme is broken.
    await page.evaluate((activeTheme: string) => {
      document.documentElement.dataset.theme = activeTheme;
    }, theme);
    await page.waitForTimeout(450);

    const measured = await page.evaluate(() => {
      interface Rgb { r: number; g: number; b: number; a: number }
      const parse = (colour: string): Rgb => {
        const hex = colour.trim().match(/^#([0-9a-f]{6})$/i);
        if (hex) {
          const n = parseInt(hex[1], 16);
          return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
        }
        const n = (colour.match(/[\d.]+/g) ?? ['0', '0', '0']).map(Number);
        return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
      };
      const channel = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const luminance = (c: Rgb) => 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
      const over = (fg: Rgb, bg: Rgb): Rgb => ({
        r: fg.r * fg.a + bg.r * (1 - fg.a),
        g: fg.g * fg.a + bg.g * (1 - fg.a),
        b: fg.b * fg.a + bg.b * (1 - fg.a),
        a: 1,
      });
      const ratio = (a: Rgb, b: Rgb) => {
        const l1 = luminance(a);
        const l2 = luminance(b);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      };
      // Walk up until something is opaque — the bar itself is translucent
      // glass. Nothing in the chain is opaque here (body and html compute to
      // transparent, the page is painted by `--bg`), so the walk bottoms out
      // on the page backdrop.
      const pageBackground = parse(
        getComputedStyle(document.documentElement).getPropertyValue('--bg'),
      );
      const backdrop = (el: Element): Rgb => {
        let acc: Rgb | null = null;
        let node: Element | null = el;
        while (node && node !== document.documentElement) {
          const colour = parse(getComputedStyle(node).backgroundColor);
          if (colour.a > 0) acc = acc ? over(acc, colour) : colour;
          if (acc && acc.a === 1) return acc;
          node = node.parentElement;
        }
        return acc ? over(acc, pageBackground) : pageBackground;
      };

      const rows = [...document.querySelectorAll<HTMLElement>('.mobile-quick-nav-btn span')].map(
        (label) => {
          const bg = backdrop(label);
          const fg = over(parse(getComputedStyle(label).color), bg);
          return {
            label: label.textContent ?? '',
            active: Boolean(label.closest('.active')),
            ink: getComputedStyle(label).color,
            behind: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
            ratio: Math.round(ratio(fg, bg) * 100) / 100,
          };
        },
      );

      return { theme: document.documentElement.dataset.theme, rows };
    });

    const offenders = measured.rows.filter((row) => row.ratio < 4.5);
    expect(measured.theme, 'the theme did not stick').toBe(theme);
    expect(offenders, `${theme} theme, under 4.5:1:\n${JSON.stringify(measured.rows, null, 1)}`).toEqual(
      [],
    );
    expect(measured.rows).toHaveLength(6);
  }
});

/**
 * A fixed bar is invisible to every guard this suite already had.
 *
 * It contributes nothing to `document.scrollingElement.scrollWidth` (the
 * overflow test above still reads exactly the viewport width), and a 44px sweep
 * passes while the row overflows, because each *button* is 44px — it is the row
 * that is wrong. The bar held ten items, which is 440px of targets: at 390px
 * the last two, Ventures and Connect, sat entirely off the right edge of the
 * screen with all of it green. Connect is the bar's call to action, so the one
 * control that mattered was the one you could not press.
 *
 * So measure the bar itself, its right edge, and its labels.
 */
for (const width of BAR_WIDTHS) {
  test(`the route bar fits inside a ${width}px phone`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.locator('.mobile-quick-nav')).toBeVisible();
    await page.waitForTimeout(600);

    const bar = await page.evaluate(() => {
      const nav = document.querySelector('.mobile-quick-nav') as HTMLElement;
      const items = [...nav.querySelectorAll<HTMLElement>('.mobile-quick-nav-btn')].map((btn) => {
        const box = btn.getBoundingClientRect();
        const label = btn.querySelector('span') as HTMLElement;
        return {
          name: btn.getAttribute('aria-label') ?? '',
          width: Math.round(box.width),
          overshoot: Math.round(box.right - window.innerWidth),
          clipped: label.scrollWidth > label.clientWidth + 1,
        };
      });
      return { rowOverflow: nav.scrollWidth - nav.clientWidth, items };
    });

    expect(bar.rowOverflow, `the bar overflows itself: ${JSON.stringify(bar.items)}`).toBeLessThanOrEqual(0);

    const offscreen = bar.items.filter((item) => item.overshoot > 0);
    expect(offscreen, `past the right edge: ${JSON.stringify(offscreen)}`).toEqual([]);

    const clipped = bar.items.filter((item) => item.clipped);
    expect(clipped, `label truncated: ${JSON.stringify(clipped)}`).toEqual([]);

    expect(bar.items).toHaveLength(6);
    expect(bar.items[bar.items.length - 1].name).toBe('Connect');
  });
}

/**
 * The route sheet menu is the only surface carrying all twelve camps, so it has
 * to be reachable, scrollable and closable. Two ways it was not:
 *
 *  - the sheet is a child of `.navbar`, so its z-index stacks inside the
 *    navbar's own context and it painted over the masthead, burying the button
 *    that closes it;
 *  - the body scroll lock set `touch-action: none` on `<body>`, which the
 *    browser intersects with the ancestors of whatever you touch, so a sheet
 *    taller than the screen could not be swiped at all.
 */
test('the route sheet menu carries all twelve camps in three legs', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#mobile-nav-menu');
  await expect(menu).toHaveClass(/nav-mobile-menu--open/);

  const stops = menu.locator('.nav-mobile-link');
  await expect(stops).toHaveCount(12);
  await expect(menu.locator('.nav-mobile-leg')).toHaveCount(3);
  await expect(stops.first()).toContainText('Base Camp');
  await expect(stops.last()).toContainText('Summit');

  const sheet = await menu.evaluate((el) => ({
    scrollable: el.scrollHeight > el.clientHeight,
    bodyTouchAction: getComputedStyle(document.body).touchAction,
  }));
  expect(sheet.scrollable, 'twelve stops have to fit somewhere').toBe(true);
  expect(sheet.bodyTouchAction, 'a locked body must not lock the overlay too').not.toBe('none');

  // The sheet scrolls under the masthead, so the masthead must out-stack it.
  const mastheadOnTop = await page.evaluate(() => {
    const pill = (document.querySelector('.nav-container') as HTMLElement).getBoundingClientRect();
    const hit = document.elementFromPoint(window.innerWidth / 2, pill.top + pill.height / 2);
    return Boolean(hit && hit.closest('.nav-container'));
  });
  expect(mastheadOnTop, 'the sheet is painting over the masthead').toBe(true);

  await menu.getByRole('button', { name: 'Ventures' }).click();
  await expect(page.locator('#ventures')).toBeInViewport({ timeout: 20000 });
  await expect(menu).not.toHaveClass(/nav-mobile-menu--open/);

  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(menu).toHaveClass(/nav-mobile-menu--open/);
  await page.locator('.nav-menu-btn').click();
  await expect(menu).not.toHaveClass(/nav-mobile-menu--open/);
});

/**
 * The pill and the bar's Connect item are the same door: both say "start a
 * conversation" and both are the loudest thing on their strip of screen. Both
 * are worth having — the pill is the wide invitation, Connect is the permanent
 * thumb-reach — but both lit at once is the site shouting twice about one
 * thing. Exactly one carries the accent at any moment.
 *
 * `StickyCta` publishes which is showing on `<html data-cta>`.
 */
test('only one call to action is lit at a time', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-quick-nav')).toBeVisible();

  const ACCENT = 'rgb(215, 255, 85)';
  const read = () =>
    page.evaluate(() => ({
      pillShowing: !document.querySelector('.sticky-cta')!.classList.contains('sticky-cta--hidden'),
      connect: getComputedStyle(document.querySelector('.mobile-quick-nav-btn--cta')!).backgroundColor,
      lane: document.documentElement.dataset.cta ?? '(none)',
      scrollY: Math.round(window.scrollY),
    }));

  // Scrolling down sends the pill away; the bar carries the call.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 4000);
    await new Promise((r) => setTimeout(r, 700));
  });
  const down = await read();
  expect(down.scrollY, 'the page did not scroll, so this proves nothing').toBeGreaterThan(3000);
  expect(down.pillShowing, 'the pill should be away while reading downwards').toBe(false);
  expect(down.lane).toBe('bar');
  expect(down.connect, 'the bar should be carrying the call to action').toBe(ACCENT);

  // Scrolling back up is what summons the pill, and the bar stands down.
  await page.evaluate(async () => {
    window.scrollTo(0, 3600);
    await new Promise((r) => setTimeout(r, 700));
  });
  const up = await read();
  expect(up.pillShowing, 'the pill did not appear on scroll-up').toBe(true);
  expect(up.lane).toBe('pill');
  expect(up.connect, 'two calls to action lit at once').not.toBe(ACCENT);
});
