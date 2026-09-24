# camtaylor — Last Updated 2026-09-24 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the new Sherpa site (verified 200).

**Latest (Buffy, UI pass):** Text contrast raised to WCAG AA across the site and a
contrast guard added (`tests/contrast.spec.ts`, 45/45 tests green). Failing text included
`--text-muted` (3.60:1), the command deck boot log (2.23:1), the section kicker on the dark
shells (1.88:1) and the footer ecosystem chips (1.39:1). Commit `8ec846a`. Still open, UI:
night-theme contrast, keyboard/screen-reader pass, reduced-motion pass, 375/414px and
desktop QA. Full detail in `docs/KIMI-HANDOFF.md` (Session — 2026-09-24, UI legibility pass).

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair. Buffy (Freebuff desktop agent) is a subordinate coding tool, NOT the boss. Any prior note claiming "Buffy owns the deployment" or "camtaylor.pages.dev is Buffy's deployment" was Buffy's own self-framing and is superseded.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Production = Cloudflare Pages project `camtaylor`.

**Old site:** EZP.net WordPress — Cam deletes it himself later, no rush. Do not chase the EZP teardown.

**Next (next week, no rush):** Cam has another site to move over with Kimi's help. Also: set GitHub default branch to `main` (`origin/HEAD` still points at `talent`).
