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
  {
    id: "oscillations",
    title: "Колебания и волны",
    description: "Период и частота, длина волны и скорость её распространения, эхо и эхолот.",
    href: "/practice/oscillations-demo",
    skillsCount: getSkillsCount("oscillations"),
    modeLabel: "ритм и волны",
  },
  {
    id: "quantum",
    title: "Квантовая и атомная физика",
    description: "Энергия фотона, уравнение фотоэффекта, радиоактивный распад и состав ядра.",
    href: "/practice/quantum-demo",
    skillsCount: getSkillsCount("quantum"),
    modeLabel: "фотоны и ядра",
  },
] as const satisfies readonly ProductTopic[];

// Отдельный список: разделы программы, для которых задач в каталоге ещё нет.
// Они не попадают в progress-store и не имеют страницы урока.
export const upcomingTopics = [
  {
    id: "hydrostatics",
    title: "Гидростатика",
    description: "Давление столба жидкости, сообщающиеся сосуды и сила Архимеда.",
    reviewStatus: "planned",
  },
  {
    id: "statics",
    title: "Статика и момент силы",
    description: "Равновесие рычага, правило моментов и центр тяжести.",
    reviewStatus: "planned",
  },
  {
    id: "ac-current",
    title: "Переменный ток",
    description: "Действующие значения, трансформатор и колебательный контур.",
    reviewStatus: "planned",
  },
  {
    id: "wave-optics",
    title: "Волновая оптика",
    description: "Интерференция, дифракционная решётка и поляризация света.",
    reviewStatus: "planned",
  },
] as const;
