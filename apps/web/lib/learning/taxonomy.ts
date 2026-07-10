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
  | "thermodynamics"
  | "optics";

export type SkillId =
  | "vt-slope"
  | "vt-area"
  | "relative-velocity-vectors"
  | "free-fall"
  | "average-speed-segments"
  | "unit-conversion-speed"
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
  | "work-force-distance"
  | "ohm-law"
  | "resistor-network"
  | "source-internal-resistance"
  | "capacitor-energy"
  | "electric-power"
  | "charge-sharing"
  | "ideal-gas-state"
  | "gas-state-ratio"
  | "heat-amount"
  | "heat-balance-simple"
  | "phase-change-heat"
  | "reflection-angle"
  | "plane-mirror-separation"
  | "refractive-index-speed"
  | "snell-index-ratio"
  | "thin-lens-image-distance"
  | "lens-optical-power"
  | "lens-image-height";

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
  "average-speed-segments": {
    id: "average-speed-segments",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Средняя скорость на участках",
    shortTitle: "Средняя скорость",
    description: "Средняя скорость как весь путь, деленный на все время движения.",
  },
  "unit-conversion-speed": {
    id: "unit-conversion-speed",
    topicId: "kinematics",
    sectionId: "mechanics",
    title: "Перевод скорости км/ч в м/с",
    shortTitle: "Единицы скорости",
    description: "Перевод скорости и времени к согласованным единицам перед расчетом пути.",
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
  "work-force-distance": {
    id: "work-force-distance",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Работа постоянной силы",
    shortTitle: "Работа силы",
    description: "Работа силы как произведение силы, пути и косинуса угла между ними.",
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
  "electric-power": {
    id: "electric-power",
    topicId: "electrodynamics",
    sectionId: "electrodynamics",
    title: "Мощность электрического тока",
    shortTitle: "Мощность тока",
    description: "Мощность участка цепи через ток, напряжение и сопротивление.",
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
  "gas-state-ratio": {
    id: "gas-state-ratio",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Связь параметров газа",
    shortTitle: "Параметры газа",
    description: "Изменение давления, объема и температуры одной массы идеального газа.",
  },
  "heat-balance-simple": {
    id: "heat-balance-simple",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Тепловой баланс при смешивании",
    shortTitle: "Тепловой баланс",
    description: "Температура смеси из равенства отданной и полученной теплоты.",
  },
  "phase-change-heat": {
    id: "phase-change-heat",
    topicId: "thermodynamics",
    sectionId: "molecular",
    title: "Нагревание и плавление",
    shortTitle: "Плавление",
    description: "Полная теплота при переходе через 0 °C складывается из нагрева и плавления.",
  },
  "reflection-angle": {
    id: "reflection-angle",
    topicId: "optics",
    sectionId: "optics",
    title: "Закон отражения света",
    shortTitle: "Отражение",
    description: "Угол отражения равен углу падения; оба отсчитываются от нормали к зеркалу.",
  },
  "plane-mirror-separation": {
    id: "plane-mirror-separation",
    topicId: "optics",
    sectionId: "optics",
    title: "Изображение в плоском зеркале",
    shortTitle: "Плоское зеркало",
    description: "Мнимое изображение симметрично предмету: расстояние предмет—изображение равно 2d.",
  },
  "refractive-index-speed": {
    id: "refractive-index-speed",
    topicId: "optics",
    sectionId: "optics",
    title: "Показатель преломления через скорость света",
    shortTitle: "Показатель преломления",
    description: "Показатель преломления как отношение скорости света в вакууме к скорости в среде.",
  },
  "snell-index-ratio": {
    id: "snell-index-ratio",
    topicId: "optics",
    sectionId: "optics",
    title: "Закон преломления света",
    shortTitle: "Закон преломления",
    description: "Отношение показателей преломления равно отношению синусов углов падения и преломления.",
  },
  "thin-lens-image-distance": {
    id: "thin-lens-image-distance",
    topicId: "optics",
    sectionId: "optics",
    title: "Формула тонкой линзы",
    shortTitle: "Тонкая линза",
    description: "Расстояние до действительного изображения собирающей линзы из формулы 1/F = 1/d_o + 1/d_i.",
  },
  "lens-optical-power": {
    id: "lens-optical-power",
    topicId: "optics",
    sectionId: "optics",
    title: "Оптическая сила линзы",
    shortTitle: "Оптическая сила",
    description: "Оптическая сила в диоптриях как 1/F при фокусном расстоянии в метрах.",
  },
  "lens-image-height": {
    id: "lens-image-height",
    topicId: "optics",
    sectionId: "optics",
    title: "Линейное увеличение линзы",
    shortTitle: "Увеличение линзы",
    description: "Модуль высоты изображения через отношение расстояний d_i/d_o и высоту предмета.",
  },
};
