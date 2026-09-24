## Handoff — 2026-09-24 (OWNERSHIP SETTLED + LIVE)

**Machine:** THOR (Kimi) · **Project:** camtaylor

### Ownership — settled, no ambiguity
- **Kimi owns the camtaylor deployment.** Cam + Kimi are the decision pair.
- **Buffy (Freebuff desktop agent) is a subordinate tool, NOT the boss.** Any prior note
  claiming "Buffy owns the camtaylor deployment" was Buffy's own self-framing and is
  **superseded**. Buffy may be used as a coding tool, but she does not own or decide
  deployment.

### Live state — verified 2026-09-24
- **Production:** https://camtaylor.ca and https://www.camtaylor.ca — both serve the new
  Sherpa site ("Cam Taylor | Sherpa — Deal Architecture & Venture Operations"), HTTP 200.
- **Host:** Cloudflare Pages, project `camtaylor` (account Kitsboy@gmail.com's Account).
- **Preview:** https://camtaylor.pages.dev
- **Git:** `origin/main` = `d5f3533` (the published line). Old line preserved on
  `origin/talent` and `m3/2026-09-24-publish`.
- **Deploy command (the ONLY one):** `npm run deploy:live` from `main`.

### Old site — dropped, Cam handles it
- The old WordPress lived on **EZP.net** (Vancouver cPanel/LiteSpeed hosting, my.ezp.net).
- **Cam will delete the old WordPress system himself, later, no rush.** Do NOT chase the
  EZP teardown. camtaylor is now a fresh placeholder we keep building on.

### Open items (next week, no rush)
- Cam has another site to move over — will do with Kimi's help next week.
- Set GitHub default branch to `main` (`origin/HEAD` still points at `talent`).

---

## Handoff to Kimi — 2026-07-05

**Machine:** M3 (Antigravity / Claude)
**Project:** camtaylor

### Done
- [x] Initialized Vite React-TypeScript project at `/Users/cam/projects/camtaylor`
- [x] Installed framer-motion, lucide-react dependencies
- [x] Implemented full design system in `src/index.css` — Outfit + Plus Jakarta Sans fonts, gold/obsidian palette (`hsl(40,48%,56%)`), glassmorphism utility classes, scroll-driven animations
- [x] BackgroundCanvas.tsx — interactive canvas with floating coordinate grid and gravitational particle nodes that react to mouse hover
- [x] Navbar.tsx — fixed frosted-glass nav with section scroll links + Command Deck toggle button
- [x] Hero.tsx — animated typographic hero: "CAMERON TAYLOR / VALUE AGENT", gradient headline, dual CTA buttons, metrics strip
- [x] Manifesto.tsx — Value Axioms grid (3-col glassmorphic cards) + closing quote
- [x] Services.tsx — 2-column service cards: Capital Allocation, Deal Architecture, Venture Operations, Special Situations
- [x] Ventures.tsx — 7-card portfolio grid: Satohash, Katoa, GiveABit, OpenStrata, Motopass, Sherpacarta, Tadbuy
- [x] CommandDeck.tsx — interactive terminal overlay with /help, /about, /ventures, /manifesto, /contact, /clear, /exit commands + quick-pill buttons
- [x] Contact.tsx — deal intake form with name/org/email/deal-size selector/details + encrypted success state
- [x] Footer.tsx — minimal footer with live status dot and terminal link
- [x] App.tsx — all components wired with terminal open/close state management
- [x] Build verified: `npm run build` passes clean (345KB JS, 16.88KB CSS)
- [x] Initial git commit: `5415c96` on branch `main`

### Decisions
- Used vanilla CSS (no Tailwind) per project rules — maximum flexibility for the premium dark aesthetic
- Gold palette uses HSL-tailored values (`hsl(40, 48%, 56%)`) rather than raw hex — easier to adjust saturation/lightness per Cam's brand
- BackgroundCanvas uses requestAnimationFrame + canvas API for hardware-accelerated gravity simulation (no Three.js dep)
- CommandDeck is a standalone overlay (z-index 200) not inline, so it doesn't break layout scrolling
- Contact form submission is currently simulated (1.5s delay → success state). Needs real form backend (Formspree, Resend, etc.)

### What's Next
- **Form Backend**: Wire up `cam@camtaylor.ca` email via Formspree or Resend API — form currently simulates submission
- **Domain**: Deploy to `camtaylor.ca` — Firebase Hosting or Vercel recommended
- **SEO**: Add `og:image`, Twitter card meta tags to `index.html`
- **Favicon**: Replace default Vite favicon with CT monogram
- **Analytics**: Add Plausible or Google Analytics 4
- **Mobile Nav**: Currently hides nav links on mobile — consider adding a hamburger menu
- NOTE from GROK-SESSION-PROTOCOL: camtaylor is tagged **Red + PRODUCTION** (queued next month). Cam explicitly asked to build it early.

### Git State
- Last commit SHA: 5415c96
- Branch: main
- Unpushed: Not pushed to remote — no remote configured yet

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Handoff to Kimi — 2026-07-05 (Grok polish pass)

**Machine:** M3 (Grok)
**Project:** camtaylor

### Done
- [x] Sherpa rebrand completed — Command Deck, Hero, all copy aligned
- [x] Shared data layer: `src/data/{site,ventures,services,axioms,commandDeck}.ts`
- [x] Formspree contact form with validation, honeypot, real reference IDs (needs `VITE_FORMSPREE_FORM_ID` in `.env`)
- [x] About section with bio, location (BC), timezone (PT)
- [x] All 7 ventures now have live URLs
- [x] Mobile hamburger nav, sticky CTA, scroll-spy `aria-current`, navbar scroll shadow
- [x] Command Deck: `/services`, tab-complete, ↑↓ history, focus trap, swipe-to-close, `aria-live`
- [x] Privacy + Terms pages at `/privacy` and `/terms`
- [x] SEO: og:image, Twitter card, JSON-LD, canonical, robots.txt, sitemap.xml, favicon.svg
- [x] Self-hosted fonts via @fontsource (no Google CDN)
- [x] Lazy-loaded CommandDeck chunk, Plausible analytics hook (optional env)
- [x] Deploy configs: vercel.json, netlify.toml, public/_headers (CSP)
- [x] CI: `.github/workflows/ci.yml` + Playwright smoke tests (3 passing)
- [x] Footer social links: GitHub, LinkedIn, X

### Decisions
- Formspree over Resend — simpler static-site integration; form ID via env var
- react-router-dom for legal pages (SPA rewrites required on deploy)
- LinkedIn URL set to `linkedin.com/in/camtaylor` — verify with Cam

### What's Next
- Cam creates Formspree form → add `VITE_FORMSPREE_FORM_ID` to `.env` and deploy env
- Deploy to camtaylor.ca (Vercel or Netlify — configs ready)
- Verify LinkedIn URL is correct
- Optional: convert og-image.svg to PNG for broader social crawler support

### Git State
- Last commit SHA: d10702b
- Branch: main
- Unpushed: uncommitted local changes

---

## Handoff to Kimi — 2026-07-07

**Machine:** M3 (Grok)
**Project:** camtaylor

### Done
- [x] 50-feature polish batch: expedition log, testimonials, anti-services, venture case studies, Command Deck v2 (`/status`, `/route`, `/nostr`, `/summit`, Konami code)
- [x] Hero YouTube in-frame player — video ID `nJeddv1QbeQ` (configurable in `src/data/site.ts`)
- [x] 100 mobile improvements: `src/styles/mobile.css`, bottom quick-nav, snap-scroll ventures/testimonials, safe-area insets, bottom-sheet modals
- [x] Mobile drawer menu with backdrop, trust badges, mailto/copy-email CTAs, sticky CTA auto-hide
- [x] Night camp theme toggle, scroll progress rope, loading screen, custom cursor (desktop)
- [x] Pages: `/field-guide`, `/2026`; static `public/llms.txt`, `public/manifest.json`
- [x] PWA meta tags, YouTube preconnect, dynamic theme-color
- [x] 6 Playwright tests passing (2 mobile-specific)
- [x] README.md rewritten; docs updated

### Decisions
- **Local-first** — Cam deferred GitHub + Cloudflare for a few more weeks of local work
- Mobile scroll lock uses `overflow:hidden` only (avoids iOS position:fixed jank)
- YouTube via `youtube-nocookie.com` with click-to-play poster pattern
- Separate `mobile.css` for maintainability

### What's Next
- Git commit + push when Cam is ready (51 uncommitted files, no remote)
- Deploy camtaylor.ca when GitHub/Cloudflare set up
- Real device QA (iOS Safari, Android Chrome)
- giveabit.io avatar in namespaceRegistry.js (deferred)

### Git State
- Last commit SHA: d10702b359fd980db6360a3fe86b649ef6db6997
- Branch: main
- Unpushed: no remote configured; ~51 files uncommitted

---

## Latest Session Summary (from 2026-07-07 goodbye)

**Chat topic:** Continued camtaylor.ca locally — 50 ideas implemented, hero YouTube, 100 mobile improvements.

**Finished in this session:**
- Full feature batch + mobile-first pass
- Hero YouTube `nJeddv1QbeQ` in gold frame
- Bottom quick-nav, snap carousels, bottom sheets, night mode
- Build clean, 6 tests passing
- All docs updated

**Still to do:**
- Commit + push (no remote yet)
- Deploy when Cam ready (GitHub/Cloudflare deferred)
- giveabit.io avatar, LinkedIn verify, optional og PNG

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-07.md`. Integrate into vault when synced. Do not overwhelm with raw logs.

---

## Session — 2026-07-09

**Machine:** M3 (Grok)  
**Project:** camtaylor

### Done
- [x] `/whatsup` recovery from Jul 7 summary
- [x] Removed LinkedIn entirely (site data, footer, JSON-LD) — Cam preference
- [x] Footer social: GitHub · X · Nostr
- [x] OG image PNG `public/og-image.png` (1200×630); meta tags + alt updated
- [x] Removed About voice-intro stub and Nostr/Command Deck zap “coming soon” stubs
- [x] a11y polish (footer nav, form autocomplete, copy-email live region, focus rings, `sr-only`)
- [x] Build clean; 6 Playwright tests passing

### Decisions
- **No LinkedIn** — permanent preference for this site
- **Local-first** — still no deploy; polish only
- Calendly / PGP remain null until Cam supplies values

### What's Next
- Commit polish when Cam ready (currently uncommitted)
- Deploy camtaylor.ca later (Formspree env `xykqodnk`)
- Real device QA; giveabit.io avatar deferred
- Optional Calendly / PGP

### Git State
- Last commit SHA: `a212d184e00dfacb1c1ff57ba7e7674616f89e2b`
- Branch: main (up to date with `origin/main`)
- Remote: `github.com:kitsboy/camtaylor.git`
- Uncommitted: polish batch (8 modified files + `public/og-image.png`)
- Unpushed commits: none

---

## Latest Session Summary (from 2026-07-09 goodbye)

**Chat topic:** Local polish after whatsup recovery — kill LinkedIn, ship OG PNG, clean stubs, a11y.

**Finished in this session:**
- LinkedIn removed site-wide
- `og-image.png` + social meta
- Voice/zap stubs removed
- a11y/copy pass
- Build + 6 tests green

**Still to do:**
- Commit uncommitted polish (local-first)
- Deploy when Cam ready
- Device QA; giveabit avatar; optional Calendly/PGP

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-09.md`. Note: no LinkedIn on camtaylor; origin remote exists. Integrate when synced. No raw chat logs.

---

## Session — 2026-07-15

**Machine:** M3 (Grok)  
**Project:** camtaylor

### Done
- [x] 100 elite upgrades — perf, routes, a11y, features (see SESSION-SUMMARY-2026-07-15.md)
- [x] Code-split vendor chunks; lazy routes; ThemeProvider; 12 Playwright tests
- [x] `/route/:ventureId`, 404, hash scroll, Command Deck navigation
- [x] Cloudflare `_redirects` + CSP fixes; DEPLOYMENT.md rewritten
- [x] Pushed to origin — no deploy

### Decisions
- No deploy; Cloudflare Pages documented as planned host
- Calendly/PGP null; giveabit avatar deferred

### Git State
- SHA: `cfa5adcec8531441a2e6c255e763914b6b4a11fa`
- Branch: main (pushed, clean working tree)
- Unpushed: none

---

## Latest Session Summary (from 2026-07-15 goodbye)

**Chat topic:** `/whatsup` recovery → 100 elite upgrades, all pending work except deploy, push to GitHub. Cloudflare (not Vercel/Netlify) noted as planned host.

**Finished in this session:**
- 100-upgrade batch: perf, routes, a11y, UX, Command Deck workflow
- `/route/:ventureId`, 404, hash scroll, lazy routes, code splitting (~77KB main)
- Cloudflare-ready: `_redirects`, CSP fixes, DEPLOYMENT.md rewritten
- 12 Playwright tests passing
- Pushed to `origin/main` — no deploy

**Still to do:**
- Deploy camtaylor.ca via Cloudflare when Cam approves
- Real device QA (iOS Safari, Android Chrome)
- Optional Calendly/PGP; giveabit.io avatar (deferred)

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-15.md`. Integrate into vault when synced. Do not overwhelm with raw chat logs. Planned host: Cloudflare Pages.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Session — 2026-08-25 (contact + polish continuation)

**Done:**
- [x] Centralized `SITE.familyEmail` (`hello@giveabit.io`) and `SITE.agentsUrl` (`https://agents.giveabit.io`).
- [x] Added explicit contact delivery note: live `camtaylor.ca` submissions route through Formspree to `cam@camtaylor.ca`; private preview never sends.
- [x] Added visible family-card tooltips and agent profile hints.
- [x] Added proof refresh busy state and local verification timestamp.
- [x] Added contact section labeling and delivery destination copy.
- [x] Expanded browser coverage; quality, build, lint, and 17 Playwright tests pass.

**Decisions:**
- Formspree remains the static-site delivery mechanism; recipient configuration belongs in Formspree, not frontend secrets.
- No live email was sent and no production configuration was changed.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (polish continuation)

**Done:**
- [x] Improved family discovery with category filters and live route count.
- [x] Added agent search empty state and live result count.
- [x] Added proof refresh control and local last-checked timestamp.
- [x] Added constellation/orbit treatment to dark information panels.
- [x] Renamed duplicate nav label from second “Proof” to “Stories”.
- [x] Added 4 browser tests; quality, build, lint, and 17 Playwright tests pass.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (ecosystem founder pass)

**Done:**
- [x] Added canonical family offerings data for all 10 requested Give A Bit properties.
- [x] Added 10 approachable agent profiles with roles, identities, and agent front-door links.
- [x] Added Agents, Family, and Proof sections to the homepage and navigation.
- [x] Added color-coded family cards, agent search, family filters, live browser reachability checks, refresh signal, and recurring `Meet the agents` CTAs.
- [x] Updated contact area to point people toward `agents.giveabit.io` and `hello@giveabit.io`.
- [x] Added 2 browser tests; quality, build, lint, and 15 Playwright tests pass.

**Decisions / uncertainties:**
- External URLs are represented exactly from Cam’s brief; launch gate still requires human verification of each URL.
- Browser health checks use `no-cors`, so “Reachable” means the request completed, not that content or uptime is guaranteed.
- Static CSS/HTML visualizations were retained to avoid adding chart-library weight.

## Session — 2026-08-25

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added bold modern visual layer: ink/acid/cyan/violet/coral palette, editorial contrast, grid texture, hard-shadow cards, richer dark theme.
- [x] Added hero Route Intelligence chart strip with animated readiness bars.
- [x] Added operating-model signal dashboard to Expertise.
- [x] Improved buttons, filters, venture altitude meters, cards, footer status, and mobile layouts.
- [x] Added `npm run quality` checks and fixed viewport hook lint warning.
- [x] Verified quality, build, lint, and 13 Playwright tests.

**Decisions:**
- Kept the existing Sherpa/alpine metaphor but pushed it toward a modern intelligence-dashboard aesthetic.
- No external design or chart dependency added; charts are lightweight CSS/HTML and remain deterministic.
- Private preview remains enabled; no publish or deployment actions performed.

**Git State:**
- Local changes only; no GitHub push.

## Session — 2026-08-24

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Enforced private-preview default with visible banner.
- [x] Disabled Formspree delivery and Plausible/Umami analytics while private preview is enabled.
- [x] Removed hard-coded Umami script from `index.html`.
- [x] Added environment documentation and `docs/PRIVATE-LAUNCH-GATE.md`.
- [x] Verified build, lint, and 12 Playwright tests pass.

**Decisions:**
- No GitHub push, deploy, DNS change, or production operation is authorized.
- `VITE_PRIVATE_PREVIEW` remains enabled unless Cam explicitly approves release.

**Git State:**
- Existing local changes remain uncommitted; no push performed.

## Session — 2026-08-25 (dynamic footer)

**Done:**
- [x] Replaced the minimal footer with a high-contrast Base Camp closing experience.
- [x] Added grouped Explore and Read / connect navigation with internal routes and ecosystem CTAs.
- [x] Added GitHub, X, Nostr, and family email icon links with hover and keyboard-focus states.
- [x] Added a data-driven 10-offering family spectrum chart using each offering's identity color.
- [x] Added responsive layouts, solid dark surfaces, lit trims, reduced-motion handling, and back-to-top control.
- [x] Fixed the footer smoke-test selector to account for the intentional duplicate family email links.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- The footer chart communicates identity/color, not fake performance metrics; its labels explicitly state that distinction.
- Kept the footer CSS/HTML-only and dependency-free for fast rendering.
- Private preview remains enabled; no email was sent, GitHub push, deployment, DNS change, or production operation occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (site-wide contrast audit)

**Done:**
- [x] Audited text and control color rules across light and night themes.
- [x] Strengthened family card metadata and descriptions for light-background readability.
- [x] Improved venture live/building/syndicating status contrast and focus visibility.
- [x] Brightened supporting labels in dark agents, proof, services, and footer panels.
- [x] Added regression coverage for readable venture filter text in default and active states.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Preserved the jewel-tone visual language while replacing low-opacity text where it carried meaning.
- Kept decorative lines and shadows subdued; increased contrast only for readable content and controls.
- Private preview remains enabled; no push, deployment, DNS change, or production operation occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (family filter contrast correction)

**Done:**
- [x] Corrected the family filter buttons for All routes, Satohash, Katoa, GiveABit, OpenStrata, Motopass, Sherpacarta, and Tadbuy.
- [x] Added explicit high-contrast light-theme text/background colors instead of relying on translucent theme tokens.
- [x] Added explicit night-theme colors with readable white inactive text and dark active text on acid-lime.
- [x] Added visible cyan keyboard-focus outlines.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used opaque button surfaces to prevent background art and transparency from reducing legibility.
- Kept the existing jewel-tone active state while making inactive labels consistently readable.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (hero card enhancement)

**Done:**
- [x] Added a compact hero metadata rail for location, proof-first practice, and founder-led identity.
- [x] Added Lucide icons for the new hero signals.
- [x] Added responsive wrapping and mobile spacing for the metadata rail.
- [x] Added browser coverage confirming the proof-first hero signal renders.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept the hero enhancement informational and lightweight rather than adding another heavy visual widget.
- Preserved existing motion, contrast, and reduced-motion behavior.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer refinement)

