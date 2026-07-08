export interface DealTier {
  id: string;
  label: string;
  description: string;
  range: string;
}

export const DEAL_TIERS: DealTier[] = [
  { id: 'day-hike', label: 'Day Hike', description: 'Quick advisory or intro', range: '<$100K' },
  { id: 'multi-day', label: 'Multi-day', description: 'Structured engagement', range: '$100K – $1M' },
  { id: 'expedition', label: 'Expedition', description: 'Full deal architecture', range: '$1M – $5M' },
  { id: 'rescue', label: 'Rescue Mission', description: 'Special situations', range: '$5M+' },
];