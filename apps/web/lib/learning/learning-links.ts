import type { TemplateId } from "../server/task-generator/generate.ts";
import { formulaReference, type FormulaReferenceEntry } from "../physics/formula-reference.ts";
import { getReferenceSolution } from "./reference-solutions.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata, type SkillId } from "./taxonomy.ts";
import { topics } from "../topics.ts";

export type TaskHref = `/tasks/${TemplateId}`;
export type PracticeHref = `/practice/family/${TemplateId}`;
export type FormulaHref = `/formulas?formula=${string}`;

type ExactExplanation = { href: string; label: string; chapterId?: string };

// Only routes that explain this exact family; broader topics are not substitutes.
const explanationByFamily: Partial<Record<TemplateId, ExactExplanation>> = {
  "archimedes-force": { href: "/learn/archimedes-force?practice=archimedes-force", chapterId: "archimedes-force", label: "Почему жидкость выталкивает тело" },
  "average-speed-segments": { href: "/learn/average-speed?practice=average-speed-segments", chapterId: "average-speed", label: "Как найти среднюю скорость" },
  "average-speed-with-stop": { href: "/learn/uneven-motion?practice=average-speed-with-stop", chapterId: "uneven-motion", label: "Почему остановка входит во время" },
  "uniform-motion-basic": { href: "/learn/uniform-motion?practice=uniform-motion-basic", chapterId: "uniform-motion", label: "Как связаны путь, скорость и время" },
  "uniform-motion-graphs": { href: "/learn/uniform-motion-graphs?practice=uniform-motion-graphs", chapterId: "uniform-motion-graphs", label: "Как читать графики равномерного движения" },
  "gravity-force": { href: "/learn/gravity-elasticity-weight?practice=gravity-force", chapterId: "gravity-elasticity-weight", label: "Как связаны масса и сила тяжести" },
  "resultant-force": { href: "/learn/resultant-force-and-friction?practice=resultant-force", chapterId: "resultant-force-and-friction", label: "Как складывать силы на одной прямой" },
  "hydrostatic-pressure": { href: "/learn/hydrostatic-pressure?practice=hydrostatic-pressure", chapterId: "hydrostatic-pressure", label: "Почему давление растёт с глубиной" },
  "work-force-distance": { href: "/learn/mechanical-work?practice=work-force-distance", chapterId: "mechanical-work", label: "Когда работа силы положительна или отрицательна" },
  "mechanical-power": { href: "/learn/mechanical-power?practice=mechanical-power", chapterId: "mechanical-power", label: "Как сравнивать быстроту совершения работы" },
  "mechanical-efficiency": { href: "/learn/mechanical-efficiency?practice=mechanical-efficiency", chapterId: "mechanical-efficiency", label: "Как отличить полезную работу от полной" },
  "kinetic-energy": { href: "/learn/kinetic-energy?practice=kinetic-energy", chapterId: "kinetic-energy", label: "Почему скорость входит в квадрате" },
  "gravitational-potential-energy": { href: "/learn/potential-energy?practice=gravitational-potential-energy", chapterId: "potential-energy", label: "Почему нужен нулевой уровень энергии" },
  "mechanical-energy-conservation": { href: "/learn/mechanical-energy-conservation?practice=mechanical-energy-conservation", chapterId: "mechanical-energy-conservation", label: "Как энергия движения превращается в энергию высоты" },
  "density-volume-ratio": { href: "/learn/density?practice=density-volume-ratio", chapterId: "density", label: "Как связаны масса, объём и плотность" },
  "contact-pressure": { href: "/learn/pressure?practice=contact-pressure", chapterId: "pressure", label: "Как сила и площадь влияют на давление" },
  "relative-velocity-vectors": { href: "/learn/relative-motion?practice=relative-velocity-vectors", chapterId: "relative-motion", label: "Как складывать скорости" },
  "vt-slope": { href: "/learn/acceleration?practice=vt-slope", chapterId: "acceleration", label: "Как найти ускорение по графику скорости" },
  "newton-second": { href: "/learn/newton-second-law?practice=newton-second", chapterId: "newton-second-law", label: "Как сила и масса определяют ускорение" },
  "ohm-law": { href: "/learn/electric-current-and-ohms-law?practice=ohm-law", chapterId: "electric-current-and-ohms-law", label: "Как связаны ток, напряжение и сопротивление" },
  "reflection-angle": { href: "/learn/reflection-of-light?practice=reflection-angle", chapterId: "reflection-of-light", label: "Откуда считать углы падения и отражения" },
  "heat-amount": { href: "/learn/heat-amount-and-balance?practice=heat-amount", chapterId: "heat-amount-and-balance", label: "От чего зависит количество теплоты" },
  "heat-balance-simple": { href: "/learn/heat-amount-and-balance?practice=heat-balance-simple", chapterId: "heat-amount-and-balance", label: "Как составить тепловой баланс" },
  "fuel-combustion-heat": { href: "/learn/fuel-combustion?practice=fuel-combustion-heat", chapterId: "fuel-combustion", label: "Как масса и вид топлива определяют выделившуюся теплоту" },
  "phase-change-heat": { href: "/learn/melting-and-crystallization?practice=phase-change-heat", chapterId: "melting-and-crystallization", label: "Как разделить нагревание и плавление" },
  "vaporization-heat": { href: "/learn/evaporation-and-boiling?practice=vaporization-heat", chapterId: "evaporation-and-boiling", label: "Как разделить нагревание и парообразование" },
};

