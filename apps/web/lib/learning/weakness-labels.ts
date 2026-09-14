import {
  skillMetadata,
  type SkillId,
  type TopicId,
} from "./taxonomy.ts";

export type WeaknessDisplay = {
  key: string;
  skillId: string;
  skillTitle: string;
  title: string;
  hint: string;
  count: number;
};

const fallbackHint = "Повтори разбор задачи.";

// Экспорт — только для consistency.test.ts (см. комментарий в task-focus.ts).
export const weaknessCopyBySkill: Partial<Record<SkillId, {
  title: string;
  hint: string;
}>> = {
  "archimedes-force": {
    title: "Сила Архимеда",
    hint: "Проверь ==погружённый объём== и перевод см³ в м³ перед подстановкой в $F_A=\\rho_{\\text{ж}}gV_{\\text{погр}}$.",
  },
  "contact-pressure":{title:"Давление на опору",hint:"Полная сила действует на ==суммарную площадь== опор. Проверь перевод квадратных единиц."},
  "vt-slope": {
    title: "Наклон v(t)",
    hint: "Смотри на изменение скорости за выбранное время: $\\frac{\\Delta v}{\\Delta t}$.",
  },
  "vt-area": {
    title: "Площадь под v(t)",
    hint: "Перемещение — ==знаковая площадь==: участки ниже оси времени считаются отрицательными; для пути складывай модули.",
  },
  "free-fall": {
    title: "Свободное падение",
    hint: "Для падения из покоя используй $h = \\frac{gt^2}{2}$.",
  },
  "average-speed-segments": {
    title: "Средняя путевая скорость",
    hint: "Считай ==весь путь / всё время==, а не среднее арифметическое скоростей.",
  },
  "average-speed-with-stop": {
    title: "Средняя скорость с остановкой",
    hint: "Остановка не добавляет пути, но её время входит в ==всё время==.",
  },
  "uniform-motion-basic": {
    title: "Путь, скорость и время",
    hint: "Сначала назови неизвестную: $s=vt$, $v=\\frac{s}{t}$, $t=\\frac{s}{v}$.",
  },
  "uniform-motion-graphs": {
    title: "Графики равномерного движения",
    hint: "Прочитай оси: наклон $s(t)$ показывает скорость, а горизонтальная $v(t)$ — её постоянство.",
  },
  "unit-conversion-speed": {
    title: "Единицы скорости",
    hint: "Перед расчетом пути переведи км/ч в м/с, а минуты в секунды.",
  },
  "gravity-force": {
    title: "Сила тяжести",
    hint: "Умножь массу в килограммах на $g=9{,}8\\,\\text{Н/кг}$. Сила измеряется в ньютонах.",
  },
  "hydrostatic-pressure": {title:"Давление жидкости",hint:"Используй $p=\\rho gh$: важны плотность и ==глубина от поверхности==."},
  "newton-second": {
    title: "Второй закон Ньютона",
    hint: "Сначала реши, **что именно ищем**: силу, массу или ускорение.",
  },
  "friction-force": {
    title: "Трение",
    hint: "Сначала найди N, потом умножай на ==коэффициент трения==.",
  },
  "incline-force": {
    title: "Наклонная плоскость",
    hint: "Вдоль плоскости работает составляющая $mg\\sin\\alpha$.",
  },
  "resultant-force-2d": {
    title: "Силы под углом 90°",
    hint: "Перпендикулярные силы складывай ==векторно==: $F = \\sqrt{F_1^2 + F_2^2}$.",
  },
  "resultant-force": {
    title: "Равнодействующая",
    hint: "Нарисуй силы стрелками: встречные силы гасят друг друга, силы в одну сторону складываются.",
  },
  "weight-lift": {
    title: "Вес в лифте",
    hint: "Вес P действует на опору, реакция N — на тело; при контакте их ==модули равны==.",
  },
  "work-force-distance": {
    title: "Работа силы",
    hint: "Проверь знак: если сила направлена против перемещения, работа отрицательна.",
  },
  "mechanical-power": {
    title: "Механическая мощность",
    hint: "Различай работу и мощность: $P=\\frac{A}{t}$, а $A=Pt$.",
  },
  "mechanical-efficiency": {
    title: "КПД механизма",
    hint: "Полезная работа — часть полной: $\\eta=\\frac{A_{\\text{пол}}}{A_{\\text{сов}}}\\cdot100\\%$.",
  },
  "relative-velocity-vectors": {
    title: "Относительная скорость",
    hint: "Согласуй системы отсчёта: $\\vec v_{A/C}=\\vec v_{A/B}+\\vec v_{B/C}$; перпендикулярные векторы сложи по Пифагору.",
  },
  "resistor-network": {
    title: "Соединения резисторов",
    hint: "Параллельно общее сопротивление ==меньше меньшего==; последовательно — просто сумма.",
  },
  "ohm-law": {
    title: "Закон Ома",
    hint: "Запиши $I = \\frac{U}{R}$ и вырази нужную величину, прежде чем считать.",
  },
  "source-internal-resistance": {
    title: "Полная цепь",
    hint: "Ток ограничивают ==оба== сопротивления: $I = \\frac{\\varepsilon}{R + r}$.",
  },
  "density-volume-ratio": {
    title: "Плотность и объём",
    hint: "Масса растёт как ==куб ребра==, а не как само ребро: сравнивай объёмы.",
  },
  "impulse-momentum": {
    title: "Импульс силы",
    hint: "$\\Delta\\vec p=\\vec F_{\\text{рез}}\\Delta t$ — нужна ==равнодействующая== всех сил.",
  },
  "inelastic-collision-speed": {
    title: "Неупругое столкновение",
    hint: "После сцепления дели ==суммарный импульс== на общую массу системы.",
  },
  "kinetic-energy": {
    title: "Кинетическая энергия",
    hint: "В $E_k=\\frac{mv^2}{2}$ скорость стоит ==в квадрате==, а не первой степенью.",
  },
  "gravitational-potential-energy": {
    title: "Потенциальная энергия",
    hint: "Сначала отметь нулевой уровень и высоту относительно него, затем используй $E_p=mgh$.",
  },
  "mechanical-energy-conservation": {
    title: "Сохранение механической энергии",
    hint: "Если сопротивлением пренебрегают, приравняй начальную и конечную суммы $E_k+E_p$.",
  },
  "electric-power": {
    title: "Мощность тока",
    hint: "Не останавливайся на $U=IR$: мощность равна $P=UI$ или $P=I^2R$.",
  },
  "charge-sharing": {
    title: "Деление заряда",
    hint: "После контакта одинаковых шариков заряд не складывается, а ==делится поровну==.",
  },
  "capacitor-energy": {
    title: "Энергия конденсатора",
    hint: "Не пропускай $U^2$, коэффициент $\\frac12$ и перевод микрофарад.",
  },
  "ideal-gas-state": {
    title: "Уравнение состояния газа",
    hint: "T — абсолютная температура в кельвинах, t — по Цельсию; численно $T[К]=t[°C]+273$.",
  },
  "heat-amount": {
    title: "Количество теплоты",
    hint: "$Q=cm\\Delta T$ даёт теплоту тела при постоянной c и без фазового перехода; проверь условие о потерях.",
  },
  "gas-state-ratio": {
    title: "Параметры газа",
    hint: "В отношении $pV/T$ температуру всегда подставляй в кельвинах.",
  },
  "heat-balance-simple": {
    title: "Тепловой баланс",
    hint: "Температура смеси зависит от масс: приравняй отданную и полученную теплоту.",
  },
  "phase-change-heat": {
    title: "Нагревание и плавление",
    hint: "Сложи две стадии: нагрев до 0 °C и плавление $\\lambda m$.",
  },
  "vaporization-heat": {
    title: "Нагревание и парообразование",
    hint: "Сложи нагрев воды до температуры кипения и парообразование $Lm$.",
  },
  "reflection-angle": {
    title: "Закон отражения",
    hint: "Отсчитывай углы падения и отражения ==от нормали==, а не от зеркала.",
  },
  "plane-mirror-separation": {
    title: "Плоское зеркало",
    hint: "Между предметом и изображением ==удвоенное== расстояние до зеркала: $L=2d$.",
  },
  "refractive-index-speed": {
    title: "Показатель преломления",
    hint: "Не переворачивай $n=\\frac{c}{v}$. Здесь v — фазовая скорость в обычной прозрачной среде видимого света.",
  },
  "snell-index-ratio": {
    title: "Закон преломления",
    hint: "Дели ==синусы углов==, а не сами углы: $\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}$.",
  },
  "thin-lens-image-distance": {
    title: "Формула тонкой линзы",
    hint: "В знаменателе ==разность==: $f=\\frac{Fd}{d-F}$.",
  },
  "lens-optical-power": {
    title: "Оптическая сила",
    hint: "Сначала переведи $F$ в ==метры==: диоптрия — это 1/м.",
  },
  "lens-image-height": {
    title: "Увеличение линзы",
    hint: "$|\\Gamma|=\\frac{d_i}{d_o}$: расстояние линза—изображение стоит в ==числителе==.",
  },
};

