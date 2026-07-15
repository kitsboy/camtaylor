export interface DealTier {
  id: string;
  label: string;
  description: string;
  range: string;
  duration?: string;
  icon: 'footprints' | 'tent' | 'mountain' | 'lifebuoy';
}

export const DEAL_TIERS: DealTier[] = [
  {
    id: 'day-hike',
    label: 'Day Hike',
    description: 'Quick advisory or intro — scoped questions, fast turnaround.',
    range: '<$100K',
    duration: '1–2 sessions',
    icon: 'footprints',
  },
  {
    id: 'multi-day',
    label: 'Multi-day',
    description: 'Structured engagement — diligence, cap table, and term sheet support.',
    range: '$100K – $1M',
    duration: '2–6 weeks',
    icon: 'tent',
  },
  {
    id: 'expedition',
    label: 'Expedition',
    description: 'Full deal architecture — syndication, JV structure, and close support.',
    range: '$1M – $5M',
    duration: '1–3 months',
    icon: 'mountain',
  },
  {
    id: 'rescue',
    label: 'Rescue Mission',
    description: 'Special situations — restructuring, distressed assets, complex exits.',
    range: '$5M+',
    duration: 'Scoped per mission',
    icon: 'lifebuoy',
  },
];