import { QuestionCard } from "web";

export const WithGraph = () => (
  <div style={{ width: 640 }}>
    <QuestionCard
      type="single_choice"
      difficulty={2}
      text="На графике v(t) прямая проходит через точки (2 с; 2 м/с) и (4 с; 26 м/с). Найдите ускорение тела."
      graph={{
        type: "vt",
        series: [
          { t: 2, v: 2 },
          { t: 4, v: 26 },
        ],
        xLabel: "t, с",
        yLabel: "v, м/с",
        xRange: [0, 4],
        yRange: [0, 28],
      }}
      focus={{
        title: "Наклон v(t)",
        check: "Смотри на изменение скорости за выбранный промежуток времени.",
      }}
    />
  </div>
);

export const NumericTask = () => (
  <div style={{ width: 640 }}>
    <QuestionCard
      type="numeric_input"
      difficulty={1}
      text="Груз сбросили с корзины неподвижно висящего воздушного шара. Сопротивлением воздуха пренебречь, g = 10 м/с². Какой путь пройдёт тело за 5 с?"
    />
  </div>
);

export const WithOpticsDiagram = () => (
  <div style={{ width: 640 }}>
    <QuestionCard
      type="single_choice"
      difficulty={1}
      text="Луч света падает на плоское зеркало. Угол падения, отсчитанный от нормали, равен 30°. Найдите угол отражения."
      diagram={{
        kind: "optics",
        spec: {
          scene: "reflection",
          incidenceAngleDeg: 30,
          reflectionAngleDeg: 30,
        },
      }}
    />
  </div>
);
