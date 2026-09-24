export interface FamilyOffering {
  id: string;
  name: string;
  url: string;
  value: string;
  label: string;
  color: string;
  tone: string;
}

export const FAMILY_OFFERINGS: FamilyOffering[] = [
  { id: 'giveabit', name: 'giveabit.io', url: 'https://giveabit.io', value: 'The flagship hub for live Bitcoin data, sovereign projects, Nostr agents, calculators, and the global merchant map.', label: 'HUB', color: '#f5b942', tone: 'amber' },
  { id: 'agents', name: 'agents.giveabit.io', url: 'https://agents.giveabit.io', value: 'The front door to Cam’s autonomous AI team — meet them, talk with them, and work alongside them.', label: 'THE AGENTS', color: '#d7ff55', tone: 'acid' },
  { id: 'satohash', name: 'satohash.io', url: 'https://satohash.io', value: 'Stamp any document on Bitcoin with a free, private proof of existence.', label: 'PROOF', color: '#64e6e2', tone: 'glacier' },
  { id: 'katoa', name: 'katoa.org', url: 'https://katoa.org', value: 'A zero-fee creator platform on Bitcoin where creators keep 100%.', label: 'CREATORS', color: '#9b7cff', tone: 'violet' },
  { id: 'sherpacarta', name: 'sherpacarta.org', url: 'https://sherpacarta.org', value: 'The Global Digital Magna Carta — digital human rights for the 21st century, in eight languages.', label: 'RIGHTS', color: '#ff9866', tone: 'orange' },
  { id: 'motopass', name: 'motopass.giveabit.io', url: 'https://motopass.giveabit.io', value: 'A sovereign passport and citizenship-by-investment explorer with a live Trust Center.', label: 'TRUST', color: '#f35bba', tone: 'fuchsia' },
  { id: 'stranded', name: 'stranded.giveabit.io', url: 'https://stranded.giveabit.io', value: 'Bitcoin self-custody scenario planning and stranded-assets tooling.', label: 'RESILIENCE', color: '#36c7a2', tone: 'teal' },
  { id: 'openstrata', name: 'openstrata.giveabit.io', url: 'https://openstrata.giveabit.io', value: 'Sovereign data portability through the Strata applications framework.', label: 'PORTABILITY', color: '#5ed9ff', tone: 'cyan' },
  { id: 'tadbuy', name: 'tadbuy.giveabit.io', url: 'https://tadbuy.giveabit.io', value: 'Bitcoin-native ad buying with Lightning payments in sats.', label: 'LIGHTNING', color: '#f2ca52', tone: 'gold' },
  { id: 'hq', name: 'hq.giveabit.io', url: 'https://hq.giveabit.io', value: 'The ecosystem operations and pitch glass: dashboard, metrics, and vault.', label: 'OPERATIONS', color: '#8cf0b4', tone: 'aurora' },
];
