import { useState } from 'react';
import { ArrowUpRight, ShieldCheck, Stamp } from 'lucide-react';
import { sha256Hex, verifyUrl, stampGuideUrl, SATOHASH_SITE } from '../lib/satohash';

/**
 * Slim "verify a Satohash stamp" widget for the camtaylor Proof section.
 *
 * Paste a 64-char SHA-256 hash (or drop a file to hash it) and it deep-links to
 * the Satohash verify page for that digest. Honest-by-design: the browser only
 * computes the SHA-256, never uploads the file, and the actual OpenTimestamps
 * check runs on satohash.io/verify/<hash>. No secret is touched here.
 */
export function SatohashVerify() {
  const [hash, setHash] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const HEX64 = /^[a-f0-9]{64}$/i;

  const onFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const digest = await sha256Hex(buffer);
      setHash(digest);
    } catch {
      setError('Could not hash that file in the browser.');
    } finally {
      setBusy(false);
    }
  };

  const normalized = hash.trim().toLowerCase().replace(/^0x/, '');
  const valid = normalized.length === 64 && HEX64.test(normalized);
  const verifyHref = valid ? verifyUrl(normalized) : `${SATOHASH_SITE}/verify`;

  return (
    <div className="satohash-verify">
      <div className="satohash-verify-head">
        <Stamp size={15} className="satohash-verify-icon" />
        <span>Verify an OpenTimestamps stamp</span>
        <span className="satohash-verify-chip">PROOF</span>
      </div>

      <p className="satohash-verify-body">
        Paste a document&apos;s SHA-256 hash, or drop a file to hash it in your browser (it is
        never uploaded), and check its OpenTimestamps proof on Satohash.
      </p>

      <div className="satohash-verify-controls">
        <input
          type="text"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
            setError(null);
          }}
          placeholder="SHA-256 hash (64 hex) or drop a file"
          aria-label="SHA-256 hash to verify"
          spellCheck={false}
          className="satohash-verify-input"
        />
        <label className="satohash-verify-file" title="Hash a file in the browser">
          {busy ? 'Hashing…' : 'File'}
          <input
            type="file"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
            hidden
          />
        </label>
      </div>

      {error && <p className="satohash-verify-error">{error}</p>}

      <div className="satohash-verify-actions">
        <a
          href={verifyHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`satohash-verify-link${valid ? '' : ' is-muted'}`}
        >
          <ShieldCheck size={13} />
          Verify on Satohash <ArrowUpRight size={12} />
        </a>
        {valid && (
          <a
            href={stampGuideUrl(normalized)}
            target="_blank"
            rel="noopener noreferrer"
            className="satohash-verify-link"
          >
            Stamp this hash <ArrowUpRight size={12} />
          </a>
        )}
      </div>

      <p className="satohash-verify-note">
        The proof check runs on Satohash (OpenTimestamps anchored in Bitcoin). This widget never
        reads your file&apos;s contents.
      </p>
    </div>
  );
}
