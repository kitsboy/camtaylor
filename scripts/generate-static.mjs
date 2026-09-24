#!/usr/bin/env node
/**
 * Writes the machine-readable surface of the site at build time:
 *   - public/sitemap.xml  (static routes + one entry per dispatch)
 *   - public/feed.xml     (RSS 2.0, one item per dispatch)
 *
 * The dispatches live in `src/content/dispatches/*.md`. This script parses
 * their frontmatter with the same plain `key: value` rules the app uses in
 * `src/utils/dispatches.ts` — keep the two in step if the format changes.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const dispatchDir = join(root, 'src', 'content', 'dispatches');
const ORIGIN = 'https://camtaylor.ca';
const lastmod = new Date().toISOString().slice(0, 10);

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

const staticUrls = [
  { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
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
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod ?? lastmod}</lastmod>
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

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cam Taylor — Expedition Log</title>
    <link>${ORIGIN}/#expeditions</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Dated dispatches from the field: deal architecture, capital, and venture operations.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`;

writeFileSync(join(publicDir, 'feed.xml'), feed);

console.log(
  `Generated sitemap.xml (${staticUrls.length + dispatchUrls.length} urls) and feed.xml (${dispatches.length} dispatches)`,
);
