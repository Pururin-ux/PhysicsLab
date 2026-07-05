export const topics = [
  {
    id: "kinematics",
    title: "Кинематика",
    description: "Скорость, ускорение, перемещение и чтение графиков движения.",
    href: "/practice/kinematics-demo",
    skillsCount: 3,
    modeLabel: "графики движения",
  },
  {
    id: "dynamics",
    title: "Динамика",
    description: "Силы, трение, наклонная плоскость, импульс и плотность тел.",
    href: "/practice/dynamics-demo",
    skillsCount: 7,
    modeLabel: "силы и движение",
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    description: "Постоянный ток, закон Ома и деление заряда между проводниками.",
    href: "/practice/electro-demo",
    skillsCount: 2,
    modeLabel: "цепи и заряды",
  },
  {
    id: "thermodynamics",
    title: "Молекулярная физика и термодинамика",
    description: "Уравнение состояния газа и количество теплоты при нагревании.",
    href: "/practice/thermo-demo",
    skillsCount: 2,
    modeLabel: "газы и теплота",
  },
] as const;

// Отдельный список: эти темы не попадают в progress-store и не имеют задач.
export const upcomingTopics = [
  {
    id: "optics",
    title: "Оптика",
    description: "Отражение, преломление и построение изображений.",
    reviewStatus: "needs-physics-review",
  },
] as const;
