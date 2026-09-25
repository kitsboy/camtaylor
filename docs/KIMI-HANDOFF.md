## Session — 2026-09-25 (the phone page by prose depth: hero, manifesto, contact)

**Machine:** M3 (Buffy) · **Project:** camtaylor

Cam: *"Shrink the phone page further by cutting the prose depth of the hero, manifesto and contact
sections."* Three batches, three commits, each pushed on its own, plus one bug the work exposed.

### The numbers

All at 390 × 844, folds closed, measured on the built site.

| | before | after |
|---|---|---|
| hero | 1,329px | **1,072px** |
| manifesto | 1,280px | **1,082px** |
| contact | 2,450px | **1,672px** |
| **phone page** | 19,973px · 23.7 screens | **18,739px · 22.2 screens** |
| desktop page | 15,067px | 15,067px (untouched) |

1,234px of phone scrolling, or about 1.5 screens. Nothing was deleted: every fact, quote, link and
principle is still there, and on a desktop nothing changed at all.

### What was actually costing the height

**Hero — `cd310bb`, 1,329 → 1,072.** The chrome was spending rows:

- **metrics 182 → 111.** The two `.metric-divider` elements are *grid items*, so three metrics and two
dividers in a single-column grid laid out as **five rows — two of them holding nothing but a 1px rule
and the gaps around it**. They are `display: none` on a phone now, and each metric is one line, label
beside value. (`index.css` stacks the label over the value; that needed an explicit
`flex-direction: row`.)
- **route strip 98 → 40.** Its twelve bars are `aria-hidden` and their animation is already parked;
they were what pushed the label and the value onto rows of their own.
- **actions 164 → 120.** The primary keeps a row to itself, the two secondaries share one, all still
48px tall.
- **video 218 → 182.** 16/9 was 181px of the screen for a poster; 21/9 crops it (`object-fit: cover`,
so it crops rather than distorts).

**Manifesto — `ea3dbf6`, 1,280 → 1,082.** Chrome, not words: card padding 28 → 20px, the 40px icon
block → 34, description line-height 1.65 → 1.55, and the section padding from `--section-gap`
(**67px at this viewport height, top and bottom**) → 46. Cards 229 → 197 each, quote 188 → 169.

**Contact — `7f5d250`, 2,450 → 1,672.** The sidebar was 1,028px and **largely repeats the page**: the
spotlight quote is in the testimonials section, "How it works" repeats the delivery note directly
below it, the Nostr card repeats the footer, and "Based in" repeats the hero's own meta line. On a
phone the sidebar now shows what a reader actually uses — what the handling promises, the address,
and a button to copy it (306px) — and holds the other four cards behind one counted control. Opening
it restores 2,441px and leaves nothing invisible.

### The finding that made this take three files

**A phone rule only works if it is in the file that defines the property last.** The import order is
`index.css` → `mobile.css` → `upgrades.css` → `bold-modern.css` → `footer.css` → `touch.css`, so
anything unscoped in a later file beats a phone media query in an earlier one. Three rules in the
repo are dead for exactly this reason, and I only found them because I tried to extend them:

- `mobile.css`'s `.hero-shell { padding: 24px 18px }` — `bold-modern.css` redefines `.hero-shell`
  unscoped (a `clamp()`), so the phone padding has never applied;
- `index.css`'s `.manifesto-section { padding: 70px 0 }` and `.contact-section { padding: 70px 0 }` —
  `upgrades.css` sets both from `--section-gap`;
- `mobile.css`'s `.hero-metrics` grid rule lost the `display: grid` I assumed it still had, and
  `index.css`'s `.metric-item { flex-direction: column }` outlived my first attempt to un-stack it.

So the hero and manifesto rules went into `bold-modern.css` (after everything that defines them), the
contact container rules stayed in `mobile.css` (where nothing later contests them), and the section
padding had to go to `bold-modern.css`. **Suggestion for the next pass: pick one home for responsive
overrides and enforce it, or write a check that reports which rule wins for a selector + property.**
Right now "where does this rule go" is a research question, and the answer is not the obvious file.

### The bug this exposed — `ed77b03`

The featured video entered from `x: 28` **inside a shell that clips its overflow**. So for the first
second of every load the frame's right edge was cut, and the shell's own `scrollWidth` sat **20px past
its `clientWidth`** while the spring ran. It passed the masthead test only because the shell's padding
was 22px and the shift was 20px — two pixels of slack, with no reason for the two numbers to be
related. Narrowing that padding for the hero took the slack away and the test went red.

Fixed by entering from below (`y: 18, scale: 0.97`), which cannot overflow sideways on any frame.
Verified by sampling the shell every 80ms across the whole entrance at 430, 390 and 320px: the widest
child is never past the content edge (worst −1px, worst scrollWidth delta 0).

**And the test now says why it failed.** Both overflow assertions print the width, the pixel count and
the offending element. The old message was "hero shell overflows at 430px", which is the kind of
failure that gets a threshold edited instead of a bug fixed — I chased it with hand-rolled probes for
longer than it took to fix.

### Guards

- The masthead test's assertions now carry measurements (above).
- **New: a phone length budget** (`device-qa.spec.ts`) — the page must stay under 20,000px with folds
  closed. Length is the thing that comes back, and nothing else in the suite can see it. Canaried:
  disabling the folds takes the page to 22,636px and the test fails with "26.8 screens" in the
  message. The ceiling is deliberately ~6% loose, so it is a question ("was this worth a screen?"),
  not a target to shave.
- The existing fold test now covers five folds, including the contact sidebar's.

### Verification

- `npm run quality` ✓ · `npx tsc -b` ✓ · `npx eslint .` 0 errors (1 pre-existing `ThemeContext`
  fast-refresh warning)
- **`npx playwright test` — 70/70** (was 69)
- Every measurement above was taken on the built site at 390px, and the desktop number was re-checked
  after each batch: **15,067px every time**.

### Git state

`cd310bb` · `ea3dbf6` · `ed77b03` · `7f5d250` — all pushed to `origin/main`, tree clean.
(`public/feed.xml` and `public/sitemap.xml` are rewritten by `prebuild` on every build and reverted
before each commit.)

### Decisions for Cam

- **The contact sidebar's visibility on a phone.** Four of its seven cards are now behind one tap.
  They repeat other parts of the page, which is why I picked those four — but the spotlight quote is
a testimonial, and a testimonial next to the form is doing sales work. Say the word and it moves back
above the fold (one line in `Contact.tsx`).
- **The video's entrance** changed from sliding in from the right to rising from below, on all widths.
  It is a visual change on desktop too, where the old one was being clipped anyway.
- **21/9 for the phone poster.** Cropping a 16/9 poster to 21/9 loses some of the frame. It is one
  line if you would rather keep 16/9 and pay the 43px.

### Next

Three proposals in `LATEST-UPDATE.md`, and the first one is measurable right now: **at 390 × 844 the
primary button ("See the Route") sits at 866px — 22px below the first screen — and the hero renders the
video poster *before* the name**, because `index.css` sets `.hero-video-wrap { order: -1 }` on phones.
So the first screen a phone reader gets is two location chips, a status chip, a rotating route line and
a video poster, with no name and no button.

## Session — 2026-09-25 (the four follow-ups: the layout stops lying, the instrument stops lying, one door at a time, and a shorter phone page)

**Machine:** M3 (Buffy) · **Project:** camtaylor

Cam: *"Let's do the suggested follow ups, all of them please, in batches, commit and push every time."*
Four batches, four commits, each pushed on its own. Two of the four turned out to be **the same kind of
finding**: a check that reported green while the thing it guards was wrong.

### Batch 1 — `9f17368` the crutch under the layout, removed

`body { overflow-x: hidden }` is gone. It was there because the page overflowed, and it worked by
suppressing the scrollbar rather than the overflow — so **anything that overflowed next would be
invisible too**, and the overflow guard only ran at 320 and 390px.

What it was actually hiding, now pinned down: **one decorative tint in the hero, bleeding 105–124px
past the right edge at 900–1280px.** Nothing else. My earlier note said "74–164px of overflow" and
implied it was spread across the page; the honest version is that the *width* was that one tint and
the page content never exceeded the viewport at all. It is bounded at its source now
(`.glow-field` in `Hero.tsx` / `index.css`) rather than clipped at the body.

One consequence worth knowing, verified in the browser: with `overflow-x: hidden` on `<body>`, the
computed `overflow-y` on body becomes **`auto`** — the rule was also silently making `<body>` a
second scroll container. Removing it leaves `<body>` as plain `visible`, with `document.scrollingElement`
still `<html>` either way.

**The guard now runs at `1440, 1280, 1024, 900, 768, 430, 390, 320`.** Two exclusions, both
deliberate and both documented in the test: anything inside an `overflow: hidden` ancestor (clipped on
purpose — the hero contour art, the ticker marquee), and `position: fixed` (which cannot extend the
document; the route bar has its own guard that measures the bar itself). A **left** bleed is allowed:
the about photo's offset and the contact honeypot both sit outside the left edge and cannot make a
page scroll sideways. Measured `over=0` at every width from 320→1920, and on the field guide, the 2026
page, a venture route and the 404.

### Batch 2 — `0cfdb74` the contrast instrument, two ways it could lie

`tests/contrast.spec.ts` is a pixel-sampling WCAG AA guard, and it had two faults, one loud and one
silent.

**1. It could sample the ink as the backdrop.** The backdrop for a text run was the most common pixel
*inside the element's own box*, read from a raster with the text still painted. That is only sound
while the background dominates the box. With a tight line-height the box is almost entirely glyph, so
the probe compared the ink with itself and reported **1:1** for text that was really 4.5:1 — which is
how `span.waypoint-camp` produced a false failure in the type-system session. In reverse, a blend
nobody ever sees is a **silent pass** over a label that is genuinely failing. The text is now blanked
in the raster before it is taken, so the pixels inside the box *are* the background; the sampler
buckets a 24×8 grid across the box and takes the modal colour.

**2. It could measure a frame mid-flip.** A theme change is not one frame: tokens resolve, the
background repaints, the text colour transitions. The audit now settles before it reads. This is the
same class of fault as the mobile bar guard last session, where a half-switched bar read as
warm-ink-on-warm-background and passed.

Runtime for the contrast file went **46s → 17.7s**. Both fixes are falsified by the instrument's own
regression test, at the bottom of the file: a 40px glyph clipped to a 26px box, `#767676` on white,
asserting the **number** (4.54:1, ±0.15) and that the backdrop reads `rgb(255, 255, 255)`. With the
blanking removed it fails on ink-against-ink. Worth recording: my first version of that fixture
**passed**, which proved nothing — it was not ink-dominated. A fixture that cannot fail is the same
problem as a guard that cannot fail.

### Batch 3 — `308572a` the pill, restored without a second front door

The "Start a conversation" pill is back on phones (it was only ever a phone element, so parking it in
the previous session removed a conversion surface). With Connect now permanent in the route bar, the
two were the same door in the same strip, so **exactly one is lit at a time**: `StickyCta` publishes
which lane is showing on `<html data-cta="pill|bar">`, and the bar's Connect only carries the acid
treatment while the pill is away. Scrolling down hands the call to the bar; scrolling up hands it back
to the pill. The 44px floor and reduced-motion rules still hold for both.

### Batch 4 — `2b8ec90` the phone page, shorter rather than just navigable

