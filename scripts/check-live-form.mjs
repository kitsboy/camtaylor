// Answers one question about the LIVE site, without any account: what does the published
// contact form actually post to, and is it switched on?
//
//   npm run check:live-form
//
// It launches Chromium against https://camtaylor.ca, reads the /assets/*.js responses, then
// reads the form's own rendered state. It sends nothing, submits nothing and touches no
// account — every request is a plain GET.
//
// Why the bundle, and not the config: `VITE_FORMSPREE_FORM_ID` and `VITE_PRIVATE_PREVIEW`
// are build-time variables, so the only trustworthy statement about production is the
// artifact production is serving. Vite folds the `xykqodnk` fallback into the bundle only
// when the first was undefined at build time, which is what makes the placeholder check
// conclusive.
//
// **How the endpoint is found, and the mistake this file used to make.** It searched the
// published JavaScript for a literal `formspree.io/f/<id>`. That string is never in the
// bundle: `@formspree/react` is handed the ID and builds the submission URL from it at
// runtime, so the literal endpoint appears nowhere and the *success* branch of this probe
// could never match anything. On the production build of 2026-09-25, with the live endpoint
// correctly inlined, it printed "no Formspree endpoint could be found at all" — which reads
// exactly like a form posting nowhere. A check that cannot report success is as useless as
// one that cannot report failure, and this one had been trusted since it was written.
//
// So it now takes the endpoint from where the build takes it — `wrangler.toml` `[vars]`, the
// in-repo declaration the Pages build reads — and makes two separate claims about the
// artifact: the published bundle carries *that* ID, and a Formspree client is bundled to post
// to it. The placeholder still fails, and a missing declaration is a failure too, because
// then there is nothing to verify against.
//
// Kimi found the same bug the same afternoon and fixed it by guessing the ID's *shape* in the
// minified bundle — a 7–8 character backtick-quoted string that is not a dictionary word,
// against a hand-written list of ~200 such words. That works on today's bundle and breaks the
// day a new one appears, which is why this version asks the repo instead: the two sides of
// the comparison are the declared value and the published artifact, and neither needs a word
// list. `79d71f1` (hers) and this commit are the same diagnosis.
//
// Run it after the production variables are set: it exits 1 while the form posts to the
// placeholder, posts to something other than what the repo declares, or has a disabled submit
// button, and 0 when a real endpoint is published and the form is live. Not part of CI — it
// needs the live site.
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const SITE = process.env.LIVE_SITE ?? 'https://camtaylor.ca/';
const PLACEHOLDER = 'xykqodnk';
const failures = [];

/** The endpoint production is declared to post to, and where that declaration lives. */
function declaredEndpoint() {
  const fromEnv = process.env.VITE_FORMSPREE_FORM_ID?.trim();
  if (fromEnv) return { id: fromEnv, source: 'the environment' };
  if (existsSync('wrangler.toml')) {
    const id = readFileSync('wrangler.toml', 'utf8')
      .match(/VITE_FORMSPREE_FORM_ID\s*=\s*"([^"]+)"/)?.[1]
      ?.trim();
    if (id) return { id, source: 'wrangler.toml [vars]' };
  }
  return null;
}

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

  const declared = declaredEndpoint();
  let placeholder = false;
  let declaredSeen = false;
  let formspreeClient = false;
  for (const url of scripts) {
    const body = await (await page.request.get(url)).text();
    if (body.includes(PLACEHOLDER)) placeholder = true;
    if (declared && body.includes(declared.id)) declaredSeen = true;
    // A Formspree client that is genuinely bundled names its own origin and builds the
    // submission path from the ID — so the host and `/f/` can live in different chunks.
    if (/formspree/i.test(body) && body.includes('/f/')) formspreeClient = true;
  }

  console.log(`${SITE} — ${scripts.size} scripts, ${(await page.title()).trim()}`);
  if (placeholder) {
    failures.push(
      `the published bundle contains the placeholder form ID "${PLACEHOLDER}" — Vite only folds that in when VITE_FORMSPREE_FORM_ID was unset at build time, so nothing submitted on the live site is delivered anywhere`,
    );
  } else if (!declared) {
    failures.push(
      'no live endpoint is declared to check against — put the real Formspree ID in wrangler.toml [vars] (or VITE_FORMSPREE_FORM_ID in the environment), or this probe cannot tell a correct build from a wrong one',
    );
  } else if (!declaredSeen) {
    failures.push(
      `the published bundle does not carry the endpoint ${declared.id} declared in ${declared.source} — production is not posting to the form the repo says it posts to`,
    );
  } else if (!formspreeClient) {
    failures.push(
      `the published bundle carries ${declared.id} but no Formspree client, so nothing can post to it`,
    );
  } else {
    console.log(`✓ the published bundle posts to Formspree endpoint ${declared.id} (declared in ${declared.source})`);
  }

  const noticeCount = await page.locator('.form-preview-notice').count();
  const disabled = await page.locator('.submit-btn').isDisabled().catch(() => null);
  const note = await page.locator('.contact-delivery-note').innerText().catch(() => null);
  console.log(`  submit button ${disabled ? 'DISABLED' : 'enabled'} · preview notice ${noticeCount > 0 ? 'shown' : 'absent'}`);
  if (note) console.log(`  delivery note: ${note.trim().replace(/\s+/g, ' ')}`);
  if (disabled !== false) {
    failures.push(
      'the live submit button is disabled — production is built with the private preview on, so set VITE_PRIVATE_PREVIEW=false for the production build (wrangler.toml [vars], or the Pages project environment)',
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
