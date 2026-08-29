import type { TemplateId } from "../server/task-generator/generate.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import { skillMetadata, type PhysicsSectionId } from "./taxonomy.ts";

export type CoverageStatus = "partial" | "not-covered";

export type CoverageSection = {
  id: PhysicsSectionId;
  title: string;
  status: CoverageStatus;
  familyIds: readonly TemplateId[];
  familyCount: number;
  summary: string;
  knownGaps: readonly string[];
};

type CoverageDefinition = Omit<CoverageSection, "familyIds" | "familyCount">;

const coverageDefinitions: readonly CoverageDefinition[] = [
  {
    id: "mechanics",
    title: "Механика",
    status: "partial",
    summary:
      "Кинематика, динамика и механические колебания: движение, силы, энергия, импульс и волны.",
    knownGaps: [
      "Не все темы официальной программы представлены отдельными типами задач.",
      "Статика, момент силы и гидростатика пока не покрыты.",
    ],
  },
  {
    id: "molecular",
    title: "Молекулярная физика и термодинамика",
    status: "partial",
    summary: "Идеальный газ, нагревание, плавление и тепловой баланс.",
    knownGaps: [
      "Нет полного набора графических процессов.",
      "Не все классы задач раздела представлены.",
    ],
  },
  {
    id: "electrodynamics",
    title: "Электродинамика",
    status: "partial",
    summary:
      "Постоянный ток, цепи, заряд, конденсатор, электростатика, магнитное поле и индукция.",
    knownGaps: [
      "Напряжённость поля и потенциал пока не покрыты отдельными задачами.",
      "Переменный ток и колебательный контур в каталоге отсутствуют.",
    ],
  },
  {
    id: "optics",
    title: "Оптика",
    status: "partial",
    summary: "Отражение, преломление и базовые задачи на линзы.",
    knownGaps: [
      "Оптика v1 ограничена базовыми моделями.",
      "Волновая оптика пока не покрыта.",
    ],
  },
  {
    id: "quantum",
    title: "Квантовая физика",
    status: "partial",
    summary: "Энергия фотона и уравнение фотоэффекта.",
    knownGaps: [
      "Нет задач на спектры, уровни энергии и красную границу фотоэффекта.",
      "Волновые свойства частиц не покрыты.",
    ],
  },
  {
    id: "atomic",
    title: "Атомная и ядерная физика",
    status: "partial",
    summary: "Состав ядра и закон радиоактивного распада.",
    knownGaps: [
      "Нет задач на дефект масс и энергию связи.",
      "Ядерные реакции и цепная реакция не покрыты.",
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

    const sectionId = skillMetadata[destination.skillId].sectionId;
    const families = idsBySection.get(sectionId) ?? [];
    families.push(familyId);
    idsBySection.set(sectionId, families);
  }

  return coverageDefinitions.map((definition) => {
    const familyIds = idsBySection.get(definition.id) ?? [];
    return { ...definition, familyIds, familyCount: familyIds.length };
  });
}
