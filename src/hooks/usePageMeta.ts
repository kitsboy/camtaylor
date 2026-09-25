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

export function usePageMeta({
  title,
  description,
  path = '/',
}: {
  title: string;
  description: string;
  path?: string;
}) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${SITE.name}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE.url}${path}`);
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
  }, [title, description, path]);
}