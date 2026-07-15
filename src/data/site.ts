export const SITE = {
  name: 'Cam Taylor',
  title: 'Sherpa',
  tagline: 'We get people to the top — and back down again.',
  domain: 'camtaylor.ca',
  url: 'https://camtaylor.ca',
  email: 'cam@camtaylor.ca',
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

export const HERO_METRICS = [
  { label: 'Expeditions', value: 7, suffix: '+', display: '7+ Active', type: 'count' as const },
  { label: 'Terrain', value: 3, suffix: '', display: 'Tech · Capital · Deals', type: 'static' as const },
  { label: 'Base', value: 0, suffix: '', display: 'camtaylor.ca', type: 'static' as const },
] as const;

export const NAV_ITEMS = [
  { id: 'about', label: 'About', mobileLabel: 'About' },
  { id: 'expeditions', label: 'Log', mobileLabel: 'Log' },
  { id: 'manifesto', label: 'Philosophy', mobileLabel: 'Philosophy' },
  { id: 'services', label: 'Expertise', mobileLabel: 'Expertise' },
  { id: 'testimonials', label: 'Proof', mobileLabel: 'Proof' },
  { id: 'ventures', label: 'Ventures', mobileLabel: 'Ventures' },
  { id: 'contact', label: 'Connect', mobileLabel: 'Connect' },
] as const;

export const MOBILE_QUICK_NAV = NAV_ITEMS.filter((item) =>
  ['about', 'expeditions', 'manifesto', 'services', 'testimonials', 'ventures', 'contact'].includes(item.id),
);

export const FORMSPREE_FORM_ID =
  import.meta.env.VITE_FORMSPREE_FORM_ID ?? 'xykqodnk';

export const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;