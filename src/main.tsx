import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import './index.css';
import './styles/mobile.css';
import './styles/upgrades.css';
import './styles/bold-modern.css';
import './styles/footer.css';
import './styles/touch.css';
import App from './App.tsx';
import { validateSiteConfig } from './data/site';
import { initAnalytics } from './utils/analytics';

declare global {
  interface Window {
    __CAMTAYLOR_SENTRY__?: any;
  }
}

// Client-side Sentry (wired-but-off): dormant until VITE_SENTRY_DSN is set.
// Dynamic import keeps @sentry/react out of the first-paint bundle.
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    window.__CAMTAYLOR_SENTRY__ = Sentry;
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      tracesSampleRate: 0.3,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  });
}

if (import.meta.env.DEV) {
  const configErrors = validateSiteConfig();
  if (configErrors.length > 0) console.warn('Site configuration warnings:', configErrors);
}

// No-op unless an analytics ID is set (VITE_PLAUSIBLE_DOMAIN or VITE_UMAMI_WEBSITE_ID)
// *and* this is a public build; without this call, every event the site fires goes
// nowhere. This is the only place an analytics script is created — see
// `src/utils/analytics.ts` for why that matters.
initAnalytics();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);