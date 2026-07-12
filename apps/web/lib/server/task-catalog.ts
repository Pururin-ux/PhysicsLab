import {
  getBlueprint,
  getDifficultyCounts,
  templateRegistry,
  type TemplateId,
} from "./task-generator/generate.ts";
import {
  getTaskLearningMetadata,
} from "../learning/task-metadata.ts";
import { topicHelpSections } from "../learning/topic-help.ts";
import type {
  ExamSectionId,
  TaskTypeCatalogEntry,
  TaskVisualKind,
} from "../learning/task-catalog.ts";
import type { TopicId } from "../learning/taxonomy.ts";
import { topics } from "../topics.ts";

const examSectionByTopic: Record<TopicId, ExamSectionId> = {
  kinematics: "mechanics",
  dynamics: "mechanics",
  electrodynamics: "electrodynamics",
  thermodynamics: "mkt-thermodynamics",
  optics: "optics-srt",
};

// Только дополнительные ученические синонимы. Основные названия, подсказки,
// формулы и topic mapping берутся из существующей canonical metadata и
// generator blueprint, поэтому здесь нет второго реестра из 35 записей.
const searchAliases: Partial<Record<TemplateId, string[]>> = {
  "free-fall": ["падение тела", "ускорение свободного падения"],
  "vt-slope": ["наклон графика", "v(t)", "ускорение по графику"],
  "vt-area": ["площадь под графиком", "v(t)", "перемещение по графику"],
  "relative-velocity-vectors": ["относительное движение", "сложение скоростей"],
  "newton-second": ["сумма сил", "F=ma", "ускорение тела"],
  "resultant-force-2d": ["перпендикулярные силы", "векторная сумма"],
  "ohm-law": ["сила тока", "напряжение", "сопротивление", "I=U/R", "U=IR"],
  "resistor-network": ["последовательное соединение", "параллельное соединение"],
  "source-internal-resistance": ["эдс", "внутреннее сопротивление", "полная цепь"],
  "gas-state-ratio": ["объединенный газовый закон", "pV/T"],
  "heat-balance-simple": ["тепловой баланс", "смешивание воды"],
  "phase-change-heat": ["плавление", "удельная теплота плавления"],
  "snell-index-ratio": ["закон Снеллиуса", "синусы углов"],
  "thin-lens-image-distance": ["формула линзы", "расстояние до изображения"],
};

function topicLabel(topicId: TopicId): string {
  const topic = topics.find((entry) => entry.id === topicId);
  if (!topic) {
    throw new Error(`Catalog metadata references inactive topic "${topicId}".`);
  }
  return topic.title;
}

function latexToPlainAlias(value: string): string {
  let result = value;
  const fraction = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;

  while (fraction.test(result)) {
    result = result.replace(fraction, "$1/$2");
    fraction.lastIndex = 0;
  }

  return result
    .replace(/\\(?:text|mathrm)\{([^{}]+)\}/g, "$1")
    .replace(/\\(?:left|right|quad|,|!)/g, "")
    .replace(/\\cdot/g, "*")
    .replace(/\\Delta/g, "delta")
    .replace(/\\sum/g, "sum")
    .replace(/\\vec\s*\{?([^{}\s]+)\}?/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function difficultyRange(templateId: TemplateId) {
  const counts = getDifficultyCounts(templateId);
  const supported = ([1, 2, 3] as const).filter((level) => counts[level] > 0);

  if (supported.length === 0) {
    throw new Error(`Template "${templateId}" has no supported difficulty.`);
  }

  return {
    min: supported[0],
    max: supported[supported.length - 1],
  };
}

function visualKinds(templateId: TemplateId): TaskVisualKind[] {
  const blueprint = getBlueprint(templateId);
  const kinds: TaskVisualKind[] = [];
  if (blueprint.graph) kinds.push("graph");
  if (blueprint.diagram) kinds.push("diagram");
  return kinds;
}

function buildEntry(templateId: TemplateId): TaskTypeCatalogEntry {
  const blueprint = getBlueprint(templateId);
  const metadata = getTaskLearningMetadata(templateId);

  if (!metadata) {
    throw new Error(`Template "${templateId}" has no task learning metadata.`);
  }

  const helpSection = topicHelpSections[metadata.topicId].find(
    (section) => section.id === metadata.helpSectionId,
  );

  if (!helpSection) {
    throw new Error(`Template "${templateId}" has no matching help section.`);
  }

  const formulaAliases = [blueprint.formula, helpSection.formula]
    .filter((value): value is string => Boolean(value?.trim()))
    .flatMap((value) => [value, latexToPlainAlias(value)]);

  return {
    id: templateId,
    slug: templateId,
    title: metadata.focusLabel,
    shortDescription: metadata.shortHint,
    topicId: metadata.topicId,
    topicLabel: topicLabel(metadata.topicId),
    examSection: examSectionByTopic[metadata.topicId],
    skillLabel: blueprint.skill,
    searchTerms: [
      metadata.focusLabel,
      metadata.shortHint,
      helpSection.label,
      helpSection.shortHint,
      blueprint.skill,
      blueprint.trap,
      ...(searchAliases[templateId] ?? []),
    ],
    formulaAliases: [...new Set(formulaAliases)],
    answerFormat: blueprint.answerFormat ?? "single_choice",
    difficultyRange: difficultyRange(templateId),
    visualKinds: visualKinds(templateId),
    trainingPoints: [
      blueprint.skill,
      helpSection.shortHint,
      helpSection.mistake,
    ].filter(
      (value, index, values): value is string =>
        Boolean(value?.trim()) && values.indexOf(value) === index,
    ).slice(0, 3),
  };
}

let catalogCache: readonly TaskTypeCatalogEntry[] | undefined;

export function getTaskCatalog(): readonly TaskTypeCatalogEntry[] {
  catalogCache ??= templateRegistry.map(({ id }) => buildEntry(id));
  return catalogCache;
}

export function getTaskCatalogEntry(slug: string): TaskTypeCatalogEntry | undefined {
  return getTaskCatalog().find((entry) => entry.slug === slug);
}
