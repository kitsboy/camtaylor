import { LegalPage } from './LegalPage';
import { SITE } from '../data/site';

export function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <section>
        <h2>Agreement</h2>
        <p>
          By accessing {SITE.domain}, you agree to these terms. If you do not agree, please do not use
          this website.
        </p>
      </section>

      <section>
        <h2>Nature of services</h2>
        <p>
          This website provides general information about {SITE.name}&apos;s professional services in
          deal architecture, capital syndication, and venture operations. Nothing on this site
          constitutes legal, financial, or investment advice.
        </p>
      </section>

      <section>
        <h2>No guarantee of engagement</h2>
        <p>
          Submitting a contact form or inquiry does not create a client relationship or obligation to
          respond. All engagements are subject to separate written agreement and due diligence.
        </p>
      </section>

      <section>
        <h2>Confidentiality</h2>
        <p>
          Information submitted through the contact form will be treated as confidential to the extent
          permitted by law. Do not submit material non-public information you are not authorized to
          share.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          All content on this site — including text, design, and branding — is owned by {SITE.name}
          unless otherwise noted. Venture names and logos belong to their respective owners.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          This site links to third-party ventures and platforms. We are not responsible for the
          content or practices of external websites.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          This website is provided &quot;as is&quot; without warranties. {SITE.name} is not liable for
          any damages arising from use of this site or reliance on its content.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of British Columbia, Canada.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions? Email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}