function isKnownSkillId(value: string): value is SkillId {
  return value in skillMetadata;
}

function normalizeCount(count: number) {
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function normalizeTrapText(trap: string) {
  const trimmed = trap.trim();

  return trimmed.toLowerCase() === "undefined" ? "" : trimmed;
}

export function parseWeakTrapKey(key: string): {
  blueprint: string;
  trap: string;
} | null {
  const separatorIndex = key.indexOf(":");

  if (separatorIndex <= 0 || separatorIndex >= key.length - 1) {
    return null;
  }

  const blueprint = key.slice(0, separatorIndex).trim();
  const trap = key.slice(separatorIndex + 1).trim();

  if (!blueprint || !trap) {
    return null;
  }

  return { blueprint, trap };
}

export function formatWeakness(
  key: string,
  count: number,
): WeaknessDisplay | null {
  const safeCount = normalizeCount(count);
  if (safeCount <= 0) {
    return null;
  }

  const parsed = parseWeakTrapKey(key);
  if (!parsed) {
    return null;
  }

  const trapText = normalizeTrapText(parsed.trap);

  if (!isKnownSkillId(parsed.blueprint)) {
    return {
      key,
      skillId: parsed.blueprint,
      skillTitle: "Новая тема",
      title: "Типовая ошибка",
      hint: trapText || fallbackHint,
      count: safeCount,
    };
  }

  const skill = skillMetadata[parsed.blueprint];
  const copy = weaknessCopyBySkill[parsed.blueprint] ?? {
    title: `Повтори: ${skill.shortTitle}`,
    hint: skill.description || fallbackHint,
  };

  return {
    key,
    skillId: skill.id,
    skillTitle: skill.shortTitle,
    title: copy.title,
    hint: copy.hint,
    count: safeCount,
  };
}

export function getTopWeaknesses(
  weakTraps: Record<string, number>,
  limit = 3,
): WeaknessDisplay[] {
  const safeLimit = normalizeCount(limit);
  if (safeLimit <= 0) {
    return [];
  }

  return Object.entries(weakTraps)
    .map(([key, count]) => formatWeakness(key, count))
    .filter((weakness): weakness is WeaknessDisplay => weakness !== null)
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.skillTitle.localeCompare(right.skillTitle, "ru");
    })
    .slice(0, safeLimit);
}

export function getTopWeaknessesForTopic(
  weakTraps: Record<string, number>,
  topicId: TopicId,
  limit = 3,
): WeaknessDisplay[] {
  const topicSkillIds = Object.values(skillMetadata)
    .filter((skill) => skill.topicId === topicId)
    .map((skill) => skill.id);

  const topicWeakTraps = Object.fromEntries(
    Object.entries(weakTraps).filter(([key]) =>
      topicSkillIds.some((skillId) => key.startsWith(`${skillId}:`)),
    ),
  );

  return getTopWeaknesses(topicWeakTraps, limit);
}
