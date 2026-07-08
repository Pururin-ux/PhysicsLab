import type { PhysicsGraphSpec } from "./physics-graph-spec";

export const vtSlopeExample: PhysicsGraphSpec = {
  id: "vt-slope-example",
  kind: "cartesian-line",
  axes: {
    x: {
      label: "t",
      unit: "с",
      range: [0, 2],
      ticks: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
      ],
      arrow: true,
    },
    y: {
      label: "v",
      unit: "м/с",
      range: [0, 10],
      ticks: [
        { value: 0 },
        { value: 4 },
        { value: 8 },
        { value: 10 },
      ],
      arrow: true,
    },
  },
  series: [
    {
      id: "velocity",
      type: "line",
      points: [
        { x: 0, y: 4, label: "A" },
        { x: 2, y: 8, label: "B" },
      ],
    },
  ],
  annotations: [
    { type: "dashed-guide", from: { x: 2, y: 0 }, to: { x: 2, y: 8 } },
    { type: "dashed-guide", from: { x: 0, y: 8 }, to: { x: 2, y: 8 } },
  ],
  style: { variant: "exam", accent: "cyan" },
};

export const xtNegativeLineExample: PhysicsGraphSpec = {
  id: "xt-negative-line-example",
  kind: "signed-axis-graph",
  axes: {
    x: {
      label: "t",
      unit: "с",
      range: [0, 4],
      ticks: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
      ],
      arrow: true,
    },
    y: {
      label: "x",
      unit: "м",
      range: [-4, 8],
      ticks: [
        { value: -4 },
        { value: 0 },
        { value: 4 },
        { value: 8 },
      ],
      arrow: true,
    },
  },
  series: [
    {
      id: "coordinate",
      type: "line",
      points: [
        { x: 0, y: 6, label: "A" },
        { x: 4, y: -2, label: "B" },
      ],
    },
  ],
  annotations: [{ type: "dashed-guide", y: 0 }],
  style: { variant: "exam", accent: "cyan" },
};

export const pvCycleExample: PhysicsGraphSpec = {
  id: "pv-cycle-example",
  kind: "cycle-pv",
  axes: {
    x: {
      label: "V",
      range: [0, 2.5],
      ticks: [
        { value: 0 },
        { value: 1, label: "V₀" },
        { value: 2, label: "2V₀" },
      ],
      arrow: true,
    },
    y: {
      label: "p",
      range: [0, 2.5],
      ticks: [
        { value: 0 },
        { value: 1, label: "p₀" },
        { value: 2, label: "2p₀" },
      ],
      arrow: true,
    },
  },
  series: [
    {
      id: "cycle",
      type: "polyline",
      closed: true,
      direction: "cycle",
      points: [
        { x: 1, y: 1, label: "1" },
        { x: 2, y: 1, label: "2" },
        { x: 2, y: 2, label: "3" },
        { x: 1, y: 2, label: "4" },
      ],
    },
  ],
  annotations: [
    {
      type: "shaded-polygon",
      points: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
      label: "A",
    },
    { type: "segment-arrow", from: { x: 1, y: 1 }, to: { x: 2, y: 1 } },
    { type: "segment-arrow", from: { x: 2, y: 1 }, to: { x: 2, y: 2 } },
    { type: "segment-arrow", from: { x: 2, y: 2 }, to: { x: 1, y: 2 } },
    { type: "segment-arrow", from: { x: 1, y: 2 }, to: { x: 1, y: 1 } },
  ],
  style: { variant: "exam", accent: "gold" },
};

export const vTProcessExample: PhysicsGraphSpec = {
  id: "v-t-process-example",
  kind: "cartesian-line",
  axes: {
    x: {
      label: "T",
      range: [0, 3.25],
      ticks: [
        { value: 0 },
        { value: 1, label: "T₀" },
        { value: 2, label: "2T₀" },
        { value: 3, label: "3T₀" },
      ],
      arrow: true,
    },
    y: {
      label: "V",
      range: [0, 3.25],
      ticks: [
        { value: 0 },
        { value: 1, label: "V₀" },
        { value: 2, label: "2V₀" },
        { value: 3, label: "3V₀" },
      ],
      arrow: true,
    },
  },
  series: [
    {
      id: "process",
      type: "line",
      points: [
        { x: 1, y: 1, label: "1" },
        { x: 3, y: 3, label: "2" },
      ],
    },
  ],
  annotations: [
    { type: "dashed-guide", from: { x: 1, y: 0 }, to: { x: 1, y: 1 } },
    { type: "dashed-guide", from: { x: 3, y: 0 }, to: { x: 3, y: 3 } },
  ],
  style: { variant: "exam", accent: "cyan" },
};

export const heatingCurveExample: PhysicsGraphSpec = {
  id: "heating-curve-example",
  kind: "piecewise-line",
  axes: {
    x: {
      label: "τ",
      unit: "мин",
      range: [0, 12],
      ticks: [
        { value: 0 },
        { value: 4 },
        { value: 8 },
        { value: 12 },
      ],
      arrow: true,
    },
    y: {
      label: "t",
      unit: "°C",
      range: [0, 120],
      ticks: [
        { value: 0 },
        { value: 40 },
        { value: 80 },
        { value: 120 },
      ],
      arrow: true,
    },
  },
  series: [
    {
      id: "temperature",
      type: "polyline",
      points: [
        { x: 0, y: 20, label: "A" },
        { x: 4, y: 80, label: "B" },
        { x: 8, y: 80, label: "C" },
        { x: 12, y: 120, label: "D" },
      ],
    },
  ],
  annotations: [
    {
      type: "vertical-band",
      fromX: 4,
      toX: 8,
      label: "плавление",
    },
    { type: "dashed-guide", from: { x: 0, y: 80 }, to: { x: 8, y: 80 } },
  ],
  style: { variant: "exam", accent: "gold" },
};

export const physicsGraphExamples = [
  vtSlopeExample,
  xtNegativeLineExample,
  pvCycleExample,
  vTProcessExample,
  heatingCurveExample,
] as const;
