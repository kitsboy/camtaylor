export interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

export interface ChartSeries {
  points: ChartPoint[];
  line: string;
  area: string;
  min: number;
  max: number;
}

/**
 * Turns a list of raw readings into SVG line + area geometry. Never called with
 * invented values — callers only pass readings they actually read.
 */
export function buildChartSeries(values: number[], width: number, height: number): ChartSeries | null {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((value, index) => ({
    value,
    x: index * stepX,
    y: height - 14 - ((value - min) / span) * (height - 38),
  }));
  const coords = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`);
  return {
    points,
    min,
    max,
    line: coords.join(' '),
    area: `M0,${height} L${coords.join(' L')} L${width},${height} Z`,
  };
}
