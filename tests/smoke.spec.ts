import { test, expect } from '@playwright/test';

test('homepage loads with hero and sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.private-preview-banner')).toBeVisible();
  await expect(page.locator('script[src*="analytics"]')).toHaveCount(0);

  await expect(page).toHaveTitle(/Cam Taylor.*Sherpa/);
  await expect(page.getByRole('heading', { name: /Sherpa/i }).first()).toBeVisible();
  await expect(page.locator('.hero-card-meta')).toContainText('PROOF-FIRST PRACTICE');
  await expect(page.locator('.hero-badge')).toContainText('OPEN TO NEW CONVERSATIONS');
  await expect(page.locator('.intelligence-value')).toContainText('FOUNDER-LED');
  await expect(page.locator('.metric-value')).toHaveCount(3);
  await expect(page.locator('.metric-value').first()).toContainText('Tech · Capital · Deals');
  await expect(page.getByRole('heading', { name: /Sherpa Philosophy/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Areas of Expertise/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Active Ventures/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible();
});

test('footer renders dynamic links and family spectrum', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('contentinfo')).toContainText('Keep climbing');
  await expect(page.getByRole('contentinfo')).toContainText('Meet the agents');
  await expect(page.getByRole('contentinfo').locator('.footer-agents-panel')).toBeVisible();
  await expect(page.getByRole('contentinfo').locator('.back-to-top--progress')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Sovereignty is a practice.');
  await expect(page.getByRole('contentinfo').locator('.footer-palette-bar').first()).toHaveAttribute('aria-label', /Visit/);
  await expect(page.locator('.footer-palette-bar')).toHaveCount(10);
  await expect(page.getByRole('contentinfo').locator('a[href="mailto:hello@giveabit.io"]').first()).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('button', { name: 'Copy family email' })).toBeVisible();
  const sitemapToggle = page.getByRole('contentinfo').getByRole('button', { name: /All Give A Bit routes/i });
  await expect(sitemapToggle).toHaveAttribute('aria-expanded', 'false');
  await sitemapToggle.click();
  await expect(sitemapToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#footer-sitemap-list .footer-sitemap-item')).toHaveCount(10);
});

test('private preview banner and navigation have separate bands', async ({ page }) => {
  await page.goto('/');
  const banner = await page.locator('.private-preview-banner').boundingBox();
  const nav = await page.locator('.navbar').boundingBox();
  expect(banner).not.toBeNull();
  expect(nav).not.toBeNull();
  expect((nav?.y ?? 0)).toBeGreaterThanOrEqual((banner?.height ?? 0) - 1);
});

test('masthead holds the brand and never overflows its container', async ({ page }) => {
  test.slow();
  await page.goto('/');

  const brand = page.locator('.nav-brand');
  await expect(brand).toContainText('CAM TAYLOR');
  await expect(brand.locator('.brand-dot')).toHaveText('SHERPA');
  await expect(page.locator('.title-role')).toHaveText('Sherpa.');
  await expect(page.locator('.hero-card-meta span').first()).toBeVisible();

  for (const width of [1440, 1024, 780, 430]) {
    await page.setViewportSize({ width, height: 900 });
    const fit = (selector: string) =>
      page.locator(selector).evaluate((el) => ({
        sw: el.scrollWidth,
        cw: el.clientWidth,
        widest: [...el.querySelectorAll<HTMLElement>('*')]
          .filter((child) => child.getBoundingClientRect().width > 0)
          .reduce<{ cls: string; past: number } | null>((worst, child) => {
            const edge = el.getBoundingClientRect().right - parseFloat(getComputedStyle(el).paddingRight);
            const past = Math.round(child.getBoundingClientRect().right - edge);
            return !worst || past > worst.past ? { cls: child.className.toString().split(' ')[0] || child.tagName, past } : worst;
          }, null),
      }));
    // The numbers go in the message: "it overflows" without a width and a pixel
    // count is the kind of failure that gets a threshold edited instead of a bug.
    const nav = await fit('.nav-container');
    expect(nav.sw, `nav overflows at ${width}px: ${nav.sw} > ${nav.cw}, widest is ${nav.widest?.cls} past by ${nav.widest?.past}`).toBeLessThanOrEqual(nav.cw + 1);
    const shell = await fit('.hero-shell');
    expect(shell.sw, `hero shell overflows at ${width}px: ${shell.sw} > ${shell.cw}, widest is ${shell.widest?.cls} past by ${shell.widest?.past}`).toBeLessThanOrEqual(shell.cw + 1);
  }
});

