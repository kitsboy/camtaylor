import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import {
  Send,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Zap,
  Copy,
  Check,
  Mail,
  Lock,
  Globe,
  Loader2,
} from 'lucide-react';
import { FORMSPREE_FORM_ID, SITE } from '../data/site';
import { DEAL_TIERS } from '../data/dealTiers';
import { TESTIMONIALS } from '../data/testimonials';
import { useReferrer } from '../hooks/useReferrer';
import { trackEvent } from '../utils/analytics';

const SPOTLIGHT = TESTIMONIALS[0];

function ContactFormBody({ onReset }: { onReset: () => void }) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [tierId, setTierId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tier') ?? params.get('service') ?? 'multi-day';
  });
  const [submittedName, setSubmittedName] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [started, setStarted] = useState(false);
  const referrer = useReferrer();

  const activeTier = DEAL_TIERS.find((t) => t.id === tierId) ?? DEAL_TIERS[1];

  useEffect(() => {
    if (state.succeeded) trackEvent('form_success');
  }, [state.succeeded]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value ?? '';
    setSubmittedName(name);
    setReferenceId(`CT-${Date.now().toString(36).toUpperCase()}`);
    trackEvent('form_submit', { tier: activeTier.label, ref: referrer || 'direct' });
    handleSubmit(e);
  };

  if (state.succeeded) {
    const nostrNote = encodeURIComponent(
      `Reached base camp at camtaylor.ca — inquiry ref ${referenceId}. @giveabit.io`,
    );
    return (
      <motion.div
        className="contact-success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="success-icon" size={48} />
        <h3 className="success-title">Message received</h3>
        <p className="success-message">
          Thank you, {submittedName || 'there'}. Your inquiry has been sent to {SITE.email}. I&apos;ll
          review the details and respond if there&apos;s alignment.
        </p>
        <div className="success-details">
          <div className="details-row">
            <span>Reference:</span>
            <code>{referenceId}</code>
          </div>
          <div className="details-row">
            <span>Reply to:</span>
            <span>{SITE.email}</span>
          </div>
        </div>
        <a
          href={`https://coracle.social/notes?t=${nostrNote}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary nostr-share-btn"
        >
          <Zap size={14} />
          Share on Nostr
        </a>
        <button type="button" onClick={onReset} className="btn-reset">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="contact-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onFocus={() => {
        if (!started) {
          setStarted(true);
          trackEvent('form_start');
        }
      }}
      aria-busy={state.submitting}
    >
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            required
            autoComplete="name"
            className="form-input"
            placeholder="Your name"
          />
          <ValidationError prefix="Name" field="name" errors={state.errors} className="form-error" />
        </div>
        <div className="form-group">
          <label htmlFor="organization" className="form-label">Organization</label>
          <input
            id="organization"
            type="text"
            name="organization"
            autoComplete="organization"
            maxLength={120}
            className="form-input"
            placeholder="Company or entity (optional)"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          className="form-input"
          placeholder="you@company.com"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="form-error" />
      </div>

      <div className="form-group">
        <label className="form-label">Expedition tier</label>
        <div className="deal-size-selector expedition-tiers" role="group" aria-label="Expedition tier">
          {DEAL_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              className={`deal-size-btn expedition-tier-btn ${tierId === tier.id ? 'active' : ''}`}
              onClick={() => setTierId(tier.id)}
              aria-pressed={tierId === tier.id}
              title={tier.description}
            >
              <span className="tier-label">{tier.label}</span>
              <span className="tier-range">{tier.range}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTier.id}
            className="tier-description-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="status"
          >
            {activeTier.description}
            {activeTier.duration && (
              <span className="tier-duration"> · Typical: {activeTier.duration}</span>
            )}
          </motion.div>
        </AnimatePresence>
        <input type="hidden" name="dealSize" value={`${activeTier.label} (${activeTier.range})`} />
        <input type="hidden" name="dealTier" value={activeTier.id} />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">Brief overview</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={2000}
          className="form-textarea"
          placeholder="Structure, assets, timeline, and what you're looking for..."
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} className="form-error" />
      </div>

      <input type="hidden" name="_subject" value={`New inquiry — ${activeTier.label} (${activeTier.range})`} />
      {referrer && <input type="hidden" name="referrer" value={referrer} />}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="form-honeypot"
        aria-hidden="true"
        aria-label="Leave blank"
      />

      <div role="alert" aria-live="assertive">
        <ValidationError errors={state.errors} className="form-submit-error" />
      </div>

      <button type="submit" className="submit-btn" disabled={state.submitting} aria-busy={state.submitting}>
        {state.submitting ? (
          <>
            <Loader2 size={16} className="submit-spinner" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <span>Send message</span>
            <Send size={16} />
          </>
        )}
      </button>

      <p className="form-sla">
        <Clock size={13} />
        {SITE.responseTime}
      </p>
    </motion.form>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };
  return (
    <button
      type="button"
      className="copy-email-btn"
      onClick={copy}
      aria-label={copied ? 'Email copied' : `Copy ${SITE.email}`}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy email'}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </button>
  );
}

export const Contact: React.FC = () => {
  const [formKey, setFormKey] = useState(0);

  return (
    <section className="contact-section" id="contact">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">GET IN TOUCH</h2>
        <p className="section-subtitle">
          Share your deal, venture, or partnership idea. All inquiries are handled confidentially.
        </p>
      </div>

      <div className="contact-container">
        <AnimatePresence mode="wait">
          <ContactFormBody key={formKey} onReset={() => setFormKey((k) => k + 1)} />
        </AnimatePresence>

        <div className="contact-sidebar">
          <div className="trust-badges">
            <span className="trust-badge">
              <Lock size={14} aria-hidden="true" />
              Confidential
            </span>
            <span className="trust-badge">
              <Clock size={14} aria-hidden="true" />
              48h response
            </span>
            <span className="trust-badge">
              <Globe size={14} aria-hidden="true" />
              Nostr ready
            </span>
          </div>

          <blockquote className="testimonial-spotlight">
            &ldquo;{SPOTLIGHT.quote}&rdquo;
            <cite>
              — {SPOTLIGHT.author}, {SPOTLIGHT.role}
              {SPOTLIGHT.venture ? ` · ${SPOTLIGHT.venture}` : ''}
            </cite>
          </blockquote>

          <a href={`mailto:${SITE.email}`} className="mobile-email-cta">
            <Mail size={18} />
            <span>{SITE.email}</span>
          </a>
          <CopyEmailButton />

          {SITE.calendlyUrl && (
            <a href={SITE.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary sidebar-calendly">
              Book a route check
            </a>
          )}

          <div className="sidebar-card">
            <ShieldAlert className="sidebar-icon" size={24} />
            <h4 className="sidebar-title">How it works</h4>
            <ul className="sidebar-list">
              <li>All inquiries are treated as confidential.</li>
              <li>Priority goes to ventures with clear structure and leverage.</li>
              <li>
                Prefer email?{' '}
                <a href={`mailto:${SITE.email}`} className="secure-mail-link">{SITE.email}</a>
              </li>
            </ul>
          </div>

          <div className="sidebar-card nostr-contact-card">
            <Zap className="sidebar-icon" size={24} />
            <h4 className="sidebar-title">Prefer Nostr?</h4>
            <ul className="sidebar-list">
              <li>
                <a href="https://iris.to/cam@giveabit.io" target="_blank" rel="noopener noreferrer">
                  DM via iris.to
                </a>
              </li>
              <li>
                <a href="https://coracle.social" target="_blank" rel="noopener noreferrer">
                  coracle.social
                </a>
              </li>
              <li>NIP-05: {SITE.nostr}</li>
            </ul>
          </div>

          {SITE.pgpFingerprint && (
            <div className="sidebar-card">
              <h4 className="sidebar-title">PGP</h4>
              <code className="pgp-fingerprint">{SITE.pgpFingerprint}</code>
            </div>
          )}

          <div className="sidebar-card">
            <h4 className="sidebar-title">Based in</h4>
            <ul className="sidebar-list">
              <li>{SITE.location}</li>
              <li>{SITE.timezone}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};