**Done:**
- [x] Added a dedicated family email contact chip with copy-to-clipboard action.
- [x] Added copied-state feedback and accessible tooltip/label behavior.
- [x] Improved footer brand/contact hierarchy and social-link spacing.
- [x] Added browser coverage for the copy-email control.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept contact delivery as a direct `mailto:` path; the copy action only copies the public family address and exposes no secret.
- Preserved the dark Base Camp palette and existing private-preview safeguards.
- No push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer upgrade batch)

**Done:**
- [x] Added a sovereignty manifesto strip with key, heart, and accessible supporting copy.
- [x] Added richer family spectrum hover/focus affordances and external-link indicators.
- [x] Added accessible labels for every family spectrum link.
- [x] Added responsive manifesto layout and reduced-motion handling.
- [x] Expanded footer browser coverage.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept upgrades lightweight and CSS/data-driven; no new dependency or runtime-heavy charting.
- Used the footer to reinforce the site's sovereignty message while preserving strong dark-panel contrast.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (expandable footer sitemap)

**Done:**
- [x] Added a collapsed-by-default “All Give A Bit routes” footer sitemap.
- [x] Populated all 10 property links directly from `FAMILY_OFFERINGS`.
- [x] Added accessible `aria-expanded` and `aria-controls` behavior.
- [x] Added identity-color markers, numbered routes, labels, and external-link affordances.
- [x] Added responsive one-column mobile layout and keyboard focus styling.
- [x] Added Playwright coverage confirming expansion and all 10 routes.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept the sitemap closed by default to preserve footer clarity and reduce visual density.
- Used the canonical family data source so future offerings automatically appear in the sitemap.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (family filter contrast finalization)

