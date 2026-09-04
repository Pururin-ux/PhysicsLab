"use client";

import { MathText } from "../ui/MathText";
import { CircuitDiagram } from "../diagrams/CircuitDiagram";
import { OpticsDiagram } from "../diagrams/OpticsDiagram";
import { DensityObservationPlot, DensityPredictionPlot, OhmObservationPlot } from "./PrimerObservationPlots";
import { ReflectionAngleLab } from "./ReflectionAngleLab";
import { TopicPrimer, type TopicPrimerConfig } from "./TopicPrimer";

const electroConfig: TopicPrimerConfig = {
  topic: "Электричество",
  title: "От чего зависит ток в цепи",
  meta: "закон Ома",
  prediction: {
    title: "Сопротивление выросло вдвое. Что станет с током?",
    body: "Напряжение источника не меняется: 12 В. Сопротивление участка увеличили с 3 до 6 Ом.",
    question: "Выбери прогноз до расчёта",
    visual: (
      <CircuitDiagram
        spec={{ topology: "single", sourceLabel: "12 В", resistorLabels: ["R"], meter: { kind: "ammeter" }, tone: "cyan" }}
        ariaLabel="Участок цепи с источником 12 вольт, сопротивлением R и амперметром"
      />
    ),
    choices: [
      { id: "half", label: "Ток станет вдвое меньше", reflection: "Прогноз совпал: при неизменном напряжении ток обратно пропорционален сопротивлению." },
      { id: "same", label: "Ток не изменится", reflection: "На графике ток уменьшился: одного постоянного напряжения недостаточно, сопротивление тоже влияет." },
      { id: "double", label: "Ток станет вдвое больше", reflection: "Получилось наоборот: большее сопротивление сильнее ограничивает ток." },
    ],
  },
  observation: {
    title: "Три сопротивления — одно напряжение",
    body: "В каждом опыте U = 12 В. Меняется только сопротивление участка.",
    visual: <OhmObservationPlot />,
    insight: "При 3 Ом ток равен 4 А, при 6 Ом — 2 А. Удвоили сопротивление, поэтому ток уменьшился вдвое.",
  },
  model: {
    title: "Чем больше сопротивление, тем меньше ток",
    body: "При неизменном напряжении сопротивление ограничивает ток. Эту связь записывает закон Ома.",
    formula: "I=\\dfrac{U}{R}",
    formulaCaption: "закон Ома для участка цепи",
    principles: [
      { label: "U растёт", explanation: "При том же R ток растёт." },
      { label: "R растёт", explanation: "При том же U ток уменьшается." },
    ],
    boundary: "Рассматриваем участок цепи без источника внутри и считаем сопротивление постоянным.",
  },
  workedExample: {
    title: "Найдём ток на участке цепи",
    problem: "На участке цепи U = 12 В, R = 4 Ом. Найди силу тока.",
    steps: [
      { title: "Выбираем закон для этих трёх величин", formula: "I=\\dfrac{U}{R}" },
      { title: "Подставляем согласованные единицы", formula: "I=\\dfrac{12}{4}=3\\,\\text{А}" },
      { title: "Проверяем ответ обратным действием", formula: "3\\,\\text{А}\\cdot4\\,\\text{Ом}=12\\,\\text{В}" },
    ],
    conclusion: "Ответ: 3 А.",
  },
  fadedExample: {
    title: "Найди ток при 18 В",
    problem: "U = 18 В, R = 6 Ом. Найди I.",
    shownSteps: [{ title: "Подставляем в закон Ома", formula: "I=\\dfrac{18}{6}" }],
    answer: {
      kind: "input",
      prompt: "Вычисли частное.",
      label: "I =",
      suffix: "А",
      validation: { kind: "number", expected: 3 },
      correctFeedback: "18 ÷ 6 = 3 А.",
      incorrectFeedback: "Напряжение нужно разделить на сопротивление: 18 ÷ 6.",
    },
  },
  independentProblem: {
    title: "Лампа подключена к 9 В",
    problem: "Лампа подключена к 9 В. Сопротивление нити в этой модели 3 Ом. Найди ток.",
    answer: {
      kind: "input",
      prompt: "Какой ток идёт через лампу?",
      label: "I =",
      suffix: "А",
      validation: { kind: "number", expected: 3 },
      correctFeedback: "Да: 9 В ÷ 3 Ом = 3 А.",
      incorrectFeedback: "Вернись к I = U/R и раздели 9 на 3.",
    },
  },
  transfer: {
    title: "Теперь найдём сопротивление",
    body: "Через устройство течёт ток 0,5 А при напряжении 6 В.",
    problem: <span>Из <MathText text="$I=U/R$" /> вырази сопротивление и найди его.</span>,
    answer: {
      kind: "input",
      prompt: "R = U/I",
      label: "R =",
      suffix: "Ом",
      validation: { kind: "number", expected: 12 },
      correctFeedback: "6 ÷ 0,5 = 12 Ом.",
      incorrectFeedback: "Чтобы найти R, раздели напряжение 6 В на ток 0,5 А.",
    },
    practiceHref: "/practice/family/ohm-law",
    practiceLabel: "Решить 5 задач на закон Ома",
    completionText: "Связь работает в обе стороны: можно искать ток, напряжение или сопротивление.",
  },
};

