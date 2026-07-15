#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: 'https://camtaylor.ca/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://camtaylor.ca/field-guide', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://camtaylor.ca/2026', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://camtaylor.ca/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: 'https://camtaylor.ca/terms', priority: '0.3', changefreq: 'yearly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Cam Taylor — Expedition Log</title>
    <link>https://camtaylor.ca/#expeditions</link>
    <description>Deal architecture and venture operations from the field.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>camtaylor.ca — 100 elite upgrades</title>
      <link>https://camtaylor.ca/</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Mobile-first polish, a11y, performance, and Cloudflare-ready deploy config.</description>
    </item>
  </channel>
</rss>
`;

writeFileSync(join(publicDir, 'expedition-log.xml'), feed);
console.log('Generated sitemap.xml and expedition-log.xml');