export type LearningDestination = {
  skillId: SkillId;
  familyId: TemplateId;
  taskHref: TaskHref;
  practiceHref: PracticeHref;
  formulaIds: readonly string[];
  hasReferenceSolution: boolean;
  explanation: { href: string; label: string } | null;
};

export type RelatedTask = Pick<
  LearningDestination,
  "familyId" | "taskHref" | "practiceHref" | "hasReferenceSolution"
> & {
  title: string;
  topicLabel: string;
};

export type FormulaReferenceViewEntry = FormulaReferenceEntry & {
  relatedTasks: readonly RelatedTask[];
};

export type FormulaReferenceViewGroup = Omit<
  (typeof formulaReference)[number],
  "entries"
> & {
  entries: readonly FormulaReferenceViewEntry[];
};

function isSkillId(value: string): value is SkillId {
  return value in skillMetadata;
}

function isTemplateId(value: string): value is TemplateId {
  return value in taskLearningMetadataByTemplateId;
}

function buildSkillToFamilyMap(): ReadonlyMap<SkillId, TemplateId> {
  const links = new Map<SkillId, TemplateId>();

  for (const [templateId, metadata] of Object.entries(taskLearningMetadataByTemplateId)) {
    if (!isTemplateId(templateId) || !isSkillId(metadata.skillId)) {
      continue;
    }

    if (links.has(metadata.skillId)) {
      throw new Error(`More than one task family is mapped to skill "${metadata.skillId}".`);
    }

    links.set(metadata.skillId, templateId);
  }

  return links;
}

const familyBySkill = buildSkillToFamilyMap();
const formulaEntries = formulaReference.flatMap((group) => group.entries);
const formulaById = new Map(formulaEntries.map((entry) => [entry.id, entry]));

function topicLabelForSkill(skillId: SkillId): string {
  const topic = topics.find((entry) => entry.id === skillMetadata[skillId].topicId);
  if (!topic) {
    throw new Error(`Learning skill "${skillId}" has an unknown topic.`);
  }

  return topic.title;
}

export function buildTaskHref(familyId: TemplateId): TaskHref {
  return `/tasks/${familyId}`;
}

export function buildPracticeHref(familyId: TemplateId): PracticeHref {
  return `/practice/family/${familyId}`;
}

export function buildFormulaHref(formulaId: string): FormulaHref {
  return `/formulas?formula=${encodeURIComponent(formulaId)}`;
}

export function getFamilyForSkill(skillId: string): TemplateId | null {
  return isSkillId(skillId) ? familyBySkill.get(skillId) ?? null : null;
}

export function getChapterPracticeReturn(chapterId: string, familyId: string) {
  if (!isTemplateId(familyId) || explanationByFamily[familyId]?.chapterId !== chapterId) return null;
  const skillId = taskLearningMetadataByTemplateId[familyId].skillId;
  if (!isSkillId(skillId)) return null;
  return { href: buildPracticeHref(familyId), label: skillMetadata[skillId].shortTitle };
}

export function getFormulaEntriesForSkill(skillId: string): readonly FormulaReferenceEntry[] {
  if (!isSkillId(skillId)) {
    return [];
  }

  return formulaEntries.filter((entry) => entry.relatedSkillIds.includes(skillId));
}

export function getFormulaEntry(formulaId: string): FormulaReferenceEntry | null {
  return formulaById.get(formulaId) ?? null;
}

export function getLearningDestination(skillId: string): LearningDestination | null {
  if (!isSkillId(skillId)) {
    return null;
  }

  const familyId = getFamilyForSkill(skillId);
  if (!familyId) {
    return null;
  }

  const explanation = explanationByFamily[familyId];

  return {
    skillId,
    familyId,
    taskHref: buildTaskHref(familyId),
    practiceHref: buildPracticeHref(familyId),
    formulaIds: getFormulaEntriesForSkill(skillId).map((entry) => entry.id),
    hasReferenceSolution: Boolean(getReferenceSolution(familyId)),
    explanation: explanation ? { href: explanation.href, label: explanation.label } : null,
  };
}

export function getLearningDestinationForFamily(familyId: string): LearningDestination | null {
  if (!isTemplateId(familyId)) {
    return null;
  }

  const metadata = taskLearningMetadataByTemplateId[familyId];
  return getLearningDestination(metadata.skillId);
}

export function getFormulaReferenceView(): readonly FormulaReferenceViewGroup[] {
  return formulaReference.map((group) => ({
    ...group,
    entries: group.entries.map((entry) => ({
      ...entry,
      relatedTasks: entry.relatedSkillIds.flatMap((skillId) => {
        const destination = getLearningDestination(skillId);
        if (!destination) {
          return [];
        }

        const metadata = taskLearningMetadataByTemplateId[destination.familyId];
        return [{
          ...destination,
          title: metadata.focusLabel,
          topicLabel: topicLabelForSkill(skillId),
        }];
      }),
    })),
  }));
}

export function getKnownLearningSkillIds(): readonly SkillId[] {
  return Object.keys(skillMetadata) as SkillId[];
}
