/**
 * Service worker.
 *
 * The previous version served everything cache-first, which means a visitor
 * could stay pinned to an old build long after a deploy. This one is
 * network-first for navigations (fresh HTML wins, the cached shell is only a
 * fallback when offline) and cache-first only for hashed build assets, which
 * are immutable by name.
 *
 * Offline-first: the app shell plus the static content routes (dispatches,
 * field guide, 2026, privacy, terms, wisdom) are precached at install, so a
 * returning visitor can read the whole site with no connection. Live chain
 * and market reads are never cached — they are readings, not content.
 *
 * Bump CACHE when this file changes — activation drops every other cache.
 */
const CACHE = 'camtaylor-v4';
const PRECACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/field-guide',
  '/2026',
  '/privacy',
  '/terms',
  '/wisdom',
  '/dispatch/why-this-site-was-rebuilt',
  '/dispatch/sherpa-not-saviour',
  '/dispatch/nostr-as-a-front-door',
  '/dispatch/strata-is-a-legal-problem',
  '/dispatch/syndicate-that-survives-the-descent',
  '/dispatch/proof-before-promise',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never intercept the live chain/market reads or anything cross-origin.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() =>
          caches.match('/index.html').then((cached) => cached || Response.error()),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const cacheable = url.pathname.startsWith('/assets/') || PRECACHE.includes(url.pathname);
        if (cacheable && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
