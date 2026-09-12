import { OptionList } from "web";

const task = {
  id: "vt-slope-0001",
  blueprint: "vt-slope",
  skill: "Наклон графика v(t)",
  difficulty: 2 as const,
  type: "single_choice" as const,
  text: "На графике v(t) прямая проходит через точки (2 с; 2 м/с) и (4 с; 26 м/с). Найдите ускорение тела.",
  formula: "a=\\frac{\\Delta v}{\\Delta t}",
  explanation: "Ускорение равно наклону v(t).",
  trap: "Берёт v/t вместо изменения скорости.",
  coach_lines: { correct: "Да.", wrong: "Проверь наклон.", hint: "Наклон графика." },
  options: [
    { id: "a", text: "6,5 м/с²", value: 6.5 },
    { id: "b", text: "13 м/с²", value: 13 },
    { id: "c", text: "7 м/с²", value: 7 },
    { id: "d", text: "12 м/с²", value: 12, correct: true },
  ],
  answer: "d",
};

const baseSession = {
  currentIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  total: 5,
};

const noop = () => {};

export const BeforeAnswer = () => (
  <div style={{ width: 560 }}>
    <OptionList
      task={task}
      options={task.options}
      session={{ ...baseSession, phase: "active", selectedOptionId: null }}
      onSelect={noop}
    />
  </div>
);

export const AfterWrongAnswer = () => (
  <div style={{ width: 560 }}>
    <OptionList
      task={task}
      options={task.options}
      session={{ ...baseSession, phase: "answered", selectedOptionId: "b" }}
      onSelect={noop}
    />
  </div>
);
