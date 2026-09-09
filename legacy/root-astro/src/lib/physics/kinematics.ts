export type UniformMotionSeriesParams = {
  x0: number;
  v: number;
  tMax: number;
  step?: number;
};

export type PartialUniformMotionSeriesParams = UniformMotionSeriesParams & {
  t: number;
};

export type UniformPositionPoint = {
  t: number;
  x: number;
};

export type UniformVelocityPoint = {
  t: number;
  v: number;
};

export type UniformMotionDirection = "forward" | "backward" | "still";

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

export function normalizeUniformMotionTime(t: number, tMax: number): number {
  const safeTMax = Number.isFinite(tMax) ? Math.max(0, tMax) : 0;
  return clampNumber(t, 0, safeTMax);
}

export function getUniformMotionDirection(v: number): UniformMotionDirection {
  if (v > 0) return "forward";
  if (v < 0) return "backward";
  return "still";
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

export function generatePartialUniformMotionSeries(
  params: PartialUniformMotionSeriesParams
): UniformPositionPoint[] {
  return generateUniformMotionSeries({
    x0: params.x0,
    v: params.v,
    tMax: normalizeUniformMotionTime(params.t, params.tMax),
    step: params.step
  });
}

export function generatePartialUniformVelocitySeries(
  params: PartialUniformMotionSeriesParams
): UniformVelocityPoint[] {
  return generateUniformVelocitySeries({
    x0: params.x0,
    v: params.v,
    tMax: normalizeUniformMotionTime(params.t, params.tMax),
    step: params.step
  });
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
