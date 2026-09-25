# camtaylor — Last Updated 2026-09-25 by Buffy

**Status:** LIVE on Cloudflare Pages. camtaylor.ca + www both serve the Sherpa site.

**Latest (Buffy, the phone page by prose depth):** Cam asked to shrink the phone page by cutting the
prose depth of the **hero, manifesto and contact** sections. Four commits, each pushed on its own.
Nothing was deleted — every fact, quote, link and principle is still there, and **desktop is untouched
at 15,067px**.

| 390 × 844, folds closed | before | after |
|---|---|---|
| hero | 1,329px | **1,072px** |
| manifesto | 1,280px | **1,082px** |
| contact | 2,450px | **1,672px** |
| **phone page** | 19,973px · 23.7 screens | **18,739px · 22.2 screens** |

- **Hero** (`cd310bb`): the two `.metric-divider` elements are grid items, so three metrics plus two
  dividers in one column laid out as **five rows — two holding nothing but a 1px rule**. Metrics
  182 → 111, route strip 98 → 40 (its twelve bars are decoration and already parked), actions
  164 → 120, video 218 → 182.
- **Manifesto** (`ea3dbf6`): card padding, the 40px icon block and the 1.65 line-height came down, and
  the section's 67px of `--section-gap` per side went to 46.
- **Contact** (`7f5d250`): the sidebar was 1,028px and **mostly repeats the page** — the spotlight
  quote is in the testimonials section, "How it works" repeats the delivery note below it, the Nostr
  card repeats the footer, "Based in" repeats the hero meta. A phone keeps the three things a reader
  uses and holds the other four cards behind one tap. 2,450 → 1,672.

**A bug this exposed** (`ed77b03`): the featured video entered from `x: 28` inside a shell that clips
its overflow, so its right edge was being **cut for the first second of every load** and the shell's
`scrollWidth` sat 20px past its `clientWidth`. It only passed its test because the padding was 22px
against a 20px shift — two pixels of luck. It now rises from below, verified frame by frame at 430,
390 and 320px. **The masthead test now prints the width, the pixel count and the offending element**
instead of just "it overflows".

**⚠️ Finding for Kimi — a phone rule only works in the file that owns the property.** Import order is
`index.css` → `mobile.css` → `upgrades.css` → `bold-modern.css` → `footer.css` → `touch.css`, so an
unscoped rule in a later file beats a phone media query in an earlier one. Three rules in the repo are
**dead** for this reason (`mobile.css`'s `.hero-shell` padding; `index.css`'s `.manifesto-section` and
`.contact-section` paddings). Rules this session went wherever they actually win, which is not the
obvious file. Worth deciding: one home for responsive overrides, or a check that reports the winner.

**New guard:** the phone page must stay under **20,000px** with folds closed. Length is the thing that
comes back and nothing else in the suite can see it; canaried by disabling the folds (22,636px → fails
with "26.8 screens" in the message).

**Full suite 70/70** (was 69), quality ✓, `tsc` ✓, lint 0 errors. Detail and measurements in
`docs/KIMI-HANDOFF.md`.

**Open items for Kimi / Cam:** the contact sidebar's four folded cards (a testimonial sitting next to
the form is doing sales work — one line to bring it back); the phone poster cropped 16/9 → 21/9; the
**no-mouse pass on the live build**, still unrun; the fold numbers on real hardware at 375/414px; one
contact form submission reaching the real inbox.

**Ownership — settled:** Kimi owns the camtaylor deployment. Cam + Kimi are the decision pair.
Buffy is a subordinate coding tool, NOT the boss.

**Deploy:** `npm run deploy:live` from `main` — the only deploy command. Cloudflare Pages project
`camtaylor`.

---

## Next three UI upgrades — Buffy's proposal

**1. Win the first screen. (my pick — measurable today, no new copy)**
At 390 × 844 the hero's primary button **"See the Route" sits at 866px: 22px below the first screen**.
And `index.css` sets `.hero-video-wrap { order: -1 }` on phones, so the first screen is two location
chips, a status chip, a rotating route line and **a video poster — with no name and no button**, and
"Cam Taylor Sherpa." not until 549px. Every fact is in place already; it is an ordering and spacing
problem. The target is one screen that shows who this is and one thing to do, with the poster and the
route strip below. Verifiable: assert the title and the primary CTA are inside the first viewport at
375/390/414.

**2. Finish the phone page: `signal` and `services`.**
The pass just now took the sections Cam named. The two biggest left are untouched: **services 2,107px
and signal 1,883px** — together 4,000px, nearly 5 screens, more than everything handled today. Same
method: measure the blocks, compact the chrome, fold the tail. The section folds and the length budget
from this session are already in place to hold whatever it finds.

**3. A no-mouse pass on the live build.**
Still the biggest untested surface: the custom cursor, the hero canvas, the scroll reveals, the
rotating route status (it changes every few seconds and is **silent to a screen reader**), the
carousel, the loading screen. Focus rings on ink *and* acid surfaces, a tab order with no traps, an
`aria-live` on the status, arrow keys for the carousel, a skip link that lands right, and reveals that
can never leave content invisible to a keyboard user — the carousel did exactly that until `f0fed9d`,
and the folds raised the same shape twice since.

My pick is **#1**, then **#2** — they are the same kind of work, and #1 is the cheapest real
improvement on the site right now.
