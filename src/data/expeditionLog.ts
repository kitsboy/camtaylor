export interface ExpeditionEntry {
  id: string;
  date: string;
  terrain: string;
  title: string;
  outcome: string;
  altitude: 'base' | 'mid' | 'summit' | 'descent';
}

export const EXPEDITION_LOG: ExpeditionEntry[] = [
  {
    id: 'giveabit-launch',
    date: '2025-11',
    terrain: 'Social Yield',
    title: 'Give A Bit — namespace & micro-donation rails',
    outcome: 'Live platform with NOSTR identity layer and 7-venture constellation.',
    altitude: 'summit',
  },
  {
    id: 'openstrata-syndicate',
    date: '2026-Q2',
    terrain: 'PropTech',
    title: 'OpenStrata — strata syndication round',
    outcome: 'Structuring LP alignment and automated legal pipelines.',
    altitude: 'mid',
  },
  {
    id: 'satohash-infra',
    date: '2025-08',
    terrain: 'Crypto Infrastructure',
    title: 'Satohash — node orchestration layer',
    outcome: 'Deployed high-performance Bitcoin infrastructure stack.',
    altitude: 'summit',
  },
  {
    id: 'katoa-build',
    date: '2025-06',
    terrain: 'Engineering',
    title: 'Katoa — bespoke systems architecture',
    outcome: 'Product pipelines and elite engineering engagements.',
    altitude: 'mid',
  },
  {
    id: 'motopass-seed',
    date: '2026-Q1',
    terrain: 'AutoTech',
    title: 'Motopass — digital vehicle passport',
    outcome: 'Secured registry MVP with ownership chain tracking.',
    altitude: 'base',
  },
  {
    id: 'camtaylor-site',
    date: '2026-07',
    terrain: 'Personal Brand',
    title: 'camtaylor.ca — Sherpa command centre',
    outcome: 'This site. Your base camp for deal flow.',
    altitude: 'base',
  },
];

export const ALTITUDE_LABELS: Record<ExpeditionEntry['altitude'], string> = {
  base: 'Base Camp',
  mid: 'High Camp',
  summit: 'Summit',
  descent: 'Descent',
};