**Done:**
- [x] Added a final selector-specific contrast guard for all family filter buttons.
- [x] Set opaque cream inactive buttons with near-black text and 2px borders.
- [x] Set acid-lime active/hover buttons with near-black text and stronger shadow.
- [x] Added explicit focus outlines and matching night-theme behavior.
- [x] Added direct Playwright assertions for rendered text color and border width.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used `!important` only in this narrow component scope because multiple legacy style layers were overriding the family filter colors.
- Prioritized guaranteed readability over translucent styling for these controls.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (editorial image pass)

**Done:**
- [x] Added four relevant local SVG editorial illustrations: founder route, sovereign tools, family spectrum, and proof network.
- [x] Placed imagery in the hero, About, Give A Bit family, and Proof sections.
- [x] Added descriptive alt text, captions, fixed aspect ratios, lazy loading, and async decoding.
- [x] Kept assets local, dependency-free, lightweight, and private with no external image licensing or tracking dependency.
- [x] Added browser coverage for the hero image and editorial image count.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used a blended editorial/alpine/protocol visual language, rendered as local SVG artwork rather than unverified stock assets.
- Hero imagery loads eagerly for the first visual impression; below-the-fold images lazy-load to protect performance and CLS.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (editorial image rollback)

**Done:**
- [x] Removed the four newly added editorial image placements from the hero, About, Family, and Proof sections.
- [x] Deleted the four local SVG assets from `public/editorial/`.
- [x] Removed the related browser assertions.
- [x] Restored the pre-image visual layout without touching existing site visuals.

