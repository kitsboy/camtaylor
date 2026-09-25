# camtaylor — Last Updated 2026-09-25 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the Sherpa site.

**Latest (Buffy, the four follow-ups — four commits, each pushed on its own):**

1. **`9f17368` — `body { overflow-x: hidden }` is gone.** It worked by hiding the scrollbar, not the
   overflow, so anything that overflowed next would have been invisible too. What it was hiding: **one
   decorative tint in the hero**, bleeding 105–124px past the right edge at 900–1280px — not content.
   Bounded at its source now. The overflow guard runs at **eight widths, 1440 down to 320** (it only
   ran at phones before, because of that rule). `over=0` at every width 320→1920 and on four other pages.
2. **`0cfdb74` — the contrast instrument can no longer lie two ways.** It used to take the most common
   pixel inside a text box from a raster **with the text still painted**, so a tight line-height read as
   ink-against-ink, 1:1 — the false failure `span.waypoint-camp` produced last session, and a silent
   pass in the other direction. Text is blanked before the raster now. It also settled no frame before
   a theme flip, the same fault that made the mobile bar guard vacuous. Contrast file **46s → 17.7s**.
3. **`308572a` — the "Start a conversation" pill is back on phones**, gated so only one call to action
   is lit at a time: down-scroll hands it to the bar's Connect, up-scroll hands it back.
4. **`2b8ec90` — the phone page is shorter, not just navigable: 23,166px → 19,973px (27.4 → 23.7
   screens).** A phone shows the first three items of family routes, agents, the proof links and the
   dispatch timeline, and holds the rest behind one counted control — *"7 more routes · tap to unfold"*.
   Content stays mounted and `<details>` does the disclosure, so keyboard and screen readers keep it.
   Desktop renders nothing at all and is unchanged at 15,067px.

Full suite **69/69** (was 66), quality ✓, `tsc` ✓, lint 0 errors. Every new guard was canaried against
the bug it exists for. Detail and measurements in `docs/KIMI-HANDOFF.md`.

**⚠️ Corrected claim of my own:** I first measured a **+54px desktop growth** from the fold work. It is
not real — the current build reads 15,067px, the route-sheet number exactly. That "before" table was
captured while the webfont was still settling, which moves section heights by precisely this amount.

**⚠️ Needs a view from Cam:** the pill/bar lane switch (one line to show both at once if the double
front door is preferred), and the fold's threshold of three items before the control.

**Open items for Kimi / Cam:** the no-mouse pass on the live build (focus rings on ink *and* acid
surfaces, tab order, an `aria-live` on the rotating route status, arrow keys for the carousel, a skip
link that lands right) — **still unrun, and now the biggest untested surface**; the fold numbers on
real hardware at 375/414px; the hero and backdrop art read by eye; the six seed dispatches reviewed;
one contact form submission reaching the real inbox.

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair.
Buffy is a subordinate coding tool, NOT the boss.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Cloudflare Pages project
`camtaylor`.

---

## Next three UI upgrades — Buffy's proposal

**1. A no-mouse pass on the live build. (my pick — the least verified surface left)**
The most novel UI here is the least verified without a mouse: the custom cursor, the hero canvas, the
scroll reveals, the rotating route status, the carousel, the loading screen. Concrete: a visible focus
ring on **both** ink and acid surfaces; a tab order with no traps; an `aria-live` on the rotating status
(it changes every few seconds and is silent to a screen reader); arrow-key operation for the carousel;
a skip link that lands on the right target; and reveals that can never leave content invisible to a
keyboard user. That last one is not hypothetical — the carousel was doing exactly that until `f0fed9d`,
and the fold raised the same shape again this session. Enforced by a keyboard test plus an axe scan.

**2. The phone page is still 23.7 screens — make the sections themselves shorter.**
The fold bought 3.7 screens from the list tails. What is left is structural: the *prose* depth of
sections that are not lists, the waypoint bands, and the route sheet's 459px. Targets: the hero on a
phone, the manifesto, the contact section's several screens of form preamble, and whether the twelve
waypoint bands earn their height when the sheet already names all twelve. Honest constraint: each of
these is a Cam decision about copy and structure, not a CSS fix, and the waypoint bands are
load-bearing in tests.

**3. Make the instruments prove themselves, permanently.**
Four separate times now a green check has hidden a real fault: the tight-line-height blind spot, the
fixed bar that `scrollWidth` cannot see, the theme flip that lands in two frames, and a fixture that
could not fail. Each was fixed by hand and canaried by hand. Worth making permanent: a `canary/`
mode in the suite that re-inserts each known bug and asserts the matching guard goes red, and a
documented list of what each guard structurally cannot see (fixed elements, `overflow` ancestors,
mid-transition frames). Most compelling because it is the thing that has actually been costing us —
the faults above were all found late, by eye, and twice by the *user*.

My pick is **#1**, then **#3**.
