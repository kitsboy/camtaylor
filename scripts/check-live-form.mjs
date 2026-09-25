// Answers one question about the LIVE site, without any account: what does the published
// contact form actually post to, and is it switched on?
//
//   npm run check:live-form
//
// It launches Chromium against https://camtaylor.ca, reads the /assets/*.js responses and
// searches them for a Formspree endpoint, then reads the form's own rendered state. It
// sends nothing, submits nothing and touches no account — every request is a plain GET.
//
// Why the bundle, and not the config: `VITE_FORMSPREE_FORM_ID` and `VITE_PRIVATE_PREVIEW`
// are build-time variables, so the only trustworthy statement about production is the
// artifact production is serving. Vite folds the `xykqodnk` fallback into the bundle only
// when the first was undefined at build time, which is what makes this check conclusive.
//
// Run it after the two Cloudflare Pages production variables are set: it exits 1 while the
// form posts to the placeholder or its submit button is disabled, and 0 when a real
// endpoint is published and the form is live. Not part of CI — it needs the live site.
import { chromium } from 'playwright';

const SITE = process.env.LIVE_SITE ?? 'https://camtaylor.ca/';
const PLACEHOLDER = 'xykqodnk';
const failures = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const scripts = new Set();
page.on('response', (response) => {
  const url = response.url();
  if (url.includes('/assets/') && url.endsWith('.js')) scripts.add(url);
});

try {
  await page.goto(SITE, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(4000);

  let endpoint = null;
  let placeholder = false;
  for (const url of scripts) {
    const body = await (await page.request.get(url)).text();
    if (body.includes(PLACEHOLDER)) placeholder = true;
    for (const match of body.matchAll(/formspree\.io\/f\/([a-z0-9]+)/gi)) endpoint = match[1];
  }

  console.log(`${SITE} — ${scripts.size} scripts, ${(await page.title()).trim()}`);
  if (placeholder) {
    failures.push(
      `the published bundle contains the placeholder form ID "${PLACEHOLDER}" — Vite only folds that in when VITE_FORMSPREE_FORM_ID was unset at build time, so nothing submitted on the live site is delivered anywhere`,
    );
  } else if (endpoint) {
    console.log(`✓ the published bundle posts to Formspree endpoint ${endpoint}`);
  } else {
    failures.push('no Formspree endpoint could be found in the published bundle at all');
  }

  const noticeCount = await page.locator('.form-preview-notice').count();
  const disabled = await page.locator('.submit-btn').isDisabled().catch(() => null);
  const note = await page.locator('.contact-delivery-note').innerText().catch(() => null);
  console.log(`  submit button ${disabled ? 'DISABLED' : 'enabled'} · preview notice ${noticeCount > 0 ? 'shown' : 'absent'}`);
  if (note) console.log(`  delivery note: ${note.trim().replace(/\s+/g, ' ')}`);
  if (disabled !== false) {
    failures.push(
      'the live submit button is disabled — production is built with the private preview on, so set VITE_PRIVATE_PREVIEW=false in the Cloudflare Pages production environment',
    );
  }
  if (note && !/hello@giveabit\.io/.test(note)) {
    failures.push(`the live delivery note does not name hello@giveabit.io: ${note.trim()}`);
  }
} catch (error) {
  failures.push(`could not read the live site: ${error.message.split('\n')[0]}`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log('✓ the live contact form posts to a real endpoint and is switched on');
