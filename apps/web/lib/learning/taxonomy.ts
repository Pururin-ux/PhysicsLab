export type PhysicsSectionId =
  | "mechanics"
  | "molecular"
  | "electrodynamics"
  | "optics"
  | "quantum"
  | "atomic";

export type TopicId =
  | "kinematics"
  | "dynamics"
  | "electrodynamics"
  | "thermodynamics";

export type SkillId =
  | "vt-slope"
  | "vt-area"
  | "relative-velocity-vectors"
  | "free-fall"
  | "newton-second"
  | "friction-force"
  | "incline-force"
  | "resultant-force"
  | "resultant-force-2d"
  | "weight-lift"
  | "density-volume-ratio"
  | "impulse-momentum"
  | "inelastic-collision-speed"
  | "kinetic-energy"
  | "ohm-law"
  | "resistor-network"
  | "source-internal-resistance"
  | "capacitor-energy"
  | "charge-sharing"
  | "ideal-gas-state"
  | "heat-amount"
  | "phase-change-heat";

export type SkillMetadata = {
  id: SkillId;
  topicId: TopicId;
  sectionId: PhysicsSectionId;
  title: string;
  shortTitle: string;
  description: string;
};

export const skillMetadata: Record<SkillId, SkillMetadata> = {
  "vt-slope": {
    id: "vt-slope",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Наклон графика v(t)",
    shortTitle: "Наклон v(t)",
    description: "Ускорение как отношение изменения скорости к изменению времени.",
  },
  "vt-area": {
    id: "vt-area",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Площадь под графиком v(t)",
    shortTitle: "Площадь v(t)",
    description: "Перемещение как площадь под графиком скорости.",
  },
  "relative-velocity-vectors": {
    id: "relative-velocity-vectors",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Сложение перпендикулярных скоростей",
    shortTitle: "Сложение скоростей",
    description: "Скорость относительно берега как векторная сумма перпендикулярных скоростей.",
  },
  "free-fall": {
    id: "free-fall",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Свободное падение",
    shortTitle: "Свободное падение",
    description: "Расстояние при равноускоренном движении с g = 10 м/с².",
  },
  "newton-second": {
    id: "newton-second",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Второй закон Ньютона",
    shortTitle: "Второй закон Ньютона",
    description: "Связь равнодействующей силы, массы и ускорения.",
  },
  "friction-force": {
    id: "friction-force",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Сила трения",
    shortTitle: "Трение",
    description: "Сила трения как произведение коэффициента трения и реакции опоры.",
  },
  "incline-force": {
    id: "incline-force",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Сила на наклонной плоскости",
    shortTitle: "Наклонная плоскость",
    description: "Проекция силы тяжести вдоль наклонной плоскости.",
  },
  "resultant-force": {
    id: "resultant-force",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Равнодействующая сил",
    shortTitle: "Равнодействующая",
    description: "Сумма сил с учетом направления выбранной оси.",
  },
  "resultant-force-2d": {
    id: "resultant-force-2d",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Равнодействующая перпендикулярных сил",
    shortTitle: "Силы под углом 90°",
    description: "Равнодействующая двух взаимно перпендикулярных сил по теореме Пифагора.",
  },
  "weight-lift": {
    id: "weight-lift",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Вес тела в лифте",
    shortTitle: "Вес в лифте",
    description: "Кажущийся вес при ускорении лифта вверх или вниз.",
  },
  "density-volume-ratio": {
    id: "density-volume-ratio",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Плотность и объём",
    shortTitle: "Плотность и объём",
    description: "Масса пропорциональна произведению плотности на объём, а не ребру фигуры.",
  },
  "impulse-momentum": {
    id: "impulse-momentum",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Импульс силы",
    shortTitle: "Импульс силы",
    description: "Изменение импульса тела как произведение силы на время её действия.",
  },
  "inelastic-collision-speed": {
    id: "inelastic-collision-speed",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Неупругое столкновение",
    shortTitle: "Сцепление тележек",
    description: "Скорость сцепившихся тел через сохранение импульса системы.",
  },
  "kinetic-energy": {
    id: "kinetic-energy",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Кинетическая энергия",
    shortTitle: "Кинетическая энергия",
    description: "Энергия движения как половина произведения массы на квадрат скорости.",
  },
  "ohm-law": {
    id: "ohm-law",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Закон Ома для участка цепи",
    shortTitle: "Закон Ома",
    description: "Связь силы тока, напряжения и сопротивления участка цепи.",
  },
  "resistor-network": {
    id: "resistor-network",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Соединения резисторов",
    shortTitle: "Соединения резисторов",
    description: "Эквивалентное сопротивление при последовательном и параллельном соединении.",
  },
  "source-internal-resistance": {
    id: "source-internal-resistance",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Закон Ома для полной цепи",
    shortTitle: "Полная цепь",
    description: "Ток в цепи ограничен суммой внешнего и внутреннего сопротивлений.",
  },
  "charge-sharing": {
    id: "charge-sharing",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Деление заряда при контакте",
    shortTitle: "Деление заряда",
    description: "Заряд одинаковых проводников после контакта усредняется.",
  },
  "capacitor-energy": {
    id: "capacitor-energy",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Энергия конденсатора",
    shortTitle: "Энергия конденсатора",
    description: "Энергия электрического поля конденсатора пропорциональна квадрату напряжения.",
  },
  "ideal-gas-state": {
    id: "ideal-gas-state",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Уравнение состояния идеального газа",
    shortTitle: "Уравнение состояния газа",
    description: "Связь давления, объёма и температуры газа; температура — строго в кельвинах.",
  },
  "heat-amount": {
    id: "heat-amount",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Количество теплоты при нагревании",
    shortTitle: "Количество теплоты",
    description: "Теплота нагрева как произведение теплоёмкости, массы и изменения температуры.",
  },
  "phase-change-heat": {
    id: "phase-change-heat",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Нагревание и плавление",
    shortTitle: "Плавление",
    description: "Полная теплота при переходе через 0 °C складывается из нагрева и плавления.",
  },
};
