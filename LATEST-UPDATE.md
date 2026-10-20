# camtaylor — Last Updated 2026-10-20

- **Mempool pressure gauge** under the three live instruments. Source: mempool.space `/api/v1/fees/mempool-blocks` (projected blocks) plus `/api/mempool` (pending vbytes). Honest live / last-good / offline. No new data host.
- **UI:** nav signal chip follows the real chain read. Command Deck `/signal`, `/fee`, `/price`. Digit tick on chain numbers (skips reduced motion). Hero aurora drifts, and it and the conditions ticker pause when the tab is hidden.
- **Not deployed from this machine.** `npm run deploy:live` was not run. Push to `main` is the git-connected publish. M3 break-glass, if the push does not show up: `git pull origin main && npm install && npm run deploy:live`.

Commit: see `git log -1`
