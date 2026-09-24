/**
 * One waypoint per homepage section, in scroll order.
 *
 * The `altitude` values are framing labels for the spine, not measurements —
 * they exist so the page reads as one continuous route from base camp to
 * summit instead of a stack of unrelated sections. Conditions are qualitative
 * on purpose: this site does not invent readings it cannot source, and the
 * live numbers on it come from the live signal section only.
 */
export interface Waypoint {
  /** Matches the section id used by the nav, the rail and the scroll spy. */
  id: string;
  label: string;
  camp: string;
  altitude: number;
  condition: string;
  blurb: string;
}

export const WAYPOINTS: Waypoint[] = [
  {
    id: 'about',
    label: 'About',
    camp: 'Base Camp',
    altitude: 1200,
    condition: 'Open',
    blurb: 'Who is holding the rope, and how the work actually runs.',
  },
  {
    id: 'agents',
    label: 'Agents',
    camp: 'Tech Camp',
    altitude: 1750,
    condition: 'Assembled',
    blurb: 'The agent crew that does the hauling with me.',
  },
  {
    id: 'family',
    label: 'Family',
    camp: 'Flagged Route',
    altitude: 2300,
    condition: 'Connected',
    blurb: 'The Give A Bit constellation, one flag per venture.',
  },
  {
    id: 'proof',
    label: 'Proof',
    camp: 'Ridge Line',
    altitude: 2850,
    condition: 'Checked',
    blurb: 'What is actually reachable from your browser right now.',
  },
  {
    id: 'signal',
    label: 'Signal',
    camp: 'Weather Station',
    altitude: 3300,
    condition: 'Reading',
    blurb: 'Live, keyless readings from the chain and one exchange.',
  },
  {
    id: 'expeditions',
    label: 'Log',
    camp: 'Route Log',
    altitude: 3650,
    condition: 'Filed',
    blurb: 'Dated dispatches, newest first, syndicated by RSS.',
  },
  {
    id: 'manifesto',
    label: 'Philosophy',
    camp: 'Traverse',
    altitude: 3950,
    condition: 'Steady',
    blurb: 'The principles that decide what gets refused.',
  },
  {
    id: 'services',
    label: 'Expertise',
    camp: 'Glacier',
    altitude: 4250,
    condition: 'Open',
    blurb: 'How an expedition is scoped, structured and priced.',
  },
  {
    id: 'testimonials',
    label: 'Stories',
    camp: 'Campsite',
    altitude: 4550,
    condition: 'Voiced',
    blurb: 'What the people who climbed it say afterwards.',
  },
  {
    id: 'ventures',
    label: 'Ventures',
    camp: 'Headwall',
    altitude: 4800,
    condition: 'Climbing',
    blurb: 'Active routes, with a full case file behind each one.',
  },
  {
    id: 'kit',
    label: 'Kit',
    camp: 'The Pack',
    altitude: 5050,
    condition: 'Carried',
    blurb: 'The tools I actually use, disclosed as referrals.',
  },
  {
    id: 'contact',
    label: 'Connect',
    camp: 'Summit',
    altitude: 5300,
    condition: 'Open',
    blurb: 'Start the conversation; replies usually inside 48h PT.',
  },
];

export function getWaypoint(id: string): Waypoint | null {
  return WAYPOINTS.find((waypoint) => waypoint.id === id) ?? null;
}

export const SUMMIT_ALTITUDE = WAYPOINTS[WAYPOINTS.length - 1].altitude;

export function formatAltitude(metres: number): string {
  return `${metres.toLocaleString('en-CA')} m`;
}
