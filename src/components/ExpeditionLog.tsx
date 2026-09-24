import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flag, Mountain, Rss } from 'lucide-react';
import {
  DISPATCHES,
  formatDispatchDate,
  formatDispatchMonth,
} from '../utils/dispatches';

const TERRAINS = [...new Set(DISPATCHES.map((entry) => entry.terrain))];

/**
 * The log is the part of the site that has to keep changing. Entries are real
 * markdown files (`src/content/dispatches`), so adding one is a copy-paste —
 * and the RSS feed is generated from the same source at build time.
 */
export const ExpeditionLog: React.FC = () => {
  const [terrainFilter, setTerrainFilter] = useState<string>('all');

  const entries = useMemo(
    () =>
      terrainFilter === 'all'
        ? DISPATCHES
        : DISPATCHES.filter((entry) => entry.terrain === terrainFilter),
    [terrainFilter],
  );

  return (
    <section className="expedition-section" id="expeditions">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">EXPEDITION LOG</h2>
        <p className="section-subtitle">
          Dated dispatches from the field — {DISPATCHES.length} entries, newest first.
          Real routes, real terrain, written when they happened.
        </p>
      </div>

      {TERRAINS.length > 1 && (
        <div className="log-filters" role="group" aria-label="Filter dispatches by terrain">
          <button
            type="button"
            className={`log-filter-btn ${terrainFilter === 'all' ? 'log-filter-btn--active' : ''}`}
            onClick={() => setTerrainFilter('all')}
            aria-pressed={terrainFilter === 'all'}
          >
            All terrain
          </button>
          {TERRAINS.map((terrain) => (
            <button
              key={terrain}
              type="button"
              className={`log-filter-btn ${terrainFilter === terrain ? 'log-filter-btn--active' : ''}`}
              onClick={() => setTerrainFilter(terrain)}
              aria-pressed={terrainFilter === terrain}
            >
              {terrain}
            </button>
          ))}
        </div>
      )}

      <ol className="log-timeline">
        {entries.map((entry, index) => (
          <motion.li
            key={entry.slug}
            className="log-entry"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            <div className="log-gutter" aria-hidden="true">
              <span className="log-month">{formatDispatchMonth(entry.date)}</span>
              <span className={`log-node ${index === 0 ? 'log-node--latest' : ''}`}>
                <Flag size={11} />
              </span>
            </div>

            <article className="log-card">
              <div className="log-meta">
                <time dateTime={entry.date}>{formatDispatchDate(entry.date)}</time>
                <span className="log-camp">
                  <Mountain size={11} /> {entry.camp}
                </span>
                <span className="log-terrain">{entry.terrain}</span>
                <span className="log-minutes">{entry.minutes} min read</span>
                {index === 0 && terrainFilter === 'all' && (
                  <span className="log-latest">Latest</span>
                )}
              </div>

              <h3 className="log-title">
                <Link to={`/dispatch/${entry.slug}`}>{entry.title}</Link>
              </h3>
              <p className="log-summary">{entry.summary}</p>

              <div className="log-foot">
                <span className="log-tags">
                  {entry.tags.map((tag) => (
                    <span className="log-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </span>
                <Link className="log-open" to={`/dispatch/${entry.slug}`}>
                  Read dispatch <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          </motion.li>
        ))}
      </ol>

      {entries.length === 0 && (
        <p className="log-empty">
          No dispatches filed under {terrainFilter} yet. The log gets the next one when it
          happens, not before.
        </p>
      )}

      <p className="log-feed">
        <Rss size={13} />
        <span>
          Subscribe to new dispatches:{' '}
          <a href="/feed.xml" type="application/rss+xml">
            /feed.xml
          </a>
        </span>
      </p>
    </section>
  );
};