The route sheet made the page *navigable*, not shorter: it was still **23,166px ≈ 27 screens**, and the
length was spread across four sections rather than sitting in one place, so no single rewrite
shortened it.

| 390px | before | after |
|---|---|---|
| page height | 23,166px | **19,973px** |
| screens of scrolling | 27.4 | **23.7** |
| fully unfolded | — | 23,472px (depth is still there, one tap away) |

A phone now shows the first three items of the long lists — **family routes, agents, the proof links
and the dispatch timeline** — and holds the rest behind one counted control: *"7 more routes · tap to
unfold"*. `<details>` does the disclosure, so keyboard and screen readers get it for free, and the
folded content **stays mounted**, so the list is in the DOM whether or not it is open. Desktop renders
nothing at all — no wrapper, no `<details>` — and the page is **15,067px, the route-sheet number
exactly**. (`SectionFold` returns its children straight through when the media query does not match;
splitting a two-column desktop list at an odd number would leave one card alone in its row.)

**The guard found a bug in the thing it was guarding, on its first run.** `SERVICES` has four areas
against `shown={3}`, so it was folding exactly one — a tap and a whole control to save one card —
under a label reading *"1 more areas"*. A fold now needs **two or more** items to exist at all.

Two traps recorded for whoever touches this next:

- **JSX eats the space.** `<span>{count}</span>` on one line and `more {noun} · …` on the next renders
  as **"7more routes"** — a newline between a tag and the text after it is dropped, not collapsed to a
  space. `{' '}` makes it explicit; the test's label assertion now catches it.
- **Reading a reveal mid-animation invents a fault.** The first measurement of the unfolded content
  found **13 items below full opacity**, worst 0.37, which looks exactly like the stranded cards from
  `f0fed9d`. After a 3s settle the minimum opacity across every fold is **1** — they were 400ms
  animations in flight. The test walks the page, then waits, and only then reads.

**A note on the fold's classnames, because it changes what a selector means.** To keep the folded
items in the layout the section already gave them, the folded body reuses the section's own grid class
and spans the grid (`grid-column: 1 / -1`). So on a phone `.family-grid`, `.agents-grid`, `.proof-grid`
and `.log-timeline` each match **twice** — the visible head and the folded body. The real timeline is
`ol.log-timeline`; the folded body is a `<div>`. `device-qa.spec.ts:266` was scoped to the `ol` for
this reason. Nothing else in `src/` or `tests/` queries those classes, and the nesting is visually
seamless (both grids are 2-column at ≤700px, and the folded body is full width inside the span).

### Verification

