# camtaylor — Last Updated 2026-09-25 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the Sherpa site.

**Latest (Buffy, type system):** The site had **49 distinct font sizes** and its most common
homepage text size was **8.8px**; body paragraphs were 11.52px and nav links dropped to 8.32px
on a laptop. All of it now comes from **one eight-step scale** in `src/index.css` with a
**12px floor** (11px only for uppercase tracked micro-labels). 244 declarations migrated across
five stylesheets; nothing under 11px renders anywhere; the nav holds 12px at every width and was
verified by measurement every 10px from 1440 → 769 with no overflow. A **type-scale guard** in
`scripts/quality-check.mjs` now fails the build on any sub-floor literal, and was proven
non-vacuous with a canary file. Also caught a genuine bug class: unstyled `<small>` silently
inheriting the browser's `0.833em` shrink (`.live-state small` was 9.17px). Full detail,
measurements and two findings for Kimi in `docs/KIMI-HANDOFF.md`.

**Two things flagged, not fixed:**
1. The contrast guard has a **blind spot** for tight-line-height labels — the probe samples the
   modal pixel inside the element's own box, so `font: 800 13px/1` read as ink-on-ink. Fixed in
   the CSS; the instrument still needs a deliberate hardening decision.
2. **Pre-existing** horizontal overflow on production: `scrollWidth` exceeds the viewport by
   74–164px at desktop widths, hidden by `body { overflow-x: hidden }`. Verified against the old
   CSS; the type change reduced it.

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair.
Buffy is a subordinate coding tool, NOT the boss.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Cloudflare Pages project
`camtaylor`.

**Next:** touch & motion pass (44px target floor, motion budget), then the homepage "wall" —
25 phone screens in one fixed order. Moving sections onto real routes needs Kimi, since it
touches published routing, `_redirects` and sitemap/feed generation.
