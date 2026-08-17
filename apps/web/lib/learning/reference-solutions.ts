import type { OpticsDiagramSpec } from "../physics/optics-diagram-spec.ts";
import type { PhysicsGraphSpec } from "../physics/physics-graph-spec.ts";
import type { TemplateId } from "../server/task-generator/generate.ts";

export type ReferenceMathExpression = {
  latex: string;
  accessibleText: string;
};

export type ReferenceGiven = {
  symbol: string;
  name: string;
  value: number;
  displayValue: string;
  unit: string;
};

export type ReferenceVisual =
  | {
      kind: "graph";
      spec: PhysicsGraphSpec;
      description: string;
    }
  | {
      kind: "optics";
      spec: Extract<OpticsDiagramSpec, { scene: "thin_lens" }>;
      description: string;
    };

export type ReferenceSolution = {
  familyId: TemplateId;
  label: "Учебный пример";
  statement: string;
  question: string;
  givens: ReferenceGiven[];
  visual?: ReferenceVisual;
  model: {
    explanation: string;
  };
  law: {
    explanation: string;
    formulas: ReferenceMathExpression[];
  };
  substitution: {
    explanation?: string;
    equations: ReferenceMathExpression[];
  };
  answer: {
    expression: ReferenceMathExpression;
    sentence: string;
  };
  check?: {
    explanation: string;
    expression?: ReferenceMathExpression;
  };
  typicalMistake: {
    title: string;
    explanation: string;
  };
};

export const referencePilotIds = [
  "ohm-law",
  "vt-area",
  "friction-force",
  "average-speed-segments",
  "heat-balance-simple",
  "thin-lens-image-distance",
] as const satisfies readonly TemplateId[];

const vtAreaGraph: PhysicsGraphSpec = {
  id: "reference-vt-area",
  kind: "cartesian-line",
  axes: {
    x: {
      label: "t",
      unit: "с",
      range: [0, 4],
      ticks: [0, 1, 2, 3, 4].map((value) => ({ value })),
    },
    y: {
      label: "v",
      unit: "м/с",
      range: [0, 7],
      ticks: [0, 2, 4, 6].map((value) => ({ value })),
    },
  },
  series: [
    {
      id: "velocity",
      type: "line",
      points: [
        { x: 0, y: 2, label: "2 м/с" },
        { x: 4, y: 6, label: "6 м/с" },
      ],
    },
  ],
  annotations: [
    { type: "shaded-area-under", fromX: 0, toX: 4, seriesId: "velocity" },
  ],
  style: { variant: "app", accent: "cyan" },
};

const lensDiagram: Extract<OpticsDiagramSpec, { scene: "thin_lens" }> = {
  scene: "thin_lens",
  lensType: "converging",
  focalLength: 10,
  objectDistance: 30,
  imageDistance: 15,
  unit: "см",
};