**Decisions:**
- Rolled back the image pass at Cam’s request because it weakened the design.
- Kept all prior footer, contrast, sitemap, and hero improvements intact.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (factual hero signals)

**Done:**
- [x] Replaced numeric hero readiness and expedition displays with factual, non-numeric labels.
- [x] Added configurable `HERO_SIGNALS` in `src/data/site.ts` for launch review.
- [x] Updated hero badge, route intelligence label/value, and metric strip.
- [x] Added development validation rejecting digits in hero signal strings.
- [x] Added browser assertions for the factual hero state.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Removed `94.8 READINESS`, `7+ Active`, and related numeric hero claims to honor the proof-over-promise standard.
- Kept numeric information elsewhere only where it represents actual structural data or navigation counts; hero marketing signals are now configurable and factual.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (eight GUI upgrades)

**Done:**
- [x] Added family spotlight mode when a family filter is selected.
- [x] Added a lightweight agent constellation backdrop behind the agent grid.
- [x] Added proof status legend and dashboard-style proof rows.
- [x] Added desktop sitemap expand/collapse transition and retained mobile accordion behavior.
- [x] Added unified CTA focus, hover, tap, and reduced-motion interaction rules.
- [x] Added browser assertions for family spotlight, agent constellation, and proof legend.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Implemented the eight GUI upgrades as lightweight CSS/HTML enhancements rather than adding animation or chart dependencies.
- Kept the agent constellation decorative and non-interactive so it does not interfere with keyboard navigation.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer GUI upgrade set)

**Done:**
- [x] Added a dedicated Meet-the-agents footer panel with supporting copy.
- [x] Added rotating footer wisdom lines using the two approved brand statements.
- [x] Added scroll-progress treatment around the back-to-top control.
- [x] Added spectrum-bar tooltips and external-link affordances.
- [x] Added distinct social icon hover identities for GitHub, X, Nostr, and email.
- [x] Added animated gradient footer edge and preserved reduced-motion behavior.
- [x] Added footer proof legend/dashboard polish and family spotlight styling.
- [x] Expanded footer browser coverage.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept all enhancements CSS/HTML/data-driven with no new dependencies.
- Rotation is non-interactive and slow to avoid disrupting reading; reduced-motion users receive static behavior.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (trail kit + colour intensity)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a **Trail Kit** affiliate section (`#kit`) between Ventures and Contact.
- [x] New data model `src/data/affiliates.ts` — one fixed card shape (name, label, tagline, note, brand colour, referral flag) so future tools drop in unchanged.
- [x] New component `src/components/Affiliates.tsx` — uniform small cards, one-line explanation, honest referral tag, plain-language disclosure line.
- [x] First tool live: Freebuff (referral link `freebuff.com/get-started?ref=…`), lime-on-ink brand treatment matching the site's acid accent.
- [x] Wired into nav ("Kit") and the footer Explore column.
- [x] UI upgrade 2 — **colour intensity pass**: stronger cyan/violet/coral tokens, richer body + hero aurora, bolder card shadows, accent bar on section kickers. `--acid` deliberately untouched (tests + brand depend on it).
- [x] UI upgrade 3 — **pointer spotlight** on kit/family/service/venture/proof cards via `src/hooks/useCardSpotlight.ts` (pointer-only, skipped for touch and reduced motion).
- [x] Added 1 Playwright test (21 total) asserting card slot uniformity, referral honesty and the Freebuff link.
- [x] Quality, build, lint (0 errors, 1 pre-existing warning) and 21 Playwright tests pass.

