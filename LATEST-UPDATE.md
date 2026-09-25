# Latest update

**Session:** 2026-09-25 (M3 / Buffy) · **Branch:** `main` — push = deploy · **100/100 tests**

Ten items, twelve commits, each pushed on its own. The four "suggested follow-ups" were four of the
ten (the form's failure path, the night theme, desktop length, the keyboard pass), so this is the whole
list — and one of them turned out to be a dead end, which is recorded with its numbers rather than
quietly dropped.

## What landed

1. **Night mode no longer flashes, and follows the OS.** `useTheme` set `data-theme` in a React effect,
   so a night reader got the warm ground painted first; the default was hard-coded `warm`, so a dark-OS
   visitor was never offered the dark ground at all. `index.html` resolves it inline ahead of the
   bundle now, and only a toggle is remembered. Guarded by aborting the bundle and asserting the
   attribute is *still* right.
2. **A refused submission has somewhere to go.** The endpoint refusing used to leave a written brief
   stranded behind a one-line error. The failure state now carries the whole thing — subject, name,
   address, tier, message — as a mailto link to the monitored inbox, still retryable.
   **This also added the project that tests the published build**, which nothing did before: every test
   in this repo ran with the private preview on, i.e. the form disabled.
3. **`trackEvent` actually loads something.** Every event the site fired was a no-op, because no
   analytics script was ever loaded — which is why nobody noticed the form being broken. Plausible now
   loads when `VITE_PLAUSIBLE_DOMAIN` is set (still empty, nothing ships), and `npm run quality` fails
   if the loader's host and the CSP disagree.
4. **The keyboard and screen-reader pass.** The closed mobile sheet was `aria-hidden` and still
   tabbable — fourteen controls with every label hidden from a screen reader. `inert` fixes it. The
   heading outline jumped h2 → h4 in the contact sidebar; it is h3 now. Six guards, canaried.
5. **The live signal keeps its last good reading.** A dropped read blanked the panel and blamed the
   reader's connection; it now shows the last reading received, labelled LAST GOOD with that reading's
   own timestamp, expiring. A cold failure still says OFFLINE with no invented number.
6. **Sitemap and feed dates come from the dispatches**, not the clock. Every deploy used to claim all
   twelve pages had changed that day, and the two files were rewritten on every build. They are
   byte-identical across builds now, and guarded.
7. **Every page below the homepage describes itself.** Dispatches declare a `BlogPosting` and a
   breadcrumb, case files an `Article`; `usePageMeta` keeps exactly one schema per page so navigation
   cannot leave the previous page's behind. The `Person` email and `llms.txt` now name the monitored
   inbox rather than `cam@camtaylor.ca`.
8. **A share card per dispatch and per venture** — thirteen, generated from each page's own words.
   JPEG, 60–75kB each. The generator found a real fault on its first run: two cards had the domain
   pushed off the frame by a long summary.
9. **A weight budget and a link check.** 166kB of JavaScript, one 69kB chunk, 668kB of imagery, 98kB of
   webfonts — measured over the wire, ceilings a third above. The measurement itself was the useful
   part: filtering by `initiatorType` saw one file out of five and would have read as a pass. Links are
   followed and must render a real page, because a single-page app answers 200 for paths that do not
   exist.
10. **Desktop measured, and the dead end recorded.** 15,087px = 16.8 laptop screens, spread across every
    section. Folding its four long lists made it **297px longer** — their grids are already
    multi-column. The repeated 72px section padding did pay: **15,087 → 14,817px**, guarded by a loose
    15,200px budget.

## Still the open item: the contact form's email

Both halves are Kimi's, as Cloudflare Pages production variables: a live `VITE_FORMSPREE_FORM_ID` and
`VITE_PRIVATE_PREVIEW=false`. The published bundle contains the placeholder and the submit button is
disabled, so **nothing sent from camtaylor.ca has ever been delivered anywhere** — `npm run
check:live-form` reports exactly that, sends nothing, and exits 0 once it is fixed. The client half is
done: one recipient address in one place, a failure path that hands it over with the brief intact, and
mirror copies to Kimi and Cam in the handoff.

## Verification

**100/100 Playwright tests** (98 preview, 2 public project excluded/included as listed), `npm run
quality` ✓ (5 assets, share card, metadata, privacy gate, type-scale floor, cascade, form inbox,
analytics CSP, per-page cards), `npx tsc -b` ✓, `npx oxlint` 0 errors / 1 pre-existing `ThemeContext`
warning. Every new guard was canaried against the bug it exists for, and two were fixed *before* they
were trusted because they could not tell correct from broken.

## Next, if Cam wants more

The three worth doing are: **the desktop section pass with Cam's eye** (the remaining 14,817px is
chrome spread across twelve sections, and the last attempt at cutting it needed a decision, not a
measurement), **wiring the analytics domain** so conversion is actually counted, and **the Formspree
endpoint** the moment Kimi supplies it.
