import { skillMetadata, type TopicId } from "./learning/taxonomy.ts";

type ProductTopic = {
  id: TopicId;
  title: string;
  description: string;
  learnHref: string;
  learnLabel?: string;
  practiceHref: string;
  /** Default topic route kept for existing progress and recommendation links. */
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
    description: "Как график скорости показывает ускорение движения.",
    learnHref: "/practice/kinematics-lesson",
    practiceHref: "/practice/family/vt-slope",
    href: "/practice/kinematics-lesson",
    skillsCount: getSkillsCount("kinematics"),
    modeLabel: "графики движения",
  },
  {
    id: "dynamics",
    title: "Динамика",
    description: "Как сила и масса меняют движение тела.",
    learnHref: "/practice/dynamics-lesson",
    practiceHref: "/practice/family/newton-second",
    href: "/practice/dynamics-lesson",
    skillsCount: getSkillsCount("dynamics"),
    modeLabel: "силы и движение",
  },
  {
    id: "electrodynamics",
    title: "Электричество",
    description: "Ток, напряжение и сопротивление в простой цепи.",
    learnHref: "/practice/electro-lesson",
    practiceHref: "/practice/family/ohm-law",
    href: "/practice/electro-lesson",
    skillsCount: getSkillsCount("electrodynamics"),
    modeLabel: "цепи и заряды",
  },
  {
    id: "thermodynamics",
    title: "Молекулярная физика и термодинамика",
    description: "Плотность вещества и связь массы с объёмом.",
    learnHref: "/practice/density-lesson",
    learnLabel: "Начать с основы",
    practiceHref: "/practice/family/density-volume-ratio",
    href: "/practice/density-lesson",
    skillsCount: getSkillsCount("thermodynamics"),
    modeLabel: "масса и объём",
  },
  {
    id: "optics",
    title: "Оптика",
    description: "Падающий и отражённый лучи: откуда считать угол.",
    learnHref: "/practice/optics-lesson",
    practiceHref: "/practice/family/reflection-angle",
    href: "/practice/optics-lesson",
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
