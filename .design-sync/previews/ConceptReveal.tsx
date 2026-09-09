import { ConceptReveal } from "web";

export const UniformMotion = () => (
  <div style={{ width: 720 }}>
    <ConceptReveal
      graph={{
        type: "xt",
        series: [
          { t: 0, x: 0 },
          { t: 4, x: 12 },
        ],
        xLabel: "t, с",
        yLabel: "x, м",
        xRange: [0, 4],
        yRange: [0, 14],
        color: "cyan",
      }}
      title="Равномерное движение"
      modelText="Прямая x(t): тело проходит **одинаковый путь** за каждую секунду."
      meaningText="Наклон прямой — это ==скорость==: чем круче линия, тем быстрее движение."
      trap="Ошибка: путать координату с пройденным путём."
      formula={"s=vt"}
      formulaCaption="путь при постоянной скорости вдоль одной прямой"
      symbols={[
        { latex: "s", description: "путь, м" },
        { latex: "v", description: "постоянная скорость, м/с" },
        { latex: "t", description: "время движения, с" },
      ]}
      limitation="Работает, только если скорость не меняется ни по величине, ни по направлению."
      accentClass="border-l-nova-cyan/55"
    />
  </div>
);