- `npm run quality` ✓ (4 assets, metadata, privacy gate, type-scale floor)
- `npx tsc -b` ✓ · `npx eslint .` 0 errors (1 pre-existing `ThemeContext.tsx` fast-refresh warning)
- **`npx playwright test` — 69/69** (was 66; the three new guards are the phone fold, the desktop
  no-op, and the fold's label/stranding invariants)
- Every new guard was canaried before it was trusted: re-inserting the hero tint fails the overflow
  test; allowing a one-item fold fails with *"1 more area … hides fewer than two items"*; letting the
  fold render on desktop fails with *"a desktop grew a disclosure"*; removing the raster blanking
  fails the contrast fixture on ink-against-ink.
- One correction to my own earlier note: I first measured a **+54px desktop growth** from this work.
  It is not real — the current build reads **15,067px**, identical to the route-sheet baseline. The
  "before" table in that comparison was captured with the webfont still settling, which moves section
  heights by exactly this amount. Proved by injecting `body { overflow-x: hidden }` at runtime: the
  heights do not change either way.

### Git state

`9f17368` · `0cfdb74` · `308572a` · `2b8ec90` — all four pushed to `origin/main`, `origin/main..HEAD`
empty, tree clean. (`public/feed.xml` and `public/sitemap.xml` are rewritten by `prebuild` on every
build and reverted before each commit; they are the only files you should expect to see dirty.)

### Decisions Cam may want to reverse

- The pill/bar lane switch. One line to make both visible at once if the double door is preferred.
- The fold shows three items before the control. That number is the whole trade: higher means a longer
  page, lower means a control per section.
- The fold is phone-only (`(max-width: 768px)`), on the reasoning that 15,067px is fine on a desktop.
  If the desktop should fold too, it is that one number in `SectionFold`, but the odd-number-split
  problem becomes real.

### Next

Three proposals are in `LATEST-UPDATE.md` under **Next three UI upgrades**. The short version: the
phone page is still 23.7 screens, the no-mouse pass on the live build is still unrun, and the fold
numbers want a look on real hardware.

## Session — 2026-09-25 (mobile navigation: one bar, one sheet, and a bar that fits)

**Machine:** M3 (Buffy) · **Project:** camtaylor

Cam: *"do huge upgrade to Mobile Navigation, its very messy"*. It was, and the mess had a
number behind it.

### The finding that started it

The bottom bar rendered **ten** items. At the 44px touch floor that is a **440px row** inside a
320–430px viewport:

| | 320px | 390px |
|---|---|---|
| before | buttons shrank to **22px**, last 2 already off-screen | buttons shrank to **33px**, all on screen |
| after `7e3b60e` (44px floor) | **3 of 10 off-screen** | **2 off-screen — Ventures and Connect** |

So the touch pass traded "too small to hit" for "off the screen", and **Connect — the only path to
the contact section from the bar — was the one that fell off the end**. Nothing caught it, and
that is the part worth keeping:

- the bar is `position: fixed`, so it contributes **nothing** to `document.scrollingElement.scrollWidth`
  (the overflow test still read exactly the viewport width, and passed);
- `body { overflow-x: hidden }` does not clip fixed elements either;
- the 44px sweep passed because **each button is 44px** — it was the *row* that overflowed.

Both existing guards were blind to a fixed bar *by construction*, not by threshold.

### Done — two commits

**1 — `80971c8` the scroll lock was freezing the very overlay it protected.**
`useBodyScrollLock` set `touch-action: none` on `<body>`. touch-action is not scoped to the
element it is set on — the browser intersects it with the ancestors of whatever is being touched
— so every descendant of the body became unscrollable by touch while an overlay was open. The
route sheet is taller than a phone screen, so the effect was a twelve-item list the reader could
not swipe. `overflow: hidden` is enough to hold the page still; overlays own their own scrolling
with `overscroll-behavior: contain`. This also affects the Command Deck and the venture modal,
which use the same hook.

**2 — `792c2ac` one bar, one sheet.**

- **The bar holds six camps** — About · Expertise · Ventures · Proof · Log · Connect (Cam's pick).
  `floor(320 / 44) = 7`, so six is the arithmetic, not the taste. Measured: **52.7px per item at
  320**, 71px at 430, nothing truncated, last right edge inside the viewport at every width, bar
  height **53px**, zero document overflow. Added a lit marker on the camp you are standing on, a
  hairline showing position on the whole route (six labels cannot say that on their own), and
  Connect as the bar's own acid control.
- **The drawer is now the route sheet**: all twelve camps in three legs (Lower route / Upper route /
  Summit push), each stop carrying its index, camp, altitude and conditions — the same content the
  in-page route sheet and the desktop rail use, from the same `waypoints.ts`. **1228px of stops in
  an 844px screen**, so it scrolls; smallest stop 56px tall. It stacks *under* the masthead (the
  sheet is a child of `.navbar`, so it stacks inside the navbar's own context — it painted over the
  brand and the close button until `.nav-container` was raised to `z-index: 2`).
- **The backdrop is gone.** The sheet is the whole screen, so nothing is left "outside" to click,
  and it was a second full-screen control named *Close menu* competing with the toggle's own name.
- **`--mobile-nav-height` is now 53px** — the bar's measured height — rather than 62px, a number
  nothing had ever checked against the element. It is the offset for the back-to-top button, the
  footer's clearance and every section's scroll-margin.

### Measurements (local production build, real browser)

| Signal | Before | After |
|---|---|---|
| Bar items | 10 | 6, all reachable at 320px |
| Row width vs viewport at 320px | 440px in 320px | 316px in 320px |
| Smallest item | 22px (production) / 44px off-screen (after the floor) | 52.7px, on screen |
| Sheet | 12 flat labels, no icons, no grouping | 3 legs, index + camp + altitude + conditions |
| Bar labels, night theme | `--green` active at **1.59:1** | `--text-primary`; inactive 4.4→**5.3:1** |

### ⚠️ Two things for Kimi to know

1. **The floating "Start a conversation" pill is parked on phones** (one line in `mobile.css`,
   commented with how to restore it). It was only ever a phone element — `index.css` turns it on
   inside `≤768px` — and with Connect permanent in the bar it was a second CTA for the same action
   in the same strip of screen, and the third fixed layer competing for it. **Cam may disagree**;
   the revert is deleting that one declaration and dropping the `--cta` class from the bar's last
   item so they are not the same door twice. On desktop nothing changed either way.
2. **A theme flip does not land in one frame, and that made my first version of the new contrast
   guard vacuous.** The tokens resolve immediately, the bar's own background repaints on the next
   frame, and the button's *colour* transitions. Measure inside that window and you read warm ink
   on the warm background — which passes, while the night theme is broken. The guard now waits
   before it reads, and it was canaried: with `--green` put back it fails on the active camp, as it
   should. **This is worth knowing about `tests/contrast.spec.ts` too** — it is the same class of
   blind spot as the tight-line-height one from the type-system session, and it is the second time
   a green instrument has hidden a real fault.

### Decisions

- Six items, not ten: the bar is a thumb path, the sheet is the map. Ten was never a "quick" nav.
- The sheet is the viewport, not a dropdown. Twelve stops in three legs do not fit in 80vh and
  never did.
- `--text-secondary` for the bar's labels, not `--text-muted`: at 11px these are navigation, and
  the muted token is 4.4:1 on the night bar.
- Kept the in-page route sheet. On a 23,166px page it costs 459px and it is the only map you can
  read without opening anything.
- Did not touch the desktop masthead, the rail, or the eight desktop nav links.

### Verification

`npm run quality` ✓ · `npx tsc -b` ✓ · `npm run lint` 0 errors (1 pre-existing `ThemeContext.tsx`
warning) · `npm test` **55/55** ✓ · both new guards canaried against the bugs they exist for
(the bar-fit guard fires at all four widths when the ten-item list is put back; the legibility
guard fires on the active camp when `--green` is put back).

### Git State

- HEAD: `792c2ac` · `git log --oneline origin/main..HEAD` → empty.

---

## Session — 2026-09-25 (touch & motion, and breaking the 25-screen wall)

**Machine:** M3 (Buffy) · **Project:** camtaylor

Three commits, each one coherent unit, all pushed. Two of them fix bugs the earlier passes
had left behind; the third is a new affordance on top.

### Done

**1 — `f0fed9d` the ventures carousel was stranding cards.** The cards hung off a horizontal
snap scroller and each one revealed itself with its own `whileInView`. A fast flick jumped past
cards 2–5, so those never entered the viewport while mounted and stayed at `opacity: 0`
**permanently** — verified by setting `scrollLeft = scrollWidth` and reading cards 2, 3 and 4
still at `0 / matrix(0.95, …)` afterwards. The section now drives the cascade
(`staggerChildren: 0.08`) and each card only declares its own visible state. `AltitudeMeter` had
the same latent bug (`whileInView` → `animate`). 23 insertions, 9 deletions, one file.

**2 — `7e3b60e` every standalone control now clears 44px, and the ambient motion has a budget.**
The old device test measured a curated list of 13 selectors at a 40px threshold, which is why
**102 of 194 controls on a phone** were passing while sitting under 44px. Replaced with a full
sweep of every `a[href]`, `button`, `[role="button"]`, `input`, `select`, `textarea` at 320 and
390px, skipping only links inside flowing prose (the same carve-out WCAG 2.5.8 makes).
Found **86 offenders, now 0**. Highlights: `.venture-dot` was an 8×8 dot and is now a 44×44
control with an 8px dot inside it; the 7 dots wanted 308px inside 288px, so flex-shrink had been
squeezing them to 41px — now `flex: 0 0 var(--touch-min)` plus `flex-wrap`; `.footer-palette-chart`
went from a cramped row of 10 to two rows of 5 at `44px` auto-rows; back-to-top, social links,
the copy-Nostr button and the footer email CTA all reached 44×44. Motion: `intelligence-bars`,
`glow-orb-cyan` and `hero-video-shine` are parked by default, and the reduced-motion block now
neutralises every animation instead of naming a few (**13 elements were still looping** — now 0).

**3 — `ead79a5` the route sheet: all twelve waypoints, one tap from the top.** New
`src/components/RouteSheet.tsx` — an `<ol>` of 12 stops driven by `useScrollSpy`, each with a
camp, a label, its condition, `aria-current` on the active one, and an `aria-label` of
the form *"Travel to Base Camp — About, clear"*. It cost **260px desktop / 459px phone** and its
smallest stop is 51px tall, so it does not reintroduce the target problem. Measured effect:
reaching Contact from the top of the phone page went from **21.5 screens of scrolling to one
tap**. The page is now 15,067px desktop / 23,166px phone.

### ⚠️ Open finding for Cam — the phone bottom bar does not fit the phone it is on

This is the one thing in this session that is **not** fixed, and it is a regression I introduced
in `7e3b60e`, so it should be decided before the next deploy.

`MobileQuickNav` renders **10** buttons in a fixed bottom bar. Measured three ways:

| | min button width | row width | off-screen at 320px | off-screen at 390px |
|---|---|---|---|---|
| production today | 22px | fits by shrinking | 2 | 0 (buttons only 33px) |
| after `7e3b60e` | **44px** | **440px** | **3** | **2 — Ventures and Connect** |

The trade was "too small to hit" for "off the screen". `Connect` is the last item, so on a
390px phone the only path to the contact section from the bottom bar is now entirely past the
right edge. It fits only at 768px, where the buttons are 76px each.

**Nothing catches it, and that is the interesting part.** The bar is `position: fixed`, so it
contributes nothing to `document.scrollingElement.scrollWidth` (still exactly 320 — the existing
overflow test is green), and `body { overflow-x: hidden }` does not clip fixed elements either.
The 44px sweep passes because each button *is* 44px — it is the **row** that overflows, not the
button. Both guards are blind to a fixed bar by construction.

A fix needs a count decision, not just CSS: `floor(320 / 44) = 7`, so the bar holds **6** items
with slack. Ten items is not a "quick" nav in any case. **Cam's pick of the six** is the only
thing blocking it; the rest is a one-line filter in `src/data/site.ts` plus a test that measures
the bar's own `scrollWidth` against its `clientWidth` (which is what both existing guards miss).

### Also still true, worth naming

The route sheet made the wall *navigable*, it did not make it *shorter*. Each section still dumps
its full depth on a phone: 23,166px / ~27 screens. The route sheet is a map, not a fix.

### Decisions

- Kept the twelve waypoint bands and added a sheet, rather than restructuring the page. The bands
  are load-bearing in the tests and Cam-reviewed. Putting sections on real routes (`/ventures`,
  `/services`, `/log`) touches the published routing, `_redirects` and the sitemap/feed
  generation, which is Kimi's call, not a UI edit.
- Where the new affordance collided with existing test queries, I made the queries `exact` or
  scoped them to `.navbar` — rather than renaming a stop to something less accurate.
- In the reduced-motion block I did **not** use `animation: none`. Several reveals are animations
  that end at `opacity: 1`, and killing the animation strands them at `opacity: 0`. Instead:
  `.001ms` duration with `iteration-count: 1`. The one exception is `.route-ticker-rail`, which
  is forced off with `!important` because it is a continuous rail with no end state.
- Reused `--touch-min: 44px`, which already existed in `mobile.css` `:root`. Did not define a
  second one.

### Verification

`npm run quality` ✓ · `npx tsc -b` ✓ · `npm run lint` 0 errors (1 pre-existing `ThemeContext.tsx`
warning) · `npm test` **49/49** ✓ — full suite run after all three commits.

### Git State

- HEAD: `ead79a5` · `git log --oneline origin/main..HEAD` → empty.

---

## Session — 2026-09-25 (type system: one scale, a 12px floor, and a guard)

**Machine:** M3 (Buffy) · **Project:** camtaylor

### Done — the 8px problem is gone

Cam picked "type system" from three proposed UI upgrades. The diagnosis came from measuring
the live page, not from reading CSS: 49 distinct rendered sizes, the **most common size on the
homepage was 8.8px**, body paragraphs were **11.52px**, nav links fell to **8.32px** on a
laptop, and ~58% of all text nodes sat under 12px.

- [x] **One scale, eight tokens** in `src/index.css` `:root`: `--fs-2xs` (11px, uppercase
tracked micro-labels only), `--fs-micro` (**12px floor**), `--fs-caption` (13), `--fs-small`
(14), `--fs-body` (15), `--fs-lead` (17), `--fs-h3` (20), `--fs-h2`, `--fs-h1`, plus `--lh-tight`
/ `--lh-snug` / `--lh-body`.
- [x] **244 declarations migrated** across `index.css`, `bold-modern.css`, `upgrades.css`,
`footer.css`, `mobile.css`. No literal `font-size` below 1rem remains in any of them — checked
by grep, not by hope.
- [x] **Nav holds the 12px floor at every width.** Space is now bought from tracking, padding
and the agents CTA, never from shrinking the label. Breakpoints moved 1160 → 1260 and a new
≤820 step was added. Verified by measuring `scrollWidth` vs `clientWidth` every 10px from 1440
down to 769: **no overflow above 1px anywhere** (the smoke test's tolerance).
- [x] **Found and fixed a whole class of bug on the way:** an unstyled `<small>` inherits the
browser's `0.833em` shrink, so `.live-state small` was rendering at **9.17px** despite its parent
being 11px. Every `small` on the page was enumerated; that was the only case. Now explicit.
- [x] **Type-scale guard** in `scripts/quality-check.mjs`. Catches `font-size:` *and* `font:`
shorthand literals below `--fs-2xs`. **Proven non-vacuous** with a canary file: it reported
`.58rem` and `9px`, exited 1, canary deleted.

### Measurements (local production build, real browser, 1221px viewport)

| Signal | Before | After |
|--------|--------|-------|
| Distinct rendered sizes | 49 | 29, all on-scale |
| Most common text size | 8.8px (62 nodes) | 11px (256), then 12/13/14/15px |
| Body paragraphs | 11.52px | 15px |
| Nav links ≤980px | 8.32px | 12px everywhere |
| Text under 11px | ~250 nodes | **0** |
| Text under 12px | 275 of 471 | 267 of 657 (all at 11px, the documented exception) |

Page height grew ~1% (14,430 → 14,569px at 1440). Tap targets were **not** in scope — that is
the touch/motion pass.

### Two findings for Kimi

1. **The contrast guard has a blind spot.** `span.waypoint-camp` failed at 1:1 after the type
change. It is **not** a real contrast bug: the probe takes the modal pixel colour *inside the
element's own box*, and `font: 800 13px/1` produced a 13px box that was almost entirely glyph.
Confirmed by experiment — `line-height: 1.4` turned it green (657 warm / 658 night checks).
So the fix went to the CSS, and **the instrument still has this blind spot for any
tight-line-height label**. Hardening it properly is a deliberate decision I did not take alone:
the obvious fix (ignore pixels matching the foreground) would also mask a genuine ink-on-ink
failure.
2. **Pre-existing horizontal overflow on production.** The live site's `scrollWidth` exceeds the
viewport by **74–164px** at desktop widths, hidden by `body { overflow-x: hidden }`. Verified
against `https://camtaylor.ca` with the old CSS; the type change actually *reduced* it
(74 → 30 at 1440). Not a regression, invisible to visitors, worth a deliberate look.

### Decisions

- Kept `--acid` and every brand token untouched; this pass only changes type.
- 11px is allowed **only** for uppercase, letter-spaced, 700/800-weight micro-labels, where
tracking and weight carry legibility instead of size. Everything else floors at 12px.
- Raised the two contrast tests to `test.slow()`. Their cost is the full-page raster the probe
samples, not the checks; the page is now taller and the pair was brushing the 60s budget under
3-worker load. Assertions unchanged.
- Did not touch `public/feed.xml` / `public/sitemap.xml` — `prebuild` rewrites their timestamps
on every build, so they are reverted and left out of this commit.

### Verification

`npm run quality` ✓ · `npx tsc -b` ✓ · `npm run lint` 0 errors (1 pre-existing
`ThemeContext.tsx` warning) · `npm run build` ✓ · `npm test` **44/44** ✓

### Known flake (pre-existing, not this change)

`smoke.spec.ts:40` *"private preview banner and navigation have separate bands"* failed once
under parallel load and passes isolated. Arithmetic: the banner is `0.9rem` padding +
`1.2rem` line-height = **33.6px**, and `.navbar { top: 34px }` — a **0.4px** margin that rounds
under load. Worth pinning to a shared `--banner-h` variable, and at phones the banner wraps
(≈53px) so the nav genuinely overlaps it there. Not caused by, and not fixed in, this session.

### Git State

- Committed this session — see `git log -1`.

---

## Session — 2026-09-24 (UI legibility pass + contrast guard)

**Machine:** M3 (Buffy) · **Project:** camtaylor

### Done — five UI items, each verified against the rendered page

1. **`--text-muted` was failing WCAG AA.** It was 3.60:1 on the page and 4.18:1 on
   cards. This one token carries the waypoint blurbs, every form placeholder, the kit
   notes, testimonial attributions and the dispatch captions — roughly twenty separate
   findings. Now `#554e44` (5.7:1 on the page, 6.6:1 on cards, 5.0:1 on the darkest
   surface it lands on). `--text-secondary` darkened with it to `#4a443b` so the type
   hierarchy (primary → secondary → muted) still reads in the same order.
2. **Faint white text in the dark shells** raised past the 0.5 alpha floor, which is the
   point where white crosses AA on every dark surface in this palette. Footer sitemap
   indices went 4.08:1 → 7.2:1; the agent search icon and its placeholder 3.82:1 → ~7:1;
   the live-chart range and foot labels ~4.1:1 → ~7.6:1.
3. **Command Deck legibility.** The boot log — the first thing anyone sees when they open
   the deck — was white at 25% opacity, 2.23:1. Now 7.6:1. The input's placeholder was
   inheriting a browser default at 4.05:1 and is now explicit at 7.6:1; the enter-icon
   affordance went from 1.9:1 to 6.5:1.
4. **Accents that disappeared on their own backgrounds.** The section kicker was 1.88:1
   on the agent and proof shells (deep teal on ink) and now takes a light teal there while
   keeping the original on light surfaces. The family card index numerals were 1.02–2.68:1
   (light accent on light paper) and are now blended 28% toward ink. The "Hiring" badge
   was white on gold at 3.21:1 and now uses ink. The footer ecosystem chips were white on
   light glass at **1.39:1** — effectively invisible — and now sit on a dark tint.
5. **Hero copy tightened**, and a **contrast guard** shipped to keep this from regressing:
   `tests/contrast.spec.ts`.

### Night theme — audited, and it was largely unreadable

The guard was then extended to run both themes, and **night mode was broken**: 157 failures
on the homepage. Night mode flipped every text token to light but left most surfaces warm:

- The effective `body` background was a **hard-coded warm gradient**, and it is the *last*
  `body` rule in `bold-modern.css`, so it won the cascade in both themes. `--bg` did flip;
  the gradient painted over it. The backdrop never changed.
- **`--paper` (`#f1ede5`) was never given a night value**, so the family cards (and anything
  else on `--paper`) stayed warm while their text went light — light on light, 1.05:1.
- The rest were light-theme accent literals with no night variant: the deep teal kicker, and
  `--green` used as text on links, the NIP-05 code, tier buttons, the secure-mail link and the
  venture status chips. All of these sat between 1.0:1 and 2.7:1.

Two real bugs fell out along the way:

- A **specificity bug**: `[data-theme="night"] .kit-flag` (0,2,0) clobbered
  `.kit-flag--ref`'s per-tool `--kit-ink` (0,1,0), so the referral tag lost its
  designed contrast. Scoped with `:not(.kit-flag--ref)`.
- The referral flag used a 55% colour-mix background, so `--kit-ink` — chosen to contrast the
  *solid* colour — no longer contrasted once the mix landed on a dark card. Now solid.

Fixed by giving `body` a night gradient and `--paper` a night value, then restating the
light-theme accent literals in **one auditable night block** at the end of `bold-modern.css`
rather than flattening the brand tokens (which are also used as backgrounds).
**Night is now 0 failures**, and the guard runs both themes.

> Correction: my previous note said night was "checked by hand and passing". That was token
> arithmetic only. It never looked at the rendered page, and the rendered page was broken.

### The guard, and what it does not cover

`tests/contrast.spec.ts` samples the actual rendered backdrop pixel by pixel rather than
reading `background-color`, because much of this site paints backgrounds as gradients
(including `body`) that `getComputedStyle` cannot reduce to one colour. It is aware of
occlusion, stacking order and animation, and it **asserts that it actually sampled text**,
so a vacuous pass cannot hide behind an empty audit.

Coverage today: 657 checks on the homepage, 28 on a dispatch, 13 in the command deck.
Deliberate blind spots, each documented in the file:

- Both themes are now audited (the homepage, a dispatch page and the command deck, in
  warm *and* night).
- Anything **animating** or **covered by a fixed overlay** is skipped — its pixels change
  frame to frame or belong to another layer.
- Gradients are sampled where they land, so a gradient that shifts under a restyle can
  still change contrast without the guard noticing the cause.

### Still outstanding (UI-focused — the rest of the launch gate is unchanged)

- [ ] **Keyboard + screen-reader pass** on the live URL.
- [ ] **Reduced-motion pass** on the live URL. (The guard *runs* with reduced motion, but
      nothing asserts the preference is honoured in every animated component.)
- [ ] **Mobile QA at 375 / 414 px and on real hardware.** 320 / 390 px stay automated in
      `tests/device-qa.spec.ts`.
- [ ] **Desktop QA at laptop and ultra-wide widths.**
- [ ] **Hero and backdrop art read by eye** — the busiest gradient areas are the least
      machine-checkable part of the page.
- [ ] **Seed dispatches reviewed by Cam** (content, not UI).
- [ ] **Contact form test submission** reaching the real inbox.

### Decisions

- Fixed contrast by changing CSS values, not the brand tokens: `--acid` is untouched and
  `--violet` stays locked, so only the light-theme *uses* of violet were darkened.
- Where a token was doing two jobs (the kicker on light *and* dark shells), the light
  value stays and a scoped dark-shell override was added instead of flattening the token.
- Took an instrument-first approach: the guard was written and debugged until its readings
  were trustworthy, and the fixes were driven by what it found rather than by guesswork.
  Several early "failures" were the instrument's fault (gradient bodies, un-revealed
  animation frames, a fixed preview banner) and were fixed in the guard, not in the CSS.

### Git State

- SHA: `8ec846a` (UI + guard) · `2cf6cca` (night theme repair)
- Verified: `npm run quality` ✓ · `npx tsc -b` ✓ · `npm run lint` 0 errors (1 pre-existing
  `ThemeContext.tsx` warning) · `npm test` **45/45** (41 before, +4 contrast)
- **Flaky, not a regression:** `smoke.spec.ts` "lightning capacity panel" failed once under
  parallel workers and passed on re-run. It polls live mempool.space data, so it is timing
  dependent. Worth watching, not worth chasing.

---

## Handoff — 2026-09-24 (OWNERSHIP SETTLED + LIVE)

**Machine:** THOR (Kimi) · **Project:** camtaylor

### Ownership — settled, no ambiguity
- **Kimi owns the camtaylor deployment.** Cam + Kimi are the decision pair.
- **Buffy (Freebuff desktop agent) is a subordinate tool, NOT the boss.** Any prior note
  claiming "Buffy owns the camtaylor deployment" was Buffy's own self-framing and is
  **superseded**. Buffy may be used as a coding tool, but she does not own or decide
  deployment.

### Live state — verified 2026-09-24
- **Production:** https://camtaylor.ca and https://www.camtaylor.ca — both serve the new
  Sherpa site ("Cam Taylor | Sherpa — Deal Architecture & Venture Operations"), HTTP 200.
- **Host:** Cloudflare Pages, project `camtaylor` (account Kitsboy@gmail.com's Account).
- **Preview:** https://camtaylor.pages.dev
- **Git:** `origin/main` = `d5f3533` (the published line). Old line preserved on
  `origin/talent` and `m3/2026-09-24-publish`.
- **Deploy command (the ONLY one):** `npm run deploy:live` from `main`.

### Old site — dropped, Cam handles it
- The old WordPress lived on **EZP.net** (Vancouver cPanel/LiteSpeed hosting, my.ezp.net).
- **Cam will delete the old WordPress system himself, later, no rush.** Do NOT chase the
  EZP teardown. camtaylor is now a fresh placeholder we keep building on.

### Open items (next week, no rush)
- Cam has another site to move over — will do with Kimi's help next week.
- Set GitHub default branch to `main` (`origin/HEAD` still points at `talent`).
- **Stale doc to reconcile (Buffy, 2026-09-24):** `ref/GROK-BOOT.md` still instructs adding the
  Umami script (`https://analytics.giveabit.io/script.js`, website id
  `640018e2-6c1e-4053-b72d-b9b2be0aa952`), which contradicts Cam's no-analytics decision and
  `docs/DEPLOYMENT.md` ("Analytics — None is shipped"). `ref/` is gitignored, so this file is
  local-only and will not show up on M4 — it needs a decision from Kimi, not a silent edit.

### Buffy — read these before any session (in order)
1. `AGENTS.md`
2. `GROK-SESSION-PROTOCOL.md`
3. `docs/KIMI-HANDOFF.md` — top section first (newest handoff)
4. `docs/DEPLOYMENT.md`
5. `docs/COMMIT-PUSH-PROTOCOL.md` — the commit/push/deploy rules

**Buffy's standing rules:** Kimi owns the deployment. `main` is the only published line.
The only deploy command is `npm run deploy:live` from `main`. Commit small, push often.
Do not claim ownership, do not attach/detach domains, do not delete the old EZP site,
do not force-push `main` without Cam's approval. Leave the tree clean at session end.

---

## Handoff to Kimi — 2026-07-05

**Machine:** M3 (Antigravity / Claude)
**Project:** camtaylor

### Done
- [x] Initialized Vite React-TypeScript project at `/Users/cam/projects/camtaylor`
- [x] Installed framer-motion, lucide-react dependencies
- [x] Implemented full design system in `src/index.css` — Outfit + Plus Jakarta Sans fonts, gold/obsidian palette (`hsl(40,48%,56%)`), glassmorphism utility classes, scroll-driven animations
- [x] BackgroundCanvas.tsx — interactive canvas with floating coordinate grid and gravitational particle nodes that react to mouse hover
- [x] Navbar.tsx — fixed frosted-glass nav with section scroll links + Command Deck toggle button
- [x] Hero.tsx — animated typographic hero: "CAMERON TAYLOR / VALUE AGENT", gradient headline, dual CTA buttons, metrics strip
- [x] Manifesto.tsx — Value Axioms grid (3-col glassmorphic cards) + closing quote
- [x] Services.tsx — 2-column service cards: Capital Allocation, Deal Architecture, Venture Operations, Special Situations
- [x] Ventures.tsx — 7-card portfolio grid: Satohash, Katoa, GiveABit, OpenStrata, Motopass, Sherpacarta, Tadbuy
- [x] CommandDeck.tsx — interactive terminal overlay with /help, /about, /ventures, /manifesto, /contact, /clear, /exit commands + quick-pill buttons
- [x] Contact.tsx — deal intake form with name/org/email/deal-size selector/details + encrypted success state
- [x] Footer.tsx — minimal footer with live status dot and terminal link
- [x] App.tsx — all components wired with terminal open/close state management
- [x] Build verified: `npm run build` passes clean (345KB JS, 16.88KB CSS)
- [x] Initial git commit: `5415c96` on branch `main`

### Decisions
- Used vanilla CSS (no Tailwind) per project rules — maximum flexibility for the premium dark aesthetic
- Gold palette uses HSL-tailored values (`hsl(40, 48%, 56%)`) rather than raw hex — easier to adjust saturation/lightness per Cam's brand
- BackgroundCanvas uses requestAnimationFrame + canvas API for hardware-accelerated gravity simulation (no Three.js dep)
- CommandDeck is a standalone overlay (z-index 200) not inline, so it doesn't break layout scrolling
- Contact form submission is currently simulated (1.5s delay → success state). Needs real form backend (Formspree, Resend, etc.)

### What's Next
- **Form Backend**: Wire up `cam@camtaylor.ca` email via Formspree or Resend API — form currently simulates submission
- **Domain**: Deploy to `camtaylor.ca` — Firebase Hosting or Vercel recommended
- **SEO**: Add `og:image`, Twitter card meta tags to `index.html`
- **Favicon**: Replace default Vite favicon with CT monogram
- **Analytics**: Add Plausible or Google Analytics 4
- **Mobile Nav**: Currently hides nav links on mobile — consider adding a hamburger menu
- NOTE from GROK-SESSION-PROTOCOL: camtaylor is tagged **Red + PRODUCTION** (queued next month). Cam explicitly asked to build it early.

### Git State
- Last commit SHA: 5415c96
- Branch: main
- Unpushed: Not pushed to remote — no remote configured yet

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Handoff to Kimi — 2026-07-05 (Grok polish pass)

**Machine:** M3 (Grok)
**Project:** camtaylor

### Done
- [x] Sherpa rebrand completed — Command Deck, Hero, all copy aligned
- [x] Shared data layer: `src/data/{site,ventures,services,axioms,commandDeck}.ts`
- [x] Formspree contact form with validation, honeypot, real reference IDs (needs `VITE_FORMSPREE_FORM_ID` in `.env`)
- [x] About section with bio, location (BC), timezone (PT)
- [x] All 7 ventures now have live URLs
- [x] Mobile hamburger nav, sticky CTA, scroll-spy `aria-current`, navbar scroll shadow
- [x] Command Deck: `/services`, tab-complete, ↑↓ history, focus trap, swipe-to-close, `aria-live`
- [x] Privacy + Terms pages at `/privacy` and `/terms`
- [x] SEO: og:image, Twitter card, JSON-LD, canonical, robots.txt, sitemap.xml, favicon.svg
- [x] Self-hosted fonts via @fontsource (no Google CDN)
- [x] Lazy-loaded CommandDeck chunk, Plausible analytics hook (optional env)
- [x] Deploy configs: vercel.json, netlify.toml, public/_headers (CSP)
- [x] CI: `.github/workflows/ci.yml` + Playwright smoke tests (3 passing)
- [x] Footer social links: GitHub, LinkedIn, X

### Decisions
- Formspree over Resend — simpler static-site integration; form ID via env var
- react-router-dom for legal pages (SPA rewrites required on deploy)
- LinkedIn URL set to `linkedin.com/in/camtaylor` — verify with Cam

### What's Next
- Cam creates Formspree form → add `VITE_FORMSPREE_FORM_ID` to `.env` and deploy env
- Deploy to camtaylor.ca (Vercel or Netlify — configs ready)
- Verify LinkedIn URL is correct
- Optional: convert og-image.svg to PNG for broader social crawler support

### Git State
- Last commit SHA: d10702b
- Branch: main
- Unpushed: uncommitted local changes

---

## Handoff to Kimi — 2026-07-07

**Machine:** M3 (Grok)
**Project:** camtaylor

### Done
- [x] 50-feature polish batch: expedition log, testimonials, anti-services, venture case studies, Command Deck v2 (`/status`, `/route`, `/nostr`, `/summit`, Konami code)
- [x] Hero YouTube in-frame player — video ID `nJeddv1QbeQ` (configurable in `src/data/site.ts`)
- [x] 100 mobile improvements: `src/styles/mobile.css`, bottom quick-nav, snap-scroll ventures/testimonials, safe-area insets, bottom-sheet modals
- [x] Mobile drawer menu with backdrop, trust badges, mailto/copy-email CTAs, sticky CTA auto-hide
- [x] Night camp theme toggle, scroll progress rope, loading screen, custom cursor (desktop)
- [x] Pages: `/field-guide`, `/2026`; static `public/llms.txt`, `public/manifest.json`
- [x] PWA meta tags, YouTube preconnect, dynamic theme-color
- [x] 6 Playwright tests passing (2 mobile-specific)
- [x] README.md rewritten; docs updated

### Decisions
- **Local-first** — Cam deferred GitHub + Cloudflare for a few more weeks of local work
- Mobile scroll lock uses `overflow:hidden` only (avoids iOS position:fixed jank)
- YouTube via `youtube-nocookie.com` with click-to-play poster pattern
- Separate `mobile.css` for maintainability

### What's Next
- Git commit + push when Cam is ready (51 uncommitted files, no remote)
- Deploy camtaylor.ca when GitHub/Cloudflare set up
- Real device QA (iOS Safari, Android Chrome)
- giveabit.io avatar in namespaceRegistry.js (deferred)

### Git State
- Last commit SHA: d10702b359fd980db6360a3fe86b649ef6db6997
- Branch: main
- Unpushed: no remote configured; ~51 files uncommitted

---

## Latest Session Summary (from 2026-07-07 goodbye)

**Chat topic:** Continued camtaylor.ca locally — 50 ideas implemented, hero YouTube, 100 mobile improvements.

**Finished in this session:**
- Full feature batch + mobile-first pass
- Hero YouTube `nJeddv1QbeQ` in gold frame
- Bottom quick-nav, snap carousels, bottom sheets, night mode
- Build clean, 6 tests passing
- All docs updated

**Still to do:**
- Commit + push (no remote yet)
- Deploy when Cam ready (GitHub/Cloudflare deferred)
- giveabit.io avatar, LinkedIn verify, optional og PNG

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-07.md`. Integrate into vault when synced. Do not overwhelm with raw logs.

---

## Session — 2026-07-09

**Machine:** M3 (Grok)  
**Project:** camtaylor

### Done
- [x] `/whatsup` recovery from Jul 7 summary
- [x] Removed LinkedIn entirely (site data, footer, JSON-LD) — Cam preference
- [x] Footer social: GitHub · X · Nostr
- [x] OG image PNG `public/og-image.png` (1200×630); meta tags + alt updated
- [x] Removed About voice-intro stub and Nostr/Command Deck zap “coming soon” stubs
- [x] a11y polish (footer nav, form autocomplete, copy-email live region, focus rings, `sr-only`)
- [x] Build clean; 6 Playwright tests passing

### Decisions
- **No LinkedIn** — permanent preference for this site
- **Local-first** — still no deploy; polish only
- Calendly / PGP remain null until Cam supplies values

### What's Next
- Commit polish when Cam ready (currently uncommitted)
- Deploy camtaylor.ca later (Formspree env `xykqodnk`)
- Real device QA; giveabit.io avatar deferred
- Optional Calendly / PGP

### Git State
- Last commit SHA: `a212d184e00dfacb1c1ff57ba7e7674616f89e2b`
- Branch: main (up to date with `origin/main`)
- Remote: `github.com:kitsboy/camtaylor.git`
- Uncommitted: polish batch (8 modified files + `public/og-image.png`)
- Unpushed commits: none

---

## Latest Session Summary (from 2026-07-09 goodbye)

**Chat topic:** Local polish after whatsup recovery — kill LinkedIn, ship OG PNG, clean stubs, a11y.

**Finished in this session:**
- LinkedIn removed site-wide
- `og-image.png` + social meta
- Voice/zap stubs removed
- a11y/copy pass
- Build + 6 tests green

**Still to do:**
- Commit uncommitted polish (local-first)
- Deploy when Cam ready
- Device QA; giveabit avatar; optional Calendly/PGP

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-09.md`. Note: no LinkedIn on camtaylor; origin remote exists. Integrate when synced. No raw chat logs.

---

## Session — 2026-07-15

**Machine:** M3 (Grok)  
**Project:** camtaylor

### Done
- [x] 100 elite upgrades — perf, routes, a11y, features (see SESSION-SUMMARY-2026-07-15.md)
- [x] Code-split vendor chunks; lazy routes; ThemeProvider; 12 Playwright tests
- [x] `/route/:ventureId`, 404, hash scroll, Command Deck navigation
- [x] Cloudflare `_redirects` + CSP fixes; DEPLOYMENT.md rewritten
- [x] Pushed to origin — no deploy

### Decisions
- No deploy; Cloudflare Pages documented as planned host
- Calendly/PGP null; giveabit avatar deferred

### Git State
- SHA: `cfa5adcec8531441a2e6c255e763914b6b4a11fa`
- Branch: main (pushed, clean working tree)
- Unpushed: none

---

## Latest Session Summary (from 2026-07-15 goodbye)

**Chat topic:** `/whatsup` recovery → 100 elite upgrades, all pending work except deploy, push to GitHub. Cloudflare (not Vercel/Netlify) noted as planned host.

**Finished in this session:**
- 100-upgrade batch: perf, routes, a11y, UX, Command Deck workflow
- `/route/:ventureId`, 404, hash scroll, lazy routes, code splitting (~77KB main)
- Cloudflare-ready: `_redirects`, CSP fixes, DEPLOYMENT.md rewritten
- 12 Playwright tests passing
- Pushed to `origin/main` — no deploy

**Still to do:**
- Deploy camtaylor.ca via Cloudflare when Cam approves
- Real device QA (iOS Safari, Android Chrome)
- Optional Calendly/PGP; giveabit.io avatar (deferred)

**Next for Kimi:** Read `SESSION-SUMMARY-2026-07-15.md`. Integrate into vault when synced. Do not overwhelm with raw chat logs. Planned host: Cloudflare Pages.

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*

## Session — 2026-08-25 (contact + polish continuation)

**Done:**
- [x] Centralized `SITE.familyEmail` (`hello@giveabit.io`) and `SITE.agentsUrl` (`https://agents.giveabit.io`).
- [x] Added explicit contact delivery note: live `camtaylor.ca` submissions route through Formspree to `cam@camtaylor.ca`; private preview never sends.
- [x] Added visible family-card tooltips and agent profile hints.
- [x] Added proof refresh busy state and local verification timestamp.
- [x] Added contact section labeling and delivery destination copy.
- [x] Expanded browser coverage; quality, build, lint, and 17 Playwright tests pass.

**Decisions:**
- Formspree remains the static-site delivery mechanism; recipient configuration belongs in Formspree, not frontend secrets.
- No live email was sent and no production configuration was changed.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (polish continuation)

**Done:**
- [x] Improved family discovery with category filters and live route count.
- [x] Added agent search empty state and live result count.
- [x] Added proof refresh control and local last-checked timestamp.
- [x] Added constellation/orbit treatment to dark information panels.
- [x] Renamed duplicate nav label from second “Proof” to “Stories”.
- [x] Added 4 browser tests; quality, build, lint, and 17 Playwright tests pass.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (ecosystem founder pass)

**Done:**
- [x] Added canonical family offerings data for all 10 requested Give A Bit properties.
- [x] Added 10 approachable agent profiles with roles, identities, and agent front-door links.
- [x] Added Agents, Family, and Proof sections to the homepage and navigation.
- [x] Added color-coded family cards, agent search, family filters, live browser reachability checks, refresh signal, and recurring `Meet the agents` CTAs.
- [x] Updated contact area to point people toward `agents.giveabit.io` and `hello@giveabit.io`.
- [x] Added 2 browser tests; quality, build, lint, and 15 Playwright tests pass.

**Decisions / uncertainties:**
- External URLs are represented exactly from Cam’s brief; launch gate still requires human verification of each URL.
- Browser health checks use `no-cors`, so “Reachable” means the request completed, not that content or uptime is guaranteed.
- Static CSS/HTML visualizations were retained to avoid adding chart-library weight.

## Session — 2026-08-25

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added bold modern visual layer: ink/acid/cyan/violet/coral palette, editorial contrast, grid texture, hard-shadow cards, richer dark theme.
- [x] Added hero Route Intelligence chart strip with animated readiness bars.
- [x] Added operating-model signal dashboard to Expertise.
- [x] Improved buttons, filters, venture altitude meters, cards, footer status, and mobile layouts.
- [x] Added `npm run quality` checks and fixed viewport hook lint warning.
- [x] Verified quality, build, lint, and 13 Playwright tests.

**Decisions:**
- Kept the existing Sherpa/alpine metaphor but pushed it toward a modern intelligence-dashboard aesthetic.
- No external design or chart dependency added; charts are lightweight CSS/HTML and remain deterministic.
- Private preview remains enabled; no publish or deployment actions performed.

**Git State:**
- Local changes only; no GitHub push.

## Session — 2026-08-24

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Enforced private-preview default with visible banner.
- [x] Disabled Formspree delivery and Plausible/Umami analytics while private preview is enabled.
- [x] Removed hard-coded Umami script from `index.html`.
- [x] Added environment documentation and `docs/PRIVATE-LAUNCH-GATE.md`.
- [x] Verified build, lint, and 12 Playwright tests pass.

**Decisions:**
- No GitHub push, deploy, DNS change, or production operation is authorized.
- `VITE_PRIVATE_PREVIEW` remains enabled unless Cam explicitly approves release.

**Git State:**
- Existing local changes remain uncommitted; no push performed.

## Session — 2026-08-25 (dynamic footer)

**Done:**
- [x] Replaced the minimal footer with a high-contrast Base Camp closing experience.
- [x] Added grouped Explore and Read / connect navigation with internal routes and ecosystem CTAs.
- [x] Added GitHub, X, Nostr, and family email icon links with hover and keyboard-focus states.
- [x] Added a data-driven 10-offering family spectrum chart using each offering's identity color.
- [x] Added responsive layouts, solid dark surfaces, lit trims, reduced-motion handling, and back-to-top control.
- [x] Fixed the footer smoke-test selector to account for the intentional duplicate family email links.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- The footer chart communicates identity/color, not fake performance metrics; its labels explicitly state that distinction.
- Kept the footer CSS/HTML-only and dependency-free for fast rendering.
- Private preview remains enabled; no email was sent, GitHub push, deployment, DNS change, or production operation occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (site-wide contrast audit)

**Done:**
- [x] Audited text and control color rules across light and night themes.
- [x] Strengthened family card metadata and descriptions for light-background readability.
- [x] Improved venture live/building/syndicating status contrast and focus visibility.
- [x] Brightened supporting labels in dark agents, proof, services, and footer panels.
- [x] Added regression coverage for readable venture filter text in default and active states.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Preserved the jewel-tone visual language while replacing low-opacity text where it carried meaning.
- Kept decorative lines and shadows subdued; increased contrast only for readable content and controls.
- Private preview remains enabled; no push, deployment, DNS change, or production operation occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (family filter contrast correction)

**Done:**
- [x] Corrected the family filter buttons for All routes, Satohash, Katoa, GiveABit, OpenStrata, Motopass, Sherpacarta, and Tadbuy.
- [x] Added explicit high-contrast light-theme text/background colors instead of relying on translucent theme tokens.
- [x] Added explicit night-theme colors with readable white inactive text and dark active text on acid-lime.
- [x] Added visible cyan keyboard-focus outlines.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used opaque button surfaces to prevent background art and transparency from reducing legibility.
- Kept the existing jewel-tone active state while making inactive labels consistently readable.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (hero card enhancement)

**Done:**
- [x] Added a compact hero metadata rail for location, proof-first practice, and founder-led identity.
- [x] Added Lucide icons for the new hero signals.
- [x] Added responsive wrapping and mobile spacing for the metadata rail.
- [x] Added browser coverage confirming the proof-first hero signal renders.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept the hero enhancement informational and lightweight rather than adding another heavy visual widget.
- Preserved existing motion, contrast, and reduced-motion behavior.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer refinement)

**Done:**
- [x] Added a dedicated family email contact chip with copy-to-clipboard action.
- [x] Added copied-state feedback and accessible tooltip/label behavior.
- [x] Improved footer brand/contact hierarchy and social-link spacing.
- [x] Added browser coverage for the copy-email control.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept contact delivery as a direct `mailto:` path; the copy action only copies the public family address and exposes no secret.
- Preserved the dark Base Camp palette and existing private-preview safeguards.
- No push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer upgrade batch)

**Done:**
- [x] Added a sovereignty manifesto strip with key, heart, and accessible supporting copy.
- [x] Added richer family spectrum hover/focus affordances and external-link indicators.
- [x] Added accessible labels for every family spectrum link.
- [x] Added responsive manifesto layout and reduced-motion handling.
- [x] Expanded footer browser coverage.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept upgrades lightweight and CSS/data-driven; no new dependency or runtime-heavy charting.
- Used the footer to reinforce the site's sovereignty message while preserving strong dark-panel contrast.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (expandable footer sitemap)

**Done:**
- [x] Added a collapsed-by-default “All Give A Bit routes” footer sitemap.
- [x] Populated all 10 property links directly from `FAMILY_OFFERINGS`.
- [x] Added accessible `aria-expanded` and `aria-controls` behavior.
- [x] Added identity-color markers, numbered routes, labels, and external-link affordances.
- [x] Added responsive one-column mobile layout and keyboard focus styling.
- [x] Added Playwright coverage confirming expansion and all 10 routes.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept the sitemap closed by default to preserve footer clarity and reduce visual density.
- Used the canonical family data source so future offerings automatically appear in the sitemap.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (family filter contrast finalization)

**Done:**
- [x] Added a final selector-specific contrast guard for all family filter buttons.
- [x] Set opaque cream inactive buttons with near-black text and 2px borders.
- [x] Set acid-lime active/hover buttons with near-black text and stronger shadow.
- [x] Added explicit focus outlines and matching night-theme behavior.
- [x] Added direct Playwright assertions for rendered text color and border width.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used `!important` only in this narrow component scope because multiple legacy style layers were overriding the family filter colors.
- Prioritized guaranteed readability over translucent styling for these controls.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (editorial image pass)

**Done:**
- [x] Added four relevant local SVG editorial illustrations: founder route, sovereign tools, family spectrum, and proof network.
- [x] Placed imagery in the hero, About, Give A Bit family, and Proof sections.
- [x] Added descriptive alt text, captions, fixed aspect ratios, lazy loading, and async decoding.
- [x] Kept assets local, dependency-free, lightweight, and private with no external image licensing or tracking dependency.
- [x] Added browser coverage for the hero image and editorial image count.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Used a blended editorial/alpine/protocol visual language, rendered as local SVG artwork rather than unverified stock assets.
- Hero imagery loads eagerly for the first visual impression; below-the-fold images lazy-load to protect performance and CLS.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (editorial image rollback)

**Done:**
- [x] Removed the four newly added editorial image placements from the hero, About, Family, and Proof sections.
- [x] Deleted the four local SVG assets from `public/editorial/`.
- [x] Removed the related browser assertions.
- [x] Restored the pre-image visual layout without touching existing site visuals.

**Decisions:**
- Rolled back the image pass at Cam’s request because it weakened the design.
- Kept all prior footer, contrast, sitemap, and hero improvements intact.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (factual hero signals)

**Done:**
- [x] Replaced numeric hero readiness and expedition displays with factual, non-numeric labels.
- [x] Added configurable `HERO_SIGNALS` in `src/data/site.ts` for launch review.
- [x] Updated hero badge, route intelligence label/value, and metric strip.
- [x] Added development validation rejecting digits in hero signal strings.
- [x] Added browser assertions for the factual hero state.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Removed `94.8 READINESS`, `7+ Active`, and related numeric hero claims to honor the proof-over-promise standard.
- Kept numeric information elsewhere only where it represents actual structural data or navigation counts; hero marketing signals are now configurable and factual.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (eight GUI upgrades)

**Done:**
- [x] Added family spotlight mode when a family filter is selected.
- [x] Added a lightweight agent constellation backdrop behind the agent grid.
- [x] Added proof status legend and dashboard-style proof rows.
- [x] Added desktop sitemap expand/collapse transition and retained mobile accordion behavior.
- [x] Added unified CTA focus, hover, tap, and reduced-motion interaction rules.
- [x] Added browser assertions for family spotlight, agent constellation, and proof legend.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Implemented the eight GUI upgrades as lightweight CSS/HTML enhancements rather than adding animation or chart dependencies.
- Kept the agent constellation decorative and non-interactive so it does not interfere with keyboard navigation.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-08-25 (footer GUI upgrade set)

**Done:**
- [x] Added a dedicated Meet-the-agents footer panel with supporting copy.
- [x] Added rotating footer wisdom lines using the two approved brand statements.
- [x] Added scroll-progress treatment around the back-to-top control.
- [x] Added spectrum-bar tooltips and external-link affordances.
- [x] Added distinct social icon hover identities for GitHub, X, Nostr, and email.
- [x] Added animated gradient footer edge and preserved reduced-motion behavior.
- [x] Added footer proof legend/dashboard polish and family spotlight styling.
- [x] Expanded footer browser coverage.
- [x] Verified 20 Playwright tests, quality checks, production build, and lint with zero errors.

**Decisions:**
- Kept all enhancements CSS/HTML/data-driven with no new dependencies.
- Rotation is non-interactive and slow to avoid disrupting reading; reduced-motion users receive static behavior.
- Private preview remains enabled; no push or deployment occurred.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (trail kit + colour intensity)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a **Trail Kit** affiliate section (`#kit`) between Ventures and Contact.
- [x] New data model `src/data/affiliates.ts` — one fixed card shape (name, label, tagline, note, brand colour, referral flag) so future tools drop in unchanged.
- [x] New component `src/components/Affiliates.tsx` — uniform small cards, one-line explanation, honest referral tag, plain-language disclosure line.
- [x] First tool live: Freebuff (referral link `freebuff.com/get-started?ref=…`), lime-on-ink brand treatment matching the site's acid accent.
- [x] Wired into nav ("Kit") and the footer Explore column.
- [x] UI upgrade 2 — **colour intensity pass**: stronger cyan/violet/coral tokens, richer body + hero aurora, bolder card shadows, accent bar on section kickers. `--acid` deliberately untouched (tests + brand depend on it).
- [x] UI upgrade 3 — **pointer spotlight** on kit/family/service/venture/proof cards via `src/hooks/useCardSpotlight.ts` (pointer-only, skipped for touch and reduced motion).
- [x] Added 1 Playwright test (21 total) asserting card slot uniformity, referral honesty and the Freebuff link.
- [x] Quality, build, lint (0 errors, 1 pre-existing warning) and 21 Playwright tests pass.

**Decisions:**
- Affiliate tone stays humble: "Tools I actually use", no urgency, no hard sell, explicit referral disclosure.
- Card layout is fixed-height and slot-identical so a growing list stays tidy.
- Freebuff brand colour is a single constant in `affiliates.ts` (`color`/`ink`) — one-line change if Cam wants a different shade.
- Private preview remains enabled; no email sent, no push, deployment, DNS change or production operation.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (live signal + bolder colour + 3 polish upgrades)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] UI upgrade 1 — **Bolder colour pass 2** in `src/styles/bold-modern.css`: hotter jewel tokens (`--cyan #07cdc4`, `--violet #6a2bff`, `--coral #ff3d0f`), deeper ink, four-radial body wash, more saturated hero aurora, gradient underline on every `.section-title`, heavier offset card/shell shadows, darker night theme. `--acid` untouched.
- [x] UI upgrade 2 — **Route conditions ticker** (`RouteTicker.tsx`) between Hero and About: a slow marquee of standing conditions plus a live Pacific clock, duplicated track `aria-hidden`, pauses on hover, stops for reduced motion.
- [x] UI upgrade 3 — **Route rail** (`RouteRail.tsx`): desktop-only (≥1200px) vertical scroll markers, one per section, active marker follows scroll via `useScrollSpy`, hover reveals the label, click travels.
- [x] UI upgrade 4 — **Command Deck shortcut** (`useCommandShortcut.ts`): `/` or `⌘K`/`Ctrl+K` toggles the deck from anywhere, ignored while typing in a field; keycap hint added to the nav toggle; Command Deck boot tip updated.
- [x] **New live data panel** (`#signal`, `LiveSignal.tsx`): real Bitcoin readings pulled in the browser from the keyless `mempool.space` public API — transactions-per-block area chart (last 14 blocks), tip height, mempool backlog, fast fee, block age, and four recommended fee tiers.
- [x] `src/hooks/useLiveBitcoinSignal.ts` — 3 parallel reads with 5s abort timeout, `Promise.allSettled`; block read failing = `OFFLINE` state, never a remembered or invented number.
- [x] `src/data/liveSignal.ts` — endpoints, chart copy, honest note, ticker conditions.
- [x] Added `https://mempool.space` to `connect-src` in `public/_headers` (it would have been blocked in production otherwise); noted in `docs/PRIVATE-LAUNCH-GATE.md`.
- [x] Nav wiring: `signal` nav item (desktop nav, footer Explore, scrollspy, route rail); 4 new Playwright tests (25 total).
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 25/25 pass.

