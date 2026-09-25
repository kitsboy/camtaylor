import { IS_PRIVATE_PREVIEW, PLAUSIBLE_DOMAIN, UMAMI_WEBSITE_ID } from '../data/site';

type EventSender = (event: string, options?: { props?: Record<string, string> }) => void;

declare global {
  interface Window {
    plausible?: EventSender;
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

/**
 * Every third-party host this module can load a script from.
 *
 * `scripts/quality-check.mjs` reads this list with a regex and fails the build if
 * `public/_headers` stops allowing any of them in `script-src` or `connect-src` — a blocked
 * script looks exactly like no analytics, which is how `trackEvent` managed to be a no-op for a
 * whole release without anyone noticing.
 *
 * Two providers are wired because the choice is not ours to make: Kimi runs a self-hosted Umami
 * for the Give A Bit family (`ref/GROK-BOOT.md` names `analytics.giveabit.io` and this site's
 * website ID), and this repo's own earlier default was Plausible. Whichever variable is set
 * wins, and nothing loads while both are empty — which is the current state and the launch
 * default. `docs/KIMI-HANDOFF.md` carries the open question.
 */
export const ANALYTICS_HOSTS = [
  'https://plausible.io',
  'https://analytics.giveabit.io',
] as const;

interface AnalyticsProvider {
  /** Must appear in `ANALYTICS_HOSTS`; the quality gate checks it against the CSP. */
  host: string;
  script: string;
  /** The configured ID for this provider, or null while it is switched off. */
  id: () => string | null;
  /** Sets the identifying attributes and returns the dispatcher this provider's events use. */
  configure: (script: HTMLScriptElement, id: string) => EventSender;
}

const PROVIDERS: AnalyticsProvider[] = [
  {
    host: 'https://plausible.io',
    script: 'https://plausible.io/js/script.tagged-events.js',
    id: () => PLAUSIBLE_DOMAIN,
    configure: (script, id) => {
      script.dataset.domain = id;
      script.dataset.analytics = 'plausible';
      return (event, options) => window.plausible?.(event, options);
    },
  },
  {
    // Kimi's way: Umami self-hosted on THOR, reverse-proxied to this public name.
    host: 'https://analytics.giveabit.io',
    script: 'https://analytics.giveabit.io/script.js',
    id: () => UMAMI_WEBSITE_ID,
    configure: (script, id) => {
      script.dataset.websiteId = id;
      script.dataset.analytics = 'umami';
      // Umami takes the properties directly, where Plausible nests them under `props`.
      return (event, options) => window.umami?.track(event, options?.props);
    },
  },
];

/** The provider that has been switched on, or null while analytics is off. */
function activeProvider(): { provider: AnalyticsProvider; id: string } | null {
  // A private preview is not public traffic, so it is never counted — and a build that still
  // announces itself as a preview is the one build nobody should be reading numbers from.
  if (IS_PRIVATE_PREVIEW) return null;
  for (const provider of PROVIDERS) {
    const id = provider.id();
    if (id) return { provider, id };
  }
  return null;
}

let send: EventSender | null = null;
let ready = false;
const pending: Array<() => void> = [];

/**
 * Everything the site tracks is a no-op until this runs. It is called from `main.tsx`.
 *
 * Until this existed, `trackEvent` was dead code in production: no script was ever loaded,
 * `window.plausible` was never defined, and every event the site fired — `form_start`,
 * `form_submit`, `form_success`, `form_error` — went nowhere. Nothing said so, which is the same
 * failure mode as the contact form itself: a surface that reports nothing and is therefore
 * assumed to be fine.
 *
 * This is the **only** place an analytics script may be created. It briefly was not: a React
 * effect in `src/components/Analytics.tsx` loaded Plausible's plain script while this function
 * loaded the tagged-events one, so switching Plausible on would have loaded two scripts and
 * counted the pageview twice. `npm run quality` fails the build if any other module names one of
 * these hosts.
 */
export function initAnalytics(): void {
  if (typeof document === 'undefined') return;
  const active = activeProvider();
  if (!active || document.querySelector('script[data-analytics]')) return;

  const { provider, id } = active;
  const script = document.createElement('script');
  script.defer = true;
  script.src = provider.script;
  send = provider.configure(script, id);
  // Events fired before the script lands are queued, not dropped — the first events on this
  // site are the ones a visitor triggers in the first second.
  script.onload = () => {
    ready = true;
    while (pending.length) pending.shift()?.();
  };
  document.head.appendChild(script);
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  const dispatch = () => send?.(name, props ? { props } : undefined);
  if (ready) dispatch();
  else if (activeProvider()) pending.push(dispatch);
}
