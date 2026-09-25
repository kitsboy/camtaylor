# Latest update

**Session:** 2026-09-25 (M3 / Buffy) · **Branch:** `main` @ `c5cee6a` · **Deploy:** `npm run deploy:live` from `main`

Kimi owns the camtaylor deployment. This session was UI work only — no routing, no `_redirects`, no
feed or sitemap changes.

## What landed — four commits, all pushed

1. **`46591aa` — the phone's first screen.** `index.css`'s `.hero-video-wrap { order: -1 }` put a
   video poster above the name, so a phone opened on two chips, a status chip, a rotating route line
   and a poster. The name sat at 542px and the primary button at 866px — **22px below an 844px
   screen**. On phones `.hero-grid` is `display: contents` and the shell is one flex column, so the
   nine children are ordered explicitly. Name 542 → **207**, button 866 → **506**, inside a 375×667
   screen with 113px to spare. Guarded at 375/390/414, canaried.
2. **`f4371df` — signal and expertise.** The two sections the last pass did not reach, together
   3,990px. Signal 1,883 → **946** (the chain reading stays; Lightning and price wait behind
   *"2 more readings · tap to unfold"*), expertise 2,107 → **1,649** (all four cards stay; the chrome
   came down instead). Phone page 18,739 → **17,203**, or **22.2 → 20.4 screens**. Desktop 15,067,
   untouched.
3. **`290e4be` — the cascade.** `npm run cascade` now computes which declarations can never apply:
   at each width, for one selector and one longhand property, who wins and who is dead. It found
   **45 phone-block declarations that had never applied** — 42 deleted (every one verified a no-op by
   fingerprinting computed styles and heights at six widths), 3 kept because they are live above
   768px. The quality gate now fails the build on any at-rule declaration that is dead at every width
   where it applies.
4. **`c5cee6a` — the share card.** It was a 1200×630 white card, **98% blank**, with one small
   paragraph in a corner. `npm run og` now generates it from the site's own fonts and palette, with
   `Sherpa.` at 152px as the focal point and **twelve bars that are the twelve camps' altitudes read
   out of `waypoints.ts`**. The gate reads the PNG's IHDR and fails on any size but 1200×630, and
   fails if `index.html` stops declaring the card.

## One structural fix worth knowing about

`mobile.css` has carried `--section-pad-mobile: 48px` since the phone pass that introduced it, and
**no section has ever used it** — `upgrades.css` and `bold-modern.css` both set `--section-gap` after
it. The phone section padding is now one rule, in that token, at the end of the last stylesheet that
sets section padding.

## Two things that need a decision, not a fix

- **The signal fold hides two of three instruments on a phone.** Nothing is deleted, the label counts
  what is behind it, and `shown={1}` in `LiveSignal.tsx` is the whole change if you want all three.
- **The card filename is fixed, and platforms cache a card per URL for days.** Re-scrape once after
  this deploys (X Card Validator, LinkedIn Post Inspector) or the old white card keeps appearing.

## Verification

75/75 Playwright tests, `npm run quality` ✓ (now including the cascade and share-card gates), `tsc` ✓,
lint 0 errors. Every new guard was canaried against the bug it exists for.

Known flakes, neither from this work: `contrast.spec.ts`'s command-deck test fails about once in three
full-suite runs under load and passes standalone (fixed nothing, observed only); `smoke.spec.ts`'s
"charts share one frame" read geometry before its panels settled — that one **was fixed** this
session, and it still catches a genuine 40px misalignment.

## Still open

The keyboard and screen-reader pass on the live URL: the custom cursor, the hero canvas, the reveals,
the rotating route status (silent, and it changes every few seconds) and the carousel. It is the
largest untested surface left.
