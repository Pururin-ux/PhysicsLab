export type GraphDomain = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type GraphPadding = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type GraphPoint = {
  x: number;
  y: number;
};

export type GraphTick = {
  value: number;
  label: string;
};

export type GraphViewport = {
  width?: number;
  height?: number;
  padding?: GraphPadding;
};

export const DEFAULT_GRAPH_WIDTH = 320;
export const DEFAULT_GRAPH_HEIGHT = 220;
export const DEFAULT_GRAPH_PADDING = {
  left: 42,
  right: 18,
  top: 18,
  bottom: 32
} satisfies GraphPadding;

export function clampToDomain(value: number, min: number, max: number): number {
  const safeMin = finiteOrFallback(min, 0);
  const safeMax = finiteOrFallback(max, safeMin);
  const lower = Math.min(safeMin, safeMax);
  const upper = Math.max(safeMin, safeMax);
  const safeValue = finiteOrFallback(value, lower);

  return Math.min(Math.max(safeValue, lower), upper);
}

export function mapToGraphPoint(
  xValue: number,
  yValue: number,
  domain: GraphDomain,
  viewport: GraphViewport = {}
): GraphPoint {
  const width = finiteOrFallback(viewport.width, DEFAULT_GRAPH_WIDTH);
  const height = finiteOrFallback(viewport.height, DEFAULT_GRAPH_HEIGHT);
  const padding = viewport.padding ?? DEFAULT_GRAPH_PADDING;
  const safeDomain = normalizeDomain(domain);
  const plotWidth = Math.max(width - padding.left - padding.right, 1);
  const plotHeight = Math.max(height - padding.top - padding.bottom, 1);
  const clampedX = clampToDomain(xValue, safeDomain.xMin, safeDomain.xMax);
  const clampedY = clampToDomain(yValue, safeDomain.yMin, safeDomain.yMax);
  const xRatio = ratio(clampedX, safeDomain.xMin, safeDomain.xMax);
  const yRatio = ratio(clampedY, safeDomain.yMin, safeDomain.yMax);

  return {
    x: padding.left + xRatio * plotWidth,
    y: height - padding.bottom - yRatio * plotHeight
  };
}

export function seriesToPolyline<TPoint>(
  points: TPoint[],
  mapper: (point: TPoint) => GraphPoint
): string {
  return points
    .map((point) => mapper(point))
    .map((point) => `${formatGraphNumber(point.x)},${formatGraphNumber(point.y)}`)
    .join(" ");
}

export function createTicks(
  min: number,
  max: number,
  count = 5,
  formatter: (value: number) => string = (value) => formatGraphNumber(value)
): GraphTick[] {
  const safeCount = Math.max(2, Math.floor(finiteOrFallback(count, 5)));
  const safeMin = finiteOrFallback(min, 0);
  const safeMax = finiteOrFallback(max, safeMin + 1);
  const span = safeMax - safeMin;

  if (Math.abs(span) < 1e-9) {
    return [{ value: safeMin, label: formatter(safeMin) }];
  }

  return Array.from({ length: safeCount }, (_, index) => {
    const value = safeMin + (span * index) / (safeCount - 1);
    return {
      value,
      label: formatter(value)
    };
  });
}

export function formatGraphNumber(value: number, digits = 2): string {
  const safeValue = finiteOrFallback(value, 0);
  return Number(safeValue.toFixed(digits)).toString();
}

function normalizeDomain(domain: GraphDomain): GraphDomain {
  const xMin = finiteOrFallback(domain.xMin, 0);
  const xMax = ensureDistinctMax(xMin, domain.xMax);
  const yMin = finiteOrFallback(domain.yMin, 0);
  const yMax = ensureDistinctMax(yMin, domain.yMax);

  return { xMin, xMax, yMin, yMax };
}

function ensureDistinctMax(min: number, max: number): number {
  const safeMax = finiteOrFallback(max, min + 1);
  return Math.abs(safeMax - min) < 1e-9 ? min + 1 : safeMax;
}

function ratio(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

function finiteOrFallback(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
