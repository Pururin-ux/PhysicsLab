export type PhysicsSectionId =
  | "mechanics"
  | "molecular"
  | "electrodynamics"
  | "optics"
  | "quantum"
  | "atomic";

export type TopicId = "kinematics" | "dynamics";

export type SkillId =
  | "vt-slope"
  | "vt-area"
  | "free-fall"
  | "newton-second"
  | "friction-force"
  | "incline-force"
  | "resultant-force"
  | "weight-lift";

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
  "weight-lift": {
    id: "weight-lift",
    topicId: "dynamics",
    sectionId: "mechanics",
    title: "Вес тела в лифте",
    shortTitle: "Вес в лифте",
    description: "Кажущийся вес при ускорении лифта вверх или вниз.",
  },
};
