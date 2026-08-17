export type PhysicsGraphKind =
  | "cartesian-line"
  | "piecewise-line"
  | "cycle-pv"
  | "signed-axis-graph";

export type GraphPoint2D = {
  x: number;
  y: number;
  label?: string;
};

export type MathLabelSpec =
  | string
  | {
      text?: string;
      prefix?: string;
      symbol?: string;
      unit?: string;
      subscript?: string;
      superscript?: string;
    };

export type GraphTick = {
  value: number;
  label?: MathLabelSpec;
};

export type GraphAxisSpec = {
  label: MathLabelSpec;
  unit?: string;
  range: [number, number];
  ticks?: GraphTick[];
  arrow?: boolean;
};

export type GraphSeriesSpec = {
  id?: string;
  type: "polyline" | "line" | "curve";
  points: GraphPoint2D[];
  closed?: boolean;
  direction?: "forward" | "backward" | "cycle";
};

export type GraphAnnotationSpec =
  | { type: "point-label"; x: number; y: number; label: string }
  | {
      type: "dashed-guide";
      x?: number;
      y?: number;
      from?: GraphPoint2D;
      to?: GraphPoint2D;
    }
  | { type: "shaded-area-under"; fromX: number; toX: number; seriesId?: string; label?: string }
  | { type: "vertical-band"; fromX: number; toX: number; label?: string }
  | { type: "shaded-polygon"; points: GraphPoint2D[]; label?: string }
  | { type: "segment-arrow"; from: GraphPoint2D; to: GraphPoint2D };

export type PhysicsGraphSpec = {
  id?: string;
  kind: PhysicsGraphKind;
  axes: {
    x: GraphAxisSpec;
    y: GraphAxisSpec;
  };
  series: GraphSeriesSpec[];
  annotations?: GraphAnnotationSpec[];
  style?: {
    variant?: "exam" | "app";
    accent?: "cyan" | "gold";
  };
};
