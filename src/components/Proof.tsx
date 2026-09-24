import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { FAMILY_OFFERINGS } from '../data/family';

type Health = 'checking' | 'live' | 'unreachable';

export const Proof: React.FC = () => {
  const [health, setHealth] = useState<Record<string, Health>>(() => Object.fromEntries(FAMILY_OFFERINGS.map(({ id }) => [id, 'checking'])));
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setHealth(Object.fromEntries(FAMILY_OFFERINGS.map(({ id }) => [id, 'checking'])));
    const results = await Promise.all(FAMILY_OFFERINGS.map(async (offering) => {
      try {
        await fetch(offering.url, { mode: 'no-cors', cache: 'no-store' });
        return [offering.id, 'live'] as const;
      } catch {
        return [offering.id, 'unreachable'] as const;
      }
    }));
    setHealth(Object.fromEntries(results));
    setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  useEffect(() => {
    let active = true;
    void checkHealth().then(() => {
      if (!active) return;
    });
    return () => { active = false; };
  }, [checkHealth]);

  const liveCount = Object.values(health).filter((state) => state === 'live').length;
  const checkedCount = Object.values(health).filter((state) => state !== 'checking').length;
  const isChecking = checkedCount < FAMILY_OFFERINGS.length;

  return (
    <section className="proof-section" id="proof">
      <div className="proof-shell">
        <div className="proof-heading">
          <div>
            <p className="section-kicker">PROOF / TRUTH</p>
            <h2 className="section-title">Show the work.</h2>
            <p className="proof-quote">“We&apos;d rather show you old truth than new lies.”</p>
          </div>
          <div className="proof-summary" aria-live="polite">
            <button type="button" className="proof-refresh" onClick={() => void checkHealth()} disabled={isChecking} aria-busy={isChecking}>Refresh signal</button>
            <ShieldCheck size={18} />
            <strong>{checkedCount ? `${liveCount}/${FAMILY_OFFERINGS.length}` : '—'}</strong>
            <span>family links reachable</span>
          </div>
        </div>
        <div className="proof-signal-legend" aria-label="Proof status legend"><span className="proof-legend-live">● Reachable</span><span className="proof-legend-checking">◌ Checking</span><span className="proof-legend-error">● Could not verify</span></div>
        <div className="proof-grid proof-grid--dashboard">
          {FAMILY_OFFERINGS.map((offering) => {
            const state = health[offering.id];
            return (
              <a key={offering.id} className="proof-row" href={offering.url} target="_blank" rel="noopener noreferrer">
                <span className="proof-site" style={{ '--proof-color': offering.color } as React.CSSProperties}><i />{offering.name}</span>
                <span className={`proof-state proof-state--${state}`}>
                  {state === 'checking' && <Loader2 size={13} className="proof-spin" />}
                  {state === 'live' && <CheckCircle2 size={13} />}
                  {state === 'unreachable' && <XCircle size={13} />}
                  {state === 'checking' ? 'Checking' : state === 'live' ? 'Reachable' : 'Could not verify'}
                </span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            );
          })}
        </div>
        <p className="proof-note">This browser check is a simple signal, not a promise of uptime. If a project cannot be verified, we say so.{lastChecked ? ` Last checked locally at ${lastChecked}.` : ''}</p>
      </div>
    </section>
  );
};
