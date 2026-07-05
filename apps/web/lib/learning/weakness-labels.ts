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

const weaknessCopyBySkill: Partial<Record<SkillId, {
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
  "resultant-force": {
    title: "Равнодействующая",
    hint: "Выбери **положительное направление** и учитывай знаки сил.",
  },
  "weight-lift": {
    title: "Вес в лифте",
    hint: "При ускорении вверх вес ==больше==, при ускорении вниз — ==меньше==.",
  },
  "relative-velocity-vectors": {
    title: "Сложение скоростей",
    hint: "Перпендикулярные скорости складывай ==векторно==: $v = \\sqrt{v_1^2 + v_2^2}$.",
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
  "charge-sharing": {
    title: "Деление заряда",
    hint: "После контакта одинаковых шариков заряд не складывается, а ==делится поровну==.",
  },
  "ideal-gas-state": {
    title: "Уравнение состояния газа",
    hint: "Температуру переводи в кельвины: $T = t + 273$ — иначе уравнение не работает.",
  },
  "heat-amount": {
    title: "Количество теплоты",
    hint: "В формуле $Q=cm\\Delta T$ важны ==все три== множителя: ни один нельзя пропускать.",
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
