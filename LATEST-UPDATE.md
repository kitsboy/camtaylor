# camtaylor — Last Updated 2026-09-24 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the new Sherpa site (verified 200).

**Latest (Buffy, UI pass):** Text contrast raised to WCAG AA across the site in **both
themes**, and a contrast guard added (`tests/contrast.spec.ts`, 45/45 green, warm + night).
The warm-theme fixes covered `--text-muted` (3.60:1), the command deck boot log (2.23:1),
the dark-shell section kicker (1.88:1) and the footer ecosystem chips (1.39:1). Extending the
guard to night found **157 failures**: the `body` backdrop was a hard-coded warm gradient that
never flipped, and `--paper` was never themed, so night mode showed light text on warm
surfaces. Both fixed, plus the light-theme accent literals that had no night variant.
Commits `8ec846a`, `2cf6cca`. Still open, UI: keyboard/screen-reader pass, reduced-motion
pass, 375/414px and desktop QA. Full detail in `docs/KIMI-HANDOFF.md` (Session — 2026-09-24).

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair. Buffy (Freebuff desktop agent) is a subordinate coding tool, NOT the boss. Any prior note claiming "Buffy owns the deployment" or "camtaylor.pages.dev is Buffy's deployment" was Buffy's own self-framing and is superseded.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Production = Cloudflare Pages project `camtaylor`.

**Old site:** EZP.net WordPress — Cam deletes it himself later, no rush. Do not chase the EZP teardown.

**Next (next week, no rush):** Cam has another site to move over with Kimi's help. Also: set GitHub default branch to `main` (`origin/HEAD` still points at `talent`).
