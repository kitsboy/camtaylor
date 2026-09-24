# camtaylor — Commit, Push & Deploy Protocol

**Owner:** Kimi (Cam + Kimi are the decision pair). Buffy is a subordinate coding tool.
**Last updated:** 2026-09-24 by Kimi.

This is the single source of truth for how work lands on camtaylor. Read it before
committing, pushing, or deploying anything.

---

## 1. The golden rules

1. **Kimi owns the deployment.** Buffy may write code, but she does not decide what ships.
2. **`main` is the only published line.** Everything that goes live comes from `main`.
3. **One deploy command:** `npm run deploy:live` from `main`. There is no other path to production.
4. **Commit small, push often.** One coherent unit per commit. Never batch unrelated work into
   one push, and never hold a finished unit waiting for a "final" push.
5. **Verify before you claim done.** A push is not done until the live URL serves the new build.

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

### Step 3 — Push to `origin/main`
```bash
git push origin main
```
- Push as soon as a unit is committed. Do not wait to batch.
- If the push is rejected (someone else pushed), `git pull --rebase origin main`, then push again.

### Step 4 — Deploy (only when you intend to go live)
```bash
npm run test && npm run quality   # verify first
npm run deploy:live               # build with VITE_PRIVATE_PREVIEW=false, deploy to Pages
```
- `deploy:live` is the ONLY deploy command. It builds public and uploads `dist/` to the
  Cloudflare Pages project `camtaylor`.
- `npm run deploy` (no `:live`) keeps the private preview on — use it only for a dry run.

### Step 5 — Verify live
```bash
curl -sI https://camtaylor.ca | grep -i server        # expect Cloudflare
curl -s https://camtaylor.ca | grep -o '<title>[^<]*</title>'
# expect: <title>Cam Taylor | Sherpa — Deal Architecture & Venture Operations</title>
```
- Check BOTH `camtaylor.ca` and `www.camtaylor.ca`.
- Only then is the work "done".

---

## 3. What Buffy must read before any session

In this order:

1. **`AGENTS.md`** — mandatory entry point.
2. **`GROK-SESSION-PROTOCOL.md`** — session conventions.
3. **`docs/KIMI-HANDOFF.md`** — read the **top section first** (newest handoff). This is where
   Kimi records ownership, live state, and open items.
4. **`docs/DEPLOYMENT.md`** — the deployment runbook.
5. **`docs/COMMIT-PUSH-PROTOCOL.md`** — this file. The commit/push/deploy rules.

---

## 4. What Buffy must NOT do

- **Do not claim ownership** of the deployment or the project. Kimi owns it.
- **Do not deploy** with any command other than `npm run deploy:live` from `main`.
- **Do not attach or detach domains** — that is Cam's dashboard action (no wrangler DNS scope).
- **Do not delete the old site** (EZP.net WordPress) — Cam handles that himself, later.
- **Do not force-push** `origin/main` without Cam's explicit approval.
- **Do not leave the working tree dirty** at the end of a session — commit or stash.

---

## 5. End-of-session checklist

- [ ] Working tree clean (`git status` shows nothing uncommitted).
- [ ] All coherent units committed and pushed to `origin/main`.
- [ ] `docs/KIMI-HANDOFF.md` top section updated with what was done + what's next.
- [ ] `LATEST-UPDATE.md` updated.
- [ ] Live URL verified if anything was deployed.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
