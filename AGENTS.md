# AGENTS.md — Mandatory Read

**Read `docs/DEPLOYMENT-PROTOCOL.md` before every session. It is the single source of
truth for how work lands on camtaylor (commit → push → deploy). Follow it. This is not optional.**

The one-line model: **push to `main` = deploy.** camtaylor is Git-connected to Cloudflare
Pages, so every push to `main` builds and publishes automatically. Any agent (Kimi, Buffy,
Grok, HERMES, or another LLM) may commit and push to `main` — no single agent owns the
deployment. `main` is the only published line. Commit small, push often.

Non-negotiables (full detail in the protocol):
- Always `git pull --rebase origin main` before you begin and before you push.
- Never force-push `main`. If rejected, pull --rebase, resolve, push again.
- Never `git add .` — one coherent unit per commit.
- Do not attach/detach domains, do not delete the old EZP site, do not add a second deployer.
- Leave the tree clean at session end.

For session state and open items, read the newest section of `docs/KIMI-HANDOFF.md`.
