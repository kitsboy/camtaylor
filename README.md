# camtaylor.ca — Cam Taylor | Sherpa

Personal site for deal architecture, capital syndication, and venture operations. Part of the [Give A Bit](https://giveabit.io) family.

**Stack:** Vite · React 19 · TypeScript · vanilla CSS · Framer Motion · Formspree · Cloudflare Pages · Playwright

---

## Quick start (local)

```bash
cd ~/projects/camtaylor
npm install
cp .env.example .env   # Formspree ID already set as default
npm run dev            # http://localhost:5173
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` (also regenerates `sitemap.xml` + `feed.xml`) |
| `npm run build:live` | Same, with `VITE_PRIVATE_PREVIEW=false` (public behaviour) |
| `npm run preview` | Preview the production build locally |
| `npm test` | Playwright smoke tests |
| `npm run lint` | Oxlint |
| `npm run quality` | Metadata / privacy / asset gate |
| `npm run check:live-form` | Read the live site's bundle and form state: which Formspree endpoint production actually posts to, and whether the form is switched on. Sends nothing |
| `npm run deploy` | Build + deploy current state to Cloudflare Pages (`camtaylor`) |
| `npm run deploy:live` | Same with the private-preview flag off |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FORMSPREE_FORM_ID` | No | Formspree endpoint ID. The form must deliver to `hello@giveabit.io`; the `xykqodnk` fallback is a **placeholder** that delivers nowhere |
| `VITE_PLAUSIBLE_DOMAIN` | No | Plausible domain (`camtaylor.ca`), served from `https://plausible.io` — only used when private preview is off |
| `VITE_UMAMI_WEBSITE_ID` | No | Umami website ID — the family's self-hosted Umami at `analytics.giveabit.io`; only used when private preview is off. Whichever of the two is set wins |
| `VITE_PRIVATE_PREVIEW` | No | Defaults to `true`. `false` publishes the site: banner off, form live |

---

## Routes

| Route | Page |
|-------|------|
| `/` | Home — one route of twelve waypoints, from Base Camp to Summit |
| `/dispatch/:slug` | One expedition-log dispatch (rendered from markdown) |
| `/route/:ventureId` | Venture case file — problem, structure, capital, outcome |
| `/field-guide` | Sherpa Field Guide (downloadable reference) |
| `/2026` | State of the Route — annual review |
| `/privacy` · `/terms` | Legal pages |

**Generated at build time:** `public/sitemap.xml` (static routes + one entry per dispatch) and `public/feed.xml` (RSS 2.0) via `scripts/generate-static.mjs`.

---

## The expedition log

Dispatches are real markdown files, not CMS records:

```
src/content/dispatches/2026-09-18-proof-before-promise.md
```

Frontmatter is deliberately plain so the app (`src/utils/dispatches.ts`), the RSS
generator (`scripts/generate-static.mjs`) and any editor can all read it:

```markdown
---
title: Proof before promise
date: 2026-09-18
terrain: Method
camp: Base Camp
tags: [Method, Trust]
summary: One sentence for the timeline, the feed and the social card.
ventureId: openstrata   # optional, links to the case file
draft: false            # optional, true hides it everywhere
---
```

Add a file, run `npm run build`, and it appears in the timeline, the sitemap and
`/feed.xml` at once. Bodies support headings, paragraphs, lists, quotes,
bold/italic/code and links — rendered as React elements, never raw HTML.

---

## Key features

- **One route, twelve waypoints** — waypoint signage between sections (`src/data/waypoints.ts`) and an interactive desktop rail with the camp, framing altitude and conditions for each waypoint
- **Live signal** — keyless public readings (mempool.space, Coinbase) with honest offline states and USD/CAD toggle
- **Proof layer** — browser-side reachability checks, no invented numbers anywhere
- **Expedition log** — markdown dispatches, timeline, RSS
- **Command Deck** — terminal overlay with `/status`, `/route`, `/nostr`, `/summit` and the `/` or ⌘K shortcut
- **NOSTR** — `cam@giveabit.io` + `kimi@giveabit.io` with live NIP-05 verification
- **Mobile-first** — bottom quick-nav, snap-scroll carousels, bottom-sheet modals, safe-area insets
- **Night camp** — dark mode toggle
- **Service worker** — network-first navigations, cache-first hashed assets (never pins a stale build)

---

## Project layout

```
src/
  components/     # UI (Hero, RouteRail, ExpeditionLog, LiveSignal, Ventures…)
  content/        # dispatches/*.md — the expedition log source
  data/           # site, waypoints, ventures, liveSignal, agents, family…
  hooks/          # scrollSpy, theme, konami, bodyScrollLock…
  pages/          # HomePage, DispatchPage, VentureRoutePage, legal pages
  styles/         # bold-modern.css is the override layer (loaded last)
  utils/          # dispatches (markdown), signalChart, readJson
scripts/
  generate-static.mjs  # sitemap.xml + feed.xml
  quality-check.mjs    # metadata / privacy / asset gate
docs/
  DEPLOYMENT.md          # Cloudflare Pages, step by step
  PRIVATE-LAUNCH-GATE.md # what must be true before/after publishing
  KIMI-HANDOFF.md        # agent handoff history
```

---

## Publishing

Hosting is **Cloudflare Pages** only (project `camtaylor`). Full runbook:
`docs/DEPLOYMENT.md`. Checklist: `docs/PRIVATE-LAUNCH-GATE.md`.

```bash
npm run test && npm run quality   # verify
npm run deploy:live               # build with the public flag + deploy
```

Then attach `camtaylor.ca` to the Pages project and point the apex/www DNS at it.
Nothing else in this repo deploys the site — CI only lints, builds and tests.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
