export interface AffiliateTool {
  id: string;
  name: string;
  /** Short uppercase category label shown in the card chip. */
  label: string;
  url: string;
  /** One plain sentence on what the tool does. */
  tagline: string;
  /** Personal, humble note on why Cam actually uses it. */
  note: string;
  /** Brand accent used for the mark, top rule and card shadow. */
  color: string;
  /** Readable text color on the brand accent. */
  ink: string;
  /** Referral link honesty flag — drives the card's bottom-right tag. */
  referral: boolean;
}

/**
 * Standardized kit cards — same slots, same size, same tone.
 * Add a tool with the exact same shape and it drops into the grid untouched.
 */
export const AFFILIATE_TOOLS: AffiliateTool[] = [
  {
    id: 'freebuff',
    name: 'Freebuff',
    label: 'Coding agent',
    url: 'https://freebuff.com/get-started?ref=ref-ea985ebb-dd3a-4c3c-8a40-26e1e79ad265&referrer=Sherpa',
    tagline: 'A free coding agent — a $0 alternative to Claude Code, Cursor and Codex.',
    note: 'I build this site with it every day. My link just opens the same free tier; you pay nothing.',
    color: '#7cff4f',
    ink: '#0b0f0a',
    referral: true,
  },
];

export const AFFILIATE_INTRO =
  'A short, honest list of the tools I actually use. No pressure — take what is useful and leave the rest.';

export const AFFILIATE_DISCLOSURE =
  'Some links here are referral links. They cost you nothing extra, and they help fund the time behind these projects. Everything listed is used personally before it is listed.';

export const AFFILIATE_LAST_REVIEWED = '2026-09-24';
