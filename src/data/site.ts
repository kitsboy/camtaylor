/**
 * The one inbox a contact-form submission must be delivered to, and the only
 * address the site may name as a message's destination.
 *
 * Kimi monitors this address: she reads everything that lands, drops the spam and
 * forwards the genuine inquiries on to Cam. That is why the form is not pointed at
 * Cam's own mailbox, and why the copy on the page has to agree with the Formspree
 * endpoint rather than merely sound plausible.
 *
 * One string, three readers — the success panel, the delivery note and the privacy
 * policy. `npm run quality` fails the build if `.env.example`, which is what the
 * deployer actually reads, stops naming this address. The copy used to promise
 * `cam@camtaylor.ca` while the endpoint delivered nowhere near it.
 */
export const INQUIRY_EMAIL = 'hello@giveabit.io';

export const SITE = {
  name: 'Cam Taylor',
  title: 'Sherpa',
  tagline: 'We get people to the top — and back down again.',
  domain: 'camtaylor.ca',
  url: 'https://camtaylor.ca',
  email: 'cam@camtaylor.ca',
  // The monitored inquiry inbox — see `INQUIRY_EMAIL` above. The contact form's
  // destination, its success copy and the front door in the contact header all
  // read this one value, so they cannot drift apart.
  familyEmail: INQUIRY_EMAIL,
  agentsUrl: 'https://agents.giveabit.io',
  location: 'British Columbia, Canada',
  timezone: 'Pacific Time (PT)',
  bio: `I guide founders, capital, and companies through demanding terrain — from base camp to summit and back down again. Deal architecture, capital syndication, and hands-on venture operations across tech, property, and digital assets.`,
  avatar: '/cam-profile.jpg',
  nostr: 'cam@giveabit.io',
  heroVideoId: 'nJeddv1QbeQ',
  heroVideoLabel: 'The Route — Intro',
  heroVideoBadge: 'FEATURED' as string | null,
  currentRoute: 'Q3 2026: Syndicating OpenStrata · Accepting 2 new expeditions',
  currentRoutes: [
    'Q3 2026: Syndicating OpenStrata · Accepting 2 new expeditions',
    '2 expedition slots open — structured deals preferred',
    'NOSTR: cam@giveabit.io · Reply within 48h PT',
  ],
  lastUpdated: '2026-07-15',
  responseTime: 'Typically replies within 48h PT',
  calendlyUrl: null as string | null,
  pgpFingerprint: null as string | null,
  social: {
    github: 'https://github.com/kitsboy',
    x: 'https://x.com/give_bit',
    nostr: 'https://giveabit.io/nostr',
    namespace: 'https://giveabit.io/namespace',
  },
} as const;

export const HERO_SIGNALS = {
  badge: 'OPEN TO NEW CONVERSATIONS',
  intelligenceLabel: 'ROUTE MAP / CURRENT FOCUS',
  intelligenceValue: 'FOUNDER-LED',
  metrics: [
    { label: 'Practice', display: 'Tech · Capital · Deals' },
    { label: 'Approach', display: 'Proof before promise' },
    { label: 'Base', display: 'camtaylor.ca' },
  ],
} as const;

export const NAV_ITEMS = [
  { id: 'about', label: 'About', mobileLabel: 'About' },
  { id: 'agents', label: 'Agents', mobileLabel: 'Agents' },
  { id: 'family', label: 'Family', mobileLabel: 'Family' },
  { id: 'proof', label: 'Proof', mobileLabel: 'Proof' },
  { id: 'signal', label: 'Signal', mobileLabel: 'Live signal' },
  { id: 'expeditions', label: 'Log', mobileLabel: 'Log' },
  { id: 'manifesto', label: 'Philosophy', mobileLabel: 'Philosophy' },
  { id: 'services', label: 'Expertise', mobileLabel: 'Expertise' },
  { id: 'testimonials', label: 'Stories', mobileLabel: 'Stories' },
  { id: 'ventures', label: 'Ventures', mobileLabel: 'Ventures' },
  { id: 'kit', label: 'Kit', mobileLabel: 'Trail kit' },
  { id: 'contact', label: 'Connect', mobileLabel: 'Connect' },
] as const;

/**
 * The six camps a thumb gets without opening anything: identity, the offering,
 * what is shipping, the receipts, the story, the door.
 *
 * Six is arithmetic, not taste. Every item carries a 44px target, and
 * `floor(320 / 44) = 7` — so seven is the ceiling on the narrowest phone the
 * site supports and six leaves the slack. This list held ten, which is how the
 * bar ended up 440px wide inside a 320px viewport, with Connect pushed off the
 * screen entirely. Ten was never a "quick" nav in the first place.
 * `tests/device-qa.spec.ts` now measures the bar itself, not just its buttons.
 */
export const MOBILE_QUICK_NAV = NAV_ITEMS.filter((item) =>
  ['about', 'services', 'ventures', 'proof', 'expeditions', 'contact'].includes(item.id),
);

export interface RouteLeg {
  id: string;
  name: string;
  note: string;
  ids: readonly string[];
}

/**
 * The same twelve waypoints the route sheet and the desktop rail use, grouped
 * into three legs so the phone menu reads as one ascent instead of a flat list
 * of twelve labels. The camps and altitudes come from `waypoints.ts`; nothing
 * here is invented twice.
 */
export const ROUTE_LEGS: RouteLeg[] = [
  {
    id: 'lower',
    name: 'Lower route',
    note: 'Who is holding the rope',
    ids: ['about', 'agents', 'family'],
  },
  {
    id: 'upper',
    name: 'Upper route',
    note: 'What is actually true',
    ids: ['proof', 'signal', 'expeditions', 'manifesto'],
  },
  {
    id: 'summit',
    name: 'Summit push',
    note: 'What is on offer',
    ids: ['services', 'testimonials', 'ventures', 'kit', 'contact'],
  },
];

export const IS_PRIVATE_PREVIEW = import.meta.env.VITE_PRIVATE_PREVIEW !== 'false';

export function validateSiteConfig(): string[] {
  const errors: string[] = [];
  if (!SITE.url.startsWith('https://')) errors.push('SITE.url must use HTTPS');
  if (!SITE.email.includes('@')) errors.push('SITE.email must be a valid email');
  if (SITE.familyEmail !== INQUIRY_EMAIL) errors.push('SITE.familyEmail must be INQUIRY_EMAIL — the form destination and the public address cannot drift');
  if (!SITE.heroVideoId.trim()) errors.push('SITE.heroVideoId is missing');
  if (NAV_ITEMS.some((item) => !item.id || !item.label)) errors.push('NAV_ITEMS contains an incomplete item');
  if (Object.values(HERO_SIGNALS).some((value) => typeof value === 'string' && /\d/.test(value))) errors.push('HERO_SIGNALS must use factual non-numeric labels');
  return errors;
}
/**
 * The Formspree endpoint the contact form posts to. `xykqodnk` is the template's
 * placeholder, not a live form: with it in place the endpoint accepts a visitor's
 * message and delivers it nowhere. The live ID is Kimi's to supply — it is set as
 * a `VITE_FORMSPREE_FORM_ID` build variable, and this fallback exists only so a
 * local build has something to post to. It is deliberately the same value CI uses.
 */
export const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID ?? 'xykqodnk';

/** True while the form is pointed at the placeholder endpoint rather than the live one. */
export const IS_PLACEHOLDER_FORM_ENDPOINT = FORMSPREE_FORM_ID === 'xykqodnk';
export const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;
export const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? null;