test('navigation exposes the agents front door', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('.nav-agents-cta');
  await expect(cta).toHaveAttribute('href', 'https://agents.giveabit.io');
  await expect(cta).toContainText('Meet agents');
});

test('navigation scrolls to contact', async ({ page }) => {
  await page.goto('/');
  // Scoped: the route sheet also offers a way to Connect, so an unscoped
  // first() would be relying on document order rather than intent.
  await page.locator('.navbar').getByRole('button', { name: 'Connect' }).click();
  await expect(page.locator('#contact')).toBeInViewport();
});

test('hash routing scrolls to contact', async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.locator('#contact')).toBeInViewport({ timeout: 20000 });
});

test('legal pages render', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle(/Privacy Policy/);
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();

  await page.goto('/terms');
  await expect(page).toHaveTitle(/Terms of Use/);
  await expect(page.getByRole('heading', { name: 'Terms of Use' })).toBeVisible();
});

test('ecosystem sections render with family and agents', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#agents')).toContainText('Kimi');
  await expect(page.locator('#family')).toContainText('agents.giveabit.io');
  await expect(page.locator('.family-tooltip').first()).toContainText('Open');
  await expect(page.locator('#proof')).toContainText('old truth');
  await expect(page.locator('.proof-signal-legend')).toContainText('Reachable');
  await expect(page.locator('.agents-constellation')).toBeVisible();
  await expect(page.getByRole('link', { name: /Meet the agents/i }).first()).toHaveAttribute('href', /agents\.giveabit\.io/);
  await expect(page.locator('.family-count')).toContainText('10');
});

test('family filters have strong contrast and update the route count', async ({ page }) => {
  await page.goto('/');
  // Exact: "Glacier" is also a camp on the route sheet, and a substring match
  // would legitimately hit both controls.
  const satohashFilter = page.getByRole('button', { name: 'glacier', exact: true });
  await expect(satohashFilter).toHaveCSS('color', 'rgb(16, 23, 19)');
  await expect(satohashFilter).toHaveCSS('border-top-width', '2px');
  await satohashFilter.click();
  await expect(page.locator('.family-count')).toContainText('1 of 10');
  await expect(page.locator('#family')).toContainText('satohash.io');
  await expect(page.locator('.family-grid')).toHaveClass(/family-grid--spotlight/);
});

test('trail kit lists standardized referral cards with an honest disclosure', async ({ page }) => {
  await page.goto('/');
  const kit = page.locator('#kit');
  await expect(kit.getByRole('heading', { name: /Tools I actually use/i })).toBeVisible();
  await expect(kit.locator('.kit-disclosure')).toContainText(/referral links/i);

  const cards = kit.locator('.kit-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const card = cards.nth(i);
    await expect(card.locator('.kit-mark')).toBeVisible();
    await expect(card.locator('.kit-chip')).toBeVisible();
    await expect(card.locator('.kit-name')).toBeVisible();
    await expect(card.locator('.kit-tagline')).toBeVisible();
    await expect(card.locator('.kit-note')).toBeVisible();
    await expect(card.locator('.kit-flag')).toBeVisible();
  }

  const freebuff = kit.locator('.kit-card', { hasText: 'Freebuff' });
  await expect(freebuff).toHaveAttribute('href', /freebuff\.com\/get-started\?ref=/);
  await expect(freebuff).toHaveAttribute('target', '_blank');
  await expect(freebuff).toContainText('Referral');
});

test('route ticker runs standing conditions past a live Pacific clock', async ({ page }) => {
  await page.goto('/');
  const ticker = page.locator('.route-ticker');
  await expect(ticker).toBeVisible();
  await expect(ticker).toContainText('PROOF OVER PROMISE');
  await expect(ticker.locator('.route-ticker-clock')).toContainText(/\d{1,2}:\d{2}/);
  await expect(ticker.locator('.route-ticker-clock')).toContainText('PT');
  await expect(ticker.locator('.route-ticker-track[aria-hidden="true"]')).toHaveCount(1);
});