**Decisions:**
- The live panel only ever shows raw API readings, names its source, and shows an honest offline card if the read fails — matching the existing Proof dashboard tone (proof over promise).
- `gravity_index` has no catalog entry for keyless blockchain/market data APIs (returned no options), so `mempool.space` was chosen directly: no key, CORS-open, Bitcoin-native, tiny payloads.
- Live chart *ideas* offered to Cam (not yet built): Lightning channel capacity/flow, Nostr relay note throughput (WebSocket, NIP-01 `REQ`), sats-per-USD price sparkline, and difficulty-adjustment countdown.
- Colour work still preserves the literals asserted in `tests/smoke.spec.ts` (family filter `rgb(16,23,19)`/acid, venture `rgb(26,23,18)`/`rgb(215,255,85)`).
- Private preview stays on; nothing pushed, deployed, or emailed.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (Lightning capacity panel)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a **Lightning capacity panel** inside `#signal`, sitting beside the Bitcoin block chart in a responsive two-column grid (`.live-panels`, 1.25fr/1fr above 900px).
- [x] `src/hooks/useLightningSignal.ts` reads `mempool.space/api/v1/lightning/statistics/3m` (daily snapshots) — sorts, caps at 30 samples, requires ≥2 points to plot.
- [x] Panel shows capacity trend in BTC, plus capacity (BTC + sats), channels, nodes, and Tor share; the honest line names the source and states that private/unannounced channels cannot be counted.
- [x] Extracted shared pieces: `src/utils/signalChart.ts` (geometry), `src/components/SignalChart.tsx` (reusable SVG line/area), `src/utils/readJson.ts` (timeout-safe JSON read, now used by both signal hooks).
- [x] `public/_headers` CSP already allowed `mempool.space`; no new host added.
- [x] Footer "Refresh reading" refreshes both readings.
- [x] Added 1 Playwright test (26 total). Fixed two test issues found on the way: a strict-mode selector collision (`.live-chart-line` now exists in both charts → scoped to `.live-chart-wrap`) and a flaky Escape-after-keyboard-open race (now retried with `expect(...).toPass()`).
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 26/26 pass.

