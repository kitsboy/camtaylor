import React, { useState } from 'react';
import { Activity, Coins, ExternalLink, Loader2, RefreshCw, Zap } from 'lucide-react';
import {
  LIGHTNING_COPY,
  LIVE_SIGNAL_COPY,
  LIVE_SIGNAL_SOURCE,
  PRICE_COPY,
  PRICE_QUOTES,
  type PriceQuote,
} from '../data/liveSignal';
import { useLiveBitcoinSignal } from '../hooks/useLiveBitcoinSignal';
import { useLightningSignal } from '../hooks/useLightningSignal';
import { usePriceSignal } from '../hooks/usePriceSignal';
import { usePacificClock } from '../hooks/usePacificClock';
import { SignalChart } from './SignalChart';
import { SectionFold } from './SectionFold';
import { buildChartSeries } from '../utils/signalChart';

const CHART_W = 640;
const CHART_H = 120;
const ACID = '#d7ff55';
const VIOLET = '#6a2bff';
const SATS_PER_BTC = 100_000_000;

const counts = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const whole = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const btcFormat = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const satsFormat = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const usdFormat = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const pctFormat = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' });
const dayFormat = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });

function buildChart(values: number[]) {
  return buildChartSeries(values, CHART_W, CHART_H);
}

function formatAge(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export const LiveSignal: React.FC = () => {
  const { status, blocks, fees, mempool, updatedAt, isStale, refresh } = useLiveBitcoinSignal();
  const lightning = useLightningSignal();
  const price = usePriceSignal();
  const [quote, setQuote] = useState<PriceQuote>('USD');
  const { time, now } = usePacificClock();

  const cadRate = price.cadRate;
  // Falls back to USD whenever the live CAD rate is missing, so a label can
  // never claim Canadian dollars over American numbers.
  const activeQuote = quote === 'CAD' && cadRate ? 'CAD' : 'USD';
  const quoteConfig = PRICE_QUOTES.find((entry) => entry.code === activeQuote) ?? PRICE_QUOTES[0];
  const factor = activeQuote === 'CAD' && cadRate ? cadRate : 1;

  const chart = buildChart(blocks.map((block) => block.txCount));
  const tip = blocks.length ? blocks[blocks.length - 1] : null;
  const age = tip ? formatAge(Math.max(0, Math.round(now / 1000 - tip.timestamp))) : '—';
  const lightningLatest = lightning.samples.length ? lightning.samples[lightning.samples.length - 1] : null;
  const lightningBtc = lightning.samples.map((sample) => sample.capacity / SATS_PER_BTC);
  const lightningSeries = buildChartSeries(lightningBtc, CHART_W, CHART_H);
  const torShare = lightningLatest
    ? Math.round(
        (lightningLatest.torNodes /
          Math.max(1, lightningLatest.torNodes + lightningLatest.clearnetNodes + lightningLatest.unannouncedNodes)) *
          100,
      )
    : null;
  const lightningWindow =
    lightning.samples.length > 1
      ? `${dayFormat.format(new Date(lightning.samples[0].at))} – ${dayFormat.format(new Date(lightning.samples[lightning.samples.length - 1].at))}`
      : null;

  const priceSamples = price.samples.map((sample) => ({
    close: sample.close * factor,
    low: sample.low * factor,
    high: sample.high * factor,
  }));
  const priceFirst = priceSamples.length ? priceSamples[0].close : null;
  const priceLatest = priceSamples.length ? priceSamples[priceSamples.length - 1].close : null;
  const satsSeries = priceSamples.map((sample) => SATS_PER_BTC / sample.close);
  const satsChart = buildChartSeries(satsSeries, CHART_W, CHART_H);
  const satsNow = priceLatest ? SATS_PER_BTC / priceLatest : null;
  const priceChange = priceFirst && priceLatest ? ((priceLatest - priceFirst) / priceFirst) * 100 : null;
  const priceLow = priceSamples.length ? Math.min(...priceSamples.map((sample) => sample.low)) : null;
  const priceHigh = priceSamples.length ? Math.max(...priceSamples.map((sample) => sample.high)) : null;
  const feeTiers = fees
    ? [
        { label: 'Fastest', value: fees.fastest },
        { label: '30 min', value: fees.halfHour },
        { label: '1 hour', value: fees.hour },
        { label: 'Economy', value: fees.economy },
      ]
    : [];
  const feeMax = feeTiers.reduce((high, tier) => Math.max(high, tier.value), 0) || 1;

  return (
    <section className="live-section" id="signal">
      <div className="live-shell">
        <div className="live-head">
          <div>
            <p className="section-kicker">{LIVE_SIGNAL_COPY.kicker}</p>
            <h2 className="section-title">{LIVE_SIGNAL_COPY.title}</h2>
            <p className="live-subtitle">{LIVE_SIGNAL_COPY.subtitle}</p>
          </div>
          <div
            className={`live-state live-state--${isStale || lightning.isStale || price.isStale ? 'stale' : status}`}
            aria-live="polite"
          >
            <span className="live-state-dot" aria-hidden="true" />
            {isStale || lightning.isStale || price.isStale
              ? 'LAST GOOD'
              : status === 'live'
                ? 'LIVE'
                : status === 'connecting'
                  ? 'CONNECTING'
                  : 'OFFLINE'}
            <small>{time} PT</small>
          </div>
        </div>

        {/*
          A dropped read used to blank the panel and print "offline", which blames the
          reader's connection for what is often a blocked request — and throws away a
          reading the browser had in hand a minute earlier. The reading is kept, with the
          time it was actually received, and this says which panels are showing it.
        */}
        {isStale || lightning.isStale || price.isStale ? (
          <p className="live-stale" role="status">
            <RefreshCw size={13} aria-hidden="true" />
            {[
              isStale ? 'the chain reading' : null,
              lightning.isStale ? 'Lightning capacity' : null,
              price.isStale ? 'the price series' : null,
            ]
              .filter(Boolean)
              .join(', ')}
            {' '}
            {isStale && updatedAt
              ? `could not be read again — showing the last reading this browser received, ${new Date(updatedAt).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Vancouver' })} PT.`
              : 'could not be read again — showing the last reading this browser received.'}
          </p>
        ) : null}

        {/*
          Three instruments, 1,182px of a 390px phone stacked on top of each
          other. The chain reading is the one the nav item promises ("Live
          signal"), so it stays; the Lightning and price panels are one tap
          away behind a counted control. On a desktop nothing is folded —
          `SectionFold` renders its children straight through — so the
          three-up layout is unchanged, and every panel stays mounted either
          way.
        */}
        <div className="live-panels">
          <SectionFold shown={1} noun="readings" bodyClassName="live-panels">
          <div className="live-chart-wrap">
            <div className="live-chart-head">
              <span>
                <Activity size={13} /> {LIVE_SIGNAL_COPY.chartLabel}
              </span>
              <span className="live-chart-range">
                {chart && status === 'live'
                  ? `last ${blocks.length} blocks · ${counts.format(blocks[0].height)}–${counts.format(tip?.height ?? 0)}`
                  : 'waiting for the next block'}
              </span>
            </div>
            <div className="live-chart-well">
              {chart && status === 'live' ? (
                <SignalChart
                  values={blocks.map((block) => block.txCount)}
                  label={`Transactions per block across the last ${blocks.length} Bitcoin blocks`}
                  gradientId="live-chart-fill"
                  accent={ACID}
                  svgClassName="live-chart"
                />
              ) : (
                <p className="live-offline">
                  {status === 'connecting' ? 'Reading the chain…' : LIVE_SIGNAL_COPY.offline}
                </p>
              )}
            </div>
            {chart && status === 'live' ? (
              <div className="live-chart-foot">
                <span>low {counts.format(chart.min)} txs</span>
                <span>high {counts.format(chart.max)} txs</span>
              </div>
            ) : null}
            <div className="live-mini-stats" role="group" aria-label="Chain readings">
              <div className="live-mini-stat live-stat">
                <span className="live-stat-label">Tip height</span>
                <strong>{tip ? counts.format(tip.height) : '—'}</strong>
                <small>latest mined block</small>
              </div>
              <div className="live-mini-stat live-stat">
                <span className="live-stat-label">Mempool</span>
                <strong>{mempool ? counts.format(mempool.count) : '—'}</strong>
                <small>transactions waiting</small>
              </div>
              <div className="live-mini-stat live-stat">
                <span className="live-stat-label">Fast fee</span>
                <strong>
                  {fees ? fees.fastest : '—'}
                  <i>{fees ? 'sats/vB' : ''}</i>
                </strong>
                <small>next-block estimate</small>
              </div>
              <div className="live-mini-stat live-stat">
                <span className="live-stat-label">Block age</span>
                <strong>{age}</strong>
                <small>since the tip was found</small>
              </div>
            </div>
          </div>

          <div className="live-panel live-panel--lightning">
            <div className="live-chart-head">
              <span>
                <Zap size={13} /> {LIGHTNING_COPY.title}
              </span>
              <span className="live-chart-range">
                {lightningWindow ? `${lightningWindow} · ${lightning.samples.length} snapshots` : 'daily snapshots'}
              </span>
            </div>
            {lightning.status === 'live' && lightningSeries ? (
              <>
                <div className="live-chart-well">
                  <SignalChart
                    values={lightningBtc}
                    label={`Public Lightning channel capacity across ${lightning.samples.length} daily snapshots`}
                    gradientId="lightning-chart-fill"
                    accent="#07cdc4"
                    svgClassName="lightning-chart"
                  />
                </div>
                <div className="live-chart-foot">
                  <span>low {btcFormat.format(lightningSeries.min)} BTC</span>
                  <span>high {btcFormat.format(lightningSeries.max)} BTC</span>
                </div>
              </>
            ) : (
              <div className="live-chart-well">
                <p className="live-panel-empty">
                  {lightning.status === 'connecting' ? LIGHTNING_COPY.connecting : LIGHTNING_COPY.empty}
                </p>
              </div>
            )}
            <div className="live-mini-stats">
              <div className="live-mini-stat">
                <span className="live-stat-label">Capacity</span>
                <strong>{lightningLatest ? btcFormat.format(lightningLatest.capacity / SATS_PER_BTC) : '—'}<i>BTC</i></strong>
                <small>{lightningLatest ? `${whole.format(lightningLatest.capacity)} sats public` : 'public channel capacity'}</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">Channels</span>
                <strong>{lightningLatest ? whole.format(lightningLatest.channels) : '—'}</strong>
                <small>public channels</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">Nodes</span>
                <strong>{lightningLatest ? whole.format(lightningLatest.torNodes + lightningLatest.clearnetNodes + lightningLatest.unannouncedNodes) : '—'}</strong>
                <small>announced nodes</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">Tor share</span>
                <strong>{torShare !== null ? `${torShare}%` : '—'}</strong>
                <small>of announced nodes</small>
              </div>
            </div>
            <p className="live-panel-note">{LIGHTNING_COPY.note}</p>
          </div>

          <div className="live-panel live-panel--price">
            <div className="live-chart-head">
              <span>
                <Coins size={13} /> {PRICE_COPY.title}
              </span>
              <span className="live-chart-head-right">
                <span className="live-chart-range">
                  {price.samples.length > 1 ? `last ${price.samples.length} hourly closes` : 'hourly closes'}
                </span>
                <span className="live-quote-toggle" role="group" aria-label={`Quote currency, showing ${activeQuote}`}>
                  {PRICE_QUOTES.map((entry) => {
                    const isDisabled = entry.code === 'CAD' && !cadRate;
                    return (
                      <button
                        key={entry.code}
                        type="button"
                        className={`live-quote-btn ${activeQuote === entry.code ? 'live-quote-btn--active' : ''}`}
                        aria-pressed={activeQuote === entry.code}
                        disabled={isDisabled}
                        title={isDisabled ? PRICE_COPY.noRate : `Show readings in ${entry.code}`}
                        onClick={() => setQuote(entry.code)}
                      >
                        {entry.code}
                      </button>
                    );
                  })}
                </span>
              </span>
            </div>
            {price.status === 'live' && satsChart ? (
              <>
                <div className="live-chart-well">
                  <SignalChart
                    values={satsSeries}
                    label={`Sats per ${activeQuote} dollar across the last ${price.samples.length} hourly closes`}
                    gradientId="price-chart-fill"
                    accent={VIOLET}
                    svgClassName="price-chart"
                  />
                </div>
                <div className="live-chart-foot">
                  <span>low {satsFormat.format(satsChart.min)} sats</span>
                  <span>high {satsFormat.format(satsChart.max)} sats</span>
                </div>
              </>
            ) : (
              <div className="live-chart-well">
                <p className="live-panel-empty">
                  {price.status === 'connecting' ? PRICE_COPY.connecting : PRICE_COPY.empty}
                </p>
              </div>
            )}
            <div className="live-mini-stats">
              <div className="live-mini-stat">
                <span className="live-stat-label">{quoteConfig.perLabel}</span>
                <strong>{satsNow !== null ? satsFormat.format(satsNow) : '—'}</strong>
                <small>at the latest close</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">BTC price</span>
                <strong>{priceLatest !== null ? `${quoteConfig.symbol}${usdFormat.format(priceLatest)}` : '—'}</strong>
                <small>{activeQuote === 'CAD' ? 'Canadian dollars' : 'US dollars'}</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">Day move</span>
                <strong>{priceChange !== null ? `${pctFormat.format(priceChange)}%` : '—'}</strong>
                <small>over the window</small>
              </div>
              <div className="live-mini-stat">
                <span className="live-stat-label">Hourly range</span>
                <strong>{priceLow !== null && priceHigh !== null ? `${quoteConfig.symbol}${usdFormat.format(priceLow)}–${quoteConfig.symbol}${usdFormat.format(priceHigh)}` : '—'}</strong>
                <small>low to high, {activeQuote}</small>
              </div>
            </div>
            <p className="live-panel-note">
              {PRICE_COPY.note}
              {activeQuote === 'CAD' && cadRate ? ` Live rate: 1 USD = ${cadRate.toFixed(4)} CAD (mempool.space).` : ''}
            </p>
          </div>
          </SectionFold>
        </div>

        {feeTiers.length > 0 && (
          <div className="live-fees" aria-label="Recommended fee tiers in sats per vB">
            {feeTiers.map((tier) => (
              <div className="live-fee" key={tier.label}>
                <div className="live-fee-bar">
                  <span className="live-fee-fill" style={{ width: `${Math.max(4, (tier.value / feeMax) * 100)}%` }} />
                </div>
                <div className="live-fee-meta">
                  <span>{tier.label}</span>
                  <strong>{tier.value} sats/vB</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="live-foot">
          <p className="live-note">{LIVE_SIGNAL_COPY.note}</p>
          <div className="live-actions">
            <a className="live-source" href={LIVE_SIGNAL_SOURCE.home} target="_blank" rel="noopener noreferrer">
              {LIVE_SIGNAL_SOURCE.name} <ExternalLink size={12} />
            </a>
            <button
              type="button"
              className="live-refresh"
              onClick={() => {
                void refresh();
                void lightning.refresh();
                void price.refresh();
              }}
              disabled={status === 'connecting'}
            >
              {status === 'connecting' ? <Loader2 size={13} className="proof-spin" /> : <RefreshCw size={13} />}
              Refresh reading
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
