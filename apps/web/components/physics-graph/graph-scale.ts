import { formatTickValue, niceTicks } from "../../lib/physics/graph-ticks.ts";
import type {
  GraphAxisSpec,
  GraphPoint2D,
  GraphTick,
  MathLabelSpec,
  PhysicsGraphSpec,
} from "../../lib/physics/physics-graph-spec";

export type GraphFrame = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type GraphScale = {
  frame: GraphFrame;
  plotWidth: number;
  plotHeight: number;
  mapX: (value: number) => number;
  mapY: (value: number) => number;
  mapPoint: (point: GraphPoint2D) => { x: number; y: number };
  xAxisY: number;
  yAxisX: number;
};

export const DEFAULT_GRAPH_FRAME: GraphFrame = {
  width: 420,
  height: 268,
  left: 62,
  right: 38,
  top: 32,
  bottom: 52,
};

function normalizeRange([min, max]: [number, number]): [number, number] {
  if (max === min) {
    return [min - 1, max + 1];
  }

  return min < max ? [min, max] : [max, min];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function axisValue(range: [number, number]) {
  const [min, max] = normalizeRange(range);

  if (min <= 0 && max >= 0) {
    return 0;
  }

  return min;
}

export function createGraphScale(
  spec: Pick<PhysicsGraphSpec, "axes">,
  frame: GraphFrame = DEFAULT_GRAPH_FRAME,
): GraphScale {
  const xRange = normalizeRange(spec.axes.x.range);
  const yRange = normalizeRange(spec.axes.y.range);
  const plotWidth = frame.width - frame.left - frame.right;
  const plotHeight = frame.height - frame.top - frame.bottom;

  function mapX(value: number) {
    const [min, max] = xRange;
    return frame.left + ((value - min) / (max - min)) * plotWidth;
  }

  function mapY(value: number) {
    const [min, max] = yRange;
    return frame.top + (1 - (value - min) / (max - min)) * plotHeight;
  }

  return {
    frame,
    plotWidth,
    plotHeight,
    mapX,
    mapY,
    mapPoint: (point) => ({ x: mapX(point.x), y: mapY(point.y) }),
    xAxisY: clamp(mapY(axisValue(yRange)), frame.top, frame.height - frame.bottom),
    yAxisX: clamp(mapX(axisValue(xRange)), frame.left, frame.width - frame.right),
  };
}

export function makeAutoTicks(axis: GraphAxisSpec, count = 4): GraphTick[] {
  if (axis.ticks?.length) {
    return axis.ticks;
  }

  // Деления с «учебным» шагом 1–2–5·10ⁿ, а не слепое деление диапазона.
  return niceTicks(normalizeRange(axis.range), count);
}

export function formatTickLabel(tick: GraphTick) {
  if (tick.label) {
    return labelToText(tick.label);
  }

  return formatTickValue(tick.value);
}

function labelToText(label: MathLabelSpec) {
  if (typeof label === "string") {
    return label;
  }

  if (label.text) {
    return label.text;
  }

  return `${label.prefix ?? ""}${label.symbol ?? ""}${label.subscript ?? ""}${label.superscript ?? ""}`;
}

export function formatAxisLabel(axis: GraphAxisSpec) {
  return axis.unit ? `${labelToText(axis.label)}, ${axis.unit}` : labelToText(axis.label);
}
