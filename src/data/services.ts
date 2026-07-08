export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'deal-architecture',
    title: 'Deal Architecture',
    description:
      'Engineering high-leverage transaction structures, joint ventures, and capital allocation frameworks designed for asymmetric returns.',
    features: ['Arbitrage Mapping', 'Jurisdictional Optimization', 'Risk Structuring'],
  },
  {
    id: 'capital-syndication',
    title: 'Capital Syndication',
    description:
      'Orchestrating private deal flow, venture investments, and connecting strategic resources with high-conviction founders.',
    features: ['Private Placements', 'LP Syndicate Management', 'Growth Capital Alignments'],
  },
  {
    id: 'venture-operations',
    title: 'Venture Operations',
    description:
      'Hands-on scaling, tech architecture, and operational excellence for digital assets and modern web projects.',
    features: ['AI Systems Integration', 'Token Economics Design', 'Product Launch Runbooks'],
  },
  {
    id: 'special-situations',
    title: 'Special Situations',
    description:
      'Navigating complex restructurings, digital asset buyouts, and resolving distressed technical or corporate dependencies.',
    features: ['IP Reclamation', 'Technical Auditing', 'Arbitrage Exploitation'],
  },
];