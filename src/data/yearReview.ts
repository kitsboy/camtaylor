import { SITE } from './site';

export const YEAR_REVIEW_LAST_UPDATED = '2026-07-15';

export const YEAR_REVIEW_HIGHLIGHTS = [
  'camtaylor.ca Sherpa command centre launched',
  'Give A Bit constellation at 7 active ventures',
  'OpenStrata syndication round in progress',
  'NOSTR identity layer live at @giveabit.io',
  '100+ elite UX upgrades — mobile-first, a11y, performance',
] as const;

export const YEAR_REVIEW_LESSONS = [
  {
    id: 'skin',
    title: 'Skin in the game beats hourly advice',
    context: 'Structure before scale — align incentives with outcomes.',
  },
  {
    id: 'descent',
    title: 'The descent matters as much as the summit',
    context: 'Exit planning and cap table hygiene from day one.',
  },
  {
    id: 'local',
    title: 'Local-first builds compound quality',
    context: 'Ship polish before deploy — camtaylor.ca remains local-first until Cloudflare.',
  },
] as const;

export const YEAR_REVIEW_QUARTERS = {
  q1: ['Satohash stack hardened', 'Give A Bit namespace registry'],
  q2: ['camtaylor.ca v1 scaffold', 'Command Deck v2'],
  q3: [SITE.currentRoutes[0], 'Mobile-first 100 improvements'],
  q4: ['Deploy camtaylor.ca (planned)', 'Annual review publish'],
} as const;