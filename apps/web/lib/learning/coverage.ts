import type { TemplateId } from "../server/task-generator/generate.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import { skillMetadata, type PhysicsSectionId, type TopicId } from "./taxonomy.ts";

export type CoverageStatus = "partial" | "not-covered";

export type CoverageSection = {
  id: PhysicsSectionId;
  title: string;
  status: CoverageStatus;
  familyIds: readonly TemplateId[];
  familyCount: number;
  summary: string;
  knownGaps: readonly string[];
  catalogDestinations: readonly CoverageCatalogDestination[];
};

export type CoverageCatalogDestination = {
  topicId: TopicId;
  label: string;
  href: string;
  familyCount: number;
};

type CoverageDefinition = Omit<
  CoverageSection,
  "familyIds" | "familyCount" | "catalogDestinations" | "status"
>;

export const EXAM_PROGRAM_SOURCE = {
  label: "Спецификация экзаменационной работы по физике ЦЭ/ЦТ 2026",
  organization: "Республиканский институт контроля знаний",
  url: "https://rikc.by/ru/specification/2026/03.pdf",
  verificationStatus: "pending",
  lastAccessAttempt: "08.09.2026",
} as const;

const catalogDestinationDefinitions: Record<
  TopicId,
  { label: string; href: string }
> = {
  kinematics: { label: "Кинематика", href: "/tasks?topic=kinematics" },
  dynamics: { label: "Динамика и законы сохранения", href: "/tasks?topic=dynamics" },
  thermodynamics: { label: "Молекулярная физика и теплота", href: "/tasks?topic=thermodynamics" },
  electrodynamics: { label: "Электричество и цепи", href: "/tasks?topic=electrodynamics" },
  optics: { label: "Геометрическая оптика", href: "/tasks?topic=optics" },
} as const;

const coverageDefinitions: readonly CoverageDefinition[] = [
  {
    id: "mechanics",
    title: "Механика",
    summary: "Кинематика и динамика: движение, силы, энергия и импульс.",
    knownGaps: [
      "Не все темы официальной программы представлены отдельными типами задач.",
      "Задач на колебания и волны пока нет.",
    ],
  },
  {
    id: "molecular",
    title: "Молекулярная физика и термодинамика",
    summary: "Идеальный газ, нагревание, плавление и тепловой баланс.",
    knownGaps: [
      "Задачи на графики газовых процессов пока есть не для всех случаев.",
      "Некоторые виды задач этого раздела пока недоступны.",
    ],
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    summary: "Постоянный ток, цепи, заряд и конденсатор.",
    knownGaps: [
      "Задач на магнитное поле и электромагнитную индукцию пока нет.",
      "Не все типы электрических цепей представлены.",
    ],
  },
  {
    id: "optics",
    title: "Оптика",
    summary: "Отражение, преломление и базовые задачи на линзы.",
    knownGaps: [
      "Пока доступны только базовые задачи геометрической оптики.",
      "Задач по волновой оптике пока нет.",
    ],
  },
  {
    id: "quantum",
    title: "Квантовая физика",
    summary: "В каталоге пока нет задач этого раздела.",
    knownGaps: ["Для этого раздела ещё нет задач и учебных объяснений."],
  },
  {
    id: "atomic",
    title: "Атомная и ядерная физика",
    summary: "В каталоге пока нет задач этого раздела.",
    knownGaps: ["Для этого раздела ещё нет задач и учебных объяснений."],
  },
];

export function buildCoverageSections(
  catalogFamilyIds: readonly TemplateId[],
): readonly CoverageSection[] {
  const idsBySection = new Map<PhysicsSectionId, TemplateId[]>();

  for (const familyId of catalogFamilyIds) {
    const destination = getLearningDestinationForFamily(familyId);
    if (!destination) {
      throw new Error(`Catalog family "${familyId}" has no learning destination.`);
    }

    const sectionId = skillMetadata[destination.skillId].sectionId;
    const families = idsBySection.get(sectionId) ?? [];
    families.push(familyId);
    idsBySection.set(sectionId, families);
  }

  return coverageDefinitions.map((definition) => {
    const familyIds = idsBySection.get(definition.id) ?? [];
    const familyCountsByTopic = new Map<TopicId, number>();

    for (const familyId of familyIds) {
      const destination = getLearningDestinationForFamily(familyId)!;
      const topicId = skillMetadata[destination.skillId].topicId;
      familyCountsByTopic.set(topicId, (familyCountsByTopic.get(topicId) ?? 0) + 1);
    }

    const catalogDestinations = [...familyCountsByTopic.entries()].map(
      ([topicId, familyCount]) => {
        const catalogDestination = catalogDestinationDefinitions[topicId];

        return {
          topicId,
          label: catalogDestination.label,
          href: catalogDestination.href,
          familyCount,
        };
      },
    );

    return {
      ...definition,
      status: familyIds.length > 0 ? "partial" : "not-covered",
      familyIds,
      familyCount: familyIds.length,
      catalogDestinations,
    };
  });
}

