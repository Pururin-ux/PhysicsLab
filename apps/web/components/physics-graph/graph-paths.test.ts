import assert from "node:assert/strict";
import test from "node:test";
import {
  heatingCurveExample,
  physicsGraphExamples,
  pvCycleExample,
  vTProcessExample,
  xtNegativeLineExample,
} from "../../lib/physics/physics-graph-examples.ts";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec.ts";
import {
  buildPolylinePath,
  buildSegmentArrow,
  buildShadedAreaUnderPath,
  buildShadedPolygonPath,
  collectPointLabels,
} from "./graph-paths.ts";
import {
  DEFAULT_GRAPH_FRAME,
  createGraphScale,
  formatAxisLabel,
  formatTickLabel,
  makeAutoTicks,
} from "./graph-scale.ts";

test("all example specs have readable axis labels and renderable polylines", () => {
  for (const spec of physicsGraphExamples) {
    assert.ok(formatAxisLabel(spec.axes.x).trim(), `${spec.id} should have x axis label`);
    assert.ok(formatAxisLabel(spec.axes.y).trim(), `${spec.id} should have y axis label`);

    const scale = createGraphScale(spec);

    for (const series of spec.series) {
      assert.match(buildPolylinePath(series.points, scale, series.closed), /^M /);
    }
  }
});

test("renders units and symbolic ticks", () => {
  assert.equal(formatAxisLabel(vTProcessExample.axes.x), "T");
  assert.equal(formatAxisLabel(vTProcessExample.axes.y), "V");

  const symbolicTicks = [
    ...makeAutoTicks(pvCycleExample.axes.x),
    ...makeAutoTicks(pvCycleExample.axes.y),
    ...makeAutoTicks(vTProcessExample.axes.x),
    ...makeAutoTicks(vTProcessExample.axes.y),
  ].map(formatTickLabel);

  assert.ok(symbolicTicks.includes("V₀"));
  assert.ok(symbolicTicks.includes("2V₀"));
  assert.ok(symbolicTicks.includes("p₀"));
  assert.ok(symbolicTicks.includes("2p₀"));
  assert.ok(symbolicTicks.includes("T₀"));
  assert.ok(symbolicTicks.includes("2T₀"));
});

test("signed y-axis is mapped inside the plot area", () => {
  const scale = createGraphScale(xtNegativeLineExample);

  assert.equal(xtNegativeLineExample.kind, "signed-axis-graph");
  assert.ok(scale.xAxisY > DEFAULT_GRAPH_FRAME.top);
  assert.ok(scale.xAxisY < DEFAULT_GRAPH_FRAME.height - DEFAULT_GRAPH_FRAME.bottom);
});

test("collects point labels from series and annotations", () => {
  const labels = collectPointLabels(pvCycleExample).map((point) => point.label);

  assert.deepEqual(labels, ["1", "2", "3", "4"]);
});

test("keeps heating curve plateau as an interval, not area under graph", () => {
  assert.equal(
    heatingCurveExample.annotations?.some((item) => item.type === "shaded-area-under"),
    false,
  );
  assert.ok(heatingCurveExample.annotations?.some((item) => item.type === "vertical-band"));
});

test("builds shaded area under a line for area tasks", () => {
  const spec: PhysicsGraphSpec = {
    kind: "piecewise-line",
    axes: {
      x: { label: "t", unit: "с", range: [0, 4] },
      y: { label: "v", unit: "м/с", range: [0, 8] },
    },
    series: [
      {
        id: "velocity",
        type: "line",
        points: [
          { x: 0, y: 2 },
          { x: 4, y: 6 },
        ],
      },
    ],
  };
  const annotation = {
    type: "shaded-area-under" as const,
    fromX: 0,
    toX: 4,
    seriesId: "velocity",
  };
  const scale = createGraphScale(spec);

  assert.match(buildShadedAreaUnderPath(spec, annotation, scale) ?? "", /^M /);
});

test("builds shaded p(V) cycle polygon and segment arrows", () => {
  const scale = createGraphScale(pvCycleExample);
  const polygon = pvCycleExample.annotations?.find((item) => item.type === "shaded-polygon");
  const arrow = pvCycleExample.annotations?.find((item) => item.type === "segment-arrow");

  assert.ok(polygon);
  assert.match(buildShadedPolygonPath(polygon.points, scale), / Z$/);

  assert.ok(arrow);
  const segmentArrow = buildSegmentArrow(arrow.from, arrow.to, scale);
  assert.ok(segmentArrow.end.x > segmentArrow.start.x);
});

test("does not crash for a minimal cartesian spec", () => {
  const spec: PhysicsGraphSpec = {
    kind: "cartesian-line",
    axes: {
      x: { label: "t", unit: "с", range: [0, 1] },
      y: { label: "x", unit: "м", range: [0, 1] },
    },
    series: [{ type: "line", points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }],
  };
  const scale = createGraphScale(spec);

  assert.match(buildPolylinePath(spec.series[0].points, scale), /^M /);
  assert.equal(makeAutoTicks(spec.axes.x).length, 5);
});
