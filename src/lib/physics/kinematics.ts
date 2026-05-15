export type UniformMotionSeriesParams = {
  x0: number;
  v: number;
  tMax: number;
  step?: number;
};

export type UniformPositionPoint = {
  t: number;
  x: number;
};

export type UniformVelocityPoint = {
  t: number;
  v: number;
};

export function uniformPosition(x0: number, v: number, t: number): number {
  return x0 + v * t;
}

export function uniformVelocity(v: number): number {
  return v;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function formatPhysicsNumber(value: number, digits = 2): string {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

export function generateUniformMotionSeries(
  params: UniformMotionSeriesParams
): UniformPositionPoint[] {
  const { x0, v, tMax } = params;
  const step = normalizeStep(params.step);
  const safeTMax = Math.max(0, tMax);
  const points: UniformPositionPoint[] = [];

  // Include the final tMax point so graph and numeric state use the same domain.
  for (let t = 0; t < safeTMax; t += step) {
    points.push({ t: formatSeriesNumber(t), x: uniformPosition(x0, v, t) });
  }

  points.push({
    t: formatSeriesNumber(safeTMax),
    x: uniformPosition(x0, v, safeTMax)
  });

  return points;
}

export function generateUniformVelocitySeries(
  params: UniformMotionSeriesParams
): UniformVelocityPoint[] {
  const { v, tMax } = params;
  const step = normalizeStep(params.step);
  const safeTMax = Math.max(0, tMax);
  const points: UniformVelocityPoint[] = [];

  for (let t = 0; t < safeTMax; t += step) {
    points.push({ t: formatSeriesNumber(t), v: uniformVelocity(v) });
  }

  points.push({ t: formatSeriesNumber(safeTMax), v: uniformVelocity(v) });

  return points;
}

function normalizeStep(step = 0.5): number {
  if (!Number.isFinite(step) || step <= 0) {
    return 0.5;
  }

  return step;
}

function formatSeriesNumber(value: number): number {
  return Number(value.toFixed(4));
}