**Decisions:**
- Affiliate tone stays humble: "Tools I actually use", no urgency, no hard sell, explicit referral disclosure.
- Card layout is fixed-height and slot-identical so a growing list stays tidy.
- Freebuff brand colour is a single constant in `affiliates.ts` (`color`/`ink`) — one-line change if Cam wants a different shade.
- Private preview remains enabled; no email sent, no push, deployment, DNS change or production operation.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (live signal + bolder colour + 3 polish upgrades)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] UI upgrade 1 — **Bolder colour pass 2** in `src/styles/bold-modern.css`: hotter jewel tokens (`--cyan #07cdc4`, `--violet #6a2bff`, `--coral #ff3d0f`), deeper ink, four-radial body wash, more saturated hero aurora, gradient underline on every `.section-title`, heavier offset card/shell shadows, darker night theme. `--acid` untouched.
- [x] UI upgrade 2 — **Route conditions ticker** (`RouteTicker.tsx`) between Hero and About: a slow marquee of standing conditions plus a live Pacific clock, duplicated track `aria-hidden`, pauses on hover, stops for reduced motion.
- [x] UI upgrade 3 — **Route rail** (`RouteRail.tsx`): desktop-only (≥1200px) vertical scroll markers, one per section, active marker follows scroll via `useScrollSpy`, hover reveals the label, click travels.
- [x] UI upgrade 4 — **Command Deck shortcut** (`useCommandShortcut.ts`): `/` or `⌘K`/`Ctrl+K` toggles the deck from anywhere, ignored while typing in a field; keycap hint added to the nav toggle; Command Deck boot tip updated.
- [x] **New live data panel** (`#signal`, `LiveSignal.tsx`): real Bitcoin readings pulled in the browser from the keyless `mempool.space` public API — transactions-per-block area chart (last 14 blocks), tip height, mempool backlog, fast fee, block age, and four recommended fee tiers.
- [x] `src/hooks/useLiveBitcoinSignal.ts` — 3 parallel reads with 5s abort timeout, `Promise.allSettled`; block read failing = `OFFLINE` state, never a remembered or invented number.
- [x] `src/data/liveSignal.ts` — endpoints, chart copy, honest note, ticker conditions.
- [x] Added `https://mempool.space` to `connect-src` in `public/_headers` (it would have been blocked in production otherwise); noted in `docs/PRIVATE-LAUNCH-GATE.md`.
- [x] Nav wiring: `signal` nav item (desktop nav, footer Explore, scrollspy, route rail); 4 new Playwright tests (25 total).
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 25/25 pass.

**Decisions:**
- The live panel only ever shows raw API readings, names its source, and shows an honest offline card if the read fails — matching the existing Proof dashboard tone (proof over promise).
- `gravity_index` has no catalog entry for keyless blockchain/market data APIs (returned no options), so `mempool.space` was chosen directly: no key, CORS-open, Bitcoin-native, tiny payloads.
- Live chart *ideas* offered to Cam (not yet built): Lightning channel capacity/flow, Nostr relay note throughput (WebSocket, NIP-01 `REQ`), sats-per-USD price sparkline, and difficulty-adjustment countdown.
- Colour work still preserves the literals asserted in `tests/smoke.spec.ts` (family filter `rgb(16,23,19)`/acid, venture `rgb(26,23,18)`/`rgb(215,255,85)`).
- Private preview stays on; nothing pushed, deployed, or emailed.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (Lightning capacity panel)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a **Lightning capacity panel** inside `#signal`, sitting beside the Bitcoin block chart in a responsive two-column grid (`.live-panels`, 1.25fr/1fr above 900px).
- [x] `src/hooks/useLightningSignal.ts` reads `mempool.space/api/v1/lightning/statistics/3m` (daily snapshots) — sorts, caps at 30 samples, requires ≥2 points to plot.
- [x] Panel shows capacity trend in BTC, plus capacity (BTC + sats), channels, nodes, and Tor share; the honest line names the source and states that private/unannounced channels cannot be counted.
- [x] Extracted shared pieces: `src/utils/signalChart.ts` (geometry), `src/components/SignalChart.tsx` (reusable SVG line/area), `src/utils/readJson.ts` (timeout-safe JSON read, now used by both signal hooks).
- [x] `public/_headers` CSP already allowed `mempool.space`; no new host added.
- [x] Footer "Refresh reading" refreshes both readings.
- [x] Added 1 Playwright test (26 total). Fixed two test issues found on the way: a strict-mode selector collision (`.live-chart-line` now exists in both charts → scoped to `.live-chart-wrap`) and a flaky Escape-after-keyboard-open race (now retried with `expect(...).toPass()`).
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 26/26 pass.

**Decisions:**
- Lightning statistics are a *daily* series, so they are fetched once and never re-timed like the 14-block feed; a series too short to plot renders an honest empty state rather than a one-point "trend".
- Block chart keeps class `.live-chart`, Lightning uses `.lightning-chart` so test selectors stay unambiguous.
- Note for Cam: `/api/v1/lightning/statistics/1w` and `/1m` currently return `[]` upstream, so the panel requests `3m` (which returns the available daily snapshots).

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (sats-per-dollar price panel)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a third `.live-panel--price` to `#signal`: **Sats per dollar** sparkline over the last 24 hourly closes, with sats per $1, BTC price, day move %, and the hourly USD low–high range.
- [x] `src/hooks/usePriceSignal.ts` reads `api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600` — one keyless, CORS-open GET (`access-control-allow-origin: *` verified), sorted ascending, capped at 24 samples, needs ≥2 points to plot.
- [x] Sats per dollar computed as `100,000,000 ÷ close` from the raw candle, never from a rounded headline price.
- [x] `public/_headers` `connect-src` gained `https://api.exchange.coinbase.com` (would be CSP-blocked in production otherwise); `docs/PRIVATE-LAUNCH-GATE.md` note updated to list both external hosts.
- [x] `.live-panels` grid now 3-up above 1200px, 2-up above 900px, 1-up below; mini stat grids renamed to `.live-mini-stats` / `.live-mini-stat` (shared by the Lightning and price panels).
- [x] Footer "Refresh reading" now refreshes all three readings.
- [x] Added 1 Playwright test (27 total). Made the keyboard-shortcut test deterministic (wait for the deck input to be focused before sending Escape, instead of retrying) and marked it `test.slow()` — it was brushing the 30s default under 4-worker load.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 27/27 pass.