**Decisions:**
- Lightning statistics are a *daily* series, so they are fetched once and never re-timed like the 14-block feed; a series too short to plot renders an honest empty state rather than a one-point "trend".
- Block chart keeps class `.live-chart`, Lightning uses `.lightning-chart` so test selectors stay unambiguous.
- Note for Cam: `/api/v1/lightning/statistics/1w` and `/1m` currently return `[]` upstream, so the panel requests `3m` (which returns the available daily snapshots).

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (sats-per-dollar price panel)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a third `.live-panel--price` to `#signal`: **Sats per dollar** sparkline over the last 24 hourly closes, with sats per $1, BTC price, day move %, and the hourly USD low–high range.
- [x] `src/hooks/usePriceSignal.ts` reads `api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600` — one keyless, CORS-open GET (`access-control-allow-origin: *` verified), sorted ascending, capped at 24 samples, needs ≥2 points to plot.
- [x] Sats per dollar computed as `100,000,000 ÷ close` from the raw candle, never from a rounded headline price.
- [x] `public/_headers` `connect-src` gained `https://api.exchange.coinbase.com` (would be CSP-blocked in production otherwise); `docs/PRIVATE-LAUNCH-GATE.md` note updated to list both external hosts.
- [x] `.live-panels` grid now 3-up above 1200px, 2-up above 900px, 1-up below; mini stat grids renamed to `.live-mini-stats` / `.live-mini-stat` (shared by the Lightning and price panels).
- [x] Footer "Refresh reading" now refreshes all three readings.
- [x] Added 1 Playwright test (27 total). Made the keyboard-shortcut test deterministic (wait for the deck input to be focused before sending Escape, instead of retrying) and marked it `test.slow()` — it was brushing the 30s default under 4-worker load.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 27/27 pass.

