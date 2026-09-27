import { Link } from 'react-router-dom';
import { Printer, Download, Bitcoin, Zap, ShieldCheck, ExternalLink } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';
import { SITE } from '../data/site';
import { WISDOM, WISDOM_LAST_VERIFIED, TIER_LABELS } from '../data/wisdom';

const TIER_ORDER = [1, 2, 3, 4, 5, 6] as const;

export function WisdomPage() {
  usePageMeta({
    title: 'Sovereign Healthcare Wisdom Database',
    description:
      'Verified clinics and practices that accept Bitcoin or Lightning — ordered by geography, each tied to its source.',
    path: '/wisdom',
  });

  const handlePrint = () => window.print();
  const bitcoinCount = WISDOM.filter((w) => w.accepts_bitcoin).length;
  const lightningCount = WISDOM.filter((w) => w.accepts_lightning).length;

  return (
    <SiteLayout>
      <article className="legal-content wisdom-content">
        <h1>Sovereign Healthcare — Wisdom Database</h1>
        <p className="legal-updated">
          Verified {WISDOM_LAST_VERIFIED} · {WISDOM.length} clinics · {bitcoinCount} accept
          Bitcoin · {lightningCount} accept Lightning
        </p>

        <p>
          This is the living index behind <strong>Kimi</strong> (Chief Medical Orchestrator),
          with specialist routing to <strong>Doctor Doug</strong> (vetting &amp; research) and{' '}
          <strong>Nurse Nikki</strong> (operations, triage &amp; payment vetting). Every entry is
          source-attributed — no record ships on hearsay. Payment policy is Bitcoin and Lightning
          first, fiat second: <strong>we never exclude a facility that only takes fiat</strong>,
          but BTC/Lightning acceptance is surfaced first.
        </p>

        <div className="wisdom-legend">
          <span className="wisdom-badge wisdom-btc">
            <Bitcoin size={14} /> ₿ Bitcoin accepted
          </span>
          <span className="wisdom-badge wisdom-ln">
            <Zap size={14} /> ⚡ Lightning accepted
          </span>
          <span className="wisdom-badge wisdom-verified">
            <ShieldCheck size={14} /> Source-verified
          </span>
        </div>

        <div className="field-guide-actions">
          <button type="button" className="btn-secondary" onClick={handlePrint}>
            <Printer size={14} />
            Print / Save as PDF
          </button>
          <a href="/wisdom" className="btn-secondary btn-ghost">
            <Download size={14} />
            Share link
          </a>
        </div>

        {TIER_ORDER.filter((tier) =>
          WISDOM.some((w) => w.location.tier === tier),
        ).map((tier) => {
          const entries = WISDOM.filter((w) => w.location.tier === tier).sort((a, b) =>
            Number(b.accepts_lightning) - Number(a.accepts_lightning),
          );
          if (!entries.length) return null;
          return (
            <section key={tier} className="wisdom-tier">
              <h2>
                Tier {tier} — {TIER_LABELS[tier]}
              </h2>
              <div className="wisdom-grid">
                {entries.map((entry) => (
                  <div key={entry.id} className="wisdom-card">
                    <div className="wisdom-card-head">
                      <h3>{entry.name}</h3>
                      <div className="wisdom-card-badges">
                        {entry.accepts_bitcoin && (
                          <span className="wisdom-badge wisdom-btc">
                            <Bitcoin size={12} /> BTC
                          </span>
                        )}
                        {entry.accepts_lightning && (
                          <span className="wisdom-badge wisdom-ln">
                            <Zap size={12} />⚡
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="wisdom-category">
                      {entry.category} · {entry.sub_categories.join(', ')}
                    </p>
                    <p className="wisdom-location">
                      {entry.location.city}, {entry.location.region}, {entry.location.country}
                    </p>
                    <p className="wisdom-offerings">{entry.offerings_summary}</p>

                    {entry.vetting_metrics?.booking_wait_time && (
                      <p className="wisdom-vetting">
                        <strong>Wait:</strong> {entry.vetting_metrics.booking_wait_time}
                      </p>
                    )}
                    {entry.vetting_metrics?.physician_credentials && (
                      <p className="wisdom-vetting">
                        <strong>Credentials:</strong>{' '}
                        {entry.vetting_metrics.physician_credentials}
                      </p>
                    )}

                    <p className="wisdom-payment">
                      <strong>Payment:</strong> {entry.payment_notes}
                    </p>

                    <div className="wisdom-links">
                      {entry.website && (
                        <a href={entry.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={12} /> Website
                        </a>
                      )}
                      {entry.direct_intake_email && (
                        <a href={`mailto:${entry.direct_intake_email}`}>✉ Email</a>
                      )}
                      {entry.direct_phone && (
                        <a href={`tel:${entry.direct_phone.replace(/[^+\d]/g, '')}`}>📞 Phone</a>
                      )}
                      <a
                        href={entry.verifiedSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wisdom-source"
                      >
                        <ShieldCheck size={12} /> Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <h2>How to use this</h2>
        <p>
          Ask <strong>Kimi</strong> in plain language — <em>“my friend needs knee surgery,
          Bitcoin-friendly, in Colombia”</em>. Kimi routes surgical/chronic cases to Doctor Doug
          and logistics/payment to Nurse Nikki, runs the search hierarchy (YVR → Canada → USA →
          EU/Swiss → South America → Rest of World), requires each result to carry a verification
          source before it is added here, and returns a direct answer. Travelling? Ask for a
          trip-specific printable cheat-sheet.
        </p>

        <h2>Contribute a facility</h2>
        <p>
          Know a Bitcoin- or Lightning-accepting clinic that should be listed? Send it to{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with a verifiable source link. It is
          checked before it ships.
        </p>

        <p>
          <Link to="/#contact">Contact</Link> · <Link to="/field-guide">Field Guide</Link> ·{' '}
          <Link to="/2026">2026</Link>
        </p>
      </article>
    </SiteLayout>
  );
}
