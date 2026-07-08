import {
  getMisconceptionMetadata,
  getTaskLearningMetadata,
  taskLearningMetadataByTemplateId,
  type TaskLearningMetadata,
} from "./task-metadata.ts";
import { skillMetadata, type TopicId } from "./taxonomy.ts";

export type HelpSectionId =
  | "uniform-motion"
  | "accelerated-motion"
  | "motion-graphs"
  | "average-speed"
  | "vectors-relative-motion"
  | "newton-second-law"
  | "resultant-force"
  | "friction"
  | "incline"
  | "weight-lift"
  | "momentum"
  | "density-volume"
  | "kinetic-energy"
  | "ohms-law"
  | "full-circuit"
  | "charge-sharing"
  | "capacitor-energy"
  | "ideal-gas"
  | "gas-equation"
  | "heat-amount"
  | "heating-melting";

export type HelpReason = "task" | "mistake" | "fallback";

export type TopicHelpSection = {
  id: HelpSectionId;
  label: string;
  shortHint: string;
};

export type HelpTarget = {
  topicId: TopicId;
  sectionId: HelpSectionId;
  reason: HelpReason;
  label: string;
  shortHint: string;
};

export type HelpableQuizTask = {
  blueprint: string;
  skill?: string;
  text?: string;
  formula?: string;
  trap?: string;
  graph?: { type?: string } | null;
  diagram?: { kind?: string } | null;
  explanation?: string;
  explanation_latex?: string;
};

export const topicHelpSections: Record<TopicId, TopicHelpSection[]> = {
  kinematics: [
    {
      id: "uniform-motion",
      label: "Равномерное движение",
      shortHint: "Постоянная скорость: путь равен скорости, умноженной на время.",
    },
    {
      id: "accelerated-motion",
      label: "Равноускоренное движение",
      shortHint: "При постоянном ускорении путь зависит от t² и члена at²/2.",
    },
    {
      id: "motion-graphs",
      label: "Графики v(t), x(t)",
      shortHint: "Наклон v(t) даёт ускорение, площадь под v(t) даёт перемещение.",
    },
    {
      id: "average-speed",
      label: "Средняя скорость",
      shortHint: "Средняя скорость считается через весь путь и всё время.",
    },
    {
      id: "vectors-relative-motion",
      label: "Векторы и относительное движение",
      shortHint: "Скорости складываются по направлению; перпендикулярные — через треугольник.",
    },
  ],
  dynamics: [
    {
      id: "newton-second-law",
      label: "Второй закон Ньютона",
      shortHint: "Сумма сил задаёт ускорение: сначала выбери ось и знаки.",
    },
    {
      id: "resultant-force",
      label: "Равнодействующая",
      shortHint: "Складывай силы как векторы, а не просто их модули.",
    },
    {
      id: "friction",
      label: "Трение",
      shortHint: "Сила трения равна μN и направлена против относительного движения.",
    },
    {
      id: "incline",
      label: "Наклонная плоскость",
      shortHint: "Разложи mg вдоль плоскости и перпендикулярно ей.",
    },
    {
      id: "weight-lift",
      label: "Вес тела / лифт",
      shortHint: "Вес — это N; ускорение вверх увеличивает его, вниз уменьшает.",
    },
    {
      id: "momentum",
      label: "Импульс",
      shortHint: "Для столкновения смотри импульс всей системы до и после.",
    },
    {
      id: "density-volume",
      label: "Плотность и объём",
      shortHint: "Масса зависит от плотности и объёма: m = ρV.",
    },
    {
      id: "kinetic-energy",
      label: "Кинетическая энергия",
      shortHint: "Энергия движения равна mv²/2 и зависит от квадрата скорости.",
    },
  ],
  electrodynamics: [
    {
      id: "ohms-law",
      label: "Закон Ома",
      shortHint: "Свяжи ток, напряжение и сопротивление до подстановки чисел.",
    },
    {
      id: "full-circuit",
      label: "Полная цепь",
      shortHint: "Во всей цепи учитывай внешнее и внутреннее сопротивление.",
    },
    {
      id: "charge-sharing",
      label: "Деление заряда",
      shortHint: "После контакта одинаковых проводников общий заряд делится поровну.",
    },
    {
      id: "capacitor-energy",
      label: "Конденсатор",
      shortHint: "Энергия конденсатора зависит от U² и коэффициента 1/2.",
    },
  ],
  thermodynamics: [
    {
      id: "ideal-gas",
      label: "Идеальный газ",
      shortHint: "Давление, объём и температура связаны состоянием газа.",
    },
    {
      id: "gas-equation",
      label: "Уравнение состояния",
      shortHint: "В pV = nRT температура всегда в кельвинах.",
    },
    {
      id: "heat-amount",
      label: "Количество теплоты",
      shortHint: "Для нагревания нужны масса, теплоёмкость и изменение температуры.",
    },
    {
      id: "heating-melting",
      label: "Плавление / нагревание",
      shortHint: "Если есть нагрев и плавление, считай стадии отдельно и складывай.",
    },
  ],
};

