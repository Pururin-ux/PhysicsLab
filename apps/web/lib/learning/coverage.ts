import type { TemplateId } from "../server/task-generator/generate.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import { skillMetadata, type PhysicsSectionId, type TopicId } from "./taxonomy.ts";

export type CoverageStatus = "partial" | "not-covered";

export type CoverageSection = {
  id: PhysicsSectionId;
  title: string;
  officialTaskCount: number;
  status: CoverageStatus;
  familyIds: readonly TemplateId[];
  familyCount: number;
  summary: string;
  knownGaps: readonly string[];
  catalogDestinations: readonly CoverageCatalogDestination[];
};

export type CoverageCatalogDestination = {
  id: string;
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
  verificationStatus: "verified",
  verifiedAt: "2026-09-26",
  sha256: "CC99C84E84637CDBF4A20C22E64C21F94B281A168C453294CFE35151A6E0F865",
} as const;

const examSectionOverrides: Partial<Record<TemplateId, PhysicsSectionId>> = {
  // The product keeps density with matter and thermodynamics, while the official
  // 2026 exam specification lists mass and density in Mechanics.
  "density-volume-ratio": "mechanics",
};

const catalogDestinationDefinitions: Record<
  TopicId,
  { label: string; href: string }
> = {
  measurements: { label: "Измерения", href: "/tasks?topic=measurements" },
  kinematics: { label: "Кинематика", href: "/tasks?topic=kinematics" },
  dynamics: { label: "Динамика и законы сохранения", href: "/tasks?topic=dynamics" },
  thermodynamics: { label: "Молекулярная физика и теплота", href: "/tasks?topic=thermodynamics" },
  electrodynamics: { label: "Электричество и цепи", href: "/tasks?topic=electrodynamics" },
  optics: { label: "Геометрическая оптика", href: "/tasks?topic=optics" },
  quantum: { label: "Физика атома", href: "/tasks?topic=quantum" },
} as const;

const coverageDefinitions: readonly CoverageDefinition[] = [
  {
    id: "mechanics",
    title: "Механика",
    officialTaskCount: 10,
    summary:
      "Есть задачи на движение, силы, равновесие, работу и энергию. Также можно потренировать плотность, давление, колебания и волны.",
    knownGaps: [
      "Есть базовая практика броска под углом при одинаковых высотах старта и финиша; нет широкого набора задач для разных уровней и с сопротивлением воздуха.",
      "Нет отдельного семейства задач на закон Гука и широкого набора задач на равновесие.",
    ],
  },
  {
    id: "molecular",
    title: "Основы МКТ и термодинамики",
    officialTaskCount: 7,
    summary:
      "Есть задачи о строении вещества, газах и теплоте: от влажности и фазовых переходов до первого закона термодинамики и КПД двигателя.",
    knownGaps: [
      "Нет задач на основное уравнение МКТ и среднюю квадратичную скорость молекул.",
      "Нет широкого набора задач на влажность и тепловые двигатели: по двигателям пока проверяется только энергетический счёт одного цикла.",
      "Для первого закона есть вводный баланс энергии; нужны более широкий набор процессов, графических и качественных задач.",
    ],
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    officialTaskCount: 9,
    summary:
      "Есть задачи о зарядах и электрическом поле, конденсаторах, постоянном токе и направлении магнитного поля.",
    knownGaps: [
      "Сложение электрических полей от нескольких источников пока ограничено задачами на одной прямой.",
      "Задач по электромагнитной индукции и электромагнитным колебаниям пока нет.",
      "Расчёты электрических цепей представлены не полностью.",
    ],
  },
  {
    id: "optics",
    title: "Оптика и основы СТО",
    officialTaskCount: 2,
    summary:
      "Сейчас есть отражение, преломление, плоское зеркало и тонкие линзы.",
    knownGaps: [
      "Нет задач на сферические зеркала, интерференцию и дифракцию.",
      "Нет задач по специальной теории относительности.",
    ],
  },
  {
    id: "quantum",
    title: "Основы квантовой физики",
    officialTaskCount: 1,
    summary: "Есть вводный расчёт энергии, частоты и длины волны фотона при переходе атома водорода между уровнями.",
    knownGaps: [
      "Нет задач по фотоэффекту, лазерам и другим расчётным или качественным случаям переходов между уровнями.",
    ],
  },
  {
    id: "atomic",
    title: "Атомное ядро и элементарные частицы",
    officialTaskCount: 1,
    summary: "В каталоге пока нет задач этого раздела.",
    knownGaps: [
      "Нет задач на энергию связи ядра, ядерные реакции и радиоактивный распад.",
    ],
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

    const skill = skillMetadata[destination.skillId];
    // A Grade 7 measurement skill has a school-program link, but no verified
    // CE/CT section. Keep it in practice without counting it as exam coverage.
    if (skill.topicId === "measurements") {
      continue;
    }

    const sectionId =
      examSectionOverrides[familyId] ?? skill.sectionId;
    const families = idsBySection.get(sectionId) ?? [];
    families.push(familyId);
    idsBySection.set(sectionId, families);
  }

  return coverageDefinitions.map((definition) => {
    const familyIds = idsBySection.get(definition.id) ?? [];
    const destinationsById = new Map<string, CoverageCatalogDestination>();

    for (const familyId of familyIds) {
      const destination = getLearningDestinationForFamily(familyId)!;
      const skill = skillMetadata[destination.skillId];
      const usesOfficialOverride = examSectionOverrides[familyId] !== undefined;
      const catalogDestination = catalogDestinationDefinitions[skill.topicId];
      const id = usesOfficialOverride ? `family:${familyId}` : `topic:${skill.topicId}`;
      const current = destinationsById.get(id);

      destinationsById.set(id, {
        id,
        label: usesOfficialOverride ? skill.shortTitle : catalogDestination.label,
        href: usesOfficialOverride
          ? `${destination.taskHref}?from=exam-program`
          : catalogDestination.href,
        familyCount: (current?.familyCount ?? 0) + 1,
      });
    }

    const catalogDestinations = [...destinationsById.values()];

    return {
      ...definition,
      status: familyIds.length > 0 ? "partial" : "not-covered",
      familyIds,
      familyCount: familyIds.length,
      catalogDestinations,
    };
  });
}

