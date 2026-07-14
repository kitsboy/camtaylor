import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import {
  NOSTR_IDENTITIES,
  NOSTR_NAMESPACE_URL,
  NOSTR_PAGE_URL,
  NOSTR_JSON_URL,
  nip05LocalPart,
} from '../data/nostr';

type VerifyState = 'idle' | 'checking' | 'verified' | 'failed';

function NostrCard({ identity, index }: { identity: (typeof NOSTR_IDENTITIES)[0]; index: number }) {
  const [copied, setCopied] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  useEffect(() => {
    let active = true;
    const local = nip05LocalPart(identity.nip05);
    if (!local) return;

    setVerifyState('checking');
    fetch(NOSTR_JSON_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const hex = data?.names?.[local];
        setVerifyState(typeof hex === 'string' && hex.length === 64 ? 'verified' : 'failed');
      })
      .catch(() => {
        if (active) setVerifyState('failed');
      });

    return () => {
      active = false;
    };
  }, [identity.nip05]);

  const copyNip05 = async () => {
    try {
      await navigator.clipboard.writeText(identity.nip05);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      className="nostr-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <img src={identity.avatar} alt={identity.name} className="nostr-avatar" width={64} height={64} />

      <div className="nostr-card-body">
        <div className="nostr-card-header">
          <div>
            <h4 className="nostr-name">{identity.name}</h4>
            <p className="nostr-role">{identity.role}</p>
          </div>
          {verifyState === 'checking' && (
            <span className="nostr-badge nostr-badge-pending">Verifying…</span>
          )}
          {verifyState === 'verified' && (
            <span className="nostr-badge nostr-badge-verified">
              <ShieldCheck size={12} />
              NIP-05 verified
            </span>
          )}
          {verifyState === 'failed' && (
            <span className="nostr-badge nostr-badge-failed">
              <ShieldAlert size={12} />
              Unverified
            </span>
          )}
        </div>

        <div className="nostr-nip05-row">
          <code className="nostr-nip05">{identity.nip05}</code>
          <button
            type="button"
            onClick={copyNip05}
            className="nostr-copy-btn"
            aria-label={`Copy ${identity.nip05}`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <div className="nostr-relays">
          {['damus.io', 'nos.lol', 'snort.social'].map((r) => (
            <span key={r} className="nostr-relay-chip">{r}</span>
          ))}
        </div>

        <div className="nostr-links">
          <a href={identity.profileUrl} target="_blank" rel="noopener noreferrer" className="nostr-link">
            Profile <ExternalLink size={11} aria-hidden="true" />
          </a>
          <a href={NOSTR_NAMESPACE_URL} target="_blank" rel="noopener noreferrer" className="nostr-link">
            Verify namespace <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export const NostrIdentities: React.FC = () => {
  return (
    <div className="nostr-section">
      <div className="nostr-section-header">
        <h3 className="nostr-section-title">NOSTR Identity</h3>
        <p className="nostr-section-sub">
          Verified @giveabit.io namespace — cryptographic identity, not rented blue checks.
        </p>
        <a href={NOSTR_PAGE_URL} target="_blank" rel="noopener noreferrer" className="nostr-section-link">
          View on giveabit.io/nostr <ExternalLink size={12} />
        </a>
      </div>

      <div className="nostr-grid">
        {NOSTR_IDENTITIES.map((identity, index) => (
          <NostrCard key={identity.id} identity={identity} index={index} />
        ))}
      </div>
    </div>
  );
};