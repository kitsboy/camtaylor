# camtaylor.ca — Cam Taylor | Sherpa

Personal site for deal architecture, capital syndication, and venture operations. Part of the [Give A Bit](https://giveabit.io) family.

**Stack:** Vite · React 19 · TypeScript · vanilla CSS · Framer Motion · Formspree · Playwright

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
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Playwright smoke tests (6) |
| `npm run lint` | Oxlint |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FORMSPREE_FORM_ID` | Yes | Formspree form ID (`xykqodnk`) |
| `VITE_PLAUSIBLE_DOMAIN` | No | Plausible analytics domain |

---

## Site structure

| Route | Page |
|-------|------|
| `/` | Home — Hero, About, Expedition Log, Philosophy, Expertise, Ventures, Contact |
| `/field-guide` | Sherpa Field Guide (downloadable reference) |
| `/2026` | State of the Route — annual review |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |

**Static assets:** `public/llms.txt`, `public/manifest.json`, `public/sitemap.xml`, `public/robots.txt`

---

## Key features

- **Sherpa brand** — warm gray-brown palette, glass cards, animated hero backdrop
- **Hero YouTube** — in-frame video player (`SITE.heroVideoId` in `src/data/site.ts`)
- **Command Deck** — terminal overlay with `/status`, `/route`, `/nostr`, `/summit` easter egg, Konami code
- **NOSTR** — `cam@giveabit.io` + `kimi@giveabit.io` with live NIP-05 verification
- **Mobile-first** — bottom quick-nav, snap-scroll ventures/testimonials, bottom-sheet modals, safe-area insets
- **Night camp** — dark mode toggle (navbar)
- **Deploy ready** — `vercel.json`, `netlify.toml`, CSP headers (no remote configured yet)

---

## Project layout

```
src/
  components/     # UI (Hero, CommandDeck, Ventures, etc.)
  data/           # site, ventures, expeditionLog, commandDeck, nostr…
  hooks/          # scrollSpy, theme, konami, bodyScrollLock…
  pages/          # HomePage, legal pages, field guide, 2026 review
  styles/         # mobile.css (100-improvement mobile pass)
docs/
  KIMI-HANDOFF.md # Agent handoff for Kimi / HERMES
```

---

## Deploy (when ready)

1. Push to GitHub
2. Connect Vercel or Netlify (configs in repo root)
3. Set env: `VITE_FORMSPREE_FORM_ID=xykqodnk`
4. Point `camtaylor.ca` DNS to host
5. SPA rewrites required for `/privacy`, `/terms`, `/field-guide`, `/2026`

---

## Handoff & continuity

- **Latest session:** `SESSION-SUMMARY-2026-07-07.md`
- **Kimi handoff:** `docs/KIMI-HANDOFF.md`
- **Recovery in new chat:** say `/whatsup`

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*