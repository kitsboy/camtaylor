# Latest update

**Session:** 2026-09-25 (M3 / Buffy) · **Branch:** `main` — push = deploy

Since `41b4bfa` **push = deploy** — Cloudflare Pages builds `main` from Git, so everything committed
here is already published. This session touched no routing, no `_redirects`, no endpoint and no
mailbox: it is the contact form's own address, plus ten numbered questions for Kimi in
`docs/KIMI-HANDOFF.md`.

## The ask: make the contact form's email work, to `hello@giveabit.io`, with no spam

Kimi monitors `hello@giveabit.io`, drops the spam and forwards the genuine inquiries on to Cam. That
is the address the form has to deliver to, and **the one thing I cannot supply is the Formspree
endpoint ID** — so it is written up as a numbered question in the handoff (questions 1–10), and
everything that does not depend on her answer is already committed.

The bug, stated exactly — the page said one thing in three places and offered a different address in
a fourth:

| on the page | it said | where that goes |
|---|---|---|
| success panel, delivery note, privacy policy | "sent to / delivered to `cam@camtaylor.ca`" | nowhere I can verify |
| the contact section's own front door | `hello@giveabit.io` | the inbox Kimi monitors |
| the endpoint | `VITE_FORMSPREE_FORM_ID` → **`xykqodnk`** | unknown |

**`xykqodnk` is the value in `.env.example`, `README.md`, `docs/DEPLOYMENT.md` and both CI jobs, and
it is the fallback compiled into `src/data/site.ts` — and the published production bundle, which is
how I checked it (see below).** The form is not merely pointing at a placeholder: in the live build
its submit button is disabled, because production has been built as a private preview the whole
time.

## What landed: `73d0b5c`

- **One address for the form's destination.** `src/data/site.ts` exports
  `INQUIRY_EMAIL = 'hello@giveabit.io'`; the success panel, the "Reply to:" row, the delivery note
  (both branches), the copy-email button, the phone mailto CTA, the sidebar's "Prefer email?" link
  and the privacy policy's *"delivered to"* line all read it. `SITE.familyEmail` is *that value*
  rather than a second copy of the string.
- **The deployer is told the truth.** `.env.example` and the README say the form must be delivered to
  `hello@giveabit.io` and that `xykqodnk` is a placeholder, not a live form.
- **A gate keeps it honest.** `npm run quality` fails if `INQUIRY_EMAIL` disappears, if
  `familyEmail` stops being it, or if `.env.example` stops naming the address the form must reach.
  Canaried: breaking both printed both failures, one per line.
- **A test on the rendered page.** `tests/smoke.spec.ts` asserts the delivery note names
  `hello@giveabit.io` and **not** `cam@camtaylor.ca`. Canaried: restoring the old copy fails at
  line 436.

## The live bundle says the form has never worked

Probed read-only — Chromium on `https://camtaylor.ca`, collect the `/assets/*.js` responses, search
them. Both answers are in the published build, and neither is a guess:

1. **The published `index-*.js` contains `xykqodnk` and no other Formspree endpoint.** Vite only
   folds that fallback into the bundle when `VITE_FORMSPREE_FORM_ID` was undefined at build time, so
   the live form is posting to the placeholder. **Nothing sent from camtaylor.ca has been delivered
   anywhere.**
2. **Production is built as a private preview.** The live page shows *"Private preview: message
   delivery is disabled until launch approval"*, the submit button is **disabled**, and the delivery
   note still says *"…once camtaylor.ca goes public"* — on a domain that is already public.

So the fix is **two Cloudflare Pages production variables, not one**: a live
`VITE_FORMSPREE_FORM_ID`, and `VITE_PRIVATE_PREVIEW=false`. Even with a working endpoint, the form
stays disabled until the second one is set. Both are asked for in the handoff, together with the ID.

It is repeatable: **`npm run check:live-form`** reads the live bundle and the form's rendered state,
sends nothing, exits 1 while the form is broken and 0 when it is fixed. It is the verification step
after the two variables are set (and it is not in CI, because it needs the live site).

## What is still blocked on Kimi

