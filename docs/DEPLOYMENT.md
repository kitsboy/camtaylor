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
| Environment variables | `VITE_PRIVATE_PREVIEW=false` (production), `VITE_FORMSPREE_FORM_ID=<LIVE ID>` |

`prebuild` regenerates `public/sitemap.xml` and `public/feed.xml` from
`src/content/dispatches/*.md` on every build — no manual feed edits. It also writes
`public/build-meta.json`, the **identity marker**: the commit (`CF_PAGES_COMMIT_SHA`,
or git HEAD locally) and version the build came from. The deploy verifier uses it to
prove the live site is serving the pushed commit.

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

> **Prefer Option B.** Cloudflare Pages is wired to this repo, so a plain push to `main`
> builds and publishes automatically. The manual `npm run deploy:live` path exists only
> as break-glass; the git integration is the single deployer.

## Option B — Git-connected builds (the real path)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick `kitsboy/camtaylor`, production branch `main`
3. Build command `npm run build`, output `dist`
4. Settings → **Environment variables (Production)**: `VITE_PRIVATE_PREVIEW=false`, `VITE_FORMSPREE_FORM_ID=<LIVE ID>`
   (replace the `<LIVE ID>` placeholder with the real Formspree endpoint — `xykqodnk` in the old docs was
   the scaffold placeholder; see `docs/KIMI-HANDOFF.md` top section for the live delivery state).
5. Every push to `main` then publishes automatically

**Build output dir is pinned in-repo** by `wrangler.toml` (`pages_build_output_dir = "dist"`),
so Cloudflare always publishes the built site, never the repo root.

## Verifying a deploy (token-free, run by hand or in CI)

```bash
npm run deploy:check          # one-shot: fail fast if live ≠ pushed
npm run deploy:check:wait     # wait up to 15 min for Cloudflare to publish
```

`scripts/deploy-check.sh` requires the **live `/build-meta.json` to name the commit being
shipped** — an identity gate, not a timestamp — and that the homepage serves a built
`/assets/` bundle, not the source `/src/main.tsx`. `.github/workflows/deploy.yml` runs it
on every push to `main` and goes red if a push ever fails to publish. It holds no
Cloudflare credentials: the push is the deploy, and this check only observes.

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

None is shipped: `VITE_PLAUSIBLE_DOMAIN` and `VITE_UMAMI_WEBSITE_ID` are both empty in the
production environment, so no script loads and every `trackEvent()` is a no-op. That is the
launch default, not an accident.

One module owns this — `src/utils/analytics.ts`, called once from `main.tsx`. It is gated on
`VITE_PRIVATE_PREVIEW` as well as on an ID, so a preview build is never counted. Whichever
variable is set wins:

| Provider | Variable | Script host |
|---|---|---|
| Plausible (hosted) | `VITE_PLAUSIBLE_DOMAIN=camtaylor.ca` | `https://plausible.io` |
| Umami (self-hosted, THOR) | `VITE_UMAMI_WEBSITE_ID=<website id>` | `https://analytics.giveabit.io` |

Both hosts are allowed in `script-src` and `connect-src` in `public/_headers`, and
`npm run quality` fails if either is missing from either directive — a blocked script looks
exactly like no analytics, which is how the site shipped for a release reporting nothing.
Setting the variable in the Cloudflare Pages **production environment** is the whole switch
(push = deploy); no code change, no redeploy command.

**Which provider is Kimi's call.** Cam's instruction is that she has a way of doing this; the
question is open in `docs/KIMI-HANDOFF.md`, alongside the two form variables below.

See `docs/PRIVATE-LAUNCH-GATE.md` for the pre/post-launch checklist and
`docs/KIMI-HANDOFF.md` for session state.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
