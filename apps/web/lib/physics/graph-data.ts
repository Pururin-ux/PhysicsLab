export type GraphType = "vt" | "xt" | "at";

export type GraphPoint = {
  t: number;
  v?: number;
  x?: number;
  a?: number;
};

export interface GraphConfig {
  type: GraphType;
  series: GraphPoint[];
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  color: "cyan" | "gold";
}

export const UNIFORM_MOTION_VT: GraphConfig = {
  type: "vt",
  series: [
    { t: 0, v: 2 },
    { t: 1, v: 2 },
    { t: 2, v: 2 },
    { t: 3, v: 2 },
    { t: 4, v: 2 },
    { t: 5, v: 2 },
  ],
  xLabel: "t, с",
  yLabel: "v, м/с",
  xRange: [0, 5],
  yRange: [0, 10],
  color: "cyan",
};

export const ACCELERATED_MOTION_XT: GraphConfig = {
  type: "xt",
  series: [
    { t: 0, x: 0 },
    { t: 1, x: 1 },
    { t: 2, x: 4 },
    { t: 3, x: 9 },
    { t: 4, x: 16 },
    { t: 5, x: 25 },
  ],
  xLabel: "t, с",
  yLabel: "x, м",
  xRange: [0, 5],
  yRange: [0, 25],
  color: "cyan",
};
