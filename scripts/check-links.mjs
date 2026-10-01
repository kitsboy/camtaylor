#!/usr/bin/env node
/**
 * check-links.mjs — verify every external URL the site links to actually resolves.
 *
 * Scans src/data/* and src/content/* for https:// URLs (excluding API/asset hosts and the
 * site's own domain), then HEAD/GETs each and reports any that fail. Run as part of
 * `npm run verify` so a dead venture link, agent link, or trail-kit referral can never
 * ship silently.
 *
 *   node scripts/check-links.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const failures = [];
const checked = new Set();

// Hosts that are API endpoints or data feeds, not pages a visitor clicks. A mempool.space
// API path returning non-2xx under load is not a broken link, so these are skipped.
const API_HOSTS = new Set(['mempool.space', 'api.exchange.coinbase.com', 'api.satohash.io']);
const SELF = new Set(['camtaylor.ca']);

function collectUrls() {
  const urls = new Set();
  const scan = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (name.endsWith('.ts') || name.endsWith('.json') || name.endsWith('.md')) {
        const text = readFileSync(p, 'utf8');
        for (const m of text.matchAll(/https:\/\/[a-zA-Z0-9./_-]+/g)) {
          urls.add(m[0].replace(/[.,;:)]+$/, ''));
        }
      }
    }
  };
  scan(join(ROOT, 'src', 'data'));
  scan(join(ROOT, 'src', 'content'));
  return urls;
}

async function check(url) {
  if (checked.has(url)) return;
  checked.add(url);
  try {
    const host = new URL(url).hostname;
    if (API_HOSTS.has(host) || SELF.has(host)) return;
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    // Some servers reject HEAD; retry once with GET before calling it broken.
    if (!res.ok && res.status >= 400) {
      const get = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12000) });
      if (!get.ok && get.status >= 400) {
        failures.push(`${url} → HTTP ${get.status}`);
      }
    }
  } catch (err) {
    failures.push(`${url} → ${err.message}`);
  }
  // Be a good citizen — don't hammer the family's own hosts.
  await new Promise((r) => setTimeout(r, 150));
}

const urls = collectUrls();
console.log(`check-links: ${urls.size} external URLs found`);
await Promise.all([...urls].map(check));

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log('✓ All external links resolve');