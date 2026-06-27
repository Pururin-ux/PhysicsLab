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
    title: "Путаешь наклон v(t) с отношением v/t",
    hint: "Смотри на изменение скорости: Δv/Δt.",
  },
  "vt-area": {
    title: "Путаешь площадь под v(t) с высотой графика",
    hint: "Путь на v(t) - это площадь под графиком.",
  },
  "free-fall": {
    title: "Забываешь квадрат времени или деление на 2",
    hint: "Для падения из покоя используй h = gt²/2.",
  },
  "newton-second": {
    title: "Путаешь силу, массу и ускорение",
    hint: "Сначала вырази искомую величину из F = ma.",
  },
  "friction-force": {
    title: "Путаешь силу трения и реакцию опоры",
    hint: "На горизонтали Fтр = μN, а N = mg только при отсутствии вертикального ускорения.",
  },
  "incline-force": {
    title: "Путаешь sin и cos на наклонной плоскости",
    hint: "Вдоль плоскости работает составляющая mg sin α.",
  },
  "resultant-force": {
    title: "Складываешь силы без учета направления",
    hint: "Выбери положительное направление и учитывай знаки сил.",
  },
  "weight-lift": {
    title: "Путаешь знак ускорения лифта",
    hint: "При ускорении вверх вес больше, при ускорении вниз - меньше.",
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
      skillTitle: "Неизвестный навык",
      title: "Типовая ошибка",
      hint: trapText || fallbackHint,
      count: safeCount,
    };
  }

  const skill = skillMetadata[parsed.blueprint];
  const copy = weaknessCopyBySkill[parsed.blueprint] ?? {
    title: `Ошибка в навыке: ${skill.shortTitle}`,
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
