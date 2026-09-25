import { test, expect, type Page } from '@playwright/test';

/**
 * Contrast guard.
 *
 * Asserts that text which is actually rendered meets WCAG AA against its real
 * backdrop. The backdrop is sampled from a screenshot of the live page rather
 * than recomputed from `background-color`, because much of this site paints
 * backgrounds as gradients (including `body`), which `getComputedStyle` cannot
 * reduce to one colour. For each element the modal (most common) pixel colour
 * inside its box is taken as the backdrop.
 *
 * This exists so the UI can keep being restyled without silently regressing
 * legibility. On failure the console lists the element, text, and ratio.
 */

test.use({ reducedMotion: 'reduce' });

interface Failure {
  selector: string;
  text: string;
  ratio: number;
  required: number;
  color: string;
  background: string;
  fontSize: number;
}

interface ProbeResult {
  failures: Failure[];
  checked: number;
  skipped: number;
  skipReasons: Record<string, number>;
}

/**
 * Runs in the browser. `shot` is a base64 PNG of the full page.
 * `rootSelector` limits the audit to a subtree (needed when a modal overlays
 * the rest of the page, so content underneath is not judged against it).
 */
async function probe({ shot, rootSelector }: { shot: string; rootSelector: string | null }): Promise<ProbeResult> {
  const AA_NORMAL = 4.5;
  const AA_LARGE = 3.0;

  type Rgb = { r: number; g: number; b: number };
  const parse = (value: string): (Rgb & { a: number }) | null => {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((s) => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const channel = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance = (c: Rgb): number => 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
  const ratio = (a: Rgb, b: Rgb): number => {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const img = new Image();
  img.src = `data:image/png;base64,${shot}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const at = (x: number, y: number): Rgb => {
    const cx = Math.max(0, Math.min(canvas.width - 1, Math.round(x)));
    const cy = Math.max(0, Math.min(canvas.height - 1, Math.round(y)));
    const i = (cy * canvas.width + cx) * 4;
    return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
  };

  /** Most common colour inside the box — the backdrop usually dominates the glyphs. */
  const modalBackdrop = (rect: DOMRect): Rgb | null => {
    const stepX = Math.max(1, Math.floor(rect.width / 24));
    const stepY = Math.max(1, Math.floor(rect.height / 8));
    const buckets = new Map<string, { count: number; rgb: Rgb }>();
    for (let y = rect.top + 1; y < rect.bottom - 1; y += stepY) {
      for (let x = rect.left + 1; x < rect.right - 1; x += stepX) {
        const c = at(x, y);
        // Quantise so antialiased near-misses land in the same bucket.
        const key = `${c.r >> 3}-${c.g >> 3}-${c.b >> 3}`;
        const found = buckets.get(key);
        if (found) found.count += 1;
        else buckets.set(key, { count: 1, rgb: c });
      }
    }
    let best: { count: number; rgb: Rgb } | null = null;
    for (const b of buckets.values()) if (!best || b.count > best.count) best = b;
    return best ? best.rgb : null;
  };

  const describe = (el: Element): string => {
    const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
    const tag = el.tagName.toLowerCase();
    return cls ? `${tag}.${cls}` : tag;
  };

  const isLarge = (el: Element, style: CSSStyleDeclaration): boolean => {
    const size = parseFloat(style.fontSize);
    const weight = parseInt(style.fontWeight, 10) || 400;
    return size >= 24 || (size >= 18.66 && weight >= 700);
  };

  const failures: Failure[] = [];
  const skipReasons: Record<string, number> = {};
  const skip = (reason: string) => {
    skipReasons[reason] = (skipReasons[reason] ?? 0) + 1;
  };
  let checked = 0;
  let skipped = 0;

  const root: Element = rootSelector ? (document.querySelector(rootSelector) ?? document.body) : document.body;
  const scrollY = window.scrollY;

  // Fixed, non-interactive overlays (the private-preview banner, for instance)
  // paint over page content without being hit-testable, so `elementFromPoint`
  // cannot detect them. Only overlays *in front of* the element count — a modal
  // backdrop sits behind its own dialog and must not disqualify the dialog.
  const zIndexOf = (node: Element): number => {
    let n: Element | null = node;
    while (n && n !== document.documentElement) {
      const z = getComputedStyle(n).zIndex;
      if (z !== 'auto') return parseInt(z, 10) || 0;
      n = n.parentElement;
    }
    return 0;
  };

  const overlays = Array.from(document.querySelectorAll('*'))
    .filter((n) => {
      const cs = getComputedStyle(n);
      return (
        (cs.position === 'fixed' || cs.position === 'absolute') &&
        cs.zIndex !== 'auto' &&
        cs.pointerEvents === 'none' &&
        parseFloat(cs.opacity) > 0
      );
    })
    .map((n) => ({ el: n, z: parseInt(getComputedStyle(n).zIndex, 10) || 0, rect: n.getBoundingClientRect() }));

  const coveredByOverlay = (el: Element, rect: DOMRect): boolean =>
    overlays.some(({ el: o, z, rect: or }) => {
      if (or.width === 0 || or.height === 0) return false;
      if (o.contains(el)) return false; // an ancestor paints underneath its children
      const overlaps = !(or.right < rect.left || or.left > rect.right || or.bottom < rect.top || or.top > rect.bottom);
      if (!overlaps) return false;
      const zEl = zIndexOf(el);
      if (z < zEl) return false; // painted behind the element
      if (z === zEl) {
        // Same stacking level: whichever is later in the DOM paints on top.
        return (o.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) === 0;
      }
      return true;
    });

  const candidates: Array<{ el: Element; text: string; pseudo: string | null }> = [];

  for (const el of Array.from(root.querySelectorAll('body * , *'))) {
    if (el.closest('[aria-hidden="true"], [data-contrast-ignore]')) continue;
    if (el.classList.contains('sr-only')) continue;

    const ownText = Array.from(el.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();
    if (ownText) candidates.push({ el, text: ownText, pseudo: null });

    // Placeholders are rendered text too, but are not text nodes.
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      const ph = getComputedStyle(el, '::placeholder').color;
      if (ph && parse(ph)) candidates.push({ el, text: el.placeholder || '(placeholder)', pseudo: '::placeholder' });
    }
  }

  /** Any ancestor that is still animating in, or faded out, cannot be sampled. */
  const unstable = (el: Element): string | null => {
    let node: Element | null = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (cs.animationName !== 'none') return `animates (${cs.animationName})`;
      if (parseFloat(cs.opacity) === 0) return 'ancestor opacity 0';
      node = node.parentElement;
    }
    return null;
  };

  for (const { el, text, pseudo } of candidates) {
    const style = getComputedStyle(el);
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) {
      skip('not visible');
      continue;
    }
    // Skip anything still animating in (marquee, pulsing badge, un-revealed
    // framer-motion card): its pixels vary frame to frame.
    const reason = unstable(el);
    if (reason) {
      skip(reason);
      continue;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) {
      skip('too small');
      continue;
    }

    // If something hit-testable is on top at the text's centre, the sampled
    // pixel belongs to that element, not this one.
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const topmost = document.elementFromPoint(cx, cy);
    if (topmost && topmost !== el && !el.contains(topmost) && !topmost.contains(el)) {
      skip('covered by another element');
      continue;
    }
    // And if a non-interactive overlay paints over it, the pixel is that layer.
    if (coveredByOverlay(el, rect)) {
      skip('covered by a non-interactive overlay');
      continue;
    }

    const colorValue = pseudo ? getComputedStyle(el, pseudo).color : style.color;
    const fg = parse(colorValue);
    if (!fg || fg.a === 0) continue;

    // Document coordinates: the screenshot is full-page, the rect is viewport-relative.
    const docRect = new DOMRect(rect.left, rect.top + scrollY, rect.width, rect.height);
    const bg = modalBackdrop(docRect);
    if (!bg) {
      skipped += 1;
      continue;
    }

    const fgRgb: Rgb = fg.a < 1
      ? {
          r: fg.r * fg.a + bg.r * (1 - fg.a),
          g: fg.g * fg.a + bg.g * (1 - fg.a),
          b: fg.b * fg.a + bg.b * (1 - fg.a),
        }
      : { r: fg.r, g: fg.g, b: fg.b };

    const required = isLarge(el, style) ? AA_LARGE : AA_NORMAL;
    const r = ratio(fgRgb, bg);
    checked += 1;

    if (r < required) {
      failures.push({
        selector: describe(el),
        text: (pseudo ? `${text} (${pseudo})` : text).slice(0, 40),
        ratio: Math.round(r * 100) / 100,
        required,
        color: colorValue,
        background: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
        fontSize: parseFloat(style.fontSize),
      });
    }
  }

  return { failures, checked, skipped, skipReasons };
}

async function audit(page: Page, label: string, rootSelector: string | null = null): Promise<ProbeResult> {
  // Scroll the whole page once so lazy/in-view content has mounted, then
  // return to the top so rects line up with a full-page screenshot.
  // Smooth scrolling is forced off: otherwise scrollTo(0,0) is still animating
  // when the screenshot is taken and every sampled coordinate is off.
  await page.evaluate(async () => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    // Slow enough that whileInView reveals have actually fired and settled.
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));

    if (window.scrollY !== 0) {
      throw new Error(`expected to be back at the top before screenshotting, scrollY=${window.scrollY}`);
    }
    html.style.scrollBehavior = previous;
  });

  const shot = (await page.screenshot({ fullPage: true })).toString('base64');
  const result = await page.evaluate(probe, { shot, rootSelector });

  const reasons = Object.entries(result.skipReasons)
    .map(([r, n]) => `${r} x${n}`)
    .join(', ');
  if (result.failures.length) {
    console.log(`\n${label}: ${result.failures.length} contrast failure(s) of ${result.checked} checked`);
    for (const f of result.failures) {
      console.log(
        `  ${String(f.ratio).padStart(5)} / ${f.required}  ${f.selector}  "${f.text}"  ${f.color} on ${f.background}  ${f.fontSize}px`,
      );
    }
  } else {
    console.log(`\n${label}: all ${result.checked} checks pass (${result.skipped} skipped)`);
  }
  if (reasons) console.log(`  skipped because: ${reasons}`);
  return result;
}

/** Both themes ship to users, so both are audited. */
const THEMES = ['warm', 'night'] as const;
type ThemeName = (typeof THEMES)[number];

async function applyTheme(page: Page, theme: ThemeName) {
  const currentlyNight = (await page.locator('html').getAttribute('data-theme')) === 'night';
  if (currentlyNight !== (theme === 'night')) {
    // Drive the real control rather than writing the attribute, so the toggle's
    // own styling is exercised too.
    await page.locator('.theme-toggle').first().click();
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

const MIN_CHECKS: Record<ThemeName, number> = { warm: 50, night: 50 };

test('homepage text meets WCAG AA contrast in both themes', async ({ page }) => {
  // The cost here is not the checks (657 of them read fast) but the full-page
  // raster the probe samples colours from: ~14.5k px tall, twice, under a
  // 3-worker load. Same instrument, honest budget.
  test.slow();
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('button', { name: /All Give A Bit routes/i }).click();

  for (const theme of THEMES) {
    await applyTheme(page, theme);
    const result = await audit(page, `homepage (${theme})`);
    // A vacuous audit (nothing sampled) must not pass silently.
    expect(result.checked, `${theme}: the audit sampled no text at all`).toBeGreaterThan(MIN_CHECKS[theme]);
    expect(result.failures, `see ${theme} output above`).toEqual([]);
  }
});

test('a dispatch page meets WCAG AA contrast in both themes', async ({ page }) => {
  await page.goto('/dispatch/why-this-site-was-rebuilt');

  for (const theme of THEMES) {
    await applyTheme(page, theme);
    const result = await audit(page, `dispatch (${theme})`);
    expect(result.checked, `${theme}: the audit sampled no text at all`).toBeGreaterThan(5);
    expect(result.failures, `see ${theme} output above`).toEqual([]);
  }
});

test('the command deck meets WCAG AA contrast in both themes', async ({ page }) => {
  test.slow();
  await page.goto('/');
  // Wait for the nav to mount so the global key handler is attached before the
  // keypress, otherwise the shortcut can land on nothing.
  await expect(page.locator('.nav-keycap')).toHaveText('/');

  for (const theme of THEMES) {
    await applyTheme(page, theme);
    await page.keyboard.press('/');
    await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Terminal command input' })).toBeVisible();

    // Scoped to the deck: everything behind it is dimmed by the overlay.
    // `.terminal-window` is the deck's own dialog; other `[role="dialog"]`
    // elements exist earlier in the DOM (hidden menus), so select it directly.
    const result = await audit(page, `command deck (${theme})`, '.terminal-window');
    expect(result.checked, `${theme}: the audit sampled no text at all`).toBeGreaterThan(0);
    expect(result.failures, `see ${theme} output above`).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeHidden();
  }
});
