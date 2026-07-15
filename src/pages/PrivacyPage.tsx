import { LegalPage } from './LegalPage';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy',
    description: `Privacy policy for ${SITE.domain} — how contact form data and analytics are handled.`,
    path: '/privacy',
  });

  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2>Overview</h2>
        <p>
          {SITE.name} ({SITE.domain}) respects your privacy. This policy explains what information we
          collect when you use this website and how it is handled.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <p>When you submit the contact form, we collect:</p>
        <ul>
          <li>Your name and organization (if provided)</li>
          <li>Your email address</li>
          <li>Deal size preference and message details</li>
        </ul>
        <p>
          Form submissions are processed by{' '}
          <a href="https://formspree.io" target="_blank" rel="noopener noreferrer">
            Formspree
          </a>{' '}
          and delivered to {SITE.email}. We do not sell or share your data with third parties for
          marketing purposes.
        </p>
      </section>

      <section>
        <h2>Analytics</h2>
        <p>
          If enabled, we use privacy-friendly analytics (Plausible) that does not use cookies and does
          not track individuals across websites. No personal data is collected by analytics.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site does not set tracking cookies. Third-party services (Formspree) may set functional
          cookies required to process form submissions.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your contact information by
          emailing{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach out at{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}