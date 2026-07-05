import assert from "node:assert/strict";
import test from "node:test";
import { physicsGraphExamples, pvCycleExample } from "../../lib/physics/physics-graph-examples.ts";
import { getAccessibleMathLabel, getMathLabelParts } from "./svg-math-label-parts.ts";

test("math label splits physical symbol and unit", () => {
  assert.deepEqual(getMathLabelParts("v", "м/с"), [
    { kind: "symbol", text: "v" },
    { kind: "text", text: ", " },
    { kind: "unit", text: "м/с" },
  ]);
});

test("math label keeps unit upright and renders superscript in unit", () => {
  assert.deepEqual(getMathLabelParts("p", "10⁵ Па"), [
    { kind: "symbol", text: "p" },
    { kind: "text", text: ", " },
    { kind: "unit", text: "10" },
    { kind: "superscript", text: "5" },
    { kind: "unit", text: " Па" },
  ]);
});

test("symbolic ticks split coefficient, symbol, and subscript", () => {
  assert.deepEqual(getMathLabelParts("2V₀"), [
    { kind: "number", text: "2" },
    { kind: "symbol", text: "V" },
    { kind: "subscript", text: "0" },
  ]);
  assert.deepEqual(getMathLabelParts("3T₀"), [
    { kind: "number", text: "3" },
    { kind: "symbol", text: "T" },
    { kind: "subscript", text: "0" },
  ]);
});

test("old string labels still produce accessible text", () => {
  assert.equal(getAccessibleMathLabel("x, м"), "x, м");
  assert.equal(getAccessibleMathLabel("12"), "12");
});

test("all example axis and tick labels are finite readable strings", () => {
  const labels = physicsGraphExamples.flatMap((spec) => [
    getAccessibleMathLabel(spec.axes.x.label, spec.axes.x.unit),
    getAccessibleMathLabel(spec.axes.y.label, spec.axes.y.unit),
    ...(spec.axes.x.ticks ?? []).map((tick) =>
      getAccessibleMathLabel(tick.label ?? String(tick.value)),
    ),
    ...(spec.axes.y.ticks ?? []).map((tick) =>
      getAccessibleMathLabel(tick.label ?? String(tick.value)),
    ),
  ]);

  for (const label of labels) {
    assert.ok(label.trim());
    assert.equal(label.includes("undefined"), false);
    assert.equal(label.includes("NaN"), false);
    assert.equal(label.includes("Infinity"), false);
  }
});

test("p(V) symbolic ticks stay readable", () => {
  const tickLabels = [
    ...(pvCycleExample.axes.x.ticks ?? []),
    ...(pvCycleExample.axes.y.ticks ?? []),
  ].map((tick) => getAccessibleMathLabel(tick.label ?? String(tick.value)));

  assert.ok(tickLabels.includes("V0"));
  assert.ok(tickLabels.includes("2V0"));
  assert.ok(tickLabels.includes("p0"));
  assert.ok(tickLabels.includes("2p0"));
});
