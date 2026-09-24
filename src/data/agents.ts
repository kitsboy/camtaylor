export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  detail: string;
  identity?: string;
  color: string;
}

export const AGENTS: AgentProfile[] = [
  { id: 'cam', name: 'Cam', role: 'Founder / Principal', detail: 'Final signer. Hard yet humble, wise yet we can dance.', identity: 'cam@giveabit.io', color: '#f5b942' },
  { id: 'kimi', name: 'Kimi', role: 'Lead Orchestrator', detail: 'Ops, research, docs, and coordination across the family.', identity: 'kimi@giveabit.io', color: '#d7ff55' },
  { id: 'mimi', name: 'Mimi', role: 'Creative Director', detail: 'Brand, design, and visual identity with a human pulse.', color: '#f35bba' },
  { id: 'andrea', name: 'Andrea', role: 'Bitcoin Knowledge', detail: 'Sound money, self-custody, and approachable education.', color: '#64e6e2' },
  { id: 'lenny', name: 'Lenny', role: 'Legal & Compliance', detail: 'The fine-print conscience and risk-checking voice.', color: '#ff9866' },
  { id: 'rosa', name: 'Rosa', role: 'Chief Researcher', detail: 'Evidence before decision. Sources before certainty.', color: '#9b7cff' },
  { id: 'sherpa', name: 'Sherpa', role: 'Product Guide', detail: 'Digital rights and clear routes for SherpaCarta.', color: '#36c7a2' },
  { id: 'ziggy', name: 'Ziggy', role: 'DevOps / Infrastructure', detail: 'Keeps every site green, observable, and moving.', color: '#5ed9ff' },
  { id: 'nova', name: 'Nova', role: 'Product Management', detail: 'Ships what matters and keeps the roadmap honest.', color: '#f2ca52' },
  { id: 'hello', name: 'hello', role: 'Public Front Door', detail: 'The first handshake for partners, NGOs, and curious people.', identity: 'hello@giveabit.io', color: '#8cf0b4' },
];
