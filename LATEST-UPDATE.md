# camtaylor — Last Updated 2026-09-24 by Buffy (M3)

Brief: The expedition log became a real content engine — markdown dispatches in `src/content/dispatches`, a dated timeline, a `/dispatch/:slug` reader and a generated RSS feed (`/feed.xml`). The homepage is now one route of twelve waypoints with trail signage between sections and an interactive rail that shows camp, framing altitude and conditions. Venture case files gained the capital block. Repo tidied for a Cloudflare-only publish (Vercel/Netlify configs, stale summaries and the cache-first service worker are gone), and the site is deployed to the Pages project `camtaylor` with the private preview off.

Next for Cam: review the six seed dispatches, test the contact form into the real inbox, then switch `camtaylor.ca` + `www` to the Pages project in the Cloudflare dashboard (see `docs/DEPLOYMENT.md`).

Commit: pushed to `main` (Cloudflare Pages: project `camtaylor`)
