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
  currentRoute: 'Q3 2026: Syndicating OpenStrata · Accepting 2 new expeditions',
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
  { label: 'Expeditions', value: 7, suffix: '+', display: '7+ Active' },
  { label: 'Terrain', value: 3, suffix: '', display: 'Tech · Capital · Deals' },
  { label: 'Base', value: 0, suffix: '', display: 'camtaylor.ca' },
] as const;

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'expeditions', label: 'Log' },
  { id: 'manifesto', label: 'Philosophy' },
  { id: 'services', label: 'Expertise' },
  { id: 'ventures', label: 'Ventures' },
  { id: 'contact', label: 'Connect' },
] as const;

export const FORMSPREE_FORM_ID =
  import.meta.env.VITE_FORMSPREE_FORM_ID ?? 'xykqodnk';

export const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? null;