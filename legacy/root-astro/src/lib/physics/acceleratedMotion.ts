export type AcceleratedMotionSeriesParams = {
  x0: number;
  v0: number;
  a: number;
  tMax: number;
  step?: number;
};

export type AcceleratedVelocitySeriesParams = {
  v0: number;
  a: number;
  tMax: number;
  step?: number;
};

export type AcceleratedPositionPoint = {
  t: number;
  x: number;
};

export type AcceleratedVelocityPoint = {
  t: number;
  v: number;
};

export type AcceleratedMotionDirection = "forward" | "backward" | "still";

export function velocityAt(t: number, v0: number, a: number): number {
  return safeNumber(v0) + safeNumber(a) * normalizeTime(t);
}

export function positionAt(t: number, x0: number, v0: number, a: number): number {
  const safeT = normalizeTime(t);
  return safeNumber(x0) + safeNumber(v0) * safeT + (safeNumber(a) * safeT * safeT) / 2;
}

export function accelerationMotionDirection(
  t: number,
  v0: number,
  a: number
): AcceleratedMotionDirection {
  const v = velocityAt(t, v0, a);
  if (Math.abs(v) < 1e-9) return "still";
  return v > 0 ? "forward" : "backward";
}

export function generateVelocitySeries(
  params: AcceleratedVelocitySeriesParams
): AcceleratedVelocityPoint[] {
  const { v0, a } = params;
  const step = normalizeStep(params.step);
  const safeTMax = normalizeTime(params.tMax);
  const points: AcceleratedVelocityPoint[] = [];

  for (let t = 0; t < safeTMax; t += step) {
    points.push({ t: formatSeriesNumber(t), v: velocityAt(t, v0, a) });
  }

  points.push({
    t: formatSeriesNumber(safeTMax),
    v: velocityAt(safeTMax, v0, a)
  });

  return points;
}

export function generatePositionSeries(
  params: AcceleratedMotionSeriesParams
): AcceleratedPositionPoint[] {
  const { x0, v0, a } = params;
  const step = normalizeStep(params.step);
  const safeTMax = normalizeTime(params.tMax);
  const points: AcceleratedPositionPoint[] = [];

  for (let t = 0; t < safeTMax; t += step) {
    points.push({ t: formatSeriesNumber(t), x: positionAt(t, x0, v0, a) });
  }

  points.push({
    t: formatSeriesNumber(safeTMax),
    x: positionAt(safeTMax, x0, v0, a)
  });

  return points;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function normalizeTime(t: number): number {
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, t);
}

function normalizeStep(step = 0.25): number {
  if (!Number.isFinite(step) || step <= 0) {
    return 0.25;
  }

  return step;
}

function formatSeriesNumber(value: number): number {
  return Number(value.toFixed(4));
}
