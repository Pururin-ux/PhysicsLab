import { ModelVisual } from "web";

export const AcceleratedMotion = () => (
  <div style={{ width: 480 }}>
    <ModelVisual
      title="Равноускоренное движение"
      caption="Парабола координаты: чем дольше едет тело, тем быстрее растёт путь."
      config={{
        type: "xt",
        series: [
          { t: 0, x: 0 },
          { t: 1, x: 1 },
          { t: 2, x: 4 },
          { t: 3, x: 9 },
          { t: 4, x: 16 },
        ],
        xLabel: "t, с",
        yLabel: "x, м",
        xRange: [0, 4],
        yRange: [0, 18],
        color: "cyan",
      }}
    />
  </div>
);

export const AreaUnderVt = () => (
  <div style={{ width: 480 }}>
    <ModelVisual
      title="Площадь под графиком v(t)"
      caption="Перемещение равно площади под линией скорости."
      showArea
      config={{
        type: "vt",
        series: [
          { t: 0, v: 6 },
          { t: 4, v: 6 },
          { t: 8, v: 10 },
        ],
        xLabel: "t, с",
        yLabel: "v, м/с",
        xRange: [0, 8],
        yRange: [0, 12],
        color: "gold",
      }}
    />
  </div>
);