const densityConfig: TopicPrimerConfig = {
  topic: "Молекулярная физика",
  title: "Как связаны масса и объём",
  meta: "плотность вещества",
  prediction: {
    title: "Объём вырос вдвое. Что станет с массой?",
    body: "Оба образца сделаны из одного алюминия, без пустот. Объём второго вдвое больше.",
    question: "Как изменится масса?",
    visual: <DensityPredictionPlot />,
    choices: [
      { id: "double", label: "Тоже увеличится вдвое", reflection: "Да: для одного вещества масса растёт прямо пропорционально объёму." },
      { id: "same", label: "Останется той же", reflection: "График показывает рост массы: больший объём того же вещества содержит больше вещества." },
      { id: "quad", label: "Увеличится в четыре раза", reflection: "Рост линейный, не квадратичный: вдвое больше объём даёт вдвое больше массу." },
    ],
  },
  observation: {
    title: "Три образца одного алюминия",
    body: "Плотность алюминия во всех трёх случаях одинакова: 2,7 г/см³.",
    visual: <DensityObservationPlot />,
    insight: "Отношение m/V для каждой точки одинаково: 27/10 = 54/20 = 81/30 = 2,7 г/см³.",
  },
  model: {
    title: "Плотность — масса единицы объёма",
    formula: "\\rho=\\dfrac{m}{V}",
    formulaCaption: "из этой связи также следует m = ρV",
    principles: [
      { label: "Одно вещество", explanation: "Плотность постоянна в рамках модели." },
      { label: "Объём больше", explanation: "Масса растёт во столько же раз." },
    ],
    boundary: "Сравниваем однородные образцы без полостей и используем согласованные единицы массы и объёма.",
  },
  workedExample: {
    title: "Найдём массу алюминиевого образца",
    problem: "ρ = 2,7 г/см³, V = 20 см³. Найди m.",
    steps: [
      { title: "Выражаем массу", formula: "m=\\rho V" },
      { title: "Подставляем значения", formula: "m=2{,}7\\cdot20=54\\,\\text{г}" },
      { title: "Проверяем пропорцию", body: "10 см³ имели бы массу 27 г, значит 20 см³ — 54 г." },
    ],
    conclusion: "Ответ: 54 г.",
  },
  fadedExample: {
    title: "Стальной образец объёмом 5 см³",
    problem: "Сталь: ρ = 7,8 г/см³, V = 5 см³. Найди массу.",
    shownSteps: [{ title: "Масса равна плотности, умноженной на объём", formula: "m=7{,}8\\cdot5" }],
    answer: {
      kind: "input",
      prompt: "Вычисли массу.",
      label: "m =",
      suffix: "г",
      validation: { kind: "number", expected: 39 },
      correctFeedback: "7,8 · 5 = 39 г.",
      incorrectFeedback: "Умножь плотность 7,8 на объём 5.",
    },
  },
  independentProblem: {
    title: "Теперь найди саму плотность",
    problem: "Образец массой 270 г занимает 100 см³. Чему равна плотность?",
    answer: {
      kind: "input",
      prompt: "Раздели массу на объём.",
      label: "ρ =",
      suffix: "г/см³",
      validation: { kind: "number", expected: 2.7 },
      correctFeedback: "270 ÷ 100 = 2,7 г/см³.",
      incorrectFeedback: "Плотность равна m/V: раздели 270 на 100.",
    },
  },
  transfer: {
    title: "Сравним два тела без вычислений",
    body: "Два тела сделаны из одного материала. Объём второго в три раза больше.",
    problem: "Во сколько раз масса второго тела больше массы первого?",
    answer: {
      kind: "input",
      prompt: "Введи коэффициент.",
      label: "m₂/m₁ =",
      validation: { kind: "number", expected: 3 },
      correctFeedback: "При одинаковой плотности отношение масс равно отношению объёмов: 3.",
      incorrectFeedback: "Плотность сокращается: m₂/m₁ = V₂/V₁.",
    },
    practiceHref: "/practice/family/density-volume-ratio",
    practiceLabel: "Решить 5 задач на плотность",
    completionText: "Ты связал формулу, график и пропорцию одного вещества.",
  },
};

