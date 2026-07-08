export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  venture?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'founder-1',
    quote:
      'Cam doesn\'t just advise — he architects the deal, walks the cap table, and stays through the hard descent. Rare.',
    author: 'Founder',
    role: 'Series A · PropTech',
    venture: 'OpenStrata',
  },
  {
    id: 'lp-1',
    quote:
      'The syndication structure was clean, transparent, and built for asymmetric upside. Exactly what LPs want.',
    author: 'Private LP',
    role: 'Growth Capital',
  },
  {
    id: 'tech-1',
    quote:
      'From token economics to launch runbooks — hands-on venture ops that actually ship.',
    author: 'Technical Co-Founder',
    role: 'Crypto Infrastructure',
    venture: 'Satohash',
  },
];