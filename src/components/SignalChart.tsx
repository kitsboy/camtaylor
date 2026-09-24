import React from 'react';
import { buildChartSeries } from '../utils/signalChart';

interface SignalChartProps {
  values: number[];
  label: string;
  gradientId: string;
  accent: string;
  svgClassName: string;
}

/**
 * One reusable reading chart. Straight lines, no smoothing: these are
 * measurements, not a trend line someone drew for us.
 */
export const SignalChart: React.FC<SignalChartProps> = ({ values, label, gradientId, accent, svgClassName }) => {
  const series = buildChartSeries(values, 640, 120);
  if (!series) return null;

  return (
    <svg
      className={svgClassName}
      viewBox="0 0 640 120"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.42" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="live-chart-area" d={series.area} fill={`url(#${gradientId})`} />
      <polyline
        className="live-chart-line"
        points={series.line}
        style={{ stroke: accent }}
        vectorEffect="non-scaling-stroke"
      />
      {series.points.map((point) => (
        <circle
          key={point.x}
          className="live-chart-point"
          cx={point.x}
          cy={point.y}
          r={2.4}
          style={{ stroke: accent }}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
};
