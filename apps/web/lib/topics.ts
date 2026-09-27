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
    id: "measurements",
    title: "Измерения",
    description: "Как читать шкалу прибора, согласовать единицы и найти объём.",
    learnHref: "/learn/reading-scales",
    practiceHref: "/practice/family/graduated-scale-reading",
    href: "/learn/reading-scales",
    skillsCount: getSkillsCount("measurements"),
    modeLabel: "приборы и единицы",
  },
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
  {
    id: "quantum",
    title: "Физика атома",
    description: "Почему атом водорода излучает свет отдельных частот.",
    learnHref: "/learn/bohr-transitions",
    learnLabel: "Разобраться в спектре",
    practiceHref: "/practice/family/bohr-transition-radiation",
    href: "/learn/bohr-transitions",
    skillsCount: getSkillsCount("quantum"),
    modeLabel: "уровни и спектры",
  },
] as const satisfies readonly ProductTopic[];

export const upcomingTopics = [] as const;
