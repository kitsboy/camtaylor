# camtaylor — Last Updated 2026-09-25 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the Sherpa site.

**Latest (Buffy, mobile navigation):** Cam called the phone navigation "very messy" and it had a
number behind it — the bottom bar rendered **ten** items, and ten items at the 44px touch floor is
a **440px row inside a 320–430px viewport**, which put **Ventures and Connect off the right edge of
a 390px phone**. No guard could see it: a `position: fixed` bar adds nothing to `scrollWidth`, and
the 44px sweep passed because each *button* was 44px — the row was what overflowed. Now:

- **One route bar**: six camps (About · Expertise · Ventures · Proof · Log · Connect — Cam's pick),
  **52.7px per item at 320px**, nothing truncated, a lit marker on the camp you are standing on, a
  hairline for position on the whole route, and Connect as the bar's own acid call to action.
- **One route sheet**: the drawer is now all twelve camps in three legs with index, altitude and
  conditions — 1228px of stops that scrolls inside an 844px screen, stacked under the masthead so
  the close button stays reachable.
- **Two real faults fixed on the way**: the scroll lock was setting `touch-action: none` on `<body>`,
  which made the tall menu *unswipeable*; and the active bar label was `--green` in both themes —
  **1.59:1 on the night bar**. `--mobile-nav-height` is now the bar's measured 53px, not a 62px
  number nothing had checked.

Full suite **55/55**, and both new guards were canaried against the bugs they exist for. Detail,
measurements and two things for Kimi in `docs/KIMI-HANDOFF.md`.

**⚠️ Needs a view from Cam:** the floating "Start a conversation" pill is **parked on phones** (one
commented line in `mobile.css`, restore instructions in it) because Connect is now permanent in the
bar. It was only ever a phone element, so desktop is unaffected.

**⚠️ Instrument warning, second time:** a **theme flip does not land in one frame** — tokens resolve,
the bar's background repaints, the button's colour transitions. Measure inside that window and you
read warm ink on a warm background, which passes while the night theme is broken. My first version of
the new guard was vacuous for exactly this reason. Same family as the tight-line-height blind spot
below; `tests/contrast.spec.ts` should be assumed to share it.

**Also flagged, not fixed:** the contrast probe's blind spot for tight-line-height labels; and
production has **pre-existing** horizontal overflow (74–164px at desktop widths) hidden by
`body { overflow-x: hidden }`, where content is genuinely parked off-screen. The phone page is also
still 23,166px (~27 screens) — the route sheet made the wall navigable, not shorter.

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair.
Buffy is a subordinate coding tool, NOT the boss.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Cloudflare Pages project
`camtaylor`.
