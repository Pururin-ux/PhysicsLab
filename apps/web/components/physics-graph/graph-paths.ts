import type {
  GraphAnnotationSpec,
  GraphPoint2D,
  GraphSeriesSpec,
  PhysicsGraphSpec,
} from "../../lib/physics/physics-graph-spec";
import type { GraphScale } from "./graph-scale";

export type SvgPoint = {
  x: number;
  y: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pointCommand(point: SvgPoint, index: number) {
  return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}

function interpolateY(points: GraphPoint2D[], x: number): number | null {
  const sorted = [...points].sort((a, b) => a.x - b.x);

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const start = sorted[index];
    const end = sorted[index + 1];
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);

    if (x < minX || x > maxX) {
      continue;
    }

    if (end.x === start.x) {
      return end.y;
    }

    const ratio = (x - start.x) / (end.x - start.x);
    return lerp(start.y, end.y, ratio);
  }

  return null;
}

export function buildPolylinePath(
  points: GraphPoint2D[],
  scale: GraphScale,
  closed = false,
) {
  if (points.length === 0) {
    return "";
  }

  const path = points.map((point, index) => pointCommand(scale.mapPoint(point), index)).join(" ");

  return closed ? `${path} Z` : path;
}

export function findSeries(
  spec: Pick<PhysicsGraphSpec, "series">,
  seriesId?: string,
): GraphSeriesSpec | null {
  if (seriesId) {
    return spec.series.find((series) => series.id === seriesId) ?? null;
  }

  return spec.series[0] ?? null;
}

export function buildShadedAreaUnderPath(
  spec: Pick<PhysicsGraphSpec, "axes" | "series">,
  annotation: Extract<GraphAnnotationSpec, { type: "shaded-area-under" }>,
  scale: GraphScale,
) {
  const series = findSeries(spec, annotation.seriesId);

  if (!series || series.points.length < 2) {
    return null;
  }

  const fromY = interpolateY(series.points, annotation.fromX);
  const toY = interpolateY(series.points, annotation.toX);

  if (fromY === null || toY === null) {
    return null;
  }

  const minX = Math.min(annotation.fromX, annotation.toX);
  const maxX = Math.max(annotation.fromX, annotation.toX);
  const innerPoints = series.points
    .filter((point) => point.x > minX && point.x < maxX)
    .sort((a, b) => a.x - b.x);
  const graphPoints = [
    { x: annotation.fromX, y: fromY },
    ...innerPoints,
    { x: annotation.toX, y: toY },
  ];
  const baselineValue =
    spec.axes.y.range[0] <= 0 && spec.axes.y.range[1] >= 0 ? 0 : spec.axes.y.range[0];
  const baseline = scale.mapY(baselineValue);
  const mapped = graphPoints.map((point) => scale.mapPoint(point));
  const topPath = mapped.map(pointCommand).join(" ");
  const first = mapped[0];
  const last = mapped[mapped.length - 1];

  return `${topPath} L ${last.x.toFixed(2)} ${baseline.toFixed(2)} L ${first.x.toFixed(2)} ${baseline.toFixed(2)} Z`;
}

export function buildShadedPolygonPath(points: GraphPoint2D[], scale: GraphScale) {
  if (points.length < 3) {
    return "";
  }

  return buildPolylinePath(points, scale, true);
}

export function buildSegmentArrow(
  from: GraphPoint2D,
  to: GraphPoint2D,
  scale: GraphScale,
) {
  const start = scale.mapPoint({
    x: lerp(from.x, to.x, 0.42),
    y: lerp(from.y, to.y, 0.42),
  });
  const end = scale.mapPoint({
    x: lerp(from.x, to.x, 0.64),
    y: lerp(from.y, to.y, 0.64),
  });

  return { start, end };
}

export function collectPointLabels(spec: Pick<PhysicsGraphSpec, "series" | "annotations">) {
  const seriesLabels = spec.series.flatMap((series) =>
    series.points
      .filter((point) => point.label)
      .map((point) => ({
        x: point.x,
        y: point.y,
        label: point.label as string,
      })),
  );
  const annotationLabels =
    spec.annotations?.filter((annotation): annotation is Extract<GraphAnnotationSpec, { type: "point-label" }> =>
      annotation.type === "point-label",
    ) ?? [];

  return [...seriesLabels, ...annotationLabels];
}