const opticsConfig: TopicPrimerConfig = {
  topic: "Оптика",
  title: "Откуда считать угол луча",
  meta: "отражение света",
  prediction: {
    title: "Луч падает под углом 25° к нормали",
    body: "Нормаль — перпендикуляр к зеркалу в точке падения.",
    question: "Каким будет угол отражения от нормали?",
    visual: <OpticsDiagram spec={{ scene: "reflection", incidenceAngleDeg: 25, reflectionAngleDeg: 25 }} />,
    choices: [
      { id: "25", label: "25°", reflection: "Да: угол отражения равен углу падения, если оба отсчитаны от нормали." },
      { id: "65", label: "65°", reflection: "65° получились бы при отсчёте от поверхности. Закон сравнивает углы от нормали." },
      { id: "50", label: "50°", reflection: "50° — угол между лучами, а не угол отражения от нормали." },
    ],
  },
  observation: {
    title: "Измени угол падения",
    body: "Передвинь ползунок и проследи за обоими лучами. Углы считывай от пунктирной нормали.",
    visual: <ReflectionAngleLab />,
    insight: "При каждом выбранном угле отражённый луч отклоняется на столько же: α = β.",
  },
  model: {
    title: "Угол падения равен углу отражения",
    formula: "\\beta=\\alpha",
    formulaCaption: "угол отражения равен углу падения",
    principles: [
      { label: "Отсчёт", explanation: "Оба угла измеряют от нормали, не от поверхности." },
      { label: "Симметрия", explanation: "Лучи лежат по разные стороны нормали." },
    ],
    boundary: "Используем лучевую модель и гладкое плоское зеркало; шероховатое отражение здесь не рассматриваем.",
  },
  workedExample: {
    title: "Если угол дан от поверхности",
    problem: "Падающий луч образует с поверхностью зеркала 35°. Найди угол отражения от нормали.",
    steps: [
      { title: "Переходим к углу от нормали", formula: "\\alpha=90^\\circ-35^\\circ=55^\\circ" },
      { title: "Применяем закон отражения", formula: "\\beta=\\alpha=55^\\circ" },
      { title: "Проверяем, что ответ дан от нормали", body: "Вопрос просит именно β, поэтому возвращаться к углу от поверхности не нужно." },
    ],
    conclusion: "Ответ: 55°.",
  },
  fadedExample: {
    title: "Теперь переведи угол сам",
    problem: "Луч образует с поверхностью зеркала 20°. Найди угол отражения от нормали.",
    shownSteps: [{ title: "Нормаль перпендикулярна поверхности", formula: "\\beta=90^\\circ-20^\\circ" }],
    answer: {
      kind: "input",
      prompt: "Вычисли угол.",
      label: "β =",
      suffix: "°",
      validation: { kind: "number", expected: 70 },
      correctFeedback: "90° − 20° = 70°.",
      incorrectFeedback: "Угол от поверхности дополняет угол от нормали до 90°.",
    },
  },
  independentProblem: {
    title: "Угол уже дан от нормали",
    problem: "Угол падения равен 42°. Найди угол отражения.",
    answer: {
      kind: "input",
      prompt: "Дополнительных преобразований не нужно.",
      label: "β =",
      suffix: "°",
      validation: { kind: "number", expected: 42 },
      correctFeedback: "Угол отражения равен углу падения: 42°.",
      incorrectFeedback: "Оба угла уже отсчитаны от нормали, поэтому β = α.",
    },
  },
  transfer: {
    title: "Если известен угол между лучами",
    body: "Угол между падающим и отражённым лучами равен 80°.",
    problem: "Чему равен угол падения от нормали?",
    answer: {
      kind: "input",
      prompt: "Нормаль делит угол между лучами пополам.",
      label: "α =",
      suffix: "°",
      validation: { kind: "number", expected: 40 },
      correctFeedback: "80° ÷ 2 = 40°.",
      incorrectFeedback: "Лучи симметричны относительно нормали, поэтому раздели 80° пополам.",
    },
    practiceHref: "/practice/family/reflection-angle",
    practiceLabel: "Решить 5 задач на отражение",
    completionText: "Теперь ты различаешь угол от поверхности, угол от нормали и угол между лучами.",
  },
};

export function ElectroLesson() {
  return <TopicPrimer config={electroConfig} />;
}

export function DensityLesson() {
  return <TopicPrimer config={densityConfig} />;
}

export function OpticsLesson() {
  return <TopicPrimer config={opticsConfig} />;
}
