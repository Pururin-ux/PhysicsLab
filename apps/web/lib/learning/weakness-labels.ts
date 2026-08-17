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
  "vt-slope": {
    title: "Наклон v(t)",
    hint: "Смотри на изменение скорости за выбранное время: $\\frac{\\Delta v}{\\Delta t}$.",
  },
  "vt-area": {
    title: "Площадь под v(t)",
    hint: "Перемещение на графике v(t) — это ==площадь под линией==, а не одна точка.",
  },
  "free-fall": {
    title: "Свободное падение",
    hint: "Для падения из покоя используй $h = \\frac{gt^2}{2}$.",
  },
  "average-speed-segments": {
    title: "Средняя скорость",
    hint: "Считай ==весь путь / всё время==, а не среднее арифметическое скоростей.",
  },
  "unit-conversion-speed": {
    title: "Единицы скорости",
    hint: "Перед расчетом пути переведи км/ч в м/с, а минуты в секунды.",
  },
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
    hint: "Выбери **положительное направление** и учитывай знаки сил.",
  },
  "weight-lift": {
    title: "Вес в лифте",
    hint: "При ускорении вверх вес ==больше==, при ускорении вниз — ==меньше==.",
  },
  "work-force-distance": {
    title: "Работа силы",
    hint: "Проверь знак: если сила направлена против перемещения, работа отрицательна.",
  },
  "relative-velocity-vectors": {
    title: "Сложение скоростей",
    hint: "Перпендикулярные скорости складывай ==векторно==: $v = \\sqrt{v_1^2 + v_2^2}$.",
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
    hint: "$\\Delta p = F\\Delta t$ — проверь, все ли данные из условия вообще нужны формуле.",
  },
  "inelastic-collision-speed": {
    title: "Неупругое столкновение",
    hint: "После сцепления дели ==суммарный импульс== на общую массу системы.",
  },
  "kinetic-energy": {
    title: "Кинетическая энергия",
    hint: "В $E_k=\\frac{mv^2}{2}$ скорость стоит ==в квадрате==, а не первой степенью.",
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
    hint: "Температуру переводи в кельвины: $T = t + 273$ — иначе уравнение не работает.",
  },
  "heat-amount": {
    title: "Количество теплоты",
    hint: "В формуле $Q=cm\\Delta T$ важны ==все три== множителя: ни один нельзя пропускать.",
  },
  "gas-state-ratio": {
    title: "Параметры газа",
    hint: "В отношении $pV/T$ температуру всегда подставляй в Кельвинах.",
  },
  "heat-balance-simple": {
    title: "Тепловой баланс",
    hint: "Температура смеси зависит от масс: приравняй отданную и полученную теплоту.",
  },
  "phase-change-heat": {
    title: "Нагревание и плавление",
    hint: "Сложи две стадии: нагрев до 0 °C и плавление $\\lambda m$.",
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
    hint: "Не переворачивай отношение: $n=\\frac{c}{v}$ всегда не меньше единицы.",
  },
  "snell-index-ratio": {
    title: "Закон преломления",
    hint: "Дели ==синусы углов==, а не сами углы: $\\frac{n_2}{n_1}=\\frac{\\sin i}{\\sin r}$.",
  },
  "thin-lens-image-distance": {
    title: "Формула тонкой линзы",
    hint: "В знаменателе ==разность==: $d_i=\\frac{Fd_o}{d_o-F}$.",
  },
  "lens-optical-power": {
    title: "Оптическая сила",
    hint: "Сначала переведи $F$ в ==метры==: диоптрия — это 1/м.",
  },
  "lens-image-height": {
    title: "Увеличение линзы",
    hint: "Увеличение равно $\\frac{d_i}{d_o}$ — расстояние до изображения в ==числителе==.",
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
