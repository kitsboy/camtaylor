#!/usr/bin/env node
/**
 * Writes the machine-readable surface of the site at build time:
 *   - public/sitemap.xml  (static routes + one entry per dispatch)
 *   - public/feed.xml     (RSS 2.0, one item per dispatch)
 *   - public/build-meta.json  (commit + version the build came from)
 *
 * The dispatch content lives in `src/content/dispatches/*.md`. This script parses
 * their frontmatter with the same plain `key: value` rules the app uses in
 * `src/utils/dispatches.ts` — keep the two in step if the format changes.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const dispatchDir = join(root, 'src', 'content', 'dispatches');
const ORIGIN = 'https://camtaylor.ca';

function unquote(value) {
  return value.replace(/^["']|["']$/g, '').trim();
}

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');
    if (at === -1) continue;
    fields[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
  }
  return { fields, body: match[2].trim() };
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function loadDispatches() {
  let files = [];
  try {
    files = readdirSync(dispatchDir).filter((file) => file.endsWith('.md'));
  } catch {
    return [];
  }

  return files
    .map((file) => {
      const parsed = parseFrontmatter(readFileSync(join(dispatchDir, file), 'utf8'));
      if (!parsed) return null;
      const { fields, body } = parsed;
      const title = unquote(fields.title ?? '');
      const date = unquote(fields.date ?? '');
      if (!title || !date) return null;
      if (/^true$/i.test(fields.draft ?? '')) return null;
      // Keep this in step with src/utils/dispatches.ts: the date prefix in the
      // filename is for sorting only and never appears in a URL.
      return {
        slug:
          unquote(fields.slug ?? '') ||
          file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
        title,
        date,
        terrain: unquote(fields.terrain ?? '') || 'Field notes',
        summary: unquote(fields.summary ?? '') || body.split(/\n{2,}/)[0].replace(/\s+/g, ' '),
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const dispatches = loadDispatches();

// Dates come from the content, never from the clock.
//
// This file used to stamp `new Date()` on every static URL and on `lastBuildDate`, so
// every deploy claimed all twelve pages had changed that day — which is the fastest way
// to teach a crawler to ignore the field — and it made the two files dirty on every build
// for no reason a reader could see. The homepage's last change is the newest dispatch,
// because a dispatch is what changes it; the four pages that only change when someone
// edits the page itself carry no `lastmod` at all, which the sitemap schema allows and
// which is more honest than inventing a date for them.
const newestDispatch = dispatches[0]?.date ?? null;

const staticUrls = [
  { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly', lastmod: newestDispatch },
  { loc: `${ORIGIN}/field-guide`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${ORIGIN}/2026`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${ORIGIN}/privacy`, priority: '0.3', changefreq: 'yearly' },
  { loc: `${ORIGIN}/terms`, priority: '0.3', changefreq: 'yearly' },
];

const dispatchUrls = dispatches.map((dispatch) => ({
  loc: `${ORIGIN}/dispatch/${dispatch.slug}`,
  priority: '0.6',
  changefreq: 'yearly',
  lastmod: dispatch.date,
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dispatchUrls]
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

const feedItems = dispatches
  .map(
    (dispatch) => `    <item>
      <title>${escapeXml(dispatch.title)}</title>
      <link>${ORIGIN}/dispatch/${dispatch.slug}</link>
      <guid isPermaLink="true">${ORIGIN}/dispatch/${dispatch.slug}</guid>
      <category>${escapeXml(dispatch.terrain)}</category>
      <pubDate>${new Date(`${dispatch.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(dispatch.summary)}</description>
    </item>`,
  )
  .join('\n');

// The feed's own content changes when a dispatch lands, and at no other time, so its
// build date is the newest dispatch rather than the moment someone ran a deploy.
const lastBuildDate = newestDispatch
  ? new Date(`${newestDispatch}T12:00:00Z`).toUTCString()
  : new Date(0).toUTCString();

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cam Taylor — Expedition Log</title>
    <link>${ORIGIN}/#expeditions</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Dated dispatches from the field: deal architecture, capital, and venture operations.</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`;

writeFileSync(join(publicDir, 'feed.xml'), feed);

// Build metadata — the identity marker for deploy verification.
//
// Cloudflare Pages sets CF_PAGES_COMMIT_SHA to the commit it built from, so a
// build on the Pages builder carries the exact source commit. Locally we fall
// back to git HEAD. The verifier (scripts/deploy-check.sh) requires the LIVE
// site's build-meta.json to name the commit being shipped — identity, not a
// build clock, because a timestamp floor once passed a stale deploy by 41
// seconds on another site.
const pkgVersion =
  JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version ?? '';
let commitSha = process.env.CF_PAGES_COMMIT_SHA || '';
if (!commitSha) {
  try {
    commitSha = execSync('git rev-parse HEAD', { cwd: root })
      .toString()
      .trim();
  } catch {
    commitSha = '';
  }
}
writeFileSync(
  join(publicDir, 'build-meta.json'),
  `${JSON.stringify(
    {
      commit: commitSha,
      version: pkgVersion,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Generated sitemap.xml (${staticUrls.length + dispatchUrls.length} urls), feed.xml (${dispatches.length} dispatches) and build-meta.json (commit ${commitSha.slice(0, 7) || 'unknown'})`,
);
