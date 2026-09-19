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
  "ship-payload": {
    title: "Грузоподъёмность судна",
    hint: "Водоизмещение уже включает массу судна: груз равен ==водоизмещение − масса пустого судна==.",
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
  "projectile-components": {
    title: "Бросок под углом",
    hint: "Не смешивай оси: $v_{0y}$ задаёт время и высоту, а $v_{0x}$ — дальность за найденное время.",
  },
  "rotation-frequency": {
    title: "Частота вращения",
    hint: "Дели ==число полных оборотов на всё время==: ν = N/Δt.",
  },
  "centripetal-acceleration": {
    title: "Ускорение к центру",
    hint: "Скорость входит в квадрате, радиус — в знаменателе: ==a = v²/R==.",
  },
  "average-speed-with-stop": {
    title: "Средняя скорость с остановкой",
    hint: "Остановка не добавляет пути, но её время входит в ==всё время==.",
  },
  "uniform-motion-basic": {
    title: "Путь, скорость и время",
    hint: "Сначала назови неизвестную: $s=vt$, $v=\\frac{s}{t}$, $t=\\frac{s}{v}$.",
  },
  "uniform-coordinate-law": {
    title: "Координата через время",
    hint: "Сохраняй начальную координату и знак проекции скорости в $x=x_0+v_xt$.",
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
  "gravitation-distance": {
    title: "Квадрат расстояния",
    hint: "Изменение расстояния в k раз меняет силу тяготения в $k^2$ раз в противоположную сторону.",
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
  "work-at-angle": {
    title: "Работа силы под углом",
    hint: "Проецируй силу на перемещение: $A=Fs\\cos\\alpha$. При тупом угле работа ==отрицательна==.",
  },
  "torque-balance": {
    title: "Моменты сил",
    hint: "Плечо — перпендикуляр до линии действия силы; в равновесии $F_1l_1=F_2l_2$.",
  },
  "movable-pulley": {
    title: "Подвижный блок",
    hint: "Две ветви одной нити поддерживают блок с грузом, поэтому в идеальной модели $F=P/2$.",
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
  "conductor-resistance": {
    title: "Сопротивление проводника",
    hint: "В $R=\\rho l/S$ длина ==увеличивает== сопротивление, а площадь сечения уменьшает его.",
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
  "elementary-charge-count": {
    title: "Элементарный заряд",
    hint: "Используй $N=\frac{|q|}{e}$ и проверь, что число элементарных зарядов получилось целым.",
  },
  "magnetic-field-direction": {
    title: "Направление магнитного поля",
    hint: "Направь большой палец правой руки по току в прямом проводе; для катушки пальцы идут по току, а большой палец показывает её северный торец.",
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
  "molecule-count-from-mass": {
    title: "Число молекул",
    hint: "Сначала найди ==количество вещества== $\\nu=m/M$, затем используй $N=\\nu N_A$.",
  },
  "ideal-gas-isoprocess": {
    title: "Законы изопроцессов",
    hint: "Зафиксируй неизменный параметр: $T=\\mathrm{const}$ даёт $pV=\\mathrm{const}$, $p=\\mathrm{const}$ — $V/T=\\mathrm{const}$, $V=\\mathrm{const}$ — $p/T=\\mathrm{const}$.",
  },
  "solid-structure-properties": {
    title: "Строение твёрдых тел",
    hint: "Связывай наблюдение со ==строением==: единая решётка даёт анизотропию, случайные зёрна усредняют направления, аморфное тело размягчается постепенно.",
  },
  "liquid-structure-properties": {
    title: "Строение жидкости",
    hint: "Переходы между временными положениями объясняют ==текучесть==, а нескомпенсированные силы поверхности — сокращение её площади.",
  },
  "vapor-dynamic-equilibrium": {
    title: "Испарение и насыщенный пар",
    hint: "Постоянный уровень означает ==равные встречные потоки== молекул, а не остановку испарения и конденсации.",
  },
  "relative-humidity-pressure": {
    title: "Влажность воздуха",
    hint: "Сравни фактическое давление пара с ==давлением насыщенного пара при той же температуре==.",
  },
  "particle-concentration": {
    title: "Концентрация частиц",
    hint: "Используй $n=N/V$ и сначала переведи объём в ==кубические метры==.",
  },
  "molecular-kinetic-energy": {
    title: "Энергия молекул",
    hint: "Сначала найди ==абсолютную температуру== $T=t+273$, затем используй $\\overline{E_k}=\\frac32kT$.",
  },
  "fuel-combustion-heat": {
    title: "Сгорание топлива",
    hint: "Для полного сгорания умножь удельную теплоту сгорания на массу: $Q=qm$.",
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
  "shadow-and-penumbra": {
    title: "Тень и полутень",
    hint: "Точечный источник даёт ==резкую границу== тени; у протяжённого источника появляется полутень.",
  },
  "refraction-direction": {
    title: "Направление преломления",
    hint: "Сначала отметь ==нормаль== и среду, в которую входит луч: в воду — к нормали, из воды в воздух — от нормали.",
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
  "lens-image-properties": {
    title: "Изображение в линзе",
    hint: "Сначала расположи предмет относительно ==F и 2F==. Действительное изображение можно получить на экране, мнимое — нельзя.",
  },
  "vision-correction": {
    title: "Очки и положение фокуса",
    hint: "Фокус ==перед сетчаткой== сдвигают назад рассеивающей линзой; фокус за сетчаткой — вперёд собирающей.",
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
