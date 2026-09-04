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
    note: "Знаки скорости и ускорения зависят от выбранного направления оси.",
    imageClassName: "",
  },
  electricity: {
    src: "/art/production/topic-electricity.webp",
    alt: "Электрическая цепь с батареей, лампой и катушкой",
    sectionLabel: "Электричество",
    note: "Отметь, что соединено последовательно, а что параллельно.",
    imageClassName: "",
  },
  optics: {
    src: "/art/production/topic-optics.webp",
    alt: "Луч света проходит через призму и раскладывается в спектр",
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
