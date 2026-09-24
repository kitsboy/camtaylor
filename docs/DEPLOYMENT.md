# Deployment — camtaylor.ca

**Production:** https://camtaylor.ca
**GitHub:** https://github.com/kitsboy/camtaylor (branch: `main`)
**Host:** Cloudflare Pages — project **`camtaylor`** (account `Kitsboy@gmail.com's Account`)
**Preview URL:** https://camtaylor.pages.dev

Cloudflare is the only host. There is no Vercel or Netlify config in this repo, and CI
(`.github/workflows/ci.yml`) only lints, builds and tests — it never deploys.

## Build settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 |
| SPA routing | `public/_redirects` (`/* /index.html 200`) |
| Security headers | `public/_headers` |
| Environment variables | `VITE_PRIVATE_PREVIEW=false` (production), `VITE_FORMSPREE_FORM_ID=xykqodnk` |

`prebuild` regenerates `public/sitemap.xml` and `public/feed.xml` from
`src/content/dispatches/*.md` on every build — no manual feed edits.

## Option A — deploy from this machine (fastest)

```bash
npm run test && npm run quality   # verify first
npm run deploy:live               # build with VITE_PRIVATE_PREVIEW=false, then deploy
```

`deploy:live` builds with the public flag (`banner off, form live`) and uploads `dist/`
to the Pages project `camtaylor`. `npm run deploy` does the same but keeps the private
preview on, which is useful for a dry run.

Authentication is the local wrangler OAuth session (`kitsboy@gmail.com`). If it expires:

```bash
npx wrangler login
```

## Option B — Git-connected builds (no laptop involved)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick `kitsboy/camtaylor`, production branch `main`
3. Build command `npm run build`, output `dist`
4. Settings → **Environment variables (Production)**: `VITE_PRIVATE_PREVIEW=false`, `VITE_FORMSPREE_FORM_ID=xykqodnk`
5. Every push to `main` then publishes automatically

## Attaching the domain (the switch)

`camtaylor.ca` and `www.camtaylor.ca` currently resolve to the **old WordPress site**
(PHP/LiteSpeed origin behind Cloudflare). DNS records for the zone can only be edited by
the account holder, so this part is a dashboard job:

1. The `camtaylor` Pages project → **Custom domains** → **Set up a domain** → `camtaylor.ca`
2. Repeat for `www.camtaylor.ca`
3. Cloudflare offers to replace the apex + `www` records with the Pages ones — accept, and
   the WordPress origin stops receiving traffic for those hostnames
4. Verify: `curl -sI https://camtaylor.ca | grep -i server` → Cloudflare, and the page title
   should be "Cam Taylor | Sherpa — Deal Architecture & Venture Operations"
5. In Cloudflare → SSL/TLS, confirm **Full (strict)** and that **Always Use HTTPS** is on

Old-site cleanup once the new site is confirmed live:

- Remove the leftover origin records (the A/AAAA records pointing at the WordPress host)
- Cancel/archive the WordPress hosting and any old staging subdomains
- Keep Cloudflare **Email Routing** for `cam@camtaylor.ca` — it is independent of the website
- Re-submit `https://camtaylor.ca/sitemap.xml` in Google Search Console (the WordPress
  URLs will 404; the SPA fallback returns the app, which is the intended behaviour)

## Rollback

Pages keeps every deployment. Dashboard → project → **Deployments** → pick the last good
one → **Rollback**. DNS stays untouched, so this is the safe undo.

## Analytics

None is shipped. If Plausible is enabled later, set `VITE_PLAUSIBLE_DOMAIN=camtaylor.ca`
in the production environment **and** re-add `https://plausible.io` to `script-src` and
`connect-src` in `public/_headers`.

See `docs/PRIVATE-LAUNCH-GATE.md` for the pre/post-launch checklist and
`docs/KIMI-HANDOFF.md` for session state.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
