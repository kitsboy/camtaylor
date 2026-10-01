# camtaylor — Last Updated 2026-10-01

- **4 UI features shipped:**
  - Real-time live panels (WebSocket to mempool.space — chain updates on new block)
  - Calendar-aware Command Deck (`/book` opens Calendly)
  - Dispatch → PDF export (print-to-PDF button on every dispatch)
  - Offline-first PWA (sw.js v4 precaches shell + dispatches + key routes)
- Calendly "Book a route check" is the primary hero CTA.
- `check:links` added to the verify gate (all 30 external links resolve).
- Umami analytics ON (reports to HQ); mobile 390px overflow fixed; deps hardened (0 audit vulns).

Commit: see `git log -1`