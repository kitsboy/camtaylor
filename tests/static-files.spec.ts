import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// The sitemap stamped `new Date()` on every static URL and the feed stamped it on
// `lastBuildDate`, so every deploy claimed all twelve pages had changed that day — and the
// two files came out dirty on every build for no reason a reader could see. Both dates now
// come from the dispatch frontmatter, which is the only thing that changes them.

const generate = () => execFileSync('node', ['scripts/generate-static.mjs'], { encoding: 'utf8' });

test('the generated files do not change when nothing changed', () => {
  generate();
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  const feed = readFileSync('public/feed.xml', 'utf8');
  generate();
  expect(readFileSync('public/sitemap.xml', 'utf8'), 'sitemap.xml changes on every build').toBe(sitemap);
  expect(readFileSync('public/feed.xml', 'utf8'), 'feed.xml changes on every build').toBe(feed);
});

test('every date in the machine-readable surface comes from a dispatch', () => {
  generate();
  const sitemap = readFileSync('public/sitemap.xml', 'utf8');
  const feed = readFileSync('public/feed.xml', 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const dates = [...sitemap.matchAll(/<lastmod>([\d-]+)<\/lastmod>/g)].map((match) => match[1]);

  expect(dates.length).toBeGreaterThan(0);
  expect(dates, 'a lastmod is today — that is a build stamp, not a content date').not.toContain(today);
  for (const date of dates) expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  // The homepage's last change is a dispatch, and a page that only changes when someone
  // edits it does not carry a lastmod at all rather than a made-up one.
  const privacy = sitemap.slice(sitemap.indexOf('/privacy'), sitemap.indexOf('/terms'));
  expect(privacy, '/privacy should not claim a lastmod it cannot know').not.toContain('<lastmod>');

  const feedsDate = /<lastBuildDate>([^<]+)<\/lastBuildDate>/.exec(feed)?.[1];
  const pubDates = [...feed.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((match) => match[1]);
  expect(feedsDate, 'the feed claims a build date its own newest item does not').toBe(pubDates[0]);
});
