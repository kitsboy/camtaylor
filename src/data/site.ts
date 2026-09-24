export const SITE = {
  name: 'Cam Taylor',
  title: 'Sherpa',
  tagline: 'We get people to the top — and back down again.',
  domain: 'camtaylor.ca',
  url: 'https://camtaylor.ca',
  email: 'cam@camtaylor.ca',
  familyEmail: 'hello@giveabit.io',
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

export const MOBILE_QUICK_NAV = NAV_ITEMS.filter((item) =>
  ['about', 'agents', 'family', 'proof', 'expeditions', 'manifesto', 'services', 'testimonials', 'ventures', 'contact'].includes(item.id),
);

export const IS_PRIVATE_PREVIEW = import.meta.env.VITE_PRIVATE_PREVIEW !== 'false';

export function validateSiteConfig(): string[] {
  const errors: string[] = [];
  if (!SITE.url.startsWith('https://')) errors.push('SITE.url must use HTTPS');
  if (!SITE.email.includes('@')) errors.push('SITE.email must be a valid email');
  if (!SITE.heroVideoId.trim()) errors.push('SITE.heroVideoId is missing');
  if (NAV_ITEMS.some((item) => !item.id || !item.label)) errors.push('NAV_ITEMS contains an incomplete item');
  if (Object.values(HERO_SIGNALS).some((value) => typeof value === 'string' && /\d/.test(value))) errors.push('HERO_SIGNALS must use factual non-numeric labels');
  return errors;
}
export const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID ?? 'xykqodnk';
export const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;
export const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? null;