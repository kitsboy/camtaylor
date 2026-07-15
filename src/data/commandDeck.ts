import { AXIOMS } from './axioms';
import { SERVICES } from './services';
import { SITE } from './site';
import { VENTURES } from './ventures';
import { NOSTR_IDENTITIES, NOSTR_JSON_URL } from './nostr';

export const COMMANDS = [
  'help',
  'about',
  'status',
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

export function formatStatus(): string {
  return [
    'OPERATIONAL STATUS:',
    'Availability: Accepting new expeditions (2 slots)',
    `Timezone: ${SITE.timezone}`,
    `Response SLA: ${SITE.responseTime}`,
    `Current route: ${SITE.currentRoutes[0]}`,
    'Queue: Open',
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
    return `BOOK A ROUTE CHECK:\n${SITE.calendlyUrl}`;
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