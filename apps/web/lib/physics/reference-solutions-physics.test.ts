import assert from "node:assert/strict";
import test from "node:test";
import { getReferenceSolution } from "../learning/reference-solutions.ts";

const EPSILON = 1e-9;

function closeTo(actual: number, expected: number, message: string) {
  assert.ok(Math.abs(actual - expected) < EPSILON, `${message}: ${actual} != ${expected}`);
}

test("Ohm reference satisfies I R = U with coherent units", () => {
  const solution = getReferenceSolution("ohm-law")!;
  const [voltage, resistance] = solution.givens;
  const current = 3;

  closeTo(current * resistance.value - voltage.value, 0, "Ohm residual");
  assert.deepEqual([voltage.unit, resistance.unit, solution.answer.expression.accessibleText.includes("ампера")], ["В", "Ом", true]);
});
test("v(t) reference area is a 16 metre trapezoid", () => {
  const solution = getReferenceSolution("vt-area")!;
  const [v0, v1, duration] = solution.givens.map(({ value }) => value);
  const displacement = ((v0 + v1) * duration) / 2;

  assert.ok(duration > 0);
  assert.ok([v0, v1, duration, displacement].every(Number.isFinite));
  closeTo(displacement, 16, "trapezoid area");
  assert.ok(solution.answer.expression.accessibleText.includes("16 метров"));
});

test("friction reference satisfies N = mg and F = mu N", () => {
  const solution = getReferenceSolution("friction-force")!;
  const [mass, coefficient, gravity] = solution.givens.map(({ value }) => value);
  const normal = mass * gravity;
  const friction = coefficient * normal;

  assert.ok(coefficient >= 0);
  closeTo(normal, 50, "normal force");
  closeTo(friction, 10, "friction force");
});

test("average-speed reference uses total distance over total time", () => {
  const solution = getReferenceSolution("average-speed-segments")!;
  const [s1, t1, s2, t2] = solution.givens.map(({ value }) => value);
  const totalTime = t1 + t2;
  const averageSpeed = (s1 + s2) / totalTime;
  const wrongArithmeticMean = (s1 / t1 + s2 / t2) / 2;

  assert.ok(totalTime > 0);
  closeTo(averageSpeed, 8, "average speed");
  assert.notEqual(averageSpeed, wrongArithmeticMean);
});

test("heat-balance reference has zero energy residual and bounded temperature", () => {
  const solution = getReferenceSolution("heat-balance-simple")!;
  const [hotMass, hotTemperature, coldMass, coldTemperature] = solution.givens.map(({ value }) => value);
  const finalTemperature = 44;
  const specificHeat = 4200;
  const residual =
    hotMass * specificHeat * (hotTemperature - finalTemperature) -
    coldMass * specificHeat * (finalTemperature - coldTemperature);

  closeTo(residual, 0, "heat balance residual");
  assert.ok(coldTemperature < finalTemperature && finalTemperature < hotTemperature);
});

test("lens reference satisfies the thin-lens equation and diagram placement", () => {
  const solution = getReferenceSolution("thin-lens-image-distance")!;
  const [focalLength, objectDistance] = solution.givens.map(({ value }) => value);
  const imageDistance = 15;
  const residual = 1 / focalLength - 1 / objectDistance - 1 / imageDistance;

  closeTo(residual, 0, "thin-lens residual");
  assert.ok(objectDistance > 2 * focalLength);
  assert.ok(imageDistance > focalLength && imageDistance < 2 * focalLength);

  const visual = solution.visual;
  assert.equal(visual?.kind, "optics");
  if (visual?.kind === "optics") {
    assert.equal(visual.spec.focalLength, focalLength);
    assert.equal(visual.spec.objectDistance, objectDistance);
    assert.equal(visual.spec.imageDistance, imageDistance);
    assert.ok([visual.spec.focalLength, visual.spec.objectDistance, visual.spec.imageDistance].every(Number.isFinite));
  }
});
