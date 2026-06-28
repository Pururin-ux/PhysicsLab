import type { GraphConfig, GraphPoint, GraphType } from "./graph-data";
import type { GraphAxisSpec, PhysicsGraphSpec } from "./physics-graph-spec";

type AdapterOptions = {
  showArea?: boolean;
  title?: string;
};

function splitAxisLabel(value: string): Pick<GraphAxisSpec, "label" | "unit"> {
  const [label, unit] = value.split(",").map((part) => part.trim());

  return {
    label: label || value,
    unit,
  };
}

function readGraphY(point: GraphPoint, type: GraphType) {
  if (type === "vt") return point.v ?? 0;
  if (type === "xt") return point.x ?? 0;
  return point.a ?? 0;
}

function makeTicks(range: [number, number], count = 5) {
  const [min, max] = range;
  const step = (max - min) / count;

  return Array.from({ length: count + 1 }, (_, index) => ({
    value: min + step * index,
  }));
}

export function graphConfigToPhysicsGraphSpec(
  config: GraphConfig,
  options: AdapterOptions = {},
): PhysicsGraphSpec {
  const points = config.series.map((point) => ({
    x: point.t,
    y: readGraphY(point, config.type),
  }));

  return {
    id: `legacy-${config.type}-${options.title ?? "graph"}`,
    kind:
      config.yRange[0] < 0 && config.yRange[1] > 0
        ? "signed-axis-graph"
        : points.length > 2
          ? "piecewise-line"
          : "cartesian-line",
    axes: {
      x: {
        ...splitAxisLabel(config.xLabel),
        range: config.xRange,
        ticks: makeTicks(config.xRange),
        arrow: true,
      },
      y: {
        ...splitAxisLabel(config.yLabel),
        range: config.yRange,
        ticks: makeTicks(config.yRange),
        arrow: true,
      },
    },
    series: [
      {
        id: "main",
        type: points.length > 2 ? "polyline" : "line",
        points,
      },
    ],
    annotations: options.showArea
      ? [
          {
            type: "shaded-area-under",
            fromX: config.xRange[0],
            toX: config.xRange[1],
            seriesId: "main",
          },
        ]
      : undefined,
    style: {
      variant: "app",
      accent: config.color,
    },
  };
}
