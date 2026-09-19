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
  verifiedAt: "2026-09-13",
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
    officialTaskCount: 10,
    summary:
      "Сейчас есть прямолинейное движение и движение по окружности, силы, тяготение, равновесие, импульс, работа, КПД, мощность, кинетическая и потенциальная энергия, плотность, давление на опору и давление жидкости.",
    knownGaps: [
      "Есть базовая практика броска под углом при одинаковых высотах старта и финиша; нет широкого набора задач для разных уровней и с сопротивлением воздуха.",
      "Нет отдельного семейства задач на закон Гука и широкого набора задач на равновесие.",
      "Нет задач на колебания и волны.",
    ],
  },
  {
    id: "molecular",
    title: "Основы МКТ и термодинамики",
    officialTaskCount: 7,
    summary:
      "Сейчас есть МКТ, идеальный газ и изопроцессы, строение жидкостей и пара, влажность, нагревание, плавление, парообразование и простой тепловой баланс.",
    knownGaps: [
      "Нет задач на основное уравнение МКТ и среднюю квадратичную скорость молекул.",
      "Нет широкого набора задач на влажность и тепловые двигатели.",
      "Первый закон термодинамики и изопроцессы представлены не полностью.",
    ],
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    officialTaskCount: 9,
    summary:
      "Сейчас есть заряд, постоянный ток, соединения резисторов, полная цепь, мощность и конденсатор.",
    knownGaps: [
      "Нет задач на закон Кулона, напряжённость и потенциал электрического поля.",
      "Нет задач на магнитное поле, индукцию и электромагнитные колебания.",
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
    summary: "В каталоге пока нет задач этого раздела.",
    knownGaps: [
      "Нет задач на фотоэффект, фотоны, постулаты Бора, излучение и поглощение света атомом.",
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

    const sectionId =
      examSectionOverrides[familyId] ?? skillMetadata[destination.skillId].sectionId;
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

