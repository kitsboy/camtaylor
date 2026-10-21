import { useEffect, useState } from 'react';
import { WifiOff, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Honest offline + install surface for the PWA.
 *
 * - When the browser goes offline, show a slim banner: "You're offline — the
 *   last good reading is still here." It never claims a live number is current.
 * - When the browser fires `beforeinstallprompt` (Chrome/Edge/Android), offer
 *   an "Install" action so the site works as a real tool. Dismissed prompts
 *   are not re-shown this session.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(() => !navigator.onLine);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onOff = () => setOffline(true);
    const onOn = () => setOffline(false);
    window.addEventListener('offline', onOff);
    window.addEventListener('online', onOn);
    return () => {
      window.removeEventListener('offline', onOff);
      window.removeEventListener('online', onOn);
    };
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const doInstall = async () => {
    if (!installEvt) return;
    await installEvt.prompt();
    const choice = await installEvt.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallEvt(null);
  };

  if (offline) {
    return (
      <div className="offline-banner" role="status" aria-live="polite">
        <WifiOff size={14} />
        <span>You&apos;re offline — the last good reading is still here, but nothing is live right now.</span>
      </div>
    );
  }

  if (installEvt && !installed) {
    return (
      <div className="offline-banner offline-banner--install" role="status">
        <Download size={14} />
        <span>Use this as a tool — install the Sherpa deck.</span>
        <button type="button" className="offline-banner-btn" onClick={() => void doInstall()}>
          Install
        </button>
      </div>
    );
  }

  return null;
}
