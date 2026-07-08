export type VentureStatus = 'building' | 'live' | 'stealth' | 'syndicating';

export interface VentureCaseStudy {
  problem: string;
  structure: string;
  outcome: string;
}

export interface Venture {
  id: string;
  name: string;
  role: string;
  desc: string;
  tag: string;
  url: string;
  status: VentureStatus;
  altitude: number;
  stacks?: string[];
  needsTalent?: boolean;
  caseStudy: VentureCaseStudy;
}

export const VENTURE_STATUS_LABELS: Record<VentureStatus, string> = {
  building: 'Building',
  live: 'Live',
  stealth: 'Stealth',
  syndicating: 'Syndicating',
};

export const VENTURES: Venture[] = [
  {
    id: 'satohash',
    name: 'Satohash',
    role: 'Co-Founder & Deal Architect',
    desc: 'High-performance Bitcoin infrastructure, decentralized nodes, and yield orchestration layers.',
    tag: 'Crypto Infrastructure',
    url: 'https://satohash.io',
    status: 'live',
    altitude: 92,
    stacks: ['Bitcoin', 'Rust', 'Lightning'],
    caseStudy: {
      problem: 'Fragmented node ops with no yield orchestration layer.',
      structure: 'JV between infra operators and capital syndicate.',
      outcome: 'Live stack serving institutional-grade uptime.',
    },
  },
  {
    id: 'katoa',
    name: 'Katoa',
    role: 'Principal Agent',
    desc: 'Bespoke software architecture, product development pipelines, and elite systems engineering.',
    tag: 'Engineering',
    url: 'https://katoa.org',
    status: 'live',
    altitude: 78,
    stacks: ['TypeScript', 'React', 'AI Systems'],
    caseStudy: {
      problem: 'Founders need elite eng without full-time overhead.',
      structure: 'Principal-agent model with milestone gates.',
      outcome: 'Product pipelines shipping across 4 verticals.',
    },
  },
  {
    id: 'giveabit',
    name: 'GiveABit',
    role: 'Sponsor & Architect',
    desc: 'A modern, high-transparency micro-donation platform engineering asymmetric social impact.',
    tag: 'Social Yield',
    url: 'https://giveabit.io',
    status: 'live',
    altitude: 88,
    stacks: ['React', 'NOSTR', 'Bitcoin'],
    needsTalent: true,
    caseStudy: {
      problem: 'Donation platforms lack transparency and identity.',
      structure: 'Micro-yield rails with NOSTR namespace registry.',
      outcome: '7-venture constellation under one mission.',
    },
  },
  {
    id: 'openstrata',
    name: 'OpenStrata',
    role: 'Venture Architect',
    desc: 'Decentralized strata management, property asset coordination, and automated legal pipelines.',
    tag: 'PropTech',
    url: 'https://openstrata.giveabit.io',
    status: 'syndicating',
    altitude: 65,
    stacks: ['PropTech', 'Legal Tech', 'Web3'],
    needsTalent: true,
    caseStudy: {
      problem: 'Strata management is opaque and legally fragmented.',
      structure: 'LP syndicate with automated compliance pipelines.',
      outcome: 'Active syndication round — Q3 2026.',
    },
  },
  {
    id: 'motopass',
    name: 'Motopass',
    role: 'Strategic Investor',
    desc: 'Secured digital vehicle passport registry tracking ownership chain, specs, and maintenance history.',
    tag: 'AutoTech',
    url: 'https://motopass.giveabit.io',
    status: 'building',
    altitude: 42,
    stacks: ['Registry', 'Identity', 'Mobile'],
    caseStudy: {
      problem: 'Vehicle history is siloed across dealers and insurers.',
      structure: 'Digital passport with chain-of-custody ledger.',
      outcome: 'MVP registry in active development.',
    },
  },
  {
    id: 'sherpacarta',
    name: 'Sherpacarta',
    role: 'Technical Advisor',
    desc: 'Advanced geo-routing, expedition mapping and customized topographic coordination stacks.',
    tag: 'MapTech',
    url: 'https://sherpacarta.org',
    status: 'live',
    altitude: 70,
    stacks: ['GIS', 'Routing', 'Topo'],
    caseStudy: {
      problem: 'Expedition routing lacks real-time topo intelligence.',
      structure: 'Advisor role with geo-stack integration.',
      outcome: 'Live mapping platform for route coordination.',
    },
  },
  {
    id: 'tadbuy',
    name: 'Tadbuy',
    role: 'Deal Sponsor',
    desc: 'Intelligent e-commerce purchasing rails optimizing retail arbitrage and volume procurement.',
    tag: 'E-Commerce',
    url: 'https://tadbuy.giveabit.io',
    status: 'building',
    altitude: 38,
    stacks: ['E-Commerce', 'Arbitrage', 'API'],
    caseStudy: {
      problem: 'Volume procurement lacks intelligent routing.',
      structure: 'Deal-sponsored purchasing rails with arbitrage logic.',
      outcome: 'Alpha rails in private testing.',
    },
  },
];

export const ECOSYSTEM_LINKS = VENTURES.map((v) => ({
  id: v.id,
  name: v.name,
  url: v.url,
}));