test('route rail marks the active section on desktop', async ({ page }) => {
  await page.goto('/');
  const rail = page.locator('.route-rail');
  await expect(rail).toBeVisible();
  await expect(rail.locator('.route-rail-marker')).toHaveCount(12);
  await expect(rail.locator('.route-rail-marker[aria-current="true"]')).toHaveCount(1);

  await rail.locator('.route-rail-marker[data-section="ventures"]').click();
  await expect(page.locator('#ventures')).toBeInViewport({ timeout: 20000 });
});

const LIVE_STATES = /LIVE|OFFLINE|CONNECTING/;

test('live signal reads the chain and stays honest when the read fails', async ({ page }) => {
  await page.goto('/');
  const signal = page.locator('#signal');
  await expect(signal.getByRole('heading', { name: /Live from the mempool/i })).toBeVisible();
  await expect(signal.getByRole('button', { name: 'Refresh reading' })).toBeVisible();
  await expect(signal.locator('.live-note')).toContainText('mempool.space');
  await expect(signal.locator('.live-note')).toContainText(/not advice|rather than showing a guess/i);

  const state = signal.locator('.live-state');
  await expect(state).toContainText(LIVE_STATES);
  await expect(state).not.toContainText('CONNECTING', { timeout: 15000 });

  if ((await state.textContent())?.includes('LIVE')) {
    await expect(signal.locator('.live-chart')).toBeVisible();
    await expect(signal.locator('.live-chart-wrap .live-chart-line')).toBeVisible();
    await expect(signal.locator('.live-chart-point')).not.toHaveCount(0);
    await expect(signal.locator('.live-stat')).toHaveCount(4);
    await expect(signal.locator('.live-fee')).toHaveCount(4);
  } else {
    await expect(signal.locator('.live-offline')).toBeVisible();
  }
});

test('lightning capacity panel plots snapshots or says so honestly', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('#signal .live-panel--lightning');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Lightning capacity');
  await expect(panel.locator('.live-panel-note')).toContainText(/public, announced network only/i);
  await expect(panel.locator('.live-mini-stat')).toHaveCount(4);

  await expect.poll(async () => (await panel.textContent())?.includes('Reading Lightning snapshots')).toBe(false);

  if (await panel.locator('.lightning-chart').count()) {
    await expect(panel.locator('.lightning-chart')).toBeVisible();
    await expect(panel.locator('.live-chart-point').first()).toBeVisible();
    await expect(panel).toContainText(/snapshots ·|snapshots/);
  } else {
    await expect(panel.locator('.live-panel-empty')).toBeVisible();
  }

  await expect(page.locator('#signal .live-chart')).toHaveCount(1);
});

test('live signal charts share one frame and one reading row', async ({ page }) => {
  await page.goto('/');
  const signal = page.locator('#signal');

  // Every card owns a chart frame, live reading or honest empty state.
  const wells = signal.locator('.live-chart-well');
  await expect(wells).toHaveCount(3);

  // The panels fill in asynchronously — a chart, a reading, or an honest empty
  // state — and each one changes its own height when its fetch lands, so the
  // geometry below is polled until it settles instead of read from the first
  // frame after `goto`. Read once, this passed on a quiet machine and failed
  // under three workers with the contrast raster running beside it.
  const frames = () =>
    wells.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { top: Math.round(box.top), height: Math.round(box.height) };
      }),
    );
  const spread = async (pick: (frame: { top: number; height: number }) => number) => {
    const values = (await frames()).map(pick);
    return Math.max(...values) - Math.min(...values);
  };
  await expect
    .poll(() => spread((frame) => frame.top), { message: 'the three chart frames never lined up on one row' })
    .toBeLessThanOrEqual(2);
  await expect
    .poll(() => spread((frame) => frame.height), { message: 'the three chart frames never settled to one height' })
    .toBeLessThanOrEqual(2);

  // The chain readings moved into the first card; the other two keep theirs.
  await expect(signal.locator('.live-chart-wrap .live-stat')).toHaveCount(4);
  await expect(signal.locator('.live-panel .live-stat')).toHaveCount(0);

  // Bottom blocks rest on the card floor, so the row reads as one band. Same
  // race, same remedy.
  const floors = signal.locator('.live-chart-wrap .live-mini-stats, .live-panel-note');
  await expect(floors).toHaveCount(3);
  await expect
    .poll(
      async () => {
        const bottoms = await floors.evaluateAll((nodes) =>
          nodes.map((node) => Math.round(node.getBoundingClientRect().bottom)),
        );
        return Math.max(...bottoms) - Math.min(...bottoms);
      },
      { message: 'the three card floors never settled into one band' },
    )
    .toBeLessThanOrEqual(14);
});

