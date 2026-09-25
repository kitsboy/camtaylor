# Latest update

**Session:** 2026-09-25 (M3 / Buffy) · **Branch:** `main` — push = deploy · **100/100 tests**

Cam asked for two things: ask Kimi how she sets up analytics, and check whether she did the email.
**She did it — mid-session.** She answered all ten questions, set both Cloudflare Pages production
variables and pinned them in `wrangler.toml [vars]`, which triggered the production rebuild. The live
site now proves it. The analytics ask came with a bug attached: **the site had two analytics loaders
that disagreed**, and the one pointed at Kimi's own server was one CSP line from being silently
blocked.

## The email: done, verified, and it exposed a broken verification command

`npm run check:live-form` against https://camtaylor.ca now reads:

```
  submit button enabled · preview notice absent
  delivery note: Submissions are delivered to hello@giveabit.io, the monitored inquiry inbox,
  through Formspree.
```

Kimi's `wrangler.toml` declares `VITE_PRIVATE_PREVIEW=false` and `VITE_FORMSPREE_FORM_ID="xpqgopvd"`
(the family's live form, delivering to `hello@giveabit.io`, with a `[camtaylor.ca]` subject prefix so
camtaylor submissions stay distinct in a shared inbox), and the published app chunk carries exactly
that ID and no longer the `xykqodnk` placeholder.

**The command that was supposed to prove this could never have done so.** It searched the published
JavaScript for a literal `formspree.io/f/<id>`, which `@formspree/react` never emits — it builds that
URL from the ID at runtime. So on a *correct* production build the probe reported *"no Formspree
endpoint could be found at all"*, which is indistinguishable from a form posting nowhere. Fixed: the
probe reads the endpoint declared in `wrangler.toml`, requires that ID in the published bundle,
requires a bundled Formspree client, and still fails on the placeholder. It exits **0** now.

**Still open from her reply:** repoint the five `cam@camtaylor.ca` occurrences at
`hello@giveabit.io`, prefix the form subject `[camtaylor.ca]`, and add the opt-in live submission test
(never in CI).

## The analytics: her way is already half-wired here

Kimi's way is a **self-hosted Umami** on THOR behind `analytics.giveabit.io`, and `ref/GROK-BOOT.md`
on this machine already records **camtaylor.ca's website ID**. The decision of *which* analytics the
site uses is hers and Cam's — so nothing was switched on, and both analytics IDs remain empty.

What this session did was remove the two reasons her answer could not have been used:

1. **Two loaders, one pageview twice.** `src/components/Analytics.tsx` (rendered from `App.tsx`)
   loaded Plausible's plain script; `initAnalytics()` from `main.tsx` loaded the tagged-events one.
   Setting `VITE_PLAUSIBLE_DOMAIN` — documented in the last handoff as "the one-line switch" — would
   have loaded both.
2. **Her host was not allowed, and nothing would have said so.** The Umami loader existed, but
   `public/_headers` allowed only `plausible.io`: a script the browser refuses and an event POST it
   refuses, reading exactly like no visitors. The quality gate read a *single* host constant out of
   one of the two files, so it reported green on the configuration that was broken.

Both fixed by making `src/utils/analytics.ts` the only place a script is created: a provider table
(Plausible, Umami) each with its host, its script URL and its own event dispatcher — Plausible's
`plausible(name, {props})` versus Umami's `umami.track(name, props)` — gated on
`VITE_PRIVATE_PREVIEW` as well as on an ID. `Analytics.tsx` is deleted. The gate now checks every
host against `script-src` **and** `connect-src`, and fails if any other module carries an analytics
script URL. Three canaries, and one of the new rules caught my own privacy-page wording before it
was trusted.

**One line is now the whole switch**, in the Pages production environment:
`VITE_UMAMI_WEBSITE_ID=<camtaylor's Umami id>` or `VITE_PLAUSIBLE_DOMAIN=camtaylor.ca`.

## Also

- `docs/DEPLOYMENT.md`, `docs/PRIVATE-LAUNCH-GATE.md`, `.env.example`, `README.md` and the privacy
  page all still described analytics as Plausible-only or absent. They describe the two-provider
  switch now, and the privacy page names both hosts while saying plainly that nothing loads today.

## Verification

**100/100 Playwright tests**, `npm run quality` ✓, `npx tsc -b` ✓, `npx oxlint` 0 errors (1
pre-existing `ThemeContext` warning). Every new guard was canaried against the bug it exists for.

## Next

- **Kimi's analytics answer.** Which provider, which ID, and whether the ID goes in `wrangler.toml`
  `[vars]` the way the form's did. Nothing is switched on until she answers — both IDs stay empty.
- **The three things her email reply asks for:** the `cam@camtaylor.ca` repoint, the
  `[camtaylor.ca]` subject prefix, and the opt-in live submission test that would prove delivery end
  to end.
- **Worth doing with Cam's eye:** the desktop page is 14,817px, and the section that remains long
  does so because of its prose, not its chrome. Cutting further is a copy decision.