const solutions = {
  "ohm-law": {
    familyId: "ohm-law",
    label: "Учебный пример",
    statement: "К резистору сопротивлением 4 Ом приложено напряжение 12 В.",
    question: "Какова сила тока в резисторе?",
    givens: [
      { symbol: "U", name: "напряжение", value: 12, displayValue: "12", unit: "В" },
      { symbol: "R", name: "сопротивление", value: 4, displayValue: "4", unit: "Ом" },
    ],
    model: {
      explanation: "Напряжение задано на одном резисторе, а его сопротивление известно. Ток через этот участок определяет закон Ома.",
    },
    law: {
      explanation: "Сила тока равна отношению напряжения к сопротивлению.",
      formulas: [{ latex: "I=\\frac{U}{R}", accessibleText: "I равно U делённому на R" }],
    },
    substitution: {
      equations: [{ latex: "I=\\frac{12}{4}=3\\,\\text{А}", accessibleText: "I равно 12 делённому на 4, то есть 3 ампера" }],
    },
    answer: {
      expression: { latex: "I=3\\,\\text{А}", accessibleText: "I равно 3 ампера" },
      sentence: "Сила тока в резисторе равна 3 А.",
    },
    check: {
      explanation: "Подстановка ответа возвращает заданное напряжение.",
      expression: { latex: "IR=3\\cdot4=12\\,\\text{В}", accessibleText: "3 ампера умножить на 4 ома равно 12 вольт" },
    },
    typicalMistake: {
      title: "Умножить напряжение на сопротивление",
      explanation: "Произведение U·R не выражает силу тока. Из I = U/R видно: при том же напряжении больший R даёт меньший ток.",
    },
  },
  "vt-area": {
    familyId: "vt-area",
    label: "Учебный пример",
    statement: "Скорость тела линейно растёт от 2 м/с при t = 0 с до 6 м/с при t = 4 с.",
    question: "Найдите перемещение тела за четыре секунды.",
    givens: [
      { symbol: "v_0", name: "начальная скорость", value: 2, displayValue: "2", unit: "м/с" },
      { symbol: "v_1", name: "конечная скорость", value: 6, displayValue: "6", unit: "м/с" },
      { symbol: "\\Delta t", name: "промежуток времени", value: 4, displayValue: "4", unit: "с" },
    ],
    visual: {
      kind: "graph",
      spec: vtAreaGraph,
      description: "График скорости от времени: прямая идёт от точки 0 с, 2 м/с к точке 4 с, 6 м/с. Закрашенная площадь под линией является перемещением.",
    },
    model: {
      explanation: "Перемещение равно площади под графиком v(t). Здесь эта область — трапеция с основаниями 2 и 6 и высотой 4.",
    },
    law: {
      explanation: "Площадь трапеции равна полусумме параллельных сторон, умноженной на высоту.",
      formulas: [{ latex: "s=\\frac{v_0+v_1}{2}\\Delta t", accessibleText: "s равно сумме v нулевого и v первого, делённой на 2, умноженной на дельта t" }],
    },
    substitution: {
      equations: [{ latex: "s=\\frac{2+6}{2}\\cdot4=16\\,\\text{м}", accessibleText: "s равно сумме 2 и 6, делённой на 2, умноженной на 4, то есть 16 метров" }],
    },
    answer: {
      expression: { latex: "s=16\\,\\text{м}", accessibleText: "s равно 16 метров" },
      sentence: "За четыре секунды тело переместилось на 16 м.",
    },
    check: {
      explanation: "Средняя скорость 4 м/с лежит между 2 и 6 м/с; за 4 с это даёт 16 м.",
    },
    typicalMistake: {
      title: "Найти наклон вместо площади",
      explanation: "Наклон графика v(t) даёт ускорение. В этой задаче требуется перемещение, поэтому нужна площадь под линией.",
    },
  },
  "friction-force": {
    familyId: "friction-force",
    label: "Учебный пример",
    statement: "Брусок массой 5 кг скользит по горизонтальной поверхности. Коэффициент трения равен 0,20; g = 10 м/с².",
    question: "Найдите модуль силы трения скольжения.",
    givens: [
      { symbol: "m", name: "масса", value: 5, displayValue: "5", unit: "кг" },
      { symbol: "\\mu", name: "коэффициент трения", value: 0.2, displayValue: "0,20", unit: "" },
      { symbol: "g", name: "ускорение свободного падения", value: 10, displayValue: "10", unit: "м/с²" },
    ],
    model: {
      explanation: "Вертикального ускорения нет, поэтому реакция опоры уравновешивает силу тяжести: N = mg. Трение скольжения составляет долю μ от N.",
    },
    law: {
      explanation: "На горизонтальной поверхности Fтр = μN, а N = mg.",
      formulas: [{ latex: "F_{\\text{тр}}=\\mu N=\\mu mg", accessibleText: "сила трения равна мю умножить на N, или мю умножить на m и g" }],
    },
    substitution: {
      equations: [
        { latex: "N=5\\cdot10=50\\,\\text{Н}", accessibleText: "N равно 5 умножить на 10, то есть 50 ньютонов" },
        { latex: "F_{\\text{тр}}=0{,}20\\cdot50=10\\,\\text{Н}", accessibleText: "сила трения равна 0,20 умножить на 50, то есть 10 ньютонов" },
      ],
    },
    answer: {
      expression: { latex: "F_{\\text{тр}}=10\\,\\text{Н}", accessibleText: "сила трения равна 10 ньютонов" },
      sentence: "Модуль силы трения равен 10 Н.",
    },
    typicalMistake: {
      title: "Пропустить ускорение g",
      explanation: "Выражение μm не имеет единицы силы. Сначала найдите N = mg, затем умножьте её на μ.",
    },
  },
  "average-speed-segments": {
    familyId: "average-speed-segments",
    label: "Учебный пример",
    statement: "На первом участке тело прошло 100 м за 20 с, на втором — 300 м за 30 с.",
    question: "Найдите среднюю скорость на всём пути.",
    givens: [
      { symbol: "s_1", name: "первый путь", value: 100, displayValue: "100", unit: "м" },
      { symbol: "t_1", name: "первое время", value: 20, displayValue: "20", unit: "с" },
      { symbol: "s_2", name: "второй путь", value: 300, displayValue: "300", unit: "м" },
      { symbol: "t_2", name: "второе время", value: 30, displayValue: "30", unit: "с" },
    ],
    model: {
      explanation: "Средняя скорость описывает весь путь целиком: нужно сложить пройденные расстояния и разделить их на полное время движения.",
    },
    law: {
      explanation: "Средняя скорость — отношение общего пути к общему времени.",
      formulas: [{ latex: "v_{\\text{ср}}=\\frac{s_1+s_2}{t_1+t_2}", accessibleText: "v среднее равно сумме s первого и s второго, делённой на сумму t первого и t второго" }],
    },
    substitution: {
      equations: [{ latex: "v_{\\text{ср}}=\\frac{100+300}{20+30}=8\\,\\text{м/с}", accessibleText: "v среднее равно 400 метрам, делённым на 50 секунд, то есть 8 метров в секунду" }],
    },
    answer: {
      expression: { latex: "v_{\\text{ср}}=8\\,\\text{м/с}", accessibleText: "средняя скорость равна 8 метров в секунду" },
      sentence: "Средняя скорость на всём пути равна 8 м/с.",
    },
    check: {
      explanation: "Ответ лежит между скоростями участков: 5 м/с и 10 м/с.",
    },
    typicalMistake: {
      title: "Усреднить скорости участков",
      explanation: "Среднее (5 + 10)/2 = 7,5 м/с неверно: участки длились разное время. Усреднять скорости напрямую можно только при равных временах.",
    },
  },
  "heat-balance-simple": {
    familyId: "heat-balance-simple",
    label: "Учебный пример",
    statement: "Смешали 0,20 кг воды при 80 °C и 0,30 кг воды при 20 °C. Потерями тепла пренебрегают.",
    question: "Какова установившаяся температура смеси?",
    givens: [
      { symbol: "m_1", name: "масса горячей воды", value: 0.2, displayValue: "0,20", unit: "кг" },
      { symbol: "t_1", name: "температура горячей воды", value: 80, displayValue: "80", unit: "°C" },
      { symbol: "m_2", name: "масса холодной воды", value: 0.3, displayValue: "0,30", unit: "кг" },
      { symbol: "t_2", name: "температура холодной воды", value: 20, displayValue: "20", unit: "°C" },
    ],
    model: {
      explanation: "В замкнутой смеси горячая вода отдаёт столько же теплоты, сколько получает холодная. Удельная теплоёмкость одинакова и сокращается.",
    },
    law: {
      explanation: "При отсутствии потерь выполняется тепловой баланс.",
      formulas: [{ latex: "m_1c(t_1-t)=m_2c(t-t_2)", accessibleText: "m один c умножить на разность t один и t равно m два c умножить на разность t и t два" }],
    },
    substitution: {
      equations: [
        { latex: "0{,}20(80-t)=0{,}30(t-20)", accessibleText: "0,20 умножить на 80 минус t равно 0,30 умножить на t минус 20" },
        { latex: "16-0{,}20t=0{,}30t-6", accessibleText: "16 минус 0,20 t равно 0,30 t минус 6" },
        { latex: "t=44\\,^\\circ\\text{C}", accessibleText: "t равно 44 градуса Цельсия" },
      ],
    },
    answer: {
      expression: { latex: "t=44\\,^\\circ\\text{C}", accessibleText: "температура равна 44 градуса Цельсия" },
      sentence: "Установившаяся температура смеси равна 44 °C.",
    },
    check: {
      explanation: "44 °C находится между 20 и 80 °C и ближе к 20 °C, потому что холодной воды больше.",
      expression: { latex: "0{,}20(80-44)=0{,}30(44-20)=7{,}2", accessibleText: "обе части теплового баланса равны 7,2" },
    },
    typicalMistake: {
      title: "Взять обычное среднее температур",
      explanation: "50 °C получилось бы при равных массах. Здесь холодной воды больше, поэтому итоговая температура смещена к 20 °C.",
    },
  },
  "thin-lens-image-distance": {
    familyId: "thin-lens-image-distance",
    label: "Учебный пример",
    statement: "Предмет находится в 30 см от собирающей линзы с фокусным расстоянием 10 см.",
    question: "На каком расстоянии от линзы получится действительное изображение?",
    givens: [
      { symbol: "F", name: "фокусное расстояние", value: 10, displayValue: "10", unit: "см" },
      { symbol: "d", name: "расстояние до предмета", value: 30, displayValue: "30", unit: "см" },
    ],
    visual: {
      kind: "optics",
      spec: lensDiagram,
      description: "Предмет расположен слева дальше двойного фокуса собирающей линзы. Действительное перевёрнутое изображение возникает справа между F и 2F, на расстоянии 15 см.",
    },
    model: {
      explanation: "Предмет находится дальше фокуса собирающей линзы, поэтому лучи после линзы сходятся и образуют действительное изображение.",
    },
    law: {
      explanation: "Для действительного предмета и действительного изображения используем положительные расстояния в формуле тонкой линзы.",
      formulas: [{ latex: "\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}", accessibleText: "единица делённая на F равна единице делённой на d плюс единица делённая на f" }],
    },
    substitution: {
      equations: [
        { latex: "\\frac{1}{f}=\\frac{1}{10}-\\frac{1}{30}=\\frac{1}{15}", accessibleText: "единица делённая на f равна одной десятой минус одной тридцатой, то есть одной пятнадцатой" },
        { latex: "f=15\\,\\text{см}", accessibleText: "f равно 15 сантиметров" },
      ],
    },
    answer: {
      expression: { latex: "f=15\\,\\text{см}", accessibleText: "расстояние до изображения равно 15 сантиметров" },
      sentence: "Изображение получится в 15 см от линзы.",
    },
    check: {
      explanation: "Предмет расположен дальше 2F, поэтому изображение должно быть между F и 2F. Значение 15 см попадает в этот интервал.",
      expression: { latex: "10<15<20", accessibleText: "15 сантиметров находится между 10 и 20 сантиметрами" },
    },
    typicalMistake: {
      title: "Сложить расстояния или перепутать обратные величины",
      explanation: "Из формулы нужно вычесть 1/d из 1/F. Простая сумма F + d не описывает построение изображения.",
    },
  },
} satisfies Partial<Record<TemplateId, ReferenceSolution>>;

export const referenceSolutions: Readonly<Partial<Record<TemplateId, ReferenceSolution>>> = solutions;

export function getReferenceSolution(familyId: TemplateId): ReferenceSolution | undefined {
  return referenceSolutions[familyId];
}
