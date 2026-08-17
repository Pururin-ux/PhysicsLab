export interface UniformMotionInput {
  x0?: number;
  v: number;
  t: number;
}

export interface UniformMotionState {
  x: number;
  displacement: number;
  v: number;
}

export interface AcceleratedMotionInput {
  x0?: number;
  v0?: number;
  a: number;
  t: number;
}

export interface AcceleratedMotionState {
  x: number;
  displacement: number;
  v: number;
}

function assertNonNegativeTime(t: number) {
  if (t < 0) {
    throw new RangeError("Time must be non-negative.");
  }
}

export function uniformMotion({
  x0 = 0,
  v,
  t,
}: UniformMotionInput): UniformMotionState {
  assertNonNegativeTime(t);

  const displacement = v * t;

  return {
    x: x0 + displacement,
    displacement,
    v,
  };
}

export function acceleratedMotion({
  x0 = 0,
  v0 = 0,
  a,
  t,
}: AcceleratedMotionInput): AcceleratedMotionState {
  assertNonNegativeTime(t);

  const displacement = v0 * t + (a * t ** 2) / 2;

  return {
    x: x0 + displacement,
    displacement,
    v: v0 + a * t,
  };
}

export function nthSecondDisplacement({
  v0 = 0,
  a,
  n,
}: {
  v0?: number;
  a: number;
  n: number;
}) {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError("Second number must be a positive integer.");
  }

  const atEnd = acceleratedMotion({ v0, a, t: n }).displacement;
  const before = acceleratedMotion({ v0, a, t: n - 1 }).displacement;

  return atEnd - before;
}