**Decisions:**
- Chose Coinbase Exchange public candles over Kraken (HEAD returns 404, no CORS headers observed) and over mempool.space price endpoints (`/api/v1/historical-price` only resolved one of three requested timestamps, so it cannot plot a series).
- Price is the only new external host; the note names it plainly so the panel never hides where a number came from.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (USD/CAD toggle)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a small **USD / CAD toggle** (`.live-quote-toggle`, `aria-pressed`, `role="group"`) to the sats-per-dollar panel; the whole panel — chart, sats per $1, price, day move, hourly range — flips currency together.
- [x] `usePriceSignal` now also reads `mempool.space/api/v1/prices` for the live USD→CAD rate (one extra keyless GET, host already allowed).
- [x] Panel copy states the method outright: "CAD is that series converted at the live mempool.space USD→CAD rate", and selecting CAD appends "Live rate: 1 USD = x.xxxx CAD (mempool.space)."
- [x] Failure-safe: `activeQuote` falls back to USD whenever the live rate is missing, so a label can never claim Canadian dollars over American numbers; the CAD button is disabled with an explanatory `title` in that case.
- [x] Playwright config: raised to `timeout: 60_000` and `expect.timeout: 10_000`. The homepage is heavy (video, canvas, four external reads) and 3 pre-existing tests were tripping the 30s default under 4-worker parallel load.
- [x] Sats-per-dollar test extended with toggle coverage (27 tests total). `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 27/27 pass.

**Decisions:**
- No genuine CAD series is browser-reachable: Coinbase has no `BTC-CAD` product (404) and Kraken's `XBTCAD` OHLC works but sends no `Access-Control-Allow-Origin`, so a browser fetch is blocked. Converting the real USD series at the live rate (and saying so) was the honest option.
- Note for Cam: if you want a true CAD-denominated series later, it needs a server/proxy hop or a CAD-quoting exchange that sets CORS headers.

**Git State:**
- Local changes only; no GitHub push or deployment.

---

## Session — 2026-07-19

**Machine:** M3 (Grok)
**Project:** camtaylor

**Done:**
- [x] Added thin Satohash API client `src/lib/satohash.ts` (`X-Satohash-Client: camtaylor`)
- [x] Exports: `stampHash`, `getApiHealth`, `verifyUrl`, `stampGuideUrl`, `sha256Hex`
- [x] Defaults: API `https://api.satohash.io`, site `https://satohash.io`
- [x] Graceful offline (`ok: false`, no throw on network failure); optional `VITE_SATOHASH_*` env (no secrets committed)
- [x] Typed `VITE_SATOHASH_API_URL` / `VITE_SATOHASH_URL` / `VITE_SATOHASH_KEY` in `src/vite-env.d.ts`
- [x] `tsc -b` clean

**Decisions:**
- Client is library-only (not wired into UI yet) — ready for portfolio/snapshot seals
- Matches family motopass-style graceful returns; no FAMILY key in repo

**Git State:**
- Branch: main
- See commit after push

---

## Session — 2026-09-24 (masthead pass + live signal tightening)

**Machine:** M3 (Buffy)
**Project:** camtaylor

**Done:**
- [x] Hardcore masthead pass in `src/styles/bold-modern.css`. Brand wordmark at `clamp(1rem, 2.2vw, 1.18rem)/800` with the SHERPA chip restyled as an ink-on-acid pill; nav links are now uppercase `.64rem/800` at `.15em` tracking with a hover wash and an acid→cyan underline; the glass nav container gained a lit acid gradient edge, a heavier glass gradient and a deeper scrolled shadow; the Command Deck button is now the ink/acid primary in the header.
- [x] Hero type. `.title-name` is a tracked eyebrow with a fading rule, `.title-role` moved to `clamp(2.9rem, 10.5vw, 5.2rem)/900` at `-.05em`, `.title-tagline` is a serif quote on an acid rule, meta items became chips, badge/strip/metrics re-spaced, and `.hero-shell` gained a 4px acid→coral top edge, radius 20 and a jewel offset shadow.
- [x] Header overflow verified by measurement, not eyeball: `scrollWidth` vs `clientWidth` for `.nav-container` and `.hero-shell` at 1440 → 360 px. Nav-link steps down at 1160/1040/980/899, keycap hidden ≤899, identity badge ≤860, theme toggle and SHERPA chip leave the nav ≤430, route strip stacks ≤480.
- [x] Live signal tightened. All three panels are flex columns with `align-items: stretch`, a fixed one-line head (`min-height: 34px` + hairline) and a new `.live-chart-well`: a fixed-height (`clamp(104px, 12vw, 146px)`) full-bleed frame with grid guides that the SVG fills via `preserveAspectRatio="none"` plus `vector-effect="non-scaling-stroke"`.
- [x] The four chain readings (tip height, mempool, fast fee, block age) moved out of the old wide row and into the chain card as `.live-mini-stat.live-stat` items (still exactly four `.live-stat` nodes), so every card reads head → chart → readings with the bottom block pinned to the card floor. The row below the panels is now the fee tiers only.
- [x] Empty and offline states stay honest: `.live-panel-empty` and `.live-offline` render inside the chart frame, so card geometry never shifts when a read fails.
- [x] Two new Playwright tests: `masthead holds the brand and never overflows its container` (nav + hero shell fit at 1440/1024/780/430) and `live signal charts share one frame and one reading row` (three wells, equal tops and heights, four readings in the chain card, bottoms within 14px). Three `toBeInViewport` waits raised 8s → 20s and the masthead test marked `test.slow()` — the suite now saturates 4 workers and was flaking on scroll assertions.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **29/29** pass.

