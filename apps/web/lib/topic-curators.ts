export type TopicCurator = {
  src: string;
  alt: string;
  sectionLabel: string;
  note: string;
  imageClassName: string;
};

const curators = {
  mechanics: {
    src: "/art/production/curator-mechanics.webp",
    alt: "Кот-куратор механики",
    sectionLabel: "Механика",
    note: "Сначала выбери ось и расставь знаки скорости и ускорения.",
    imageClassName: "",
  },
  electricity: {
    src: "/art/production/curator-electricity.webp",
    alt: "Кот-куратор электричества",
    sectionLabel: "Электричество",
    note: "Отметь, что соединено последовательно, а что параллельно.",
    imageClassName: "",
  },
  optics: {
    src: "/art/production/curator-optics.webp",
    alt: "Кот-куратор оптики",
    sectionLabel: "Оптика",
    note: "Углы отражения и преломления отсчитывай от нормали.",
    imageClassName: "",
  },
  thermodynamics: {
    src: "/art/production/curator-thermodynamics.webp",
    alt: "Кот-куратор термодинамики",
    sectionLabel: "Термодинамика",
    note: "Температуру газа подставляй в формулы только в кельвинах.",
    imageClassName: "",
  },
} satisfies Record<string, TopicCurator>;

export const formulaCuratorByGroup = {
  kinematics: curators.mechanics,
  dynamics: {
    ...curators.mechanics,
    note: "Нарисуй все силы. В F = ma входит их равнодействующая.",
  },
  electrodynamics: curators.electricity,
  optics: curators.optics,
  thermodynamics: curators.thermodynamics,
} satisfies Record<string, TopicCurator>;