const blueprintTargets: Partial<
  Record<string, { topicId: TopicId; sectionId: HelpSectionId }>
> = {
  "formula-substitution": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "free-fall": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "nth-second-displacement": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "graph-area": { topicId: "kinematics", sectionId: "motion-graphs" },
  "graph-recognition": { topicId: "kinematics", sectionId: "motion-graphs" },
  "acceleration-from-speed-change": { topicId: "kinematics", sectionId: "motion-graphs" },
  "signed-coordinate": { topicId: "kinematics", sectionId: "uniform-motion" },
  "relative-motion-meeting": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "relative-motion-overtake": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "relative-velocity-vectors": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "newton-second": { topicId: "dynamics", sectionId: "newton-second-law" },
  "resultant-force": { topicId: "dynamics", sectionId: "resultant-force" },
  "resultant-force-2d": { topicId: "dynamics", sectionId: "resultant-force" },
  "friction-force": { topicId: "dynamics", sectionId: "friction" },
  "incline-force": { topicId: "dynamics", sectionId: "incline" },
  "weight-lift": { topicId: "dynamics", sectionId: "weight-lift" },
  "impulse-momentum": { topicId: "dynamics", sectionId: "momentum" },
  "inelastic-collision-speed": { topicId: "dynamics", sectionId: "momentum" },
  "kinetic-energy": { topicId: "dynamics", sectionId: "newton-second-law" },
  "ohm-law": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "resistor-network": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "source-internal-resistance": { topicId: "electrodynamics", sectionId: "full-circuit" },
  "charge-sharing": { topicId: "electrodynamics", sectionId: "charge-sharing" },
  "capacitor-energy": { topicId: "electrodynamics", sectionId: "capacitor-energy" },
  "ideal-gas-state": { topicId: "thermodynamics", sectionId: "gas-equation" },
  "heat-amount": { topicId: "thermodynamics", sectionId: "heat-amount" },
  "phase-change-heat": { topicId: "thermodynamics", sectionId: "heating-melting" },
};

function normalize(value: string | undefined) {
  return (value ?? "").toLowerCase().replaceAll("ё", "е");
}

