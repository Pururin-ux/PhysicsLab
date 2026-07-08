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
  "melting-plateau-misread": {
    id: "melting-plateau-misread",
    label: "смешивает нагрев и плавление",
    helpSectionId: "heating-melting",
    shortHint: "Нагрев и плавление считаются разными стадиями и складываются.",
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
  "heat-amount": {
    templateId: "heat-amount",
    topicId: "thermodynamics",
    helpSectionId: "heat-amount",
    skillId: "heat-amount",
    focusLabel: "Количество теплоты",
    shortHint: "В Q = cmΔT нужны масса, теплоемкость и изменение температуры.",
    misconceptionIds: ["heat-delta-temperature"],
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