test('sats per dollar panel plots hourly closes or says so honestly', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator('#signal .live-panel--price');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Sats per dollar');
  await expect(panel.locator('.live-panel-note')).toContainText(/Coinbase/i);
  await expect(panel.locator('.live-mini-stat')).toHaveCount(4);

  const toggle = panel.locator('.live-quote-toggle');
  await expect(toggle).toHaveAttribute('aria-label', /Quote currency/);
  const usdBtn = toggle.getByRole('button', { name: 'USD' });
  const cadBtn = toggle.getByRole('button', { name: 'CAD' });
  await expect(usdBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(cadBtn).toHaveAttribute('aria-pressed', 'false');
  await expect(panel).toContainText('Sats per $1');

  await expect.poll(async () => (await panel.textContent())?.includes('Reading price candles')).toBe(false);

  if (await panel.locator('.price-chart').count()) {
    await expect(panel.locator('.price-chart')).toBeVisible();
    await expect(panel).toContainText(/hourly closes/);
    await expect(panel.locator('.live-mini-stat strong').first()).not.toHaveText('—');
  } else {
    await expect(panel.locator('.live-panel-empty')).toBeVisible();
  }

  // CAD flips the same reading set to Canadian dollars when the live rate is available.
  if (await cadBtn.isEnabled()) {
    await cadBtn.click();
    await expect(cadBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(usdBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(panel).toContainText('Sats per C$1');
    await expect(panel).toContainText('Live rate: 1 USD =');

    await usdBtn.click();
    await expect(usdBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(panel).toContainText('Sats per $1');
    await expect(panel).not.toContainText('Live rate: 1 USD =');
  } else {
    await expect(cadBtn).toBeDisabled();
  }

  await expect(page.locator('#signal .live-chart')).toHaveCount(1);
});

test('slash and command-K open the Command Deck from the keyboard', async ({ page }) => {
  test.slow();
  await page.goto('/');
  await expect(page.locator('.nav-keycap')).toHaveText('/');

  const deck = page.getByRole('dialog', { name: 'Sherpa Command Deck' });
  await page.keyboard.press('/');
  await expect(deck).toBeVisible();
  // The deck focuses its input in an effect that lands before its escape listener,
  // so waiting for focus keeps this deterministic instead of racing the keypress.
  await expect(page.getByRole('textbox', { name: 'Terminal command input' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(deck).toBeHidden();

  const search = page.getByPlaceholder('Find an agent by strength…');
  await search.click();
  await search.press('/');
  await expect(deck).toBeHidden();

  await page.keyboard.press('ControlOrMeta+k');
  await expect(deck).toBeVisible();
});

test('agent search filters the team', async ({ page }) => {
  await page.goto('/');
  const search = page.getByPlaceholder('Find an agent by strength…');
  await search.fill('research');
  await expect(page.locator('#agents')).toContainText('Rosa');
  await expect(page.locator('#agents')).not.toContainText('Mimi');
});

test('mobile viewport renders quick nav and hero video', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Quick section navigation' })).toBeVisible();
  await expect(page.getByLabel(/Play.*Intro/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  await expect(page.locator('.nav-mobile-agents')).toHaveAttribute('href', 'https://agents.giveabit.io');
});

test('mobile menu opens and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#mobile-nav-menu');
  await expect(menu).toHaveClass(/nav-mobile-menu--open/);

  await menu.getByRole('button', { name: 'Ventures' }).click();
  await expect(page.locator('#ventures')).toBeInViewport({ timeout: 20000 });
});

test('field guide and 2026 pages render', async ({ page }) => {
  await page.goto('/field-guide');
  await expect(page.getByRole('heading', { name: /Sherpa Field Guide/i })).toBeVisible();

  await page.goto('/2026');
  await expect(page.getByRole('heading', { name: /State of the Route/i })).toBeVisible();
});

test('venture route page renders', async ({ page }) => {
  await page.goto('/route/giveabit');
  await expect(page.getByRole('heading', { name: /GiveABit/i })).toBeVisible();
});

test('404 page renders', async ({ page }) => {
  await page.goto('/nonexistent-trail');
  await expect(page.getByRole('heading', { name: /Off the map/i })).toBeVisible();
});

test('venture filters remain readable and work', async ({ page }) => {
  await page.goto('/');
  const filter = page.getByRole('button', { name: 'Live', exact: true });
  await expect(filter).toHaveCSS('color', 'rgb(26, 23, 18)');
  await filter.click();
  await expect(filter).toHaveCSS('color', 'rgb(215, 255, 85)');
  await expect(page.locator('#ventures .venture-name', { hasText: 'Satohash' })).toBeVisible();
});

test('command deck opens and shows help', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Command Deck' }).click();
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeVisible();

  const input = page.getByRole('textbox', { name: 'Terminal command input' });
  await input.fill('/help');
  await input.press('Enter');
  await expect(page.getByText(/Available Commands/i)).toBeVisible();
});

test('proof dashboard exposes honest local state', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#proof')).toContainText(/family links reachable/);
  await expect(page.getByRole('button', { name: 'Refresh signal' })).toBeVisible();
  await expect(page.locator('.proof-note')).toContainText(/Last checked locally|simple signal/);
  await expect(page.locator('.proof-note')).toContainText(/simple signal/);
});

test('private preview disables contact delivery', async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.getByText(/message delivery is disabled/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await expect(page.locator('input[name="name"]')).toHaveAttribute('autocomplete', 'name');
  await expect(page.locator('input[name="email"]')).toHaveAttribute('autocomplete', 'email');
  // The delivery note has to name the inbox the form actually delivers to — the one
  // Kimi monitors — and not the address it used to promise. Reverting the copy fails
  // here, which is the whole point: the page had two different addresses on it and
  // neither was where the endpoint delivered.
  await expect(page.locator('.contact-delivery-note')).toContainText('hello@giveabit.io');
  await expect(page.locator('.contact-delivery-note')).not.toContainText('cam@camtaylor.ca');
  await expect(page.locator('#contact .mobile-email-cta')).toContainText('hello@giveabit.io');
  await expect(page.locator('#contact .mobile-email-cta')).not.toContainText('cam@camtaylor.ca');
});

test('command deck closes with escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Command Deck' }).click();
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeHidden();
});