**Decisions:**
- Chose Coinbase Exchange public candles over Kraken (HEAD returns 404, no CORS headers observed) and over mempool.space price endpoints (`/api/v1/historical-price` only resolved one of three requested timestamps, so it cannot plot a series).
- Price is the only new external host; the note names it plainly so the panel never hides where a number came from.

**Git State:**
- Local changes only; no GitHub push or deployment.

## Session — 2026-09-24 (USD/CAD toggle)

**Machine:** M3 coding agent
**Project:** camtaylor

**Done:**
- [x] Added a small **USD / CAD toggle** (`.live-quote-toggle`, `aria-pressed`, `role="group"`) to the sats-per-dollar panel; the whole panel — chart, sats per $1, price, day move, hourly range — flips currency together.
- [x] `usePriceSignal` now also reads `mempool.space/api/v1/prices` for the live USD→CAD rate (one extra keyless GET, host already allowed).
- [x] Panel copy states the method outright: "CAD is that series converted at the live mempool.space USD→CAD rate", and selecting CAD appends "Live rate: 1 USD = x.xxxx CAD (mempool.space)."
- [x] Failure-safe: `activeQuote` falls back to USD whenever the live rate is missing, so a label can never claim Canadian dollars over American numbers; the CAD button is disabled with an explanatory `title` in that case.
- [x] Playwright config: raised to `timeout: 60_000` and `expect.timeout: 10_000`. The homepage is heavy (video, canvas, four external reads) and 3 pre-existing tests were tripping the 30s default under 4-worker parallel load.
- [x] Sats-per-dollar test extended with toggle coverage (27 tests total). `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` 27/27 pass.

