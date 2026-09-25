import { PLAUSIBLE_DOMAIN } from '../data/site';

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

// Kept as a bare `const SCRIPT_HOST = …` on purpose: `scripts/quality-check.mjs` reads it
// with a regex and fails the build if public/_headers stops allowing the host.
const SCRIPT_HOST = 'https://plausible.io';
const pending: Array<() => void> = [];

/**
 * Everything the site tracks is a no-op until this runs. It is called from `main.tsx`.
 *
 * Until this existed, `trackEvent` was dead code in production: no script was ever
 * loaded, `window.plausible` was never defined, and every event the site fired —
 * `form_start`, `form_submit`, `form_success`, `form_error` — went nowhere. Nothing said
 * so, which is the same failure mode as the contact form itself: a surface that reports
 * nothing and is therefore assumed to be fine. The host is also named in
 * `public/_headers` (script-src and connect-src) and `npm run quality` fails if the two
 * ever disagree, because a blocked script looks exactly like no analytics.
 */
export function initAnalytics(): void {
  if (!PLAUSIBLE_DOMAIN || typeof document === 'undefined') return;
  if (document.querySelector('script[data-analytics="plausible"]')) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = `${SCRIPT_HOST}/js/script.tagged-events.js`;
  script.dataset.analytics = 'plausible';
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  // Events fired before the script lands are queued, not dropped — the first events on
  // this site are the ones a visitor triggers in the first second.
  script.onload = () => {
    while (pending.length) pending.shift()?.();
  };
  document.head.appendChild(script);
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  if (!PLAUSIBLE_DOMAIN) return;
  const send = () => window.plausible?.(name, props ? { props } : undefined);
  if (window.plausible) send();
  else pending.push(send);
}
