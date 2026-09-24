# Launch Gate — camtaylor.ca

**Status: PUBLISHING.** Cam approved a public launch on 2026-09-24: private preview off,
contact form live, no analytics. The site is deployed to the Cloudflare Pages project
`camtaylor`; the domain switch (`camtaylor.ca` + `www`) is done in the Cloudflare
dashboard because DNS edit is not delegated to the build machine.

## Launch decisions (2026-09-24)

- `VITE_PRIVATE_PREVIEW=false` for production builds → preview banner off, contact delivery on.
- Contact form: Formspree `xykqodnk`, live. **Verify the recipient inbox before sharing the link widely.**
- Analytics: none shipped. `public/_headers` no longer allows plausible.io or analytics.giveabit.io.
- Hosting: Cloudflare Pages only. `vercel.json` and `netlify.toml` were deleted.
- Service worker: network-first for navigations so a deploy is never masked by a stale cache.

## Before the DNS switch

- [x] `npm run quality` passes
- [x] `npx tsc -b` clean
- [x] `npm run lint` — 0 errors (1 pre-existing fast-refresh warning in `ThemeContext.tsx`)
- [x] Deployed to Pages project `camtaylor` with `VITE_PRIVATE_PREVIEW=false` → https://camtaylor.pages.dev
- [x] Satohash provenance ported onto `/route/*` (health check + route hash + verify/stamp links)
- [x] Public build no longer advertises a preview: navbar, footer and contact note all gated on `IS_PRIVATE_PREVIEW`, with a `quality-check.mjs` guard against regressions
- [x] Production build clean; Playwright suite green
- [x] Dispatches moved from stub XML to generated `feed.xml`; old `expedition-log.xml` removed
- [x] Repository tidy: Vercel/Netlify configs, stale session summaries, `.DS_Store`, unused `og-image.svg` removed
- [ ] **Seed dispatches reviewed by Cam** — the six entries in `src/content/dispatches` are drafts written in his voice
- [ ] Contact form test submission received at the real inbox
- [ ] Keyboard + screen-reader pass on the live URL
- [ ] Contrast and reduced-motion pass on the live URL
- [ ] Mobile QA at 320 / 375 / 390 / 414 px, and tablet — **320 and 390 px are now automated** in `tests/device-qa.spec.ts` (overflow + 44px touch targets); 375 / 414 px and real hardware still need eyes
- [ ] Desktop QA at laptop and ultra-wide widths
- [ ] Internal + external links checked (family cards, ventures, agents)
- [ ] Metadata, canonical, JSON-LD, sitemap, robots, OG image checked against the live URL

## After the switch

- [ ] `camtaylor.ca` + `www` resolve to the Pages project; old WordPress origin records removed
- [ ] WordPress hosting cancelled or archived; leftover staging subdomains removed
- [ ] Cloudflare Email Routing for `cam@camtaylor.ca` confirmed untouched
- [ ] `https://camtaylor.ca/sitemap.xml` re-submitted; old WordPress URLs allowed to 404
- [ ] Redirect sanity: `/expedition-log.xml` → `/feed.xml`, SPA fallback for `/dispatch/*` and `/route/*`
- [ ] Formspree recipient verified one more time
- [ ] Analytics decision revisited (Plausible or Umami) once traffic justifies it

## Release procedure

1. `npm run test && npm run quality`
2. `npm run deploy:live`
3. Confirm https://camtaylor.pages.dev behaves (banner gone, form live, feed present)
4. Attach the custom domain in the dashboard and accept the DNS records Cloudflare proposes
5. Roll back by redeploying an earlier Pages deployment — DNS is untouched

## What this site is allowed to claim

- Every number on the page is either read live from a public source or explicitly framed as
  a design waypoint (`src/data/waypoints.ts` altitudes).
- The proof dashboard reports reachability, not scores.
- Venture case files describe the shape of a deal and never publish participant amounts.

*Safe Harbour · Part of the Give A Bit family.*
