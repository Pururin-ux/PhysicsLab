import { PhysicsGraph } from "web";

export const VtLine = () => (
  <div style={{ width: 440 }}>
    <PhysicsGraph
      spec={{
        id: "preview-vt",
        kind: "cartesian-line",
        axes: {
          x: { label: "t", unit: "с", range: [0, 4], arrow: true },
          y: { label: "v", unit: "м/с", range: [0, 28], arrow: true },
        },
        series: [
          {
            id: "velocity",
            type: "line",
            points: [
              { x: 2, y: 2 },
              { x: 4, y: 26 },
            ],
          },
        ],
        style: { variant: "app", accent: "cyan" },
      }}
    />
  </div>
);

export const AreaUnderGraph = () => (
  <div style={{ width: 440 }}>
    <PhysicsGraph
      spec={{
        id: "preview-vt-area",
        kind: "piecewise-line",
        axes: {
          x: { label: "t", unit: "с", range: [0, 8], arrow: true },
          y: { label: "v", unit: "м/с", range: [0, 12], arrow: true },
        },
        series: [
          {
            id: "speed",
            type: "polyline",
            points: [
              { x: 0, y: 6 },
              { x: 4, y: 6 },
              { x: 8, y: 10 },
            ],
          },
        ],
        annotations: [
          { type: "shaded-area-under", fromX: 0, toX: 8, seriesId: "speed" },
        ],
        style: { variant: "app", accent: "gold" },
      }}
    />
  </div>
);

export const ExamStyle = () => (
  <div style={{ width: 440 }}>
    <PhysicsGraph
      spec={{
        id: "preview-exam",
        kind: "cartesian-line",
        axes: {
          x: {
            label: "t",
            unit: "с",
            range: [0, 2],
            ticks: [{ value: 0 }, { value: 1 }, { value: 2 }],
            arrow: true,
          },
          y: {
            label: "v",
            unit: "м/с",
            range: [0, 10],
            ticks: [{ value: 0 }, { value: 4 }, { value: 8 }],
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
      }}
    />
  </div>
);
