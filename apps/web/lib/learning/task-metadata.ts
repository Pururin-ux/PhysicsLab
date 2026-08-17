import type { HelpSectionId } from "./topic-help.ts";
import type { TopicId } from "./taxonomy.ts";

export type TaskLearningMetadata = {
  templateId: string;
  topicId: TopicId;
  helpSectionId: HelpSectionId;
  skillId: string;
  focusLabel: string;
  shortHint: string;
  misconceptionIds?: string[];
};

export type MisconceptionMetadata = {
  id: string;
  label: string;
  helpSectionId: HelpSectionId;
  shortHint: string;
};

export const misconceptionMetadataById: Record<string, MisconceptionMetadata> = {
  "vt-area-not-final-speed": {
    id: "vt-area-not-final-speed",
    label: "читает скорость как путь",
    helpSectionId: "motion-graphs",
    shortHint: "На v(t) путь дает площадь под графиком, а не конечная скорость.",
  },
  "slope-vs-area": {
    id: "slope-vs-area",
    label: "путает наклон и площадь",
    helpSectionId: "motion-graphs",
    shortHint: "Наклон v(t) дает ускорение, площадь под v(t) дает перемещение.",
  },
  "forgot-acceleration-term": {
    id: "forgot-acceleration-term",
    label: "теряет член ускорения",
    helpSectionId: "accelerated-motion",
    shortHint: "При постоянном ускорении путь содержит член at^2/2.",
  },
  "average-speed-arithmetic-mean": {
    id: "average-speed-arithmetic-mean",
    label: "усредняет скорости без учета времени",
    helpSectionId: "average-speed",
    shortHint: "Средняя скорость равна всему пути, деленному на все время.",
  },
  "speed-unit-conversion": {
    id: "speed-unit-conversion",
    label: "не переводит скорость и время к одним единицам",
    helpSectionId: "units-conversion",
    shortHint: "Перед расчетом пути переведи км/ч в м/с, а минуты в секунды.",
  },
  "wrong-force-direction": {
    id: "wrong-force-direction",
    label: "складывает силы без направлений",
    helpSectionId: "resultant-force",
    shortHint: "Силы складываются как векторы: сначала ось и знаки, потом сумма.",
  },
  "friction-normal-force": {
    id: "friction-normal-force",
    label: "берет неверную реакцию опоры",
    helpSectionId: "friction",
    shortHint: "Трение равно muN; сначала найди N для конкретной опоры.",
  },
  "incline-projection-swap": {
    id: "incline-projection-swap",
    label: "путает sin и cos на наклонной",
    helpSectionId: "incline",
    shortHint: "Вдоль плоскости работает mg sin alpha, к плоскости - mg cos alpha.",
  },
  "lift-acceleration-sign": {
    id: "lift-acceleration-sign",
    label: "выбирает знак по скорости лифта",
    helpSectionId: "weight-lift",
    shortHint: "Вес меняет ускорение лифта, а не сама скорость движения.",
  },
  "momentum-not-conserved": {
    id: "momentum-not-conserved",
    label: "не сохраняет импульс системы",
    helpSectionId: "momentum",
    shortHint: "Для сцепившихся тел сохраняется суммарный импульс до и после.",
  },
  "work-sign-error": {
    id: "work-sign-error",
    label: "не учитывает знак работы",
    helpSectionId: "work-energy",
    shortHint: "Работа отрицательна, если сила направлена против перемещения.",
  },
  "ohm-transform-error": {
    id: "ohm-transform-error",
    label: "ошибка в преобразовании закона Ома",
    helpSectionId: "ohms-law",
    shortHint: "Сначала вырази нужную величину из I = U/R, потом подставляй числа.",
  },
  "internal-resistance-missed": {
    id: "internal-resistance-missed",
    label: "теряет внутреннее сопротивление",
    helpSectionId: "full-circuit",
    shortHint: "В полной цепи ток ограничивает сумма внешнего и внутреннего сопротивлений.",
  },
  "charge-not-conserved": {
    id: "charge-not-conserved",
    label: "не сохраняет общий заряд",
    helpSectionId: "charge-sharing",
    shortHint: "Перед делением сложи заряды с учетом знаков.",
  },
  "capacitor-square-law": {
    id: "capacitor-square-law",
    label: "теряет квадрат напряжения",
    helpSectionId: "capacitor-energy",
    shortHint: "Энергия конденсатора пропорциональна U^2 и содержит коэффициент 1/2.",
  },
  "electric-power-voltage-only": {
    id: "electric-power-voltage-only",
    label: "находит напряжение вместо мощности",
    helpSectionId: "electric-power",
    shortHint: "После U=IR нужно еще найти P=UI или P=I²R.",
  },
  "temperature-celsius-kelvin": {
    id: "temperature-celsius-kelvin",
    label: "подставляет температуру в градусах Цельсия",
    helpSectionId: "gas-equation",
    shortHint: "В pV = nRT температура всегда в кельвинах.",
  },
  "heat-delta-temperature": {
    id: "heat-delta-temperature",
    label: "берет конечную температуру вместо изменения",
    helpSectionId: "heat-amount",
    shortHint: "В Q = cmΔT нужна разность температур.",
  },
  "heat-balance-arithmetic-mean": {
    id: "heat-balance-arithmetic-mean",
    label: "усредняет температуры без учета масс",
    helpSectionId: "heat-balance",
    shortHint: "В тепловом балансе массы задают вклад горячей и холодной воды.",
  },
  "melting-plateau-misread": {
    id: "melting-plateau-misread",
    label: "смешивает нагрев и плавление",
    helpSectionId: "heating-melting",
    shortHint: "Нагрев и плавление считаются разными стадиями и складываются.",
  },
  "angle-from-surface": {
    id: "angle-from-surface",
    label: "отсчитывает углы от поверхности",
    helpSectionId: "reflection",
    shortHint: "Углы падения, отражения и преломления отсчитываются от нормали.",
  },
  "mirror-image-distance": {
    id: "mirror-image-distance",
    label: "путает расстояние до зеркала и до изображения",
    helpSectionId: "plane-mirror",
    shortHint: "Изображение за зеркалом на том же расстоянии: между предметом и изображением 2d.",
  },
  "refractive-index-inverted": {
    id: "refractive-index-inverted",
    label: "переворачивает отношение скоростей",
    helpSectionId: "refractive-index",
    shortHint: "Показатель преломления n = c/v всегда не меньше единицы.",
  },
  "snell-without-sines": {
    id: "snell-without-sines",
    label: "делит углы вместо синусов",
    helpSectionId: "refraction",
    shortHint: "Закон преломления связывает синусы углов, а не сами углы.",
  },
  "lens-equation-sign": {
    id: "lens-equation-sign",
    label: "ошибается в знаменателе формулы линзы",
    helpSectionId: "thin-lens",
    shortHint: "Для действительного изображения d_i = F·d_o/(d_o − F): в знаменателе разность.",
  },
  "diopter-unit-conversion": {
    id: "diopter-unit-conversion",
    label: "не переводит фокусное расстояние в метры",
    helpSectionId: "optical-power",
    shortHint: "Диоптрия — это 1/м: сначала переведи F в метры.",
  },
  "magnification-inverted": {
    id: "magnification-inverted",
    label: "переворачивает отношение расстояний",
    helpSectionId: "magnification",
    shortHint: "Увеличение равно d_i/d_o — расстояние до изображения в числителе.",
  },
};

