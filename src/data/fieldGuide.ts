import { SITE } from './site';
import { AXIOMS } from './axioms';
import { DEAL_TIERS } from './dealTiers';
import { ANTI_SERVICES } from './antiServices';

export const FIELD_GUIDE_LAST_UPDATED = '2026-07-15';

export const FIELD_GUIDE_INTRO = `A one-page reference for working with ${SITE.name}. Download, share, or print.`;

export const FIELD_GUIDE_SHERPA = `Not a consultant who waves from base camp. A Sherpa architects the deal, walks the cap table, and stays through the hard descent. Deal architecture, capital syndication, venture operations.`;

export const FIELD_GUIDE_WORKING_NORMS = [
  'All inquiries are confidential unless you agree otherwise.',
  'First email: structure, assets, timeline, and what success looks like.',
  'Priority goes to ventures with clear leverage and honest cap tables.',
  'NDAs available on request before sensitive materials.',
  'Typical intro call: 15 minutes — route check, not a pitch deck review.',
] as const;

export const FIELD_GUIDE_RED_FLAGS = [
  'Unclear ownership or cap table',
  'No skin in the game from founders',
  'Urgency without structure',
  'Advisor equity without deliverables',
] as const;

export { AXIOMS, DEAL_TIERS, ANTI_SERVICES };