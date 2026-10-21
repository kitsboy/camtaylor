import { AXIOMS } from './axioms';
import { SERVICES } from './services';
import { SITE } from './site';
import { VENTURES } from './ventures';
import { NOSTR_IDENTITIES, NOSTR_JSON_URL } from './nostr';
import type { ChainSnapshot, PriceSnapshot } from '../utils/signalBoard';

export const COMMANDS = [
  'help',
  'about',
  'status',
  'signal',
  'fee',
  'price',
  'services',
  'ventures',
  'route',
  'manifesto',
  'contact',
  'book',
  'nostr',
  'field-guide',
  '2026',
  'ascii',
  'summit',
  'copy',
  'clear',
  'exit',
] as const;

export type CommandName = (typeof COMMANDS)[number];

export const SHERPA_ASCII = `
     /\\
    /  \\    SHERPA
   /____\\   camtaylor.ca
  /      \\
`.trim();

export function formatHelp(): string {
  return [
    'Available Commands:',
    '  /about     - Learn about Cam Taylor',
    '  /status    - Availability & response SLA',
    '  /signal    - Chain reading this browser has actually received',
    '  /fee       - Fast fee from that same reading',
    '  /price     - Latest BTC-USD close and sats per dollar',
    '  /services  - Areas of expertise',
    '  /ventures  - Portfolio and active operations',
    '  /route     - Deep-dive a venture (/route giveabit)',
    '  /manifesto - Sherpa philosophy',
    '  /contact   - Get in touch (scrolls to form)',
    '  /book      - Schedule a route check',
    '  /field-guide - Sherpa Field Guide',
    '  /2026      - State of the Route review',
    '  /nostr     - NIP-05 identity & relays',
    '  /ascii     - Sherpa ASCII logo',
    '  /copy      - Export session transcript',
    '  /clear     - Flush terminal buffer',
    '  /exit      - Close command deck',
    '',
    'Easter egg: try /summit',
  ].join('\n');
}

export function formatAbout(): string {
  return [
    'PROFILE SUMMARY:',
    `Name: ${SITE.name}`,
    `Title: ${SITE.title}`,
    `Location: ${SITE.location} (${SITE.timezone})`,
    'Specialization: Deal architecture, capital syndication, venture operations.',
    `Mission: ${SITE.tagline}`,
    `Route: ${SITE.currentRoutes[0]}`,
  ].join('\n');
}

export function formatStatus(chain?: ChainSnapshot, price?: PriceSnapshot): string {
  const lines = [
    'OPERATIONAL STATUS:',
    'Availability: Accepting new expeditions (2 slots)',
    `Timezone: ${SITE.timezone}`,
    `Response SLA: ${SITE.responseTime}`,
    `Current route: ${SITE.currentRoutes[0]}`,
    'Queue: Open',
  ];
  // Live mission briefing — only when a real reading has landed. Never a
  // fabricated number: each line is gated on the snapshot actually holding it.
  if (chain && chain.tipHeight != null) {
    lines.push('');
    lines.push('LIVE CHAIN:');
    lines.push(`  Tip height: ${counts.format(chain.tipHeight)}`);
    if (chain.mempoolCount != null) lines.push(`  Mempool: ${counts.format(chain.mempoolCount)} txs waiting`);
    if (chain.fastestFee != null) lines.push(`  Fast fee: ${chain.fastestFee} sats/vB`);
    if (chain.isStale) lines.push('  (last good — not current)');
  }
  if (price && price.closeUsd != null) {
    lines.push('');
    lines.push('LIVE PRICE:');
    lines.push(`  BTC: ${money.format(price.closeUsd)}`);
    if (price.satsPerUsd != null) lines.push(`  Sats per $1: ${counts.format(price.satsPerUsd)}`);
  }
  return lines.join('\n');
}

const counts = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function readStamp(at: number | null, stale: boolean): string {
  if (at == null) return stale ? 'LAST GOOD, time not recorded' : 'time not recorded';
  const clock = new Date(at).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Vancouver',
  });
  return stale ? `LAST GOOD as of ${clock} PT, not current` : `as of ${clock} PT`;
}

function unread(label: string): string {
  return [
    `${label}:`,
    'Not read yet from this browser.',
    'Source: mempool.space. No number until a read lands.',
  ].join('\n');
}

export function formatSignal(chain: ChainSnapshot): string {
  if (chain.tipHeight == null && chain.status !== 'live') {
    return chain.status === 'offline'
      ? 'SIGNAL:\nOFFLINE. This browser could not reach mempool.space. No reading to show.'
      : unread('SIGNAL');
  }
  return [
    `SIGNAL (${readStamp(chain.updatedAt, chain.isStale)}):`,
    'Source: mempool.space',
    `Tip height: ${chain.tipHeight != null ? counts.format(chain.tipHeight) : '—'}`,
    `Mempool txs: ${chain.mempoolCount != null ? counts.format(chain.mempoolCount) : '—'}`,
    `Pending vB: ${chain.mempoolVsize != null ? counts.format(chain.mempoolVsize) : '—'}`,
    'Readings, not advice.',
  ].join('\n');
}