export const taskLearningMetadataByTemplateId: Record<string, TaskLearningMetadata> = {
  "free-fall": {
    templateId: "free-fall",
    topicId: "kinematics",
    helpSectionId: "accelerated-motion",
    skillId: "free-fall",
    focusLabel: "Свободное падение",
    shortHint: "Свободное падение из покоя - это равноускоренное движение с g.",
    misconceptionIds: ["forgot-acceleration-term"],
  },
  "vt-slope": {
    templateId: "vt-slope",
    topicId: "kinematics",
    helpSectionId: "motion-graphs",
    skillId: "vt-slope",
    focusLabel: "Наклон графика v(t)",
    shortHint: "Наклон v(t) показывает ускорение на выбранном участке.",
    misconceptionIds: ["slope-vs-area"],
  },
  "vt-area": {
    templateId: "vt-area",
    topicId: "kinematics",
    helpSectionId: "motion-graphs",
    skillId: "vt-area",
    focusLabel: "Площадь под графиком v(t)",
    shortHint: "Площадь под v(t) показывает перемещение за весь интервал.",
    misconceptionIds: ["vt-area-not-final-speed", "slope-vs-area"],
  },
  "relative-velocity-vectors": {
    templateId: "relative-velocity-vectors",
    topicId: "kinematics",
    helpSectionId: "vectors-relative-motion",
    skillId: "relative-velocity-vectors",
    focusLabel: "Относительная скорость",
    shortHint: "Скорости складываются по направлению; перпендикулярные - как векторы.",
  },
  "average-speed-segments": {
    templateId: "average-speed-segments",
    topicId: "kinematics",
    helpSectionId: "average-speed",
    skillId: "average-speed-segments",
    focusLabel: "Средняя скорость на участках",
    shortHint: "Считай среднюю скорость через весь путь и все время движения.",
    misconceptionIds: ["average-speed-arithmetic-mean"],
  },
  "unit-conversion-speed": {
    templateId: "unit-conversion-speed",
    topicId: "kinematics",
    helpSectionId: "units-conversion",
    skillId: "unit-conversion-speed",
    focusLabel: "Перевод скорости",
    shortHint: "Перед расчетом пути переведи км/ч в м/с, а минуты в секунды.",
    misconceptionIds: ["speed-unit-conversion"],
  },
  "newton-second": {
    templateId: "newton-second",
    topicId: "dynamics",
    helpSectionId: "newton-second-law",
    skillId: "newton-second",
    focusLabel: "Второй закон Ньютона",
    shortHint: "Сумма сил задает ускорение: выбери ось и вырази нужную величину.",
    misconceptionIds: ["wrong-force-direction"],
  },
  "friction-force": {
    templateId: "friction-force",
    topicId: "dynamics",
    helpSectionId: "friction",
    skillId: "friction-force",
    focusLabel: "Сила трения",
    shortHint: "Трение равно muN; сначала найди реакцию опоры.",
    misconceptionIds: ["friction-normal-force"],
  },
  "incline-force": {
    templateId: "incline-force",
    topicId: "dynamics",
    helpSectionId: "incline",
    skillId: "incline-force",
    focusLabel: "Наклонная плоскость",
    shortHint: "Разложи mg вдоль плоскости и перпендикулярно ей.",
    misconceptionIds: ["incline-projection-swap", "friction-normal-force"],
  },
  "resultant-force": {
    templateId: "resultant-force",
    topicId: "dynamics",
    helpSectionId: "resultant-force",
    skillId: "resultant-force",
    focusLabel: "Равнодействующая сил",
    shortHint: "Складывай силы с учетом выбранного направления.",
    misconceptionIds: ["wrong-force-direction"],
  },
  "resultant-force-2d": {
    templateId: "resultant-force-2d",
    topicId: "dynamics",
    helpSectionId: "resultant-force",
    skillId: "resultant-force-2d",
    focusLabel: "Равнодействующая перпендикулярных сил",
    shortHint: "Перпендикулярные силы складываются по теореме Пифагора.",
    misconceptionIds: ["wrong-force-direction"],
  },
  "weight-lift": {
    templateId: "weight-lift",
    topicId: "dynamics",
    helpSectionId: "weight-lift",
    skillId: "weight-lift",
    focusLabel: "Вес тела в лифте",
    shortHint: "Вес зависит от ускорения опоры, а не от направления скорости.",
    misconceptionIds: ["lift-acceleration-sign"],
  },
  "inelastic-collision-speed": {
    templateId: "inelastic-collision-speed",
    topicId: "dynamics",
    helpSectionId: "momentum",
    skillId: "inelastic-collision-speed",
    focusLabel: "Неупругое столкновение",
    shortHint: "После сцепления тел общий импульс делится на общую массу.",
    misconceptionIds: ["momentum-not-conserved"],
  },
  "kinetic-energy": {
    templateId: "kinetic-energy",
    topicId: "dynamics",
    helpSectionId: "kinetic-energy",
    skillId: "kinetic-energy",
    focusLabel: "Кинетическая энергия",
    shortHint: "Кинетическая энергия зависит от квадрата скорости.",
  },
  "density-volume-ratio": {
    templateId: "density-volume-ratio",
    topicId: "dynamics",
    helpSectionId: "density-volume",
    skillId: "density-volume-ratio",
    focusLabel: "Плотность и объем",
    shortHint: "Масса пропорциональна плотности и объему, а не линейному размеру.",
  },
  "impulse-momentum": {
    templateId: "impulse-momentum",
    topicId: "dynamics",
    helpSectionId: "momentum",
    skillId: "impulse-momentum",
    focusLabel: "Импульс силы",
    shortHint: "Импульс силы равен изменению импульса тела.",
    misconceptionIds: ["momentum-not-conserved"],
  },
  "work-force-distance": {
    templateId: "work-force-distance",
    topicId: "dynamics",
    helpSectionId: "work-energy",
    skillId: "work-force-distance",
    focusLabel: "Работа силы",
    shortHint: "Смотри на направление силы относительно перемещения: знак работы меняется.",
    misconceptionIds: ["work-sign-error"],
  },
  "ohm-law": {
    templateId: "ohm-law",
    topicId: "electrodynamics",
    helpSectionId: "ohms-law",
    skillId: "ohm-law",
    focusLabel: "Закон Ома",
    shortHint: "Свяжи ток, напряжение и сопротивление до подстановки чисел.",
    misconceptionIds: ["ohm-transform-error"],
  },
  "resistor-network": {
    templateId: "resistor-network",
    topicId: "electrodynamics",
    helpSectionId: "ohms-law",
    skillId: "resistor-network",
    focusLabel: "Соединения резисторов",
    shortHint: "Сначала найди эквивалентное сопротивление, затем применяй закон Ома.",
    misconceptionIds: ["ohm-transform-error"],
  },
  "source-internal-resistance": {
    templateId: "source-internal-resistance",
    topicId: "electrodynamics",
    helpSectionId: "full-circuit",
    skillId: "source-internal-resistance",
    focusLabel: "Полная цепь",
    shortHint: "Во всей цепи учитывай внешнее и внутреннее сопротивление.",
    misconceptionIds: ["internal-resistance-missed"],
  },
  "capacitor-energy": {
    templateId: "capacitor-energy",
    topicId: "electrodynamics",
    helpSectionId: "capacitor-energy",
    skillId: "capacitor-energy",
    focusLabel: "Энергия конденсатора",
    shortHint: "Энергия конденсатора зависит от U^2 и коэффициента 1/2.",
    misconceptionIds: ["capacitor-square-law"],
  },
  "electric-power": {
    templateId: "electric-power",
    topicId: "electrodynamics",
    helpSectionId: "electric-power",
    skillId: "electric-power",
    focusLabel: "Мощность тока",
    shortHint: "Не останавливайся на U=IR: для мощности используй P=UI или P=I²R.",
    misconceptionIds: ["electric-power-voltage-only", "ohm-transform-error"],
  },
  "charge-sharing": {
    templateId: "charge-sharing",
    topicId: "electrodynamics",
    helpSectionId: "charge-sharing",
    skillId: "charge-sharing",
    focusLabel: "Деление заряда",
    shortHint: "После контакта одинаковых проводников общий заряд делится поровну.",
    misconceptionIds: ["charge-not-conserved"],
  },
  "ideal-gas-state": {
    templateId: "ideal-gas-state",
    topicId: "thermodynamics",
    helpSectionId: "gas-equation",
    skillId: "ideal-gas-state",
    focusLabel: "Уравнение состояния газа",
    shortHint: "В pV = nRT температура всегда в кельвинах.",
    misconceptionIds: ["temperature-celsius-kelvin"],
  },
  "gas-state-ratio": {
    templateId: "gas-state-ratio",
    topicId: "thermodynamics",
    helpSectionId: "gas-equation",
    skillId: "gas-state-ratio",
    focusLabel: "Связь параметров газа",
    shortHint: "Для одной массы газа используй pV/T = const и температуру в Кельвинах.",
    misconceptionIds: ["temperature-celsius-kelvin"],
  },
  "heat-amount": {
    templateId: "heat-amount",
    topicId: "thermodynamics",
    helpSectionId: "heat-amount",
    skillId: "heat-amount",
    focusLabel: "Количество теплоты",
    shortHint: "В Q = cmΔT нужны масса, теплоемкость и изменение температуры.",
    misconceptionIds: ["heat-delta-temperature"],
  },
  "heat-balance-simple": {
    templateId: "heat-balance-simple",
    topicId: "thermodynamics",
    helpSectionId: "heat-balance",
    skillId: "heat-balance-simple",
    focusLabel: "Тепловой баланс",
    shortHint: "При смешивании вода обменивается теплотой: Q_отд = Q_пол.",
    misconceptionIds: ["heat-balance-arithmetic-mean"],
  },
  "phase-change-heat": {
    templateId: "phase-change-heat",
    topicId: "thermodynamics",
    helpSectionId: "heating-melting",
    skillId: "phase-change-heat",
    focusLabel: "Нагревание и плавление",
    shortHint: "Нагрев и плавление считаются отдельными стадиями и складываются.",
    misconceptionIds: ["melting-plateau-misread", "heat-delta-temperature"],
  },
  "reflection-angle": {
    templateId: "reflection-angle",
    topicId: "optics",
    helpSectionId: "reflection",
    skillId: "reflection-angle",
    focusLabel: "Закон отражения",
    shortHint: "Угол отражения равен углу падения; оба отсчитываются от нормали.",
    misconceptionIds: ["angle-from-surface"],
  },
  "plane-mirror-separation": {
    templateId: "plane-mirror-separation",
    topicId: "optics",
    helpSectionId: "plane-mirror",
    skillId: "plane-mirror-separation",
    focusLabel: "Плоское зеркало",
    shortHint: "Между предметом и мнимым изображением — удвоенное расстояние до зеркала.",
    misconceptionIds: ["mirror-image-distance"],
  },
  "refractive-index-speed": {
    templateId: "refractive-index-speed",
    topicId: "optics",
    helpSectionId: "refractive-index",
    skillId: "refractive-index-speed",
    focusLabel: "Показатель преломления",
    shortHint: "n = c/v: скорость света в вакууме дели на скорость в среде.",
    misconceptionIds: ["refractive-index-inverted"],
  },
  "snell-index-ratio": {
    templateId: "snell-index-ratio",
    topicId: "optics",
    helpSectionId: "refraction",
    skillId: "snell-index-ratio",
    focusLabel: "Закон преломления",
    shortHint: "Отношение показателей равно отношению синусов углов от нормали.",
    misconceptionIds: ["snell-without-sines", "angle-from-surface"],
  },
  "thin-lens-image-distance": {
    templateId: "thin-lens-image-distance",
    topicId: "optics",
    helpSectionId: "thin-lens",
    skillId: "thin-lens-image-distance",
    focusLabel: "Формула тонкой линзы",
    shortHint: "Вырази d_i из 1/F = 1/d_o + 1/d_i, следи за разностью в знаменателе.",
    misconceptionIds: ["lens-equation-sign"],
  },
  "lens-optical-power": {
    templateId: "lens-optical-power",
    topicId: "optics",
    helpSectionId: "optical-power",
    skillId: "lens-optical-power",
    focusLabel: "Оптическая сила",
    shortHint: "Переведи фокусное расстояние в метры и возьми обратную величину.",
    misconceptionIds: ["diopter-unit-conversion"],
  },
  "lens-image-height": {
    templateId: "lens-image-height",
    topicId: "optics",
    helpSectionId: "magnification",
    skillId: "lens-image-height",
    focusLabel: "Увеличение линзы",
    shortHint: "Увеличение d_i/d_o умножь на высоту предмета.",
    misconceptionIds: ["magnification-inverted"],
  },
};

export function getTaskLearningMetadata(templateId: string | undefined) {
  if (!templateId) {
    return undefined;
  }

  return taskLearningMetadataByTemplateId[templateId];
}

export function getMisconceptionMetadata(misconceptionId: string | undefined) {
  if (!misconceptionId) {
    return undefined;
  }

  return misconceptionMetadataById[misconceptionId];
}
