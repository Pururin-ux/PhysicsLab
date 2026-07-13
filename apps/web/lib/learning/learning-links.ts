import type { TemplateId } from "../server/task-generator/generate.ts";
import { formulaReference, type FormulaReferenceEntry } from "../physics/formula-reference.ts";
import { getReferenceSolution } from "./reference-solutions.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata, type SkillId } from "./taxonomy.ts";
import { topics } from "../topics.ts";

export type TaskHref = `/tasks/${TemplateId}`;
export type PracticeHref = `/practice/family/${TemplateId}`;
export type FormulaHref = `/formulas?formula=${string}`;

export type LearningDestination = {
  skillId: SkillId;
  familyId: TemplateId;
  taskHref: TaskHref;
  practiceHref: PracticeHref;
  formulaIds: readonly string[];
  hasReferenceSolution: boolean;
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

  return {
    skillId,
    familyId,
    taskHref: buildTaskHref(familyId),
    practiceHref: buildPracticeHref(familyId),
    formulaIds: getFormulaEntriesForSkill(skillId).map((entry) => entry.id),
    hasReferenceSolution: Boolean(getReferenceSolution(familyId)),
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