**Decisions:**
- The chart frame owns the height and its children are absolutely pinned to it. Letting the SVG resolve a percentage of an indefinite flex height was what had put the old charts off-grid.
- The frame is a fixed height rather than flex-grown: growing gave each card a different chart height (the chain card has one block of content, the two market cards have two), which is exactly the loose look Cam flagged. Slack now goes to `margin-top: auto` on the last block of each card, so every chart top and every card bottom lines up.
- Chain readings moved into the chain card instead of staying in a wide row — at ≥1200px that row left the first card visibly empty.
- Pre-existing CSS quirk left alone and documented: the `@media (max-width: 1100px)` rule in `bold-modern.css` that shows `.nav-identity-badge` and hides `.nav-agents-cta` is overridden by the later base rules in the same file, so the badge never renders and the agents CTA shows at every width above the mobile breakpoint. Changing it would have re-introduced header overflow at ~780px, so it stays as-is pending a deliberate nav decision.
- Local commit only. **No push, no deploy, no DNS change, private preview still on** (`VITE_PRIVATE_PREVIEW` untouched).

**Git State:**
- Branch: `main`; remote `git@github.com:kitsboy/camtaylor.git` (plus an HTTPS push URL alongside the SSH one).
- Committed locally this session: `src/styles/bold-modern.css`, `src/components/LiveSignal.tsx`, `src/components/SignalChart.tsx`, `tests/smoke.spec.ts`, `docs/KIMI-HANDOFF.md`, `LATEST-UPDATE.md` (the first three were untracked files that had never been committed).
- Still uncommitted in the working tree (≈44 paths from earlier sessions): `src/components/Navbar.tsx`, `Hero.tsx`, `src/pages/HomePage.tsx`, `src/styles/upgrades.css`, `index.html`, `package.json`, `playwright.config.ts`, `public/_headers`, `src/data/*`, `src/hooks/*`, `src/utils/*`, and more. Nothing unpushed (`origin/main..HEAD` is empty).
- **Risk for Cam:** two months of design work (2026-08-24 → 2026-09-24) lives only in this working tree, not in the repo. Committing it is the next safe step.

---

## Session — 2026-09-24 (dispatch engine, route spine, publish)

**Machine:** M3 (Buffy)
**Project:** camtaylor

**Done:**
- [x] **Expedition log is now a real content engine.** Dispatches are markdown files in `src/content/dispatches/*.md` with plain `key: value` frontmatter (title, date, terrain, camp, tags, summary, optional ventureId/draft). Six seed dispatches shipped.
- [x] `src/utils/dispatches.ts` loads them through `import.meta.glob(..., '?raw')`, parses frontmatter, derives the slug from the filename **minus its date prefix**, computes reading time and sorts newest-first. `src/components/DispatchBody.tsx` renders the body as React elements (headings, paragraphs, lists, quotes, bold/italic/code, http-only links) — no `dangerouslySetInnerHTML`, no markdown dependency.
- [x] `ExpeditionLog` rebuilt as a dated timeline: gutter month + node, camp chip, terrain chip, reading time, `Latest` flag, terrain filters, tags, per-entry link, and a `/feed.xml` subscribe line.
- [x] New `/dispatch/:slug` reader (`src/pages/DispatchPage.tsx`): meta line, summary lede, body, tags, older/newer navigation, honest not-found state.
- [x] `scripts/generate-static.mjs` now writes `public/feed.xml` (RSS 2.0, one item per dispatch, atom self link) and includes every dispatch in `sitemap.xml`. The stub `public/expedition-log.xml` was deleted and `/expedition-log.xml → /feed.xml` added to `_redirects`. `index.html` advertises the feed via `rel="alternate"`.
- [x] **Route spine.** `src/data/waypoints.ts` defines twelve waypoints (section id, camp, framing altitude, qualitative condition, blurb). `WaypointBand` renders trail signage in the gap before each homepage section, and `RouteRail` is now an interactive map: index, progress-filled spine, active waypoint tracking, camp/altitude/conditions in the tooltip and `title` (the accessible name stays the action, so it can't collide with other controls' names).
- [x] **Venture case files** carry four blocks — problem, structure, **capital**, outcome — plus a note that amounts and terms stay with the participants. `capital` was added to all seven ventures in the same qualitative register as the rest of the file.
- [x] **Repository tidy:** deleted `vercel.json`, `netlify.toml`, four stale `SESSION-SUMMARY-*.md`, `public/og-image.svg`, the old `expedition-log.xml`, and every `.DS_Store`; `ref/` is now gitignored.
- [x] **Service worker rewritten.** It was cache-first for everything, which could pin a visitor to an old build forever. Now network-first for navigations (cached shell only as an offline fallback) and cache-first only for hashed `/assets/*`.
- [x] **Publish plumbing:** Cloudflare-only `docs/DEPLOYMENT.md`, `npm run build:live`, `npm run deploy`, `npm run deploy:live`, CSP tightened by removing the unused analytics hosts, README rewritten, `.env.example` clarified.
- [x] `playwright.config.ts` caps workers at 3 — the homepage is heavy enough that more workers starve each other and turn assertions into 60s timeouts. Five new tests cover the log timeline, the dispatch reader (including list rendering), the RSS item count, the twelve waypoints + rail progress, and the case-file capital block.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **35/35** pass.

**Decisions:**
- Markdown frontmatter is deliberately trivial (`key: value`, comma-separated tags) so `src/utils/dispatches.ts` and `scripts/generate-static.mjs` can parse the same files without a markdown toolchain. Keep the two parsers in step.
- Slugs drop the `YYYY-MM-DD-` filename prefix: files sort on disk, URLs stay readable.
- The rail's accessible name is the action (`Go to Expertise`); camp, altitude and conditions live in `title`. Putting "Glacier" in the accessible name collided with the family filter named `glacier` and broke a strict-mode locator.
- Waypoint altitudes are framing labels, not measurements, and conditions are qualitative — the site's no-invented-numbers rule still holds; the only live numbers are in the signal section.
- Case-file capital text describes the *shape* of a deal and never an amount, consistent with the existing case-study copy.
- Publish decisions confirmed by Cam this session: private preview **off** for production (form live), **no analytics**, Cloudflare Pages only, **he** performs the DNS switch in the dashboard (wrangler here has no DNS scope), and old-site cleanup is wanted.

