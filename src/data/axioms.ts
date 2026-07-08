export interface Axiom {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const AXIOMS: Axiom[] = [
  {
    id: 'terrain',
    number: '01',
    title: 'Know the Terrain First',
    description:
      "The best sherpa studies the mountain before the climber arrives. We map deals, capital structures, and risk before others know there's a summit.",
  },
  {
    id: 'summit',
    number: '02',
    title: 'Summit Together or Not at All',
    description:
      "We don't send clients ahead alone. Structure, alignment, and shared skin in the game — that's the only way everyone makes it home.",
  },
  {
    id: 'descent',
    number: '03',
    title: 'The Descent Matters Too',
    description:
      "Most guides stop at the top. We stay for the return — exits, compounding, and the next expedition already in motion before you're back at base camp.",
  },
];

export const MANIFESTO_QUOTE =
  "The mountain doesn't care about your business plan. But a great sherpa makes it irrelevant.";