# camtaylor — Commit, Push & Deploy Protocol

**Owner:** Cam (decision pair: Cam + Kimi). Any agent — Kimi, Buffy, Grok, or another LLM — may commit, push, and deploy.
**Last updated:** 2026-09-25 by Kimi.

This is the single source of truth for how work lands on camtaylor. Read it before
committing, pushing, or deploying anything.

---

## 1. The golden rules

1. **Push = deploy.** camtaylor is connected to Cloudflare Pages via Git. Every push to
   `main` builds and publishes automatically. There is no separate deploy step and no
   deploy gate — the push IS the deploy.
2. **`main` is the only published line.** Everything that goes live comes from `main`.
3. **Any agent may ship.** Kimi, Buffy, Grok, or any other LLM can commit and push to
   `main`. No single agent "owns" the deployment.
4. **Commit small, push often.** One coherent unit per commit. Never batch unrelated work
   into one push, and never hold a finished unit waiting for a "final" push.
5. **Verify before you claim done.** A push is not done until the live URL serves the new
   build.

---

## 2. The commit → push → deploy flow

### Step 1 — Work on `main`
```bash
git checkout main
git pull origin main        # start from the latest published state
```

### Step 2 — Make one coherent change, then commit it
```bash
git add <the files for THIS unit only>
git commit -m "type(scope): short description"
```
- One logical change per commit (a fix, a feature, a doc update).
- Do not `git add .` and sweep everything in.
- Commit message style: `feat(scope): ...`, `fix(scope): ...`, `docs: ...`, `style: ...`.

### Step 3 — Push to `origin/main` — this deploys
```bash
git push origin main
```
- Cloudflare Pages builds and publishes on every push to `main`. No further action needed.
- Push as soon as a unit is committed. Do not wait to batch.
- If the push is rejected (someone else pushed), `git pull --rebase origin main`, then push again.

### Step 4 — Verify live (the push is not done until this passes)
```bash
curl -sI https://camtaylor.ca | grep -i server        # expect Cloudflare
curl -s https://camtaylor.ca | grep -o '<title>[^<]*</title>'
# expect: <title>Cam Taylor | Sherpa — Deal Architecture & Venture Operations</title>
```
- Check BOTH `camtaylor.ca` and `www.camtaylor.ca`.
- Confirm the live page serves a **built bundle** (`/assets/index-*.js`), not the source
  file (`/src/main.tsx`). If you see `/src/main.tsx`, the build output directory is wrong.
- Only then is the work "done".

---

## 3. What every agent must read before any session

In this order:

1. **`AGENTS.md`** — mandatory entry point.
2. **`GROK-SESSION-PROTOCOL.md`** — session conventions.
3. **`docs/KIMI-HANDOFF.md`** — read the **top section first** (newest handoff). This is where
   the latest live state and open items are recorded.
4. **`docs/DEPLOYMENT.md`** — the deployment runbook.
5. **`docs/COMMIT-PUSH-PROTOCOL.md`** — this file. The commit/push/deploy rules.

---

## 4. What no agent must do

- **Do not attach or detach domains** — that is Cam's dashboard action (no wrangler DNS scope).
- **Do not delete the old site** (EZP.net WordPress) — Cam handles that himself, later.
- **Do not force-push** `origin/main` without Cam's explicit approval.
- **Do not leave the working tree dirty** at the end of a session — commit or stash.
- **Do not add a second deployer** (e.g. a `wrangler pages deploy` step in CI). Cloudflare
  Pages Git integration is the ONE deployer. Two builders racing for one URL is what caused
  the "push looks deployed but the old build is still served" bug.

---

## 5. End-of-session checklist

- [ ] Working tree clean (`git status` shows nothing uncommitted).
- [ ] All coherent units committed and pushed to `origin/main`.
- [ ] `docs/KIMI-HANDOFF.md` top section updated with what was done + what's next.
- [ ] `LATEST-UPDATE.md` updated.
- [ ] Live URL verified if anything was deployed.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
