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
  | "units-conversion"
  | "vectors-relative-motion"
  | "newton-second-law"
  | "resultant-force"
  | "friction"
  | "incline"
  | "weight-lift"
  | "momentum"
  | "density-volume"
  | "kinetic-energy"
  | "work-energy"
  | "ohms-law"
  | "full-circuit"
  | "charge-sharing"
  | "capacitor-energy"
  | "electric-power"
  | "ideal-gas"
  | "gas-equation"
  | "heat-amount"
  | "heat-balance"
  | "heating-melting";

export type HelpReason = "task" | "mistake" | "fallback";

export type TopicHelpSection = {
  id: HelpSectionId;
  label: string;
  shortHint: string;
  formula?: string;
  mistake?: string;
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
      formula: "s=vt",
      mistake: "Не путай путь за всё время с одной координатой или одной отметкой на графике.",
    },
    {
      id: "accelerated-motion",
      label: "Равноускоренное движение",
      shortHint: "При постоянном ускорении координата содержит начальное положение, скорость и член at²/2.",
      formula: "x=x_0+v_0t+\\frac{at^2}{2}",
      mistake: "Не забудь член at²/2: он даёт добавку пути из-за ускорения.",
    },
    {
      id: "motion-graphs",
      label: "Графики v(t), x(t)",
      shortHint: "Наклон v(t) даёт ускорение, площадь под v(t) даёт перемещение.",
      formula: "a=\\frac{\\Delta v}{\\Delta t},\\quad s=S_{v(t)}",
      mistake: "Не бери конечную скорость как путь: путь на v(t) даёт площадь под графиком.",
    },
    {
      id: "average-speed",
      label: "Средняя скорость",
      shortHint: "Средняя скорость считается через весь путь и всё время.",
      formula: "v_{avg}=\\frac{s_{all}}{t_{all}}",
      mistake: "Не усредняй скорости без учёта времени или пройденного пути.",
    },
    {
      id: "units-conversion",
      label: "Единицы скорости",
      shortHint: "Перед расчетом пути приведи скорость и время к согласованным единицам.",
      formula: "1\\ \\mathrm{km/h}=\\frac{1}{3.6}\\ \\mathrm{m/s}",
      mistake: "Не умножай км/ч на секунды напрямую: сначала переведи скорость в м/с.",
    },
    {
      id: "vectors-relative-motion",
      label: "Векторы и относительное движение",
      shortHint: "Скорости складываются по направлению; перпендикулярные — через треугольник.",
      formula: "\\vec v_{rel}=\\vec v_1-\\vec v_2",
      mistake: "Сначала выбери направление скоростей: встречное и попутное движение считаются по-разному.",
    },
  ],
  dynamics: [
    {
      id: "newton-second-law",
      label: "Второй закон Ньютона",
      shortHint: "Ускорение задаёт сумма сил, а не одна выбранная сила.",
      formula: "\\sum F = ma",
      mistake: "Сначала выбери положительное направление и знаки проекций.",
    },
    {
      id: "resultant-force",
      label: "Равнодействующая",
      shortHint: "Складывай силы как векторы, а не просто их модули.",
      formula: "\\vec F_{res}=\\sum \\vec F",
      mistake: "Если силы направлены под углом, складывай проекции или используй треугольник.",
    },
    {
      id: "friction",
      label: "Трение",
      shortHint: "Сила трения равна μN и направлена против относительного движения.",
      formula: "F_{fr}=\\mu N",
      mistake: "Не подставляй mg вместо N автоматически: на наклонной или в лифте N меняется.",
    },
    {
      id: "incline",
      label: "Наклонная плоскость",
      shortHint: "Разложи mg вдоль плоскости и перпендикулярно ей.",
      formula: "F_{\\parallel}=mg\\sin\\alpha",
      mistake: "Не меняй sin и cos местами: вдоль плоскости работает mg sin α.",
    },
    {
      id: "weight-lift",
      label: "Вес тела / лифт",
      shortHint: "Вес — это N; ускорение вверх увеличивает его, вниз уменьшает.",
      formula: "N=m(g\\pm a)",
      mistake: "Знак зависит от ускорения лифта, а не от того, куда он сейчас движется.",
    },
    {
      id: "momentum",
      label: "Импульс",
      shortHint: "Для столкновения смотри импульс всей системы до и после.",
      formula: "m_1v_1+m_2v_2=(m_1+m_2)v",
      mistake: "Сохраняется импульс системы, а не скорости отдельных тел.",
    },
    {
      id: "density-volume",
      label: "Плотность и объём",
      shortHint: "Масса зависит от плотности и объёма: m = ρV.",
      formula: "m=\\rho V",
      mistake: "Следи за единицами объёма: см³ и м³ дают разные масштабы.",
    },
    {
      id: "kinetic-energy",
      label: "Кинетическая энергия",
      shortHint: "Энергия движения равна mv²/2 и зависит от квадрата скорости.",
      formula: "E_k=\\frac{mv^2}{2}",
      mistake: "Если скорость выросла в два раза, энергия выросла в четыре раза.",
    },
    {
      id: "work-energy",
      label: "Работа силы",
      shortHint: "Работа равна произведению силы, пути и cos угла между ними.",
      formula: "A=Fs\\cos\\alpha",
      mistake: "Если сила направлена против перемещения, работа отрицательна.",
    },
  ],
  electrodynamics: [
    {
      id: "ohms-law",
      label: "Закон Ома",
      shortHint: "Сначала определи, что дано: напряжение U и сопротивление R. Потом подставь в I = U/R.",
      formula: "I=\\frac{U}{R}",
      mistake: "Не умножай U на R: при большем сопротивлении ток меньше.",
    },
    {
      id: "full-circuit",
      label: "Полная цепь",
      shortHint: "Во всей цепи учитывай внешнее и внутреннее сопротивление.",
      formula: "I=\\frac{\\mathcal{E}}{R+r}",
      mistake: "Не забывай внутреннее сопротивление r: оно тоже ограничивает ток.",
    },
    {
      id: "charge-sharing",
      label: "Деление заряда",
      shortHint: "Сначала сложи заряды с учётом знаков, потом раздели поровну.",
      formula: "q'=\\frac{q_1+q_2}{2}",
      mistake: "Заряды разных знаков частично компенсируют друг друга до деления.",
    },
    {
      id: "capacitor-energy",
      label: "Конденсатор",
      shortHint: "Энергия конденсатора зависит от U² и коэффициента 1/2.",
      formula: "W=\\frac{CU^2}{2}",
      mistake: "Не теряй квадрат напряжения и коэффициент 1/2.",
    },
    {
      id: "electric-power",
      label: "Мощность тока",
      shortHint: "Мощность участка цепи можно считать как P=UI или P=I²R.",
      formula: "P=UI=I^2R",
      mistake: "Не останавливайся на напряжении U=IR: для мощности нужен еще множитель I.",
    },
  ],
  thermodynamics: [
    {
      id: "ideal-gas",
      label: "Идеальный газ",
      shortHint: "Давление, объём и температура связаны состоянием газа.",
      formula: "pV=\\nu RT",
      mistake: "Температуру газа подставляй в кельвинах, а не в градусах Цельсия.",
    },
    {
      id: "gas-equation",
      label: "Уравнение состояния",
      shortHint: "Температуру подставляй в кельвинах: T = t°C + 273.",
      formula: "pV=\\nu RT",
      mistake: "Не подставляй градусы Цельсия напрямую.",
    },
    {
      id: "heat-amount",
      label: "Количество теплоты",
      shortHint: "Для нагревания нужны масса, теплоёмкость и изменение температуры.",
      formula: "Q=cm\\Delta T",
      mistake: "В формулу входит изменение температуры, а не конечная температура.",
    },
    {
      id: "heat-balance",
      label: "Тепловой баланс",
      shortHint: "Сколько теплоты отдала горячая вода, столько получила холодная.",
      formula: "m_1c(T_1-T)=m_2c(T-T_2)",
      mistake: "Не усредняй температуры без учета масс.",
    },
    {
      id: "heating-melting",
      label: "Плавление / нагревание",
      shortHint: "Нагрев и плавление считаются отдельными стадиями: посчитай каждую и сложи.",
      formula: "Q=cm\\Delta T+\\lambda m",
      mistake: "Во время плавления температура не растёт: теплота идёт на изменение состояния.",
    },
  ],
};

const blueprintTargets: Partial<
  Record<string, { topicId: TopicId; sectionId: HelpSectionId }>
> = {
  "formula-substitution": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "free-fall": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "average-speed-segments": { topicId: "kinematics", sectionId: "average-speed" },
  "unit-conversion-speed": { topicId: "kinematics", sectionId: "units-conversion" },
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
  "work-force-distance": { topicId: "dynamics", sectionId: "work-energy" },
  "ohm-law": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "resistor-network": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "source-internal-resistance": { topicId: "electrodynamics", sectionId: "full-circuit" },
  "charge-sharing": { topicId: "electrodynamics", sectionId: "charge-sharing" },
  "capacitor-energy": { topicId: "electrodynamics", sectionId: "capacitor-energy" },
  "electric-power": { topicId: "electrodynamics", sectionId: "electric-power" },
  "ideal-gas-state": { topicId: "thermodynamics", sectionId: "gas-equation" },
  "gas-state-ratio": { topicId: "thermodynamics", sectionId: "gas-equation" },
  "heat-amount": { topicId: "thermodynamics", sectionId: "heat-amount" },
  "heat-balance-simple": { topicId: "thermodynamics", sectionId: "heat-balance" },
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
