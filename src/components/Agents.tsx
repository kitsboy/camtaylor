import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Bot, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { AGENTS } from '../data/agents';

export const Agents: React.FC = () => {
  const [query, setQuery] = useState('');
  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return AGENTS;
    return AGENTS.filter((agent) => `${agent.name} ${agent.role} ${agent.detail}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
  <section className="agents-section" id="agents">
    <div className="agents-shell">
      <div className="agents-heading">
        <div className="agents-orbit" aria-hidden="true"><Bot size={22} /></div>
        <div>
          <p className="section-kicker">THE PEOPLE BEHIND IT</p>
          <h2 className="section-title">Meet the agents</h2>
          <p className="section-subtitle">An autonomous team with different strengths, one shared standard: evidence before ego.</p>
        </div>
        <a className="agents-cta" href="https://agents.giveabit.io" target="_blank" rel="noopener noreferrer">Meet the agents <ArrowUpRight size={15} /></a>
      </div>
      <label className="agent-search">
        <span className="sr-only">Search agents</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an agent by strength…" />
        <span>{filteredAgents.length}/{AGENTS.length}</span>
      </label>
      <div className="agents-constellation" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="agents-grid agents-grid--constellation">
        {filteredAgents.map((agent, index) => (
          <motion.a
            key={agent.id}
            href={`https://agents.giveabit.io/#${agent.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="agent-card"
            style={{ '--agent-color': agent.color } as React.CSSProperties}
            initial={{ opacity: 0, scale: .96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: index * .035, duration: .3 }}
          >
            <div className="agent-avatar" aria-hidden="true">{agent.name.slice(0, 1).toUpperCase()}</div>
            <div className="agent-copy">
              <div className="agent-name-row"><h3>{agent.name}</h3><ArrowUpRight size={13} /></div>
              <p className="agent-role">{agent.role}</p>
              <p className="agent-detail">{agent.detail}</p>
              <span className="agent-cta-hint">Open agent profile ↗</span>
              {agent.identity && <span className="agent-identity"><Mail size={11} /> {agent.identity}</span>}
            </div>
          </motion.a>
        ))}
      </div>
      {filteredAgents.length === 0 && <p className="agent-empty">No agent matches that route yet. Try “research”, “design”, or “Bitcoin”.</p>}
    </div>
  </section>
  );
};