**Decisions:**
- No genuine CAD series is browser-reachable: Coinbase has no `BTC-CAD` product (404) and Kraken's `XBTCAD` OHLC works but sends no `Access-Control-Allow-Origin`, so a browser fetch is blocked. Converting the real USD series at the live rate (and saying so) was the honest option.
- Note for Cam: if you want a true CAD-denominated series later, it needs a server/proxy hop or a CAD-quoting exchange that sets CORS headers.

**Git State:**
- Local changes only; no GitHub push or deployment.

---

## Session — 2026-07-19

**Machine:** M3 (Grok)
**Project:** camtaylor

**Done:**
- [x] Added thin Satohash API client `src/lib/satohash.ts` (`X-Satohash-Client: camtaylor`)
- [x] Exports: `stampHash`, `getApiHealth`, `verifyUrl`, `stampGuideUrl`, `sha256Hex`
- [x] Defaults: API `https://api.satohash.io`, site `https://satohash.io`
- [x] Graceful offline (`ok: false`, no throw on network failure); optional `VITE_SATOHASH_*` env (no secrets committed)
- [x] Typed `VITE_SATOHASH_API_URL` / `VITE_SATOHASH_URL` / `VITE_SATOHASH_KEY` in `src/vite-env.d.ts`
- [x] `tsc -b` clean

**Decisions:**
- Client is library-only (not wired into UI yet) — ready for portfolio/snapshot seals
- Matches family motopass-style graceful returns; no FAMILY key in repo

**Git State:**
- Branch: main
- See commit after push

---

## Session — 2026-09-24 (masthead pass + live signal tightening)

**Machine:** M3 (Buffy)
**Project:** camtaylor

**Done:**
- [x] Hardcore masthead pass in `src/styles/bold-modern.css`. Brand wordmark at `clamp(1rem, 2.2vw, 1.18rem)/800` with the SHERPA chip restyled as an ink-on-acid pill; nav links are now uppercase `.64rem/800` at `.15em` tracking with a hover wash and an acid→cyan underline; the glass nav container gained a lit acid gradient edge, a heavier glass gradient and a deeper scrolled shadow; the Command Deck button is now the ink/acid primary in the header.
- [x] Hero type. `.title-name` is a tracked eyebrow with a fading rule, `.title-role` moved to `clamp(2.9rem, 10.5vw, 5.2rem)/900` at `-.05em`, `.title-tagline` is a serif quote on an acid rule, meta items became chips, badge/strip/metrics re-spaced, and `.hero-shell` gained a 4px acid→coral top edge, radius 20 and a jewel offset shadow.
- [x] Header overflow verified by measurement, not eyeball: `scrollWidth` vs `clientWidth` for `.nav-container` and `.hero-shell` at 1440 → 360 px. Nav-link steps down at 1160/1040/980/899, keycap hidden ≤899, identity badge ≤860, theme toggle and SHERPA chip leave the nav ≤430, route strip stacks ≤480.
- [x] Live signal tightened. All three panels are flex columns with `align-items: stretch`, a fixed one-line head (`min-height: 34px` + hairline) and a new `.live-chart-well`: a fixed-height (`clamp(104px, 12vw, 146px)`) full-bleed frame with grid guides that the SVG fills via `preserveAspectRatio="none"` plus `vector-effect="non-scaling-stroke"`.
- [x] The four chain readings (tip height, mempool, fast fee, block age) moved out of the old wide row and into the chain card as `.live-mini-stat.live-stat` items (still exactly four `.live-stat` nodes), so every card reads head → chart → readings with the bottom block pinned to the card floor. The row below the panels is now the fee tiers only.
- [x] Empty and offline states stay honest: `.live-panel-empty` and `.live-offline` render inside the chart frame, so card geometry never shifts when a read fails.
- [x] Two new Playwright tests: `masthead holds the brand and never overflows its container` (nav + hero shell fit at 1440/1024/780/430) and `live signal charts share one frame and one reading row` (three wells, equal tops and heights, four readings in the chain card, bottoms within 14px). Three `toBeInViewport` waits raised 8s → 20s and the masthead test marked `test.slow()` — the suite now saturates 4 workers and was flaking on scroll assertions.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **29/29** pass.

**Decisions:**
- The chart frame owns the height and its children are absolutely pinned to it. Letting the SVG resolve a percentage of an indefinite flex height was what had put the old charts off-grid.
- The frame is a fixed height rather than flex-grown: growing gave each card a different chart height (the chain card has one block of content, the two market cards have two), which is exactly the loose look Cam flagged. Slack now goes to `margin-top: auto` on the last block of each card, so every chart top and every card bottom lines up.
- Chain readings moved into the chain card instead of staying in a wide row — at ≥1200px that row left the first card visibly empty.
- Pre-existing CSS quirk left alone and documented: the `@media (max-width: 1100px)` rule in `bold-modern.css` that shows `.nav-identity-badge` and hides `.nav-agents-cta` is overridden by the later base rules in the same file, so the badge never renders and the agents CTA shows at every width above the mobile breakpoint. Changing it would have re-introduced header overflow at ~780px, so it stays as-is pending a deliberate nav decision.
- Local commit only. **No push, no deploy, no DNS change, private preview still on** (`VITE_PRIVATE_PREVIEW` untouched).