export function formatFee(chain: ChainSnapshot): string {
  if (chain.fastestFee == null) {
    return chain.status === 'offline'
      ? 'FEE:\nOFFLINE. Fast fee could not be read from mempool.space.'
      : unread('FEE');
  }
  return [
    `FEE (${readStamp(chain.updatedAt, chain.isStale)}):`,
    'Source: mempool.space recommended fastest fee',
    `Fast fee: ${chain.fastestFee} sats/vB`,
    'A reading, not advice.',
  ].join('\n');
}

export function formatPriceReading(price: PriceSnapshot): string {
  if (price.closeUsd == null || price.satsPerUsd == null) {
    return price.status === 'offline'
      ? 'PRICE:\nOFFLINE. Hourly BTC-USD closes could not be read from the Coinbase Exchange public API.'
      : unread('PRICE').replace('mempool.space', 'Coinbase Exchange');
  }
  return [
    `PRICE (${readStamp(price.updatedAt, price.isStale)}):`,
    'Source: Coinbase Exchange public API, BTC-USD hourly close',
    `Latest close: ${money.format(price.closeUsd)}`,
    `Sats per $1: ${counts.format(price.satsPerUsd)} (100,000,000 divided by that close, nearest sat)`,
    'One spot reading, not advice.',
  ].join('\n');
}

export function formatServices(): string {
  return SERVICES.map(
    (s) => `- ${s.title.padEnd(22)} ${s.features.slice(0, 2).join(', ')}`,
  ).join('\n');
}

export function formatVentures(): string {
  return VENTURES.map(
    (v) => `- ${v.name.padEnd(12)} [${v.tag}] ${v.status.toUpperCase()} → ${v.url}`,
  ).join('\n');
}

export function formatRoute(ventureId: string): string | null {
  const v = VENTURES.find(
    (x) => x.id === ventureId || x.name.toLowerCase() === ventureId.toLowerCase(),
  );
  if (!v) return null;
  return [
    `ROUTE: ${v.name}`,
    `Role: ${v.role}`,
    `Status: ${v.status}`,
    `Altitude: ${v.altitude}%`,
    `Tag: ${v.tag}`,
    `URL: ${v.url}`,
    '',
    'CASE STUDY:',
    `  Problem:   ${v.caseStudy.problem}`,
    `  Structure: ${v.caseStudy.structure}`,
    `  Outcome:   ${v.caseStudy.outcome}`,
  ].join('\n');
}

export function formatManifesto(): string {
  return AXIOMS.map((a) => `${a.number}. ${a.title} — ${a.description.split('.')[0]}.`).join('\n');
}

export function formatContact(): string {
  return [
    'COMMUNICATION:',
    'Contact form: Navigating to Connect section…',
    `Email: ${SITE.email}`,
    `Location: ${SITE.location}`,
    `Response: ${SITE.responseTime}`,
    'Status: Accepting new expeditions.',
    'NOSTR: /nostr for cryptographic identity.',
  ].join('\n');
}

export function formatBook(): string {
  if (SITE.calendlyUrl) {
    return [
      'BOOK A ROUTE CHECK:',
      'A 60-minute route check — deal architecture, capital, or a venture in view.',
      `Open calendar: ${SITE.calendlyUrl}`,
      '',
      'Prefer email?',
      `  ${SITE.email}`,
      '  Subject: Route Check — 15 min intro',
      'Or scroll to Connect and submit the expedition form.',
    ].join('\n');
  }
  return [
    'BOOK A ROUTE CHECK:',
    `Email: ${SITE.email}`,
    'Subject: Route Check — 15 min intro',
    'Or scroll to Connect and submit the expedition form.',
  ].join('\n');
}

export function formatNostr(): string {
  const cam = NOSTR_IDENTITIES[0];
  return [
    'NOSTR IDENTITY:',
    `NIP-05: ${cam.nip05}`,
    `Namespace: ${NOSTR_JSON_URL}`,
    'Relays: relay.damus.io, nos.lol, relay.snort.social',
    'DM: Prefer Nostr? Reach via iris.to or coracle.social',
  ].join('\n');
}

export function completeCommand(input: string): string | null {
  const raw = input.trim().toLowerCase().replace(/^\//, '');
  const partial = raw.split(/\s/)[0];
  if (!partial) return null;
  const match = COMMANDS.find((cmd) => cmd.startsWith(partial));
  return match ? `/${match}` : null;
}