function combinedTaskText(task: HelpableQuizTask) {
  return normalize(
    [
      task.blueprint,
      task.skill,
      task.text,
      task.formula,
      task.trap,
      task.explanation,
      task.explanation_latex,
      task.graph?.type,
      task.diagram?.kind,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function sectionFor(topicId: TopicId, sectionId: HelpSectionId) {
  return (
    topicHelpSections[topicId].find((section) => section.id === sectionId) ??
    topicHelpSections[topicId][0]
  );
}

function createTarget(
  topicId: TopicId,
  sectionId: HelpSectionId,
  reason: HelpReason,
): HelpTarget {
  const section = sectionFor(topicId, sectionId);

  return {
    topicId,
    sectionId: section.id,
    reason,
    label: section.label,
    shortHint: section.shortHint,
  };
}

function createTargetFromMetadata(
  metadata: TaskLearningMetadata,
  reason: HelpReason,
): HelpTarget {
  const section = sectionFor(metadata.topicId, metadata.helpSectionId);

  return {
    topicId: metadata.topicId,
    sectionId: section.id,
    reason,
    label: section.label,
    shortHint: metadata.shortHint || section.shortHint,
  };
}

function topicFromBlueprint(blueprint: string): TopicId | null {
  const metadata = getTaskLearningMetadata(blueprint);
  if (metadata) {
    return metadata.topicId;
  }

  if (blueprint in skillMetadata) {
    return skillMetadata[blueprint as keyof typeof skillMetadata].topicId;
  }

  return blueprintTargets[blueprint]?.topicId ?? null;
}

function inferTopic(task: HelpableQuizTask, topicHint?: TopicId): TopicId {
  const blueprintTopic = topicFromBlueprint(task.blueprint);
  if (blueprintTopic) return blueprintTopic;
  if (topicHint) return topicHint;

  const text = combinedTaskText(task);
  if (/(ом|напряж|сопротив|заряд|конденс|цеп)/.test(text)) return "electrodynamics";
  if (/(газ|давлен|температур|теплот|плавлен|кельвин|pv|nrt)/.test(text)) {
    return "thermodynamics";
  }
  if (/(сила|ньютон|трени|наклон|импульс|лифт|масса)/.test(text)) return "dynamics";

  return "kinematics";
}

function inferSection(task: HelpableQuizTask, topicId: TopicId): HelpSectionId {
  const metadata = getTaskLearningMetadata(task.blueprint);
  if (metadata?.topicId === topicId) {
    return metadata.helpSectionId;
  }

  const blueprintTarget = blueprintTargets[task.blueprint];
  const text = combinedTaskText(task);

  if (topicId === "kinematics") {
    if (task.graph || /\bv\(t\)|\bx\(t\)|график|наклон|площад/.test(text)) {
      return "motion-graphs";
    }
    if (blueprintTarget?.topicId === topicId) return blueprintTarget.sectionId;
    if (/ускор|at\^?2|gt\^?2|frac\{a|frac\{g|свободн/.test(text)) {
      return "accelerated-motion";
    }
    if (/средн/.test(text)) return "average-speed";
    if (/навстреч|догон|относительн|перпендикулярн/.test(text)) {
      return "vectors-relative-motion";
    }
    return "uniform-motion";
  }

  if (blueprintTarget?.topicId === topicId) return blueprintTarget.sectionId;

  if (topicId === "dynamics") {
    if (/трени|\\mu|μ/.test(text)) return "friction";
    if (/наклон|sin|cos|плоскост/.test(text)) return "incline";
    if (/лифт|вес|реакци/.test(text)) return "weight-lift";
    if (/импульс|столкнов|тележ/.test(text)) return "momentum";
    if (/равнодейств|перпендикуляр|пифагор|направлен|проекци/.test(text)) {
      return "resultant-force";
    }
    return "newton-second-law";
  }

  if (topicId === "electrodynamics") {
    if (/заряд|поровну|дели|усредн/.test(text)) return "charge-sharing";
    if (/конденс|cu\^?2|u\^?2|микрофарад/.test(text)) return "capacitor-energy";
    if (/эдс|внутрен|полная цеп|r \+ r|r\+r/.test(text)) return "full-circuit";
    return "ohms-law";
  }

  if (/плавл|лед|λ|lambda/.test(text)) return "heating-melting";
  if (/теплот|cm|дельта|\\delta|нагрев/.test(text)) return "heat-amount";
  if (/pv|nrt|кельвин|уравнен/.test(text)) return "gas-equation";
  return "ideal-gas";
}

function hasKnownHelpSignal(task: HelpableQuizTask) {
  if (task.blueprint in taskLearningMetadataByTemplateId) {
    return true;
  }

  if (task.blueprint in skillMetadata || blueprintTargets[task.blueprint]) {
    return true;
  }
  if (task.graph || task.diagram) {
    return true;
  }

  const text = combinedTaskText(task);
  return /(v\(t\)|x\(t\)|график|ускор|сила|ньютон|трени|наклон|импульс|ом|напряж|сопротив|заряд|конденс|газ|давлен|теплот|плавлен|pv|nrt|cm\\delta)/.test(
    text,
  );
}

export function getDefaultHelpTarget(topicId: TopicId): HelpTarget {
  return createTarget(topicId, topicHelpSections[topicId][0].id, "fallback");
}

export function getHelpTargetForTask(
  task: HelpableQuizTask,
  topicHint?: TopicId,
): HelpTarget {
  const metadata = getTaskLearningMetadata(task.blueprint);
  if (metadata) {
    return createTargetFromMetadata(metadata, "task");
  }

  const topicId = inferTopic(task, topicHint);
  const sectionId = inferSection(task, topicId);

  return createTarget(topicId, sectionId, hasKnownHelpSignal(task) ? "task" : "fallback");
}

export function getHelpTargetForMistake(
  task: HelpableQuizTask,
  trap?: string,
  topicHint?: TopicId,
): HelpTarget {
  const stableMisconception = getMisconceptionMetadata(trap);
  const taskMetadata = getTaskLearningMetadata(task.blueprint);
  if (stableMisconception && taskMetadata) {
    return createTarget(
      taskMetadata.topicId,
      stableMisconception.helpSectionId,
      "mistake",
    );
  }

  const topicId = inferTopic(task, topicHint);
  const mistakeText = normalize(trap);

  if (topicId === "kinematics") {
    if (/площад|наклон|график|ось|v\(t\)|x\(t\)/.test(mistakeText)) {
      return createTarget(topicId, "motion-graphs", "mistake");
    }
    if (/знак|направлен/.test(mistakeText)) {
      return createTarget(topicId, "accelerated-motion", "mistake");
    }
  }

  if (topicId === "dynamics") {
    if (/знак|направлен|проекци|складывать силы|сложил/.test(mistakeText)) {
      return createTarget(topicId, "resultant-force", "mistake");
    }
    if (/трени|\\mu|μ/.test(mistakeText)) return createTarget(topicId, "friction", "mistake");
    if (/наклон|sin|cos/.test(mistakeText)) return createTarget(topicId, "incline", "mistake");
  }

  if (topicId === "electrodynamics") {
    if (/заряд|поровну|дели|усредн/.test(mistakeText)) {
      return createTarget(topicId, "charge-sharing", "mistake");
    }
    if (/конденс|u\^?2|коэффициент|1\/2|половин|микрофарад/.test(mistakeText)) {
      return createTarget(topicId, "capacitor-energy", "mistake");
    }
    if (/ом|напряж|сопротив|ток|u\/r/.test(mistakeText)) {
      return createTarget(topicId, "ohms-law", "mistake");
    }
  }

  if (topicId === "thermodynamics") {
    if (/плавл|лед|стади/.test(mistakeText)) {
      return createTarget(topicId, "heating-melting", "mistake");
    }
    if (/теплот|масса|температур|delta|изменен/.test(mistakeText)) {
      return createTarget(topicId, "heat-amount", "mistake");
    }
    if (/кельвин|давлен|объем|pv|nrt/.test(mistakeText)) {
      return createTarget(topicId, "gas-equation", "mistake");
    }
  }

  if (/подстав|формул|вырази|выразил/.test(mistakeText)) {
    const target = getHelpTargetForTask(task, topicHint);
    return { ...target, reason: "mistake" };
  }

  const target = getHelpTargetForTask(task, topicHint);
  return { ...target, reason: trap ? "mistake" : target.reason };
}
