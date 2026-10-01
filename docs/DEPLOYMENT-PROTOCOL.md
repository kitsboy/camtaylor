# camtaylor — Deployment Protocol (SINGLE SOURCE OF TRUTH)

**Owner:** Cam. Any agent — Kimi, Buffy, Grok, HERMES, or any other LLM — may commit,
push, and deploy. There is no single "deploy owner."
**Last updated:** 2026-10-01 by HERMES (consolidated from COMMIT-PUSH-PROTOCOL + DEPLOYMENT + PRIVATE-LAUNCH-GATE).

> **Read this file before ANY session. It is the only deployment doc you need.**
> `docs/DEPLOYMENT.md` (runbook details), `docs/PRIVATE-LAUNCH-GATE.md` (launch checklist),
> and `docs/COMMIT-PUSH-PROTOCOL.md` (superseded) are kept for reference only.

---

## 0. The one-line model

**Push to `main` = deploy.** camtaylor is Git-connected to Cloudflare Pages. Every push
to `main` builds and publishes automatically. There is no separate deploy step, no deploy
gate, and no second deployer. **The push IS the deploy.**

---

## 1. Golden rules (memorize these)

1. **`main` is the only published line.** Everything that goes live comes from `main`.
2. **Any agent may ship.** Commit small, push often. Never batch unrelated work into one push.
3. **Always start from the latest `main`.** `git pull --rebase origin main` before you begin
   and again before you push. **Never work from a stale clone** — another agent may have
   pushed (or force-pushed) since you last pulled.
4. **Never force-push `main`.** If your push is rejected, `git pull --rebase origin main`,
   resolve, then push again. Force-pushing is what corrupts shared history.
5. **Verify before you claim done.** A push is not done until the live URL serves the new build.
6. **Leave the tree clean** at session end (commit or stash everything).

---

## 2. The exact flow (copy-paste, no thinking)

### Step 1 — Start from the latest published state
```bash
cd ~/Projects/camtaylor
git checkout main
git pull --rebase origin main
```

### Step 2 — Make ONE coherent change, then commit it
```bash
git add <the files for THIS unit only>   # never `git add .`
git commit -m "type(scope): short description"
```
- One logical change per commit (a fix, a feature, a doc update).
- Message style: `feat(scope): …`, `fix(scope): …`, `docs: …`, `style: …`, `chore: …`.

### Step 3 — Verify locally before pushing (cheap, catches most mistakes)
```bash
npm run lint && npm run build && npm test
```
- `lint` → 0 errors. `build` → clean. `test` → Playwright suite green.
- If you changed dependencies: `npm audit` should report 0 high-severity vulns.

### Step 4 — Pull again, then push (this deploys)
```bash
git pull --rebase origin main
git push origin main
```
- Cloudflare Pages builds and publishes on every push to `main`. No further action needed.
- **If the push is rejected** (someone else pushed): `git pull --rebase origin main`, resolve
  conflicts, then `git push origin main` again. Do NOT force-push.

### Step 5 — Verify live (the push is not done until this passes)
```bash
curl -sI https://camtaylor.ca | grep -i server        # expect: Cloudflare
curl -s https://camtaylor.ca | grep -o '<title>[^<]*</title>'
# expect: <title>Cam Taylor | Sherpa — Deal Architecture & Venture Operations</title>
```
- Check BOTH `camtaylor.ca` and `www.camtaylor.ca`.
- Confirm the live page serves a **built bundle** (`/assets/index-*.js`), NOT the source
  (`/src/main.tsx`). If you see `/src/main.tsx`, the build output dir is wrong.
- Only then is the work "done."

---

## 3. The failure mode you WILL hit (and how to survive it)

**Symptom:** `git push origin main` → `! [rejected] ... (fetch first)` or
`Updates were rejected because the remote contains work that you do not have locally.`

**Cause:** another agent pushed (or force-pushed) `main` since your last pull. Your local
`main` is now behind/divergent.

**Fix — never force-push:**
```bash
git pull --rebase origin main     # replay your commits on top of the latest main
# resolve any conflicts, then:
git push origin main
```

**If you find yourself on a detached/divergent branch** (e.g. you were told to "reconcile"):
1. `git fetch origin`
2. `git checkout -b <your-work-branch> origin/main` — start fresh from the live state
3. Re-apply only the changes that are still valid, commit, and open a PR to `main`.
4. Do NOT merge a stale local `main` over the live one.

---

## 4. What no agent must do

- **Do not attach or detach domains** — that is Cam's dashboard action (no wrangler DNS scope).
- **Do not delete the old site** (EZP.net WordPress) — Cam handles that himself, later.
- **Do not force-push `origin/main`** without Cam's explicit approval.
- **Do not leave the working tree dirty** at the end of a session — commit or stash.
- **Do not add a second deployer** (e.g. a `wrangler pages deploy` step in CI). Cloudflare
  Pages Git integration is the ONE deployer. Two builders racing for one URL caused the
  "push looks deployed but the old build is still served" bug.
- **Do not `git add .`** and sweep everything into one commit.

---

## 5. End-of-session checklist

- [ ] Working tree clean (`git status` shows nothing uncommitted).
- [ ] All coherent units committed and pushed to `origin/main`.
- [ ] `docs/KIMI-HANDOFF.md` top section updated with what was done + what's next.
- [ ] `LATEST-UPDATE.md` updated.
- [ ] Live URL verified if anything was deployed.

---

## 6. Reference (read only if you need the details)

| File | What it's for |
|------|---------------|
| `docs/DEPLOYMENT.md` | Full runbook: build settings, domain switch, rollback, analytics |
| `docs/PRIVATE-LAUNCH-GATE.md` | Pre/post-launch checklist (status: PUBLISHING) |
| `docs/COMMIT-PUSH-PROTOCOL.md` | Superseded by this file — kept for history |
| `docs/KIMI-HANDOFF.md` | Session state + open items (read newest section first) |

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