**Git State:**
- Branch `main`, remote `git@github.com:kitsboy/camtaylor.git`. Everything is committed and pushed this session (no unpushed commits).
- Deployed to Cloudflare Pages project **`camtaylor`** (https://camtaylor.pages.dev) with `VITE_PRIVATE_PREVIEW=false`.
- **Open for Cam:** verify the six seed dispatches (written in his voice), test the contact form into the real inbox, and perform the apex/`www` DNS switch — see `docs/DEPLOYMENT.md` § Attaching the domain and `docs/PRIVATE-LAUNCH-GATE.md`.
- Left locally on purpose: `.env` (ignored), `ref/` (ignored), `.aider.*` chat history files (ignored — his call whether to delete).

---

## Session — 2026-09-24 (port the August fixes, go live, kill the preview copy)

**Machine:** M3 (Buffy)
**Project:** camtaylor
**Continues:** the dispatch-engine / route-spine session above.

**Done:**
- [x] **Ported the worthwhile August-line fixes onto the local line** (Cam chose "my Sep line, port their fixes"): new `src/components/SatohashProvenance.tsx` rendered on `/route/:ventureId`, `https://api.satohash.io` added to the CSP `connect-src`, `min-height: 100dvh`, 44px `nav-menu-btn`, `-webkit-backdrop-filter` on every remaining backdrop, and `axioms-grid` two-column ≤1000px / one-column ≤640px. Deliberately **not** ported: the remote `index.css` consolidation (it would collide with `bold-modern.css`) and the "Deal Architect" voice — Sherpa wins.
- [x] **Ported the device-QA matrix** as `tests/device-qa.spec.ts`, rewritten against current markup and driven by viewport size rather than a UA string.
- [x] **The matrix immediately found three real phone defects, all fixed:** (1) `.glow-orb` (`right: -15%`) gave the page a horizontal scrollbar on phones; (2) `.log-filter-btn`, `.venture-filter-btn` and `.theme-toggle` were under 40px tall; (3) `.nostr-card` could not shrink below its min-content, forcing 19px of overflow at 320px — fixed with `min-width: 0` on the card and its header column.
- [x] **Deployed to production.** Created the Cloudflare Pages project `camtaylor` (`wrangler pages project create camtaylor --production-branch main`) and ran `npm run deploy:live`. Production URL: **https://camtaylor.pages.dev** (currently serving `assets/index-DiA1UCzx.js`). Verified live: routes 200, `/feed.xml` with six items, `/sitemap.xml`, dispatch reader, venture route, CSP header carries `api.satohash.io`.
- [x] **Found and fixed a launch blocker on the first public deploy.** The navbar badge, the footer signal and the contact delivery note were *hardcoded* preview copy, so the live site still read `LIVE / PRIVATE PREVIEW` in the header and told visitors "Private preview never sends." All three now branch on `IS_PRIVATE_PREVIEW`, and `scripts/quality-check.mjs` gained a guard that fails the build when preview copy is not gated.
- [x] Redeployed after the fix; served bundle verified free of preview copy, and a temporary live spec (since deleted) confirmed homepage, dispatch reader, feed, venture provenance and an enabled contact form against the real URL.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **41/41** pass (was 35).

**Decisions:**
- Porting was **selective**: features and defects only, never the August theme tokens or the rebranded voice, because Cam locked the reviewed Sherpa design this session.
- Preview copy must be *branched*, never hardcoded — the quality-check guard exists so a public build can never regress into advertising a private preview.
- Local `main` is the published line. `origin/main` was originally a parallel lineage (2026-08-09 → 08-13, "Deal Architect" maturity rebrand) diverging in 28 files; **Cam approved a force-push this session**, so `origin/main` now points at this line. The August commits remain reachable on `m3/2026-09-24-publish` and `origin/talent`.

**Git State:**
- SHA: `5137415b87fcc07ba9a34a5e600ec83be62c6461` (branch `main`)
- `origin/main` was force-pushed to that SHA — `origin/main..HEAD` is now empty. `m3/2026-09-24-publish` also carries it as a safety copy; anything needed from the August line still lives on that branch and `origin/talent`.
- **`origin/HEAD` still points at `origin/talent`** — Cam should set the default branch to `main` in GitHub repository settings.
- Working tree clean; `.env`, `ref/` and `.aider.*` remain ignored and local.

**Open for Cam:**
1. Review the six seed dispatches and test one real contact-form submission.
2. Switch `camtaylor.ca` + `www` to the Pages project in the Cloudflare dashboard (see below) and delete the old WordPress records.
3. Set the GitHub default branch to `main` (`origin/HEAD` still points at `talent`).

**DNS switch (dashboard, no wrangler DNS scope):** Workers & Pages → `camtaylor` → Custom domains → **Set up a domain** → add `camtaylor.ca`, then `www`. Cloudflare will offer to create the CNAME/proxy records; accept **only** if it removes the old WordPress `A`/`CNAME` records for the apex and `www`. The live WordPress origin is LiteSpeed/PHP 8.1.34 behind the proxy — its origin records must be deleted, then the hosting cancelled.

**Kimi — read this before you deploy anything:**
- **I want to own the camtaylor deployment.** I created the Cloudflare Pages project `camtaylor` this session and published the current `main` with `npm run deploy:live` (`wrangler pages deploy dist --project-name camtaylor --branch main`). **https://camtaylor.pages.dev is my deployment.**
- **You have your own deployment pipeline** — that is fine and I am not asking you to tear it down. But we must not both point `camtaylor.ca` at different targets or deploy the same project from two pipelines, or we will silently overwrite each other and nobody will know which build a visitor got.
- **So, please confirm in a handoff note which way we go:** either (a) you keep yours and I stop using `deploy:live` for `camtaylor`, or (b) the Pages project `camtaylor` is the single production target and yours becomes a staging/preview only. If (b), the published line is `main` and the only deploy command is `npm run deploy:live`.
- **Do not attach `camtaylor.ca` or `www` until that is settled.** Cam performs the apex/`www` switch himself in the dashboard (this wrangler token has no DNS scope), and it must happen once, to one target.
- **Same rule for the old WordPress site:** nothing gets deleted until the switch is agreed, so we keep a rollback path.
- If your deployment is on THOR rather than Cloudflare Pages, say so plainly in your note — the difference matters, because the repo's `public/_headers`, `_redirects` and `sw.js` only take effect on Cloudflare Pages.

---
