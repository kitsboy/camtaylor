import { SITE } from './site';

/**
 * The "now" page is only as honest as its last edit — this date is printed on
 * the page under the title, and bumped every time the route changes. Nothing
 * here asserts a status the site's own data does not already carry.
 */
export const NOW_LAST_UPDATED = '2026-11-10';

/** What the desk is actively on — directly mirrors `SITE.currentRoutes`, so they cannot drift. */
export const NOW_FOCUS: string[] = [...(SITE.currentRoutes ?? [])];

export const NOW_INTRO = `Where the route stands, stated plainly. The site is a live instrument — this page is a still from the instrument's current reading, stamped with its date.`;
export const NOW_FOOTNOTE = `This page is only as current as its last edit. The live section and the expedition log keep the minute-to-minute truth.`;
