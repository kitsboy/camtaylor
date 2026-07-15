# Deployment — camtaylor.ca

**Production (planned):** https://camtaylor.ca  
**GitHub:** https://github.com/kitsboy/camtaylor (branch: `main`)  
**Primary host (planned):** Cloudflare Pages — configs ready in `public/_headers`, `public/_redirects`  
**Alternates:** Netlify (`netlify.toml`), Vercel (`vercel.json`)

## Local-first policy

Do **not** deploy until Cam explicitly approves. Build and test locally:

```bash
npm run build
npm run preview
npm run test
```

## Cloudflare Pages (recommended)

1. Connect repo `kitsboy/camtaylor` in Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Output directory: `dist`
4. SPA routing: `public/_redirects` (`/* /index.html 200`)
5. Security headers: `public/_headers`
6. Environment variables:
   - `VITE_FORMSPREE_FORM_ID=xykqodnk`
   - `VITE_PLAUSIBLE_DOMAIN=camtaylor.ca` (optional)

## Formspree

Contact form requires `VITE_FORMSPREE_FORM_ID` at build time. Default fallback in `src/data/site.ts` is `xykqodnk`.

## Pre-deploy checklist

- [ ] `npm run build` clean
- [ ] `npm run test` — Playwright smoke tests pass
- [ ] Real device QA (iOS Safari, Android Chrome)
- [ ] Optional: Calendly URL, PGP fingerprint in `src/data/site.ts`

See `docs/KIMI-HANDOFF.md` for latest session state.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*