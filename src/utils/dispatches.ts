/**
 * The expedition log reads real markdown files from `src/content/dispatches`.
 * Frontmatter is deliberately plain (`key: value` lines, comma-separated tags)
 * so the same files can be parsed by the build script for the RSS feed without
 * pulling in a markdown toolchain.
 */

export interface DispatchMeta {
  slug: string;
  title: string;
  /** ISO `YYYY-MM-DD`, taken straight from frontmatter. */
  date: string;
  terrain: string;
  camp: string;
  tags: string[];
  summary: string;
  ventureId: string | null;
  minutes: number;
}

export interface Dispatch extends DispatchMeta {
  body: string;
}

const SOURCES = import.meta.glob('../content/dispatches/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as unknown as Record<string, string>;

function unquote(value: string): string {
  return value.replace(/^["']|["']$/g, '').trim();
}

function parseTags(value: string): string[] {
  return value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => unquote(tag))
    .filter(Boolean);
}

function firstSentence(markdown: string): string {
  const plain = markdown
    .replace(/[#>*`_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const stop = plain.search(/[.!?](\s|$)/);
  return stop === -1 ? `${plain.slice(0, 140)}…` : plain.slice(0, stop + 1);
}

function parseSource(path: string, raw: string): Dispatch | null {
  // Files are date-stamped on disk for sorting; the URL drops that prefix so
  // `/dispatch/sherpa-not-saviour` reads better than the full filename.
  const fallbackSlug = (path.split('/').pop() ?? '')
    .replace(/\.md$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.trim());
  if (!match) return null;

  const [, frontmatter, body] = match;
  const fields: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const at = line.indexOf(':');
    if (at === -1) continue;
    fields[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
  }

  const title = unquote(fields.title ?? '');
  const date = unquote(fields.date ?? '');
  if (!title || !date) return null;

  const trimmedBody = body.trim();
  const words = trimmedBody.split(/\s+/).filter(Boolean).length;

  return {
    slug: unquote(fields.slug ?? '') || fallbackSlug,
    title,
    date,
    terrain: unquote(fields.terrain ?? '') || 'Field notes',
    camp: unquote(fields.camp ?? '') || 'Base Camp',
    tags: fields.tags ? parseTags(fields.tags) : [],
    summary: unquote(fields.summary ?? '') || firstSentence(trimmedBody),
    ventureId: unquote(fields.ventureid ?? '') || null,
    minutes: Math.max(1, Math.round(words / 220)),
    body: trimmedBody,
  };
}

/** Newest first. Drafts never ship. */
export const DISPATCHES: Dispatch[] = Object.entries(SOURCES)
  .map(([path, raw]) => parseSource(path, raw))
  .filter((entry): entry is Dispatch => entry !== null)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

export function getDispatch(slug: string | undefined): Dispatch | null {
  if (!slug) return null;
  return DISPATCHES.find((entry) => entry.slug === slug) ?? null;
}

/** `newer` is the entry above (later date), `older` the one below. */
export function dispatchNeighbours(slug: string): { newer: Dispatch | null; older: Dispatch | null } {
  const index = DISPATCHES.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? DISPATCHES[index - 1] : null,
    older: index < DISPATCHES.length - 1 ? DISPATCHES[index + 1] : null,
  };
}

export function formatDispatchDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month) return date;
  return new Date(Date.UTC(year, month - 1, day || 1)).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: day ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

export function formatDispatchMonth(date: string): string {
  const [year, month] = date.split('-').map(Number);
  if (!year || !month) return date;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}
