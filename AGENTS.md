# AGENTS.md — Mandatory Read

Before every session, read these in order. This is not optional.

1. **`GROK-SESSION-PROTOCOL.md`** — session conventions.
2. **`docs/KIMI-HANDOFF.md`** — read the **top section first** (newest handoff). Kimi records
   ownership, live state, and open items here.
3. **`docs/DEPLOYMENT.md`** — the deployment runbook.
4. **`docs/COMMIT-PUSH-PROTOCOL.md`** — the commit/push/deploy rules.

**Standing rule:** Push = deploy. camtaylor is Git-connected to Cloudflare Pages, so every
push to `main` builds and publishes automatically. Any agent (Kimi, Buffy, Grok, or another
LLM) may commit and push to `main` — no single agent owns the deployment. `main` is the only
published line. Commit small, push often. Do not attach/detach domains, do not delete the old
EZP site, do not force-push `main` without Cam's approval, do not add a second deployer.
Leave the tree clean at session end.
