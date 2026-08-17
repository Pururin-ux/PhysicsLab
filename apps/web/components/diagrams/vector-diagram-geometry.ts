import type { PlanarVector, VectorDiagramSpec } from "../../lib/physics/vector-diagram-spec";

export type GridPoint = { x: number; y: number };
export type VectorEndpoints = { start: GridPoint; end: GridPoint };

const EPS = 1e-6;

function samePoint(a: GridPoint, b: GridPoint) {
  return Math.abs(a.x - b.x) < EPS && Math.abs(a.y - b.y) < EPS;
}

// В layout "chain" каждый следующий вектор стыкуется концом предыдущего —
// начало первого всегда в истинном начале координат.
export function computeVectorEndpoints(
  spec: Pick<VectorDiagramSpec, "layout" | "vectors">,
): Map<string, VectorEndpoints> {
  const result = new Map<string, VectorEndpoints>();
  let cursor: GridPoint = { x: 0, y: 0 };

  for (const vector of spec.vectors) {
    const start = spec.layout === "chain" ? cursor : { x: 0, y: 0 };
    const end = { x: start.x + vector.dx, y: start.y + vector.dy };
    result.set(vector.id, { start, end });
    cursor = end;
  }

  return result;
}

export function computeResultant(vectors: PlanarVector[]): { dx: number; dy: number } {
  return vectors.reduce(
    (sum, vector) => ({ dx: sum.dx + vector.dx, dy: sum.dy + vector.dy }),
    { dx: 0, dy: 0 },
  );
}

export type AngleMarkGeometry = {
  center: GridPoint;
  dirA: GridPoint;
  dirB: GridPoint;
};

// Находит точку стыка двух векторов (общее начало у "concurrent",
// общий узел стыка у "chain") и направления лучей от неё — от этой точки
// строится дуга угла между векторами.
export function resolveAngleMark(
  idA: string,
  idB: string,
  endpoints: Map<string, VectorEndpoints>,
): AngleMarkGeometry | null {
  const a = endpoints.get(idA);
  const b = endpoints.get(idB);
  if (!a || !b) {
    return null;
  }

  type Candidate = AngleMarkGeometry & { match: boolean };

  const candidates: Candidate[] = [
    {
      center: a.start,
      dirA: { x: a.end.x - a.start.x, y: a.end.y - a.start.y },
      dirB: { x: b.end.x - b.start.x, y: b.end.y - b.start.y },
      match: samePoint(a.start, b.start),
    },
    {
      center: a.start,
      dirA: { x: a.end.x - a.start.x, y: a.end.y - a.start.y },
      dirB: { x: b.start.x - b.end.x, y: b.start.y - b.end.y },
      match: samePoint(a.start, b.end),
    },
    {
      center: a.end,
      dirA: { x: a.start.x - a.end.x, y: a.start.y - a.end.y },
      dirB: { x: b.end.x - b.start.x, y: b.end.y - b.start.y },
      match: samePoint(a.end, b.start),
    },
    {
      center: a.end,
      dirA: { x: a.start.x - a.end.x, y: a.start.y - a.end.y },
      dirB: { x: b.start.x - b.end.x, y: b.start.y - b.end.y },
      match: samePoint(a.end, b.end),
    },
  ];

  const found = candidates.find((candidate) => candidate.match);
  if (found) {
    return { center: found.center, dirA: found.dirA, dirB: found.dirB };
  }

  // Векторы не стыкуются — рисуем дугу у начала первого, направления как есть.
  return {
    center: a.start,
    dirA: { x: a.end.x - a.start.x, y: a.end.y - a.start.y },
    dirB: { x: b.end.x - b.start.x, y: b.end.y - b.start.y },
  };
}

export type ArcGeometry = {
  path: string;
  labelPoint: GridPoint;
  deltaDeg: number;
};

// Строит SVG-дугу (в пиксельных координатах) между двумя направлениями,
// центрированную в `centerPx`, всегда выбирая меньшую из двух дуг.
export function buildAngleArcPath(
  centerPx: GridPoint,
  dirAPx: GridPoint,
  dirBPx: GridPoint,
  radiusPx: number,
): ArcGeometry {
  const angleA = Math.atan2(dirAPx.y, dirAPx.x);
  const angleB = Math.atan2(dirBPx.y, dirBPx.x);
  let delta = angleB - angleA;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  while (delta > Math.PI) delta -= 2 * Math.PI;

  const sweepFlag = delta > 0 ? 1 : 0;
  const start = {
    x: centerPx.x + Math.cos(angleA) * radiusPx,
    y: centerPx.y + Math.sin(angleA) * radiusPx,
  };
  const end = {
    x: centerPx.x + Math.cos(angleB) * radiusPx,
    y: centerPx.y + Math.sin(angleB) * radiusPx,
  };
  const midAngle = angleA + delta / 2;
  const labelPoint = {
    x: centerPx.x + Math.cos(midAngle) * (radiusPx + 15),
    y: centerPx.y + Math.sin(midAngle) * (radiusPx + 15),
  };

  return {
    path: `M ${start.x} ${start.y} A ${radiusPx} ${radiusPx} 0 0 ${sweepFlag} ${end.x} ${end.y}`,
    labelPoint,
    deltaDeg: Math.round(Math.abs(delta) * (180 / Math.PI)),
  };
}
