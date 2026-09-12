import { AnswerFeedback } from "web";

export const Correct = () => (
  <div style={{ width: 560 }}>
    <AnswerFeedback
      isCorrect
      feedbackText={"Да. Ускорение — это наклон графика: $\\frac{26-2}{4-2}$."}
    />
  </div>
);

export const WrongWithAnswer = () => (
  <div style={{ width: 560 }}>
    <AnswerFeedback
      isCorrect={false}
      feedbackText="Средняя скорость считается как весь путь, деленный на все время, а не как среднее арифметическое скоростей."
      correctAnswer="4 м/с"
    />
  </div>
);

export const WrongTrap = () => (
  <div style={{ width: 560 }}>
    <AnswerFeedback
      isCorrect={false}
      feedbackText="Похоже на типовую ловушку: потерял квадрат времени: gt/2 вместо gt²/2."
    />
  </div>
);
