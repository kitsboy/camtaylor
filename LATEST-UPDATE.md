# camtaylor — Last Updated 2026-10-01

- **Umami analytics ON** — defaulted `UMAMI_WEBSITE_ID` (80ee8493-…) in site.ts so the
  runtime-gated loader reports to HQ (analytics.giveabit.io) in production. Matches the
  sibling sites. Updated public.spec.ts to assert the Umami tracker loads.
- Mobile 390px subpage overflow fixed (legal-footer wraps).
- Dependencies hardened: react-router 7.18.4, postcss 8.5.28, nanoid 3.3.19 — 0 audit vulns.
- Deployment rules consolidated into docs/DEPLOYMENT-PROTOCOL.md (single source of truth);
  added `npm run verify` gate; lint 0 warnings / 0 errors.

Commit: see `git log -1`