import { skillMetadata, type SkillId } from "./taxonomy";

export type TaskFocus = {
  title: string;
  check: string;
};

type TaskFocusInput = {
  blueprint: string;
  skill?: string;
};

const focusByBlueprint: Record<string, TaskFocus> = {
  "formula-substitution": {
    title: "Подстановка в формулу",
    check:
      "Проверь все слагаемые и коэффициенты. Если в формуле есть $\\frac{1}{2}$, оно тоже участвует в расчёте.",
  },
  "graph-area": {
    title: "Площадь под графиком",
    check:
      "Разбей график на простые фигуры и сложи их площади за весь промежуток времени.",
  },
  "acceleration-from-speed-change": {
    title: "Ускорение по изменению скорости",
    check:
      "Бери две точки графика: сначала найди $\\Delta v$, затем $\\Delta t$.",
  },
  "signed-coordinate": {
    title: "Перемещение и путь",
    check:
      "Для перемещения сравни только конечную и начальную координаты. Путь складывает все участки.",
  },
  "nth-second-displacement": {
    title: "Путь за отдельную секунду",
    check:
      "Найди путь к концу этой секунды и вычти путь к началу этой секунды.",
  },
  "graph-recognition": {
    title: "Чтение графиков движения",
    check:
      "Сначала подпиши, какая величина на вертикальной оси: координата, скорость или ускорение.",
  },
  "relative-motion-meeting": {
    title: "Встречное движение",
    check: "Если тела движутся навстречу, складывай скорости сближения.",
  },
  "relative-motion-overtake": {
    title: "Догоняющее движение",
    check:
      "Если тела движутся в одну сторону, скорость сокращения расстояния равна разности скоростей.",
  },
};

const checkBySkill: Partial<Record<SkillId, string>> = {
  "vt-slope": "Смотри на наклон: нужно изменение скорости за выбранный промежуток времени.",
  "vt-area": "Считай площадь под графиком скорости за весь интервал, а не одно значение скорости.",
  "free-fall": "Для падения из покоя путь растёт как $t^2$: используй $h=\\frac{gt^2}{2}$.",
  "newton-second": "Сначала реши, что ищем: силу, массу или ускорение, затем вырази эту величину из $F=ma$.",
  "friction-force": "Сначала найди реакцию опоры $N$, потом умножай на коэффициент трения.",
  "incline-force": "Вдоль наклонной плоскости работает $mg\\sin\\alpha$, поперёк — $mg\\cos\\alpha$.",
  "resultant-force": "Выбери положительное направление и складывай проекции сил со знаками.",
  "weight-lift": "Смотри на направление ускорения лифта: вверх вес больше, вниз меньше.",
  "density-volume-ratio": "Сравнивай объёмы: у куба объём растёт как третья степень ребра.",
  "impulse-momentum": "Проверь, какие данные нужны: для $\\Delta p=F\\Delta t$ масса не входит напрямую.",
  "ohm-law": "Запиши закон Ома и вырази нужную величину до подстановки чисел.",
  "charge-sharing": "После контакта одинаковых проводников заряд усредняется с учётом знаков.",
  "ideal-gas-state": "Перед расчётом переведи температуру в кельвины.",
  "heat-amount": "В $Q=cm\\Delta T$ нужны все три множителя: теплоёмкость, масса и изменение температуры.",
};

function isSkillId(value: string): value is SkillId {
  return value in skillMetadata;
}

export function getTaskFocus(task: TaskFocusInput): TaskFocus {
  if (isSkillId(task.blueprint)) {
    const skill = skillMetadata[task.blueprint];

    return {
      title: skill.shortTitle,
      check: checkBySkill[skill.id] ?? skill.description,
    };
  }

  if (focusByBlueprint[task.blueprint]) {
    return focusByBlueprint[task.blueprint];
  }

  if (task.skill) {
    return {
      title: task.skill,
      check: "Перед расчётом назови, какая величина дана, какая нужна и какая формула связывает их.",
    };
  }

  return {
    title: "Разбор условия",
    check: "Сначала выпиши данные и вопрос задачи, затем выбирай формулу.",
  };
}
