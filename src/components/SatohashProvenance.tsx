import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowUpRight, WifiOff } from 'lucide-react';
import {
  getApiHealth,
  getSatohashUrl,
  sha256Hex,
  verifyUrl,
  stampGuideUrl,
} from '../lib/satohash';

type Health = 'checking' | 'online' | 'offline';

interface SatohashProvenanceProps {
  id: string;
  source: string;
  subject: string;
}

export function SatohashProvenance({ id, source, subject }: SatohashProvenanceProps) {
  const [health, setHealth] = useState<Health>('checking');
  const [digest, setDigest] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getApiHealth().then((res) => {
      if (active) setHealth(res.ok ? 'online' : 'offline');
    });

    sha256Hex(`${subject}\n${source}\n${id}`).then((hash) => {
      if (active) setDigest(hash);
    });

    return () => {
      active = false;
    };
  }, [id, source, subject]);

  const shortDigest = digest ? `${digest.slice(0, 10)}…${digest.slice(-8)}` : null;
  const verifyHref = digest ? verifyUrl(digest) : `${getSatohashUrl()}/verify`;

  return (
    <div className="satohash-proof">
      <div className="satohash-proof-head">
        <ShieldCheck size={15} className="satohash-proof-icon" />
        <span>
          Satohash provenance
          <span className={`satohash-proof-dot satohash-proof-dot--${health}`} aria-hidden="true" />
        </span>
        <span className="satohash-proof-state">
          {health === 'online' ? 'proof plane live' : health === 'offline' ? 'offline' : 'checking…'}
        </span>
      </div>

      <p className="satohash-proof-body">
        {subject} — hash of this route{' '}
        {shortDigest ? <code>{shortDigest}</code> : <code>hashing…</code>}, publicly verifiable via
        OpenTimestamps.
      </p>

      <div className="satohash-proof-actions">
        <a href={verifyHref} target="_blank" rel="noopener noreferrer" className="satohash-proof-link">
          Verify on Satohash <ArrowUpRight size={12} />
        </a>
        <a
          href={digest ? stampGuideUrl(digest) : stampGuideUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="satohash-proof-link"
        >
          Stamp this route
        </a>
        {health === 'offline' && (
          <span className="satohash-proof-offline">
            <WifiOff size={11} /> API unreachable — page links still work
          </span>
        )}
      </div>
    </div>
  );
}