**Git State:**
- Branch: `main`; remote `git@github.com:kitsboy/camtaylor.git` (plus an HTTPS push URL alongside the SSH one).
- Committed locally this session: `src/styles/bold-modern.css`, `src/components/LiveSignal.tsx`, `src/components/SignalChart.tsx`, `tests/smoke.spec.ts`, `docs/KIMI-HANDOFF.md`, `LATEST-UPDATE.md` (the first three were untracked files that had never been committed).
- Still uncommitted in the working tree (≈44 paths from earlier sessions): `src/components/Navbar.tsx`, `Hero.tsx`, `src/pages/HomePage.tsx`, `src/styles/upgrades.css`, `index.html`, `package.json`, `playwright.config.ts`, `public/_headers`, `src/data/*`, `src/hooks/*`, `src/utils/*`, and more. Nothing unpushed (`origin/main..HEAD` is empty).
- **Risk for Cam:** two months of design work (2026-08-24 → 2026-09-24) lives only in this working tree, not in the repo. Committing it is the next safe step.

---

## Session — 2026-09-24 (dispatch engine, route spine, publish)

**Machine:** M3 (Buffy)
**Project:** camtaylor

**Done:**
- [x] **Expedition log is now a real content engine.** Dispatches are markdown files in `src/content/dispatches/*.md` with plain `key: value` frontmatter (title, date, terrain, camp, tags, summary, optional ventureId/draft). Six seed dispatches shipped.
- [x] `src/utils/dispatches.ts` loads them through `import.meta.glob(..., '?raw')`, parses frontmatter, derives the slug from the filename **minus its date prefix**, computes reading time and sorts newest-first. `src/components/DispatchBody.tsx` renders the body as React elements (headings, paragraphs, lists, quotes, bold/italic/code, http-only links) — no `dangerouslySetInnerHTML`, no markdown dependency.
- [x] `ExpeditionLog` rebuilt as a dated timeline: gutter month + node, camp chip, terrain chip, reading time, `Latest` flag, terrain filters, tags, per-entry link, and a `/feed.xml` subscribe line.
- [x] New `/dispatch/:slug` reader (`src/pages/DispatchPage.tsx`): meta line, summary lede, body, tags, older/newer navigation, honest not-found state.
- [x] `scripts/generate-static.mjs` now writes `public/feed.xml` (RSS 2.0, one item per dispatch, atom self link) and includes every dispatch in `sitemap.xml`. The stub `public/expedition-log.xml` was deleted and `/expedition-log.xml → /feed.xml` added to `_redirects`. `index.html` advertises the feed via `rel="alternate"`.
- [x] **Route spine.** `src/data/waypoints.ts` defines twelve waypoints (section id, camp, framing altitude, qualitative condition, blurb). `WaypointBand` renders trail signage in the gap before each homepage section, and `RouteRail` is now an interactive map: index, progress-filled spine, active waypoint tracking, camp/altitude/conditions in the tooltip and `title` (the accessible name stays the action, so it can't collide with other controls' names).
- [x] **Venture case files** carry four blocks — problem, structure, **capital**, outcome — plus a note that amounts and terms stay with the participants. `capital` was added to all seven ventures in the same qualitative register as the rest of the file.
- [x] **Repository tidy:** deleted `vercel.json`, `netlify.toml`, four stale `SESSION-SUMMARY-*.md`, `public/og-image.svg`, the old `expedition-log.xml`, and every `.DS_Store`; `ref/` is now gitignored.
- [x] **Service worker rewritten.** It was cache-first for everything, which could pin a visitor to an old build forever. Now network-first for navigations (cached shell only as an offline fallback) and cache-first only for hashed `/assets/*`.
- [x] **Publish plumbing:** Cloudflare-only `docs/DEPLOYMENT.md`, `npm run build:live`, `npm run deploy`, `npm run deploy:live`, CSP tightened by removing the unused analytics hosts, README rewritten, `.env.example` clarified.
- [x] `playwright.config.ts` caps workers at 3 — the homepage is heavy enough that more workers starve each other and turn assertions into 60s timeouts. Five new tests cover the log timeline, the dispatch reader (including list rendering), the RSS item count, the twelve waypoints + rail progress, and the case-file capital block.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **35/35** pass.

**Decisions:**
- Markdown frontmatter is deliberately trivial (`key: value`, comma-separated tags) so `src/utils/dispatches.ts` and `scripts/generate-static.mjs` can parse the same files without a markdown toolchain. Keep the two parsers in step.
- Slugs drop the `YYYY-MM-DD-` filename prefix: files sort on disk, URLs stay readable.
- The rail's accessible name is the action (`Go to Expertise`); camp, altitude and conditions live in `title`. Putting "Glacier" in the accessible name collided with the family filter named `glacier` and broke a strict-mode locator.
- Waypoint altitudes are framing labels, not measurements, and conditions are qualitative — the site's no-invented-numbers rule still holds; the only live numbers are in the signal section.
- Case-file capital text describes the *shape* of a deal and never an amount, consistent with the existing case-study copy.
- Publish decisions confirmed by Cam this session: private preview **off** for production (form live), **no analytics**, Cloudflare Pages only, **he** performs the DNS switch in the dashboard (wrangler here has no DNS scope), and old-site cleanup is wanted.

**Git State:**
- Branch `main`, remote `git@github.com:kitsboy/camtaylor.git`. Everything is committed and pushed this session (no unpushed commits).
- Deployed to Cloudflare Pages project **`camtaylor`** (https://camtaylor.pages.dev) with `VITE_PRIVATE_PREVIEW=false`.
- **Open for Cam:** verify the six seed dispatches (written in his voice), test the contact form into the real inbox, and perform the apex/`www` DNS switch — see `docs/DEPLOYMENT.md` § Attaching the domain and `docs/PRIVATE-LAUNCH-GATE.md`.
- Left locally on purpose: `.env` (ignored), `ref/` (ignored), `.aider.*` chat history files (ignored — his call whether to delete).

---

## Session — 2026-09-24 (port the August fixes, go live, kill the preview copy)

**Machine:** M3 (Buffy)
**Project:** camtaylor
**Continues:** the dispatch-engine / route-spine session above.

**Done:**
- [x] **Ported the worthwhile August-line fixes onto the local line** (Cam chose "my Sep line, port their fixes"): new `src/components/SatohashProvenance.tsx` rendered on `/route/:ventureId`, `https://api.satohash.io` added to the CSP `connect-src`, `min-height: 100dvh`, 44px `nav-menu-btn`, `-webkit-backdrop-filter` on every remaining backdrop, and `axioms-grid` two-column ≤1000px / one-column ≤640px. Deliberately **not** ported: the remote `index.css` consolidation (it would collide with `bold-modern.css`) and the "Deal Architect" voice — Sherpa wins.
- [x] **Ported the device-QA matrix** as `tests/device-qa.spec.ts`, rewritten against current markup and driven by viewport size rather than a UA string.
- [x] **The matrix immediately found three real phone defects, all fixed:** (1) `.glow-orb` (`right: -15%`) gave the page a horizontal scrollbar on phones; (2) `.log-filter-btn`, `.venture-filter-btn` and `.theme-toggle` were under 40px tall; (3) `.nostr-card` could not shrink below its min-content, forcing 19px of overflow at 320px — fixed with `min-width: 0` on the card and its header column.
- [x] **Deployed to production.** Created the Cloudflare Pages project `camtaylor` (`wrangler pages project create camtaylor --production-branch main`) and ran `npm run deploy:live`. Production URL: **https://camtaylor.pages.dev** (currently serving `assets/index-DiA1UCzx.js`). Verified live: routes 200, `/feed.xml` with six items, `/sitemap.xml`, dispatch reader, venture route, CSP header carries `api.satohash.io`.
- [x] **Found and fixed a launch blocker on the first public deploy.** The navbar badge, the footer signal and the contact delivery note were *hardcoded* preview copy, so the live site still read `LIVE / PRIVATE PREVIEW` in the header and told visitors "Private preview never sends." All three now branch on `IS_PRIVATE_PREVIEW`, and `scripts/quality-check.mjs` gained a guard that fails the build when preview copy is not gated.
- [x] Redeployed after the fix; served bundle verified free of preview copy, and a temporary live spec (since deleted) confirmed homepage, dispatch reader, feed, venture provenance and an enabled contact form against the real URL.
- [x] `npm run quality` ✓, `npx tsc -b` ✓, `npm run lint` 0 errors / 1 pre-existing warning, `npm test` **41/41** pass (was 35).

**Decisions:**
- Porting was **selective**: features and defects only, never the August theme tokens or the rebranded voice, because Cam locked the reviewed Sherpa design this session.
- Preview copy must be *branched*, never hardcoded — the quality-check guard exists so a public build can never regress into advertising a private preview.
- Local `main` is the published line. `origin/main` was originally a parallel lineage (2026-08-09 → 08-13, "Deal Architect" maturity rebrand) diverging in 28 files; **Cam approved a force-push this session**, so `origin/main` now points at this line. The August commits remain reachable on `m3/2026-09-24-publish` and `origin/talent`.

**Git State:**
- SHA: `5137415b87fcc07ba9a34a5e600ec83be62c6461` (branch `main`)
- `origin/main` was force-pushed to that SHA — `origin/main..HEAD` is now empty. `m3/2026-09-24-publish` also carries it as a safety copy; anything needed from the August line still lives on that branch and `origin/talent`.
- **`origin/HEAD` still points at `origin/talent`** — Cam should set the default branch to `main` in GitHub repository settings.
- Working tree clean; `.env`, `ref/` and `.aider.*` remain ignored and local.

**Open for Cam:**
1. Review the six seed dispatches and test one real contact-form submission.
2. Switch `camtaylor.ca` + `www` to the Pages project in the Cloudflare dashboard (see below) and delete the old WordPress records.
3. Set the GitHub default branch to `main` (`origin/HEAD` still points at `talent`).

**DNS switch (dashboard, no wrangler DNS scope):** Workers & Pages → `camtaylor` → Custom domains → **Set up a domain** → add `camtaylor.ca`, then `www`. Cloudflare will offer to create the CNAME/proxy records; accept **only** if it removes the old WordPress `A`/`CNAME` records for the apex and `www`. The live WordPress origin is LiteSpeed/PHP 8.1.34 behind the proxy — its origin records must be deleted, then the hosting cancelled.

**Kimi — read this before you deploy anything:**
- **I want to own the camtaylor deployment.** I created the Cloudflare Pages project `camtaylor` this session and published the current `main` with `npm run deploy:live` (`wrangler pages deploy dist --project-name camtaylor --branch main`). **https://camtaylor.pages.dev is my deployment.**
- **You have your own deployment pipeline** — that is fine and I am not asking you to tear it down. But we must not both point `camtaylor.ca` at different targets or deploy the same project from two pipelines, or we will silently overwrite each other and nobody will know which build a visitor got.
- **So, please confirm in a handoff note which way we go:** either (a) you keep yours and I stop using `deploy:live` for `camtaylor`, or (b) the Pages project `camtaylor` is the single production target and yours becomes a staging/preview only. If (b), the published line is `main` and the only deploy command is `npm run deploy:live`.
- **Do not attach `camtaylor.ca` or `www` until that is settled.** Cam performs the apex/`www` switch himself in the dashboard (this wrangler token has no DNS scope), and it must happen once, to one target.
- **Same rule for the old WordPress site:** nothing gets deleted until the switch is agreed, so we keep a rollback path.
- If your deployment is on THOR rather than Cloudflare Pages, say so plainly in your note — the difference matters, because the repo's `public/_headers`, `_redirects` and `sw.js` only take effect on Cloudflare Pages.

---