Three questions decide the rest: **(1)** whether `xykqodnk` is live or a placeholder — and the real
ID if it is not; **(3)** confirmation that `hello@giveabit.io` is the recipient; **(4)** which spam
controls the form should carry, because invisible reCAPTCHA can show a challenge and the button's
copy has to match. Also open: SPF/DKIM/DMARC on `giveabit.io`, the forward target (`cam@givebait.io`
in Cam's note is almost certainly the published `cam@giveabit.io`), whether the dead-looking
`cam@camtaylor.ca` should be repointed site-wide, and whether a live end-to-end submission test
should be written once the ID exists.

I cannot verify delivery from here — no Formspree account, no DNS zone, no mailbox. The client half
is done; the endpoint is the missing half.

## Ten things still missing

Each one is something measured on this build, not a guess.

1. **The desktop page is 15,067px — about 17 laptop screens — and no pass has ever measured its
   length.** Every fold, every budget and every measurement so far is phone-only. Two routes:
   desktop folds (the odd-number split is real, desktop grids are two columns), or splitting
   sections onto their own routes — which is routing, and Kimi's call, not a CSS edit.
2. **Night mode flashes the warm theme on every page load, and the theme never consults the OS.**
   `useTheme` writes `document.documentElement.dataset.theme` in a React effect, so a returning night
   reader gets a warm first paint; and the default is hard-coded `'warm'`, so a dark-OS visitor is
   never given the dark ground at all. An inline pre-paint script plus a `prefers-color-scheme`
   default fixes both.
3. **The form has no failure path and no retry.** When Formspree is down or rate-limits (it does, per
   IP), `ValidationError` prints a line and a reader who has just written a brief has a filled-in form
   and nowhere to send it. It needs an error state that offers the address directly, with the message
   still in hand.
4. **Conversion is unmeasured: `trackEvent` is a no-op.** `form_start`, `form_submit`, `form_success`
   and the CTA events all exit early because nothing ever loads Plausible — so nobody would have
   noticed this form being broken, and nobody will know when it starts working.
5. **One share card serves every page.** Every dispatch, venture route, field guide and `/2026` share
   the same 1200×630 card. The generator already reads the site's own data — per-page cards (dispatch
   title and camp, venture name) are the next step, plus a per-path `og:image` in `usePageMeta`.
6. **Structured data is one JSON-LD `Person`.** No `Article`/`BlogPosting` per dispatch, no
   `BreadcrumbList`, no `Organization` + `sameAs`, no `WebSite`; and no `llms.txt`. On a site whose
   entire pitch is *proof before promise*, the machine-readable proof is the thinnest layer.
7. **The sitemap and the feed date themselves by build time, not by content.** `prebuild` rewrites
   `lastmod` and `pubDate` on every build, so every deploy claims all twelve pages changed today —
   the fastest way to teach a crawler to ignore the field. The dates should come from the dispatch
   front-matter.
8. **There is no performance budget, no bundle gate, and no link check in CI.** Nothing fails on a
   regression in JS weight, the 485 kB card, or LCP; and the outbound URLs (`agents.giveabit.io`,
   `iris.to`, `coracle.social`, three data APIs) and the `_redirects` map are hand-typed strings that
   nothing verifies. A size limit in `quality` and a link/router sweep are both cheap.
9. **The live signal has no stale state.** Three keyless public APIs, no cache of last-known-good
   readings, no `aria-busy`, no "this reading is stale" note — a failed fetch silently drops a panel,
   and the suite's own load-dependent contrast flake shows how timing-sensitive that section is.
10. **The keyboard and screen-reader pass has still never been run on the live build.** The custom
    cursor, the hero canvas, the reveals, the rotating route status (silent, and it changes every few
    seconds), the route sheet, five folds and the carousel. It is the largest untested surface on the
    site and it is a browser task.

## Verification

`npm run quality` ✓ (4 assets, 1200×630 share card, metadata, privacy gate, type-scale floor,
cascade, form inbox) · `npx tsc -b` ✓ · `npx oxlint` 0 errors / 1 pre-existing `ThemeContext`
warning · **`npm test` 75/75** ✓. Both new guards were canaried against the bug they exist for.

**Live:** push = deploy, and the push was verified — the published bundle changed
(`index-LgbnQoN7.js` → `index-BzAOAjTz.js`) and the live delivery note now names
`hello@giveabit.io`. `npm run check:live-form` still fails, correctly, on the endpoint and the
disabled button.
