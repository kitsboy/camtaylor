# camtaylor — Last Updated 2026-09-25 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the Sherpa site.

**Latest (Buffy, touch & motion + the route sheet):** Three commits. (1) The ventures carousel
was **permanently stranding cards at `opacity: 0`** after a fast flick, because each card revealed
itself and a flick jumped past it — the section now drives the cascade. (2) A full sweep of every
standalone control at 320/390px found **86 undersized tap targets on a phone, now 0** (the old test
measured 13 curated selectors at a 40px threshold, which is why 102 of 194 were passing while too
small); ambient motion is parked by default and reduced motion now neutralises every animation —
**13 loops were still running, now 0**. (3) A new **route sheet** lists all twelve waypoints below
the ticker with the active camp marked; reaching Contact from the top of the phone page went from
**21.5 screens of scrolling to one tap**. Full suite **49/49** green. Detail in `docs/KIMI-HANDOFF.md`.

**⚠️ Open — decide before the next deploy:** the phone bottom bar renders **10** buttons at the new
44px floor, which is **440px wide in a 320–390px viewport**. At 390px the last two — *Ventures* and
*Connect* — now sit **entirely off-screen**; production today avoids this only by shrinking buttons
to 22–33px, so this is the trade my touch pass made. Neither existing guard can see it: the bar is
`position: fixed`, so `document.scrollingElement.scrollWidth` is unaffected (still exactly 320), and
the 44px sweep passes because each button *is* 44px — the row overflows, not the button. Fix needs a
**count decision from Cam**: the bar holds 6 items at 320px, so which six of the ten?

**Still true:** the route sheet made the wall *navigable*, not *shorter* — the phone page is still
23,166px (~27 screens) and every section still dumps its full depth.

**Also flagged, not fixed (from the type-system pass):** the contrast guard has a **blind spot** for
tight-line-height labels; and production has **pre-existing** horizontal overflow (74–164px at
desktop widths) hidden by `body { overflow-x: hidden }`, where content is genuinely parked off-screen.

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair.
Buffy is a subordinate coding tool, NOT the boss.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Cloudflare Pages project
`camtaylor`.
