import { useEffect } from 'react';
import { SITE } from '../data/site';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const SCHEMA_SELECTOR = 'script[data-page-schema]';

/**
 * The site's own `Person` block lives in `index.html`. Every *page* below the homepage
 * used to carry no structured data at all, which is thin for a site whose pitch is proof:
 * a dispatch that is not an `Article` is not a dated, attributed, quotable thing to
 * anything reading it mechanically. Pages pass their own node and this keeps exactly one
 * of them in the document — replacing rather than appending, so client-side navigation
 * cannot leave a dispatch's schema behind on the next page.
 */
function setPageSchema(serialized: string | null) {
  const existing = document.querySelector<HTMLScriptElement>(SCHEMA_SELECTOR);
  if (!serialized) {
    existing?.remove();
    return;
  }
  const script = existing ?? document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.pageSchema = '';
  script.textContent = serialized;
  if (!existing) document.head.appendChild(script);
}

export function usePageMeta({
  title,
  description,
  path = '/',
  schema,
  image,
}: {
  title: string;
  description: string;
  path?: string;
  /** A JSON-LD node for this page (`Article`, `BreadcrumbList`, …), or nothing. */
  schema?: Record<string, unknown>;
  /** This page's own share card, written by `npm run og`. Defaults to the site card. */
  image?: string;
}) {
  // Serialized outside the effect because it is also the dependency: a fresh object
  // literal at every render would otherwise re-run this effect forever.
  const schemaJson = schema ? JSON.stringify(schema) : null;
  const imagePath = image ?? '/og-image.png';

  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${SITE.name}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE.url}${path}`);
    // One card used to serve every page: a shared dispatch was indistinguishable from the
    // homepage in a feed. Each page now points at its own card, generated from its own words.
    setMeta('property', 'og:image', `${SITE.url}${imagePath}`);
    setMeta('property', 'og:image:type', imagePath.endsWith('.jpg') ? 'image/jpeg' : 'image/png');
    setMeta('name', 'twitter:image', `${SITE.url}${imagePath}`);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    // One card serves every page, so its alt text has to be the page's own or a
    // screen reader reads the homepage's sentence over a dispatch's link.
    setMeta('property', 'og:image:alt', `${fullTitle} — ${description}`);
    setMeta('name', 'twitter:image:alt', `${fullTitle} — ${description}`);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE.url}${path}`;

    setPageSchema(schemaJson);

    // Leaving the page must not leave its structured data behind: the next page would
    // otherwise be described as the one before it.
    return () => setPageSchema(null);
    // `schemaJson`, not the object: callers write an object literal at every render, and a
    // fresh identity in this list would rewrite the head on every render.
  }, [title, description, path, schemaJson, imagePath]);
}