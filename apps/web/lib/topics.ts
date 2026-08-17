import { skillMetadata, type TopicId } from "./learning/taxonomy.ts";

type ProductTopic = {
  id: TopicId;
  title: string;
  description: string;
  href: string;
  skillsCount: number;
  modeLabel: string;
};

function getSkillsCount(topicId: TopicId) {
  return Object.values(skillMetadata).filter((skill) => skill.topicId === topicId)
    .length;
}

export const topics = [
  {
    id: "kinematics",
    title: "Кинематика",
    description: "Скорость, ускорение, перемещение и чтение графиков движения.",
    href: "/practice/kinematics-demo",
    skillsCount: getSkillsCount("kinematics"),
    modeLabel: "графики движения",
  },
  {
    id: "dynamics",
    title: "Динамика",
    description: "Силы, трение, наклонная плоскость, импульс и плотность тел.",
    href: "/practice/dynamics-demo",
    skillsCount: getSkillsCount("dynamics"),
    modeLabel: "силы и движение",
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    description: "Постоянный ток, закон Ома и деление заряда между проводниками.",
    href: "/practice/electro-demo",
    skillsCount: getSkillsCount("electrodynamics"),
    modeLabel: "цепи и заряды",
  },
  {
    id: "thermodynamics",
    title: "Молекулярная физика и термодинамика",
    description: "Уравнение состояния газа и количество теплоты при нагревании.",
    href: "/practice/thermo-demo",
    skillsCount: getSkillsCount("thermodynamics"),
    modeLabel: "газы и теплота",
  },
  {
    id: "optics",
    title: "Оптика",
    description: "Отражение, плоское зеркало, преломление и собирающая линза с диаграммами.",
    href: "/practice/optics-demo",
    skillsCount: getSkillsCount("optics"),
    modeLabel: "лучи и линзы",
  },
] as const satisfies readonly ProductTopic[];

// Отдельный список: эти темы не попадают в progress-store и не имеют задач.
export const upcomingTopics = [
  {
    id: "quantum",
    title: "Атомная и квантовая физика",
    description: "Фотоэффект, спектры и ядерные превращения.",
    reviewStatus: "needs-physics-review",
  },
] as const;