test('expedition log is a dated timeline of real dispatches', async ({ page }) => {
  await page.goto('/');
  const log = page.locator('#expeditions');
  await expect(log.getByRole('heading', { name: /Expedition Log/i })).toBeVisible();

  const entries = log.locator('.log-entry');
  const count = await entries.count();
  expect(count).toBeGreaterThanOrEqual(4);

  await expect(entries.first().locator('.log-latest')).toHaveText('Latest');
  await expect(entries.first().locator('.log-title a')).toHaveAttribute('href', /\/dispatch\//);
  await expect(entries.first().locator('.log-meta time')).toBeVisible();
  await expect(entries.first().locator('.log-camp')).toContainText(/Camp|Summit|Traverse|Glacier|Headwall|Ridge|Log|Station/i);
  await expect(entries.first().locator('.log-summary')).not.toHaveText('');
  await expect(log.locator('.log-feed a')).toHaveAttribute('href', '/feed.xml');

  const terrainFilter = log.locator('.log-filter-btn', { hasText: 'Method' });
  await terrainFilter.click();
  await expect(terrainFilter).toHaveAttribute('aria-pressed', 'true');
  const shown = await log.locator('.log-entry .log-terrain').allTextContents();
  expect(shown.length).toBeGreaterThan(0);
  expect(shown.every((terrain) => terrain === 'Method')).toBe(true);
});

test('a dispatch reads end to end and links to its neighbours', async ({ page }) => {
  await page.goto('/');
  await page.locator('#expeditions .log-title a').first().click();
  await expect(page).toHaveURL(/\/dispatch\//);

  await expect(page.locator('.dispatch-title')).not.toHaveText('');
  await expect(page.locator('.dispatch-meta time')).toBeVisible();
  await expect(page.locator('.dispatch-summary')).not.toHaveText('');

  const body = page.locator('.dispatch-body');
  await expect(body.locator('p').first()).toBeVisible();
  await expect(body.locator('strong').first()).toBeVisible();

  // Lists and headings render too (this dispatch is written with a list).
  await page.goto('/dispatch/syndicate-that-survives-the-descent');
  await expect(page.locator('.dispatch-body li')).toHaveCount(4);
  await expect(page.locator('.dispatch-body strong').first()).toBeVisible();

  const next = page.locator('.dispatch-nav-link');
  await expect(next.first()).toBeVisible();
  await next.first().click();
  await expect(page.locator('.dispatch-title')).toBeVisible();
});

test('an unknown dispatch fails honestly', async ({ page }) => {
  await page.goto('/dispatch/not-a-real-dispatch');
  await expect(page.getByRole('heading', { name: /No such dispatch/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to the log/i })).toBeVisible();
});

test('the log ships an RSS feed with one item per dispatch', async ({ page, request }) => {
  await page.goto('/');
  const count = await page.locator('#expeditions .log-entry').count();

  const feed = await request.get('/feed.xml');
  expect(feed.ok()).toBe(true);
  const body = await feed.text();
  expect((body.match(/<item>/g) ?? []).length).toBe(count);
  expect(body).toContain('<link>https://camtaylor.ca/dispatch/');
  await expect(page.locator('link[rel="alternate"][href="/feed.xml"]')).toHaveCount(1);
});

test('the route sheet travels to any of the twelve camps', async ({ page }) => {
  await page.goto('/');

  const sheet = page.locator('.route-sheet');
  await expect(sheet).toBeVisible();

  const stops = sheet.locator('.route-sheet-stop');
  await expect(stops).toHaveCount(12);
  await expect(stops.first()).toContainText('Base Camp');
  await expect(stops.last()).toContainText('Summit');

  // The sheet is the point of the page: tenth waypoint in, without scrolling
  // through the nine before it.
  const target = await stops.nth(9).getAttribute('data-waypoint');
  await stops.nth(9).click();
  await expect(page.locator(`#${target}`)).toBeInViewport({ timeout: 20000 });

  // The stop you are standing on is marked as you read.
  await page.locator('#services').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(sheet.locator('.route-sheet-stop[aria-current="true"]')).toHaveAttribute(
    'data-waypoint',
    'services',
    { timeout: 20000 },
  );
});

test('every homepage section is a waypoint on one route', async ({ page }) => {
  await page.goto('/');

  const bands = page.locator('.waypoint-band');
  await expect(bands).toHaveCount(12);
  await expect(bands.first()).toContainText('Base Camp');
  await expect(bands.last()).toContainText('Summit');
  await expect(bands.first().locator('.waypoint-altitude')).toHaveText(/\d[\d,]* m/);
  await expect(bands.first().locator('.waypoint-condition')).not.toHaveText('');

  const targets = await bands.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-waypoint')),
  );
  for (const id of targets) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }

  const rail = page.locator('.route-rail');
  await expect(rail.locator('.route-rail-marker')).toHaveCount(12);
  await expect(rail.locator('.route-rail-marker').first()).toHaveAttribute('aria-label', /^Go to /);
  await expect(rail.locator('.route-rail-marker').first()).toHaveAttribute('title', /conditions/);

  // Climb: the standing waypoint follows you and the spine fills in.
  await page.locator('#services').evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(rail.locator('.route-rail-marker[aria-current="true"]')).toHaveAttribute(
    'data-section',
    'services',
    { timeout: 20000 },
  );
  await expect
    .poll(
      async () =>
        rail.locator('.route-rail-progress').evaluate((el) => Math.round(el.getBoundingClientRect().height)),
      { timeout: 20000 },
    )
    .toBeGreaterThan(0);
});

test('venture case files carry the capital shape as well as the outcome', async ({ page }) => {
  await page.goto('/route/openstrata');
  await expect(page.getByRole('heading', { name: /OpenStrata/i })).toBeVisible();
  await expect(page.locator('.venture-slide')).toHaveCount(4);
  await expect(page.locator('.venture-route-case')).toContainText('Capital');
  await expect(page.locator('.venture-route-note')).toContainText(/participants/i);
});

test('venture routes publish a Satohash provenance panel and stay usable offline', async ({
  page,
}) => {
  // Fail the health check so the offline branch is what renders.
  await page.route('**/api.satohash.io/**', (route) => route.abort());
  await page.goto('/route/satohash');

  const proof = page.locator('.satohash-proof');
  await expect(proof).toBeVisible();
  await expect(proof).toContainText('Satohash provenance');
  await expect(proof.locator('code')).not.toHaveText('hashing…');
  await expect(proof.locator('.satohash-proof-offline')).toBeVisible();

  const verify = proof.getByRole('link', { name: /Verify on Satohash/i });
  await expect(verify).toHaveAttribute('href', /satohash\.io\/verify\//);
});