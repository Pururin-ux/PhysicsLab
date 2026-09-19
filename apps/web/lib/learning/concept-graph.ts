import type { TemplateId } from "../server/task-generator/generate.ts";
import type { HelpSectionId } from "./topic-help.ts";
import type { TopicId } from "./taxonomy.ts";
import {
  LESSON_STAGE_IDS,
  lessonStageDefinitions,
  type LessonStageDefinition,
  type LessonStageGate,
  type LessonStageId,
} from "./lesson-stage-contract.ts";

export {
  LESSON_STAGE_IDS as LEARNING_STAGE_IDS,
  lessonStageDefinitions as learningStageDefinitions,
};
export type {
  LessonStageDefinition as LearningStageDefinition,
  LessonStageGate as LearningStageGate,
  LessonStageId as LearningStageId,
};

export const LEARNING_DOMAIN_IDS = [
  "core",
  "kinematics",
  "dynamics",
  "electrodynamics",
  "thermodynamics",
  "optics",
] as const satisfies readonly ("core" | TopicId)[];

export type LearningDomainId = (typeof LEARNING_DOMAIN_IDS)[number];

export const ACTIVE_TOPIC_IDS = [
  "kinematics",
  "dynamics",
  "electrodynamics",
  "thermodynamics",
  "optics",
] as const satisfies readonly TopicId[];

export const LEARNING_STAGE_PLAN_IDS = ["concept-first-v1"] as const;
export type LearningStagePlanId = (typeof LEARNING_STAGE_PLAN_IDS)[number];

export type LearningStagePlanStep = {
  stageId: LessonStageId;
  repetitions: number;
};

export type LearningStagePlan = {
  id: LearningStagePlanId;
  steps: readonly LearningStagePlanStep[];
};

// The default route mirrors the audited teaching contract:
// situation -> committed prediction -> visible result -> causal model ->
// two worked examples -> two faded examples -> two independent tasks -> transfer.
export const learningStagePlans = {
  "concept-first-v1": {
    id: "concept-first-v1",
    steps: [
      { stageId: "context", repetitions: 1 },
      { stageId: "prediction", repetitions: 1 },
      { stageId: "observation", repetitions: 1 },
      { stageId: "causal-explanation", repetitions: 1 },
      { stageId: "representation", repetitions: 1 },
      { stageId: "worked-example", repetitions: 2 },
      { stageId: "faded-example", repetitions: 2 },
      { stageId: "independent-practice", repetitions: 2 },
      { stageId: "transfer", repetitions: 1 },
      { stageId: "summary", repetitions: 1 },
    ],
  },
} as const satisfies Record<LearningStagePlanId, LearningStagePlan>;

export const CONCEPT_NODE_IDS = [
  "dynamics-contact-pressure",
  "dynamics-hydrostatic-pressure",
  "dynamics-archimedes-force",
  "dynamics-buoyant-transport",
  "core-quantities-and-units",
  "core-particles-and-models",
  "core-algebra-and-proportions",
  "core-vectors-and-projections",
  "core-graphs-and-change",
  "kinematics-motion-description",
  "kinematics-speed-units",
  "kinematics-uniform-coordinate-law",
  "kinematics-uniform-motion-graphs",
  "kinematics-average-speed",
  "kinematics-acceleration",
  "kinematics-vt-slope",
  "kinematics-vt-area",
  "kinematics-free-fall",
  "kinematics-projectile-motion",
  "kinematics-relative-velocity",
  "kinematics-rotation-frequency",
  "kinematics-centripetal-acceleration",
  "dynamics-interactions",
  "dynamics-gravity-and-weight",
  "dynamics-universal-gravitation",
  "dynamics-resultant-force-1d",
  "dynamics-resultant-force-2d",
  "dynamics-newton-second-law",
  "dynamics-normal-force",
  "dynamics-friction",
  "dynamics-incline",
  "dynamics-apparent-weight",
  "dynamics-torque-equilibrium",
  "dynamics-simple-machines",
  "dynamics-impulse",
  "dynamics-momentum-conservation",
  "dynamics-kinetic-energy",
  "dynamics-potential-energy",
  "dynamics-mechanical-energy-conservation",
  "dynamics-work",
  "dynamics-mechanical-efficiency",
  "dynamics-power",
  "electrodynamics-electrostatics",
  "electrodynamics-charge-current-voltage",
  "electrodynamics-ohm-law",
  "electrodynamics-wire-resistance",
  "electrodynamics-resistor-networks",
  "electrodynamics-complete-circuit",
  "electrodynamics-electric-power",
  "electrodynamics-magnetic-field",
  "electrodynamics-charge-sharing",
  "electrodynamics-capacitor-energy",
  "thermodynamics-particles-and-state",
  "thermodynamics-amount-of-substance",
  "thermodynamics-gas-pressure-micro",
  "thermodynamics-temperature-energy",
  "thermodynamics-density-and-volume",
  "thermodynamics-ideal-gas",
  "thermodynamics-gas-state-ratio",
  "thermodynamics-solid-structure",
  "thermodynamics-liquid-structure",
  "thermodynamics-vapor-equilibrium",
  "thermodynamics-air-humidity",
  "thermodynamics-heat-amount",
  "thermodynamics-heat-balance",
  "thermodynamics-fuel-combustion",
  "thermodynamics-phase-change",
  "thermodynamics-vaporization",
  "thermodynamics-heat-engine-reference",
  "optics-ray-model",
  "optics-reflection",
  "optics-plane-mirror",
  "optics-refractive-index",
  "optics-refraction",
  "optics-thin-lens",
  "optics-optical-power",
  "optics-magnification",
  "optics-vision-correction",
] as const;

export type ConceptNodeId = (typeof CONCEPT_NODE_IDS)[number];
export type ConceptAvailability = "learnable" | "referenceOnly" | "future";
export type FormulaSupportAvailability = "practice" | "referenceOnly" | "future";

export type ConceptFormulaSupport = {
  formulaId: string;
  availability: FormulaSupportAvailability;
};

type ConceptNodeCommon = {
  domainId: LearningDomainId;
  order: number;
  title: string;
  summary: string;
  prerequisiteIds: readonly ConceptNodeId[];
  helpSectionIds: readonly HelpSectionId[];
  formulaSupport: readonly ConceptFormulaSupport[];
};

type LearnableConceptNodeDefinition = ConceptNodeCommon & {
  availability: "learnable";
  isIntroduction: boolean;
  /** Optional authoring reference; learnability is defined by the concept graph. */
  stagePlanId: LearningStagePlanId | null;
};

type NonLearnableConceptNodeDefinition = ConceptNodeCommon & {
  availability: "referenceOnly" | "future";
  isIntroduction: false;
  stagePlanId: null;
};

export type ConceptNodeDefinition =
  | LearnableConceptNodeDefinition
  | NonLearnableConceptNodeDefinition;

export type ConceptNode = ConceptNodeDefinition & { id: ConceptNodeId };

function formula(
  formulaId: string,
  availability: FormulaSupportAvailability = "practice",
): ConceptFormulaSupport {
  return { formulaId, availability };
}

const conceptNodeDefinitions = {
  "core-quantities-and-units": {
    domainId: "core",
    order: 10,
    title: "Величины и единицы",
    summary: "Что измеряется, в каких единицах и почему величины приводят к одной системе.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: [],
    helpSectionIds: [],
    formulaSupport: [],
  },
  "core-algebra-and-proportions": {
    domainId: "core",
    order: 20,
    title: "Формула как связь величин",
    summary: "Пропорции, отношения и выражение нужной величины до подстановки чисел.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-quantities-and-units"],
    helpSectionIds: [],
    formulaSupport: [],
  },
  "core-vectors-and-projections": {
    domainId: "core",
    order: 30,
    title: "Направления, векторы и проекции",
    summary: "Выбор оси, знаки проекций и сложение величин с направлением.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-algebra-and-proportions"],
    helpSectionIds: [],
    formulaSupport: [],
  },
  "core-graphs-and-change": {
    domainId: "core",
    order: 40,
    title: "График как история изменения",
    summary: "Оси, масштаб, наклон и площадь как разные способы читать процесс.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-algebra-and-proportions"],
    helpSectionIds: [],
    formulaSupport: [],
  },
  "kinematics-motion-description": {
    domainId: "kinematics",
    order: 10,
    title: "Как описывать движение",
    summary: "Тело отсчёта, координата, путь, перемещение, время и скорость.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-quantities-and-units"],
    helpSectionIds: ["uniform-motion"],
    formulaSupport: [formula("uniform-motion")],
  },
  "kinematics-speed-units": {
    domainId: "kinematics",
    order: 20,
    title: "Единицы скорости",
    summary: "Согласованные единицы скорости, пути и времени перед расчётом.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-quantities-and-units"],
    helpSectionIds: ["units-conversion"],
    formulaSupport: [formula("unit-conversion-speed")],
  },
  "kinematics-uniform-coordinate-law": {
    domainId: "kinematics",
    order: 23,
    title: "Координатный закон движения",
    summary: "Начальная координата и знаковая проекция скорости определяют положение через время.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-vectors-and-projections", "core-algebra-and-proportions"],
    helpSectionIds: ["uniform-motion-graphs"],
    formulaSupport: [formula("uniform-motion")],
  },
  "kinematics-uniform-motion-graphs": {
    domainId: "kinematics",
    order: 25,
    title: "Графики равномерного движения",
    summary: "Наклон s(t), постоянная высота v(t) и путь под графиком скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-uniform-coordinate-law", "core-graphs-and-change"],
    helpSectionIds: ["uniform-motion-graphs"],
    formulaSupport: [formula("uniform-motion")],
  },
  "kinematics-average-speed": {
    domainId: "kinematics",
    order: 30,
    title: "Средняя скорость",
    summary: "Весь путь делится на всё время, а не усредняются отдельные скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-algebra-and-proportions"],
    helpSectionIds: ["average-speed"],
    formulaSupport: [formula("average-speed-segments")],
  },
  "kinematics-acceleration": {
    domainId: "kinematics",
    order: 40,
    title: "Изменение скорости и ускорение",
    summary: "Ускорение описывает изменение скорости, а не саму скорость движения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-algebra-and-proportions"],
    helpSectionIds: ["accelerated-motion"],
    formulaSupport: [
      formula("velocity", "referenceOnly"),
      formula("coordinate", "referenceOnly"),
    ],
  },
  "kinematics-vt-slope": {
    domainId: "kinematics",
    order: 50,
    title: "Наклон графика v(t)",
    summary: "Изменение скорости за время даёт ускорение на выбранном участке.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-acceleration", "core-graphs-and-change"],
    helpSectionIds: ["motion-graphs"],
    formulaSupport: [formula("vt-slope")],
  },
  "kinematics-vt-area": {
    domainId: "kinematics",
    order: 60,
    title: "Площадь под графиком v(t)",
    summary: "Площадь под графиком скорости даёт перемещение за интервал.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-graphs-and-change"],
    helpSectionIds: ["motion-graphs"],
    formulaSupport: [formula("vt-area")],
  },
  "kinematics-free-fall": {
    domainId: "kinematics",
    order: 70,
    title: "Свободное падение",
    summary: "Равноускоренное движение под действием тяжести в принятой модели.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-acceleration"],
    helpSectionIds: ["accelerated-motion"],
    formulaSupport: [formula("free-fall")],
  },
  "kinematics-relative-velocity": {
    domainId: "kinematics",
    order: 80,
    title: "Относительная скорость",
    summary: "Скорость зависит от системы отсчёта и складывается как вектор.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-vectors-and-projections"],
    helpSectionIds: ["vectors-relative-motion"],
    formulaSupport: [formula("relative-velocity-vectors")],
  },
  "dynamics-interactions": {
    domainId: "dynamics",
    order: 10,
    title: "Взаимодействия и силы",
    summary: "Сначала выбирается тело и перечисляются взаимодействия с другими телами.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-vectors-and-projections"],
    helpSectionIds: ["resultant-force"],
    formulaSupport: [],
  },
  "kinematics-projectile-motion": {
    domainId: "kinematics",
    order: 75,
    title: "Бросок под углом",
    summary: "Один полёт как равномерное движение по горизонтали и равноускоренное по вертикали.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-free-fall", "core-vectors-and-projections"],
    helpSectionIds: ["accelerated-motion"],
    formulaSupport: [formula("projectile-components")],
  },
  "kinematics-rotation-frequency": {
    domainId: "kinematics",
    order: 90,
    title: "Период и частота вращения",
    summary: "Один оборот связывает угол 2π, период, частоту, угловую и линейную скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-algebra-and-proportions"],
    helpSectionIds: ["circular-motion"],
    formulaSupport: [formula("rotation-frequency")],
  },
  "kinematics-centripetal-acceleration": {
    domainId: "kinematics",
    order: 100,
    title: "Центростремительное ускорение",
    summary: "Поворот вектора скорости создаёт ускорение к центру окружности.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-acceleration", "kinematics-rotation-frequency", "core-vectors-and-projections"],
    helpSectionIds: ["circular-motion"],
    formulaSupport: [formula("centripetal-acceleration")],
  },
  "core-particles-and-models": {
    domainId: "core",
    order: 15,
    title: "Частицы и модели вещества",
    summary: "Как модели атомов и частиц связывают наблюдаемое поведение вещества с его строением.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-quantities-and-units"],
    helpSectionIds: [],
    formulaSupport: [],
  },
  "dynamics-gravity-and-weight": {
    domainId: "dynamics",
    order: 15,
    title: "Тяжесть, упругость и вес",
    summary: "Силы различаются по паре взаимодействующих тел и точке приложения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-interactions"],
    helpSectionIds: ["gravity-force"],
    formulaSupport: [formula("gravity-force")],
  },
  "dynamics-universal-gravitation": {
    domainId: "dynamics",
    order: 17,
    title: "Закон всемирного тяготения",
    summary: "Массы усиливают взаимное притяжение, а расстояние между центрами ослабляет его в квадрате.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-gravity-and-weight", "kinematics-free-fall"],
    helpSectionIds: ["gravitation-distance"],
    formulaSupport: [formula("gravitation-distance")],
  },
  "dynamics-resultant-force-1d": {
    domainId: "dynamics",
    order: 20,
    title: "Равнодействующая на одной оси",
    summary: "Все силы складываются с учётом направления выбранной оси.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-interactions", "core-vectors-and-projections"],
    helpSectionIds: ["resultant-force"],
    formulaSupport: [formula("resultant-force")],
  },
  "dynamics-resultant-force-2d": {
    domainId: "dynamics",
    order: 30,
    title: "Равнодействующая на плоскости",
    summary: "Перпендикулярные силы складываются через проекции и прямоугольный треугольник.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-resultant-force-1d", "core-vectors-and-projections"],
    helpSectionIds: ["resultant-force"],
    formulaSupport: [formula("resultant-force-2d")],
  },
  "dynamics-newton-second-law": {
    domainId: "dynamics",
    order: 40,
    title: "Второй закон Ньютона",
    summary: "Ускорение связывается с равнодействующей всех сил и полной массой тела.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-resultant-force-1d", "kinematics-acceleration"],
    helpSectionIds: ["newton-second-law"],
    formulaSupport: [formula("newton-second")],
  },
  "dynamics-normal-force": {
    domainId: "dynamics",
    order: 50,
    title: "Реакция опоры",
    summary: "Реакция опоры определяется взаимодействием с поверхностью и не всегда равна mg.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-interactions", "dynamics-newton-second-law"],
    helpSectionIds: ["friction"],
    formulaSupport: [],
  },
  "dynamics-friction": {
    domainId: "dynamics",
    order: 60,
    title: "Трение скольжения",
    summary: "Трение зависит от реакции опоры и направлено против относительного движения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-normal-force", "dynamics-newton-second-law"],
    helpSectionIds: ["friction"],
    formulaSupport: [formula("friction-force")],
  },
  "dynamics-incline": {
    domainId: "dynamics",
    order: 70,
    title: "Силы на наклонной плоскости",
    summary: "Оси выбираются вдоль и поперёк плоскости, затем строятся проекции сил.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-normal-force", "core-vectors-and-projections"],
    helpSectionIds: ["incline"],
    formulaSupport: [formula("incline-force")],
  },
  "dynamics-apparent-weight": {
    domainId: "dynamics",
    order: 80,
    title: "Вес в ускоряющейся опоре",
    summary: "Вес тела — сила на опору; его меняет ускорение, а не направление скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-normal-force"],
    helpSectionIds: ["weight-lift"],
    formulaSupport: [formula("weight-lift")],
  },
  "dynamics-torque-equilibrium": {
    domainId: "dynamics",
    order: 85,
    title: "Момент силы и равновесие",
    summary: "Вращающий эффект силы задают её модуль, перпендикулярное плечо и знак направления вращения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-resultant-force-1d", "core-vectors-and-projections"],
    helpSectionIds: ["torque-balance"],
    formulaSupport: [formula("torque-balance")],
  },
  "dynamics-simple-machines": {
    domainId: "dynamics",
    order: 87,
    title: "Рычаги и блоки",
    summary: "Простые механизмы меняют направление силы или распределяют нагрузку между плечами и ветвями нити.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-torque-equilibrium", "dynamics-gravity-and-weight"],
    helpSectionIds: ["movable-pulley"],
    formulaSupport: [formula("movable-pulley")],
  },
  "dynamics-impulse": {
    domainId: "dynamics",
    order: 90,
    title: "Импульс силы",
    summary: "Действие силы за время связывается с изменением импульса тела.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-newton-second-law", "kinematics-motion-description"],
    helpSectionIds: ["impulse-force"],
    formulaSupport: [formula("impulse-momentum")],
  },
  "dynamics-momentum-conservation": {
    domainId: "dynamics",
    order: 100,
    title: "Сохранение импульса системы",
    summary: "Для сцепившихся тел сохраняется суммарный импульс замкнутой системы.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-impulse"],
    helpSectionIds: ["momentum"],
    formulaSupport: [formula("inelastic-collision-speed")],
  },
  "dynamics-kinetic-energy": {
    domainId: "dynamics",
    order: 130,
    title: "Кинетическая энергия",
    summary: "Энергия движения зависит от массы и квадрата скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-work", "core-algebra-and-proportions"],
    helpSectionIds: ["kinetic-energy"],
    formulaSupport: [formula("kinetic-energy")],
  },
  "dynamics-potential-energy": {
    domainId: "dynamics",
    order: 135,
    title: "Потенциальная энергия",
    summary: "Энергия взаимодействия зависит от взаимного положения тел и выбранного нулевого уровня.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-work", "dynamics-gravity-and-weight", "core-algebra-and-proportions"],
    helpSectionIds: ["potential-energy"],
    formulaSupport: [formula("gravitational-potential-energy")],
  },
  "dynamics-mechanical-energy-conservation": {
    domainId: "dynamics",
    order: 140,
    title: "Сохранение механической энергии",
    summary: "Без сопротивления кинетическая и потенциальная энергии превращаются друг в друга при постоянной сумме.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-kinetic-energy", "dynamics-potential-energy"],
    helpSectionIds: ["energy-conservation"],
    formulaSupport: [formula("mechanical-energy-conservation")],
  },
  "dynamics-contact-pressure": {
    domainId:"dynamics",order:110,title:"Давление на опору",summary:"Результат действия силы зависит от площади контакта.",availability:"learnable",isIntroduction:false,stagePlanId:"concept-first-v1",prerequisiteIds:["dynamics-interactions"],helpSectionIds:["contact-pressure"],formulaSupport:[formula("contact-pressure")],
  },
  "dynamics-hydrostatic-pressure": {domainId:"dynamics",order:115,title:"Давление жидкости",summary:"Давление покоящейся жидкости растёт с плотностью и глубиной.",availability:"learnable",isIntroduction:false,stagePlanId:"concept-first-v1",prerequisiteIds:["dynamics-contact-pressure"],helpSectionIds:["hydrostatic-pressure"],formulaSupport:[formula("hydrostatic-pressure")]},
  "dynamics-archimedes-force": {
    domainId: "dynamics",
    order: 117,
    title: "Сила Архимеда",
    summary: "Разность сил давления создаёт направленную вверх силу, равную весу вытесненной среды.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-hydrostatic-pressure", "dynamics-gravity-and-weight"],
    helpSectionIds: ["archimedes-force"],
    formulaSupport: [formula("archimedes-force")],
  },
  "dynamics-buoyant-transport": {
    domainId: "dynamics",
    order: 118,
    title: "Плавание судов и воздухоплавание",
    summary: "Средняя плотность, водоизмещение и баланс сил объясняют осадку судна, балласт и подъём аэростата.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-archimedes-force"],
    helpSectionIds: ["ship-payload"],
    formulaSupport: [formula("ship-payload")],
  },
  "dynamics-work": {
    domainId: "dynamics",
    order: 120,
    title: "Работа силы",
    summary: "Работа выбранной силы связывает силу, путь и её роль в изменении движения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-interactions", "kinematics-motion-description"],
    helpSectionIds: ["work-energy"],
    formulaSupport: [formula("work-force-distance"), formula("work-at-angle")],
  },
  "dynamics-power": {
    domainId: "dynamics",
    order: 125,
    title: "Механическая мощность",
    summary: "Мощность показывает, какая работа совершается за единицу времени.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-work", "core-algebra-and-proportions"],
    helpSectionIds: ["work-energy"],
    formulaSupport: [formula("mechanical-power")],
  },
  "dynamics-mechanical-efficiency": {
    domainId: "dynamics",
    order: 123,
    title: "Коэффициент полезного действия",
    summary: "КПД показывает, какая доля всей совершённой работы даёт полезный результат.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-work", "core-algebra-and-proportions"],
    helpSectionIds: ["work-energy"],
    formulaSupport: [formula("mechanical-efficiency")],
  },
  "electrodynamics-electrostatics": {
    domainId: "electrodynamics",
    order: 5,
    title: "Электризация и элементарный заряд",
    summary: "Электризация переносит электроны, заряд сохраняется и изменяется целыми порциями.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-particles-and-models", "core-quantities-and-units"],
    helpSectionIds: ["elementary-charge"],
    formulaSupport: [formula("elementary-charge-count")],
  },
  "electrodynamics-charge-current-voltage": {
    domainId: "electrodynamics",
    order: 10,
    title: "Заряд, ток и напряжение",
    summary: "Ток описывает перенос заряда, а напряжение — энергетическую разность между точками.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-electrostatics", "core-quantities-and-units"],
    helpSectionIds: ["ohms-law"],
    formulaSupport: [],
  },
  "electrodynamics-ohm-law": {
    domainId: "electrodynamics",
    order: 20,
    title: "Закон Ома для участка цепи",
    summary: "Ток определяется напряжением и сопротивлением выбранного участка.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-charge-current-voltage", "core-algebra-and-proportions"],
    helpSectionIds: ["ohms-law"],
    formulaSupport: [formula("ohm-law")],
  },
  "electrodynamics-resistor-networks": {
    domainId: "electrodynamics",
    order: 30,
    title: "Соединения резисторов",
    summary: "Схема сначала сворачивается до эквивалентного сопротивления, затем применяется закон Ома.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-wire-resistance"],
    helpSectionIds: ["ohms-law"],
    formulaSupport: [formula("series-parallel")],
  },
  "electrodynamics-complete-circuit": {
    domainId: "electrodynamics",
    order: 40,
    title: "Полная цепь",
    summary: "Источник имеет внутреннее сопротивление, которое входит в полное сопротивление цепи.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-resistor-networks"],
    helpSectionIds: ["full-circuit"],
    formulaSupport: [formula("source-internal-resistance")],
  },
  "electrodynamics-electric-power": {
    domainId: "electrodynamics",
    order: 50,
    title: "Мощность электрического тока",
    summary: "Мощность связывает передаваемую энергию с током и напряжением.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-ohm-law"],
    helpSectionIds: ["electric-power"],
    formulaSupport: [formula("electric-power")],
  },
  "electrodynamics-magnetic-field": {
    domainId: "electrodynamics",
    order: 55,
    title: "Магнитное поле тока",
    summary: "Магнитная стрелка обнаруживает поле, а направление тока определяет направление поля проводника и полюса катушки.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-charge-current-voltage"],
    helpSectionIds: ["magnetic-field"],
    formulaSupport: [formula("magnetic-field-direction")],
  },
  "electrodynamics-charge-sharing": {
    domainId: "electrodynamics",
    order: 60,
    title: "Сохранение и деление заряда",
    summary: "Общий заряд сохраняется и у одинаковых проводников после контакта делится поровну.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-charge-current-voltage", "core-algebra-and-proportions"],
    helpSectionIds: ["charge-sharing"],
    formulaSupport: [formula("charge-sharing")],
  },
  "electrodynamics-capacitor-energy": {
    domainId: "electrodynamics",
    order: 70,
    title: "Энергия конденсатора",
    summary: "Энергия электрического поля зависит от ёмкости и квадрата напряжения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-charge-sharing", "core-algebra-and-proportions"],
    helpSectionIds: ["capacitor-energy"],
    formulaSupport: [formula("capacitor-energy")],
  },
  "electrodynamics-wire-resistance": {
    domainId: "electrodynamics",
    order: 25,
    title: "Сопротивление проводника",
    summary: "Материал, длина и площадь поперечного сечения вместе задают сопротивление проводника.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["electrodynamics-ohm-law"],
    helpSectionIds: ["conductor-resistance"],
    formulaSupport: [formula("resistance-wire")],
  },
  "thermodynamics-particles-and-state": {
    domainId: "thermodynamics",
    order: 10,
    title: "Частицы, состояние и температура",
    summary: "Макроскопические величины описывают состояние вещества; абсолютная температура задаётся в кельвинах.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-quantities-and-units"],
    helpSectionIds: ["ideal-gas"],
    formulaSupport: [],
  },
  "thermodynamics-amount-of-substance": {
    domainId: "thermodynamics",
    order: 15,
    title: "Количество вещества и число частиц",
    summary: "Масса образца, молярная масса и постоянная Авогадро связывают макроскопический образец с числом частиц.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-particles-and-state", "core-algebra-and-proportions"],
    helpSectionIds: ["amount-of-substance"],
    formulaSupport: [formula("molecule-count-from-mass")],
  },
  "thermodynamics-gas-pressure-micro": {
    domainId: "thermodynamics",
    order: 18,
    title: "Концентрация и молекулярное давление",
    summary: "Основное уравнение МКТ связывает давление газа с концентрацией и средней энергией движения частиц.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-amount-of-substance"],
    helpSectionIds: ["particle-concentration", "ideal-gas"],
    formulaSupport: [formula("particle-concentration")],
  },
  "thermodynamics-temperature-energy": {
    domainId: "thermodynamics",
    order: 19,
    title: "Температура и средняя энергия молекул",
    summary: "Тепловое равновесие делает температуры равными, а абсолютная температура задаёт среднюю энергию поступательного движения частиц.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-gas-pressure-micro"],
    helpSectionIds: ["molecular-kinetic-energy", "ideal-gas"],
    formulaSupport: [formula("molecular-kinetic-energy")],
  },
  "thermodynamics-density-and-volume": {
    domainId: "thermodynamics",
    order: 20,
    title: "Плотность, масса и объём",
    summary: "Масса определяется плотностью и полным объёмом тела.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-particles-and-state", "core-algebra-and-proportions"],
    helpSectionIds: ["density-volume"],
    formulaSupport: [formula("density-volume-ratio")],
  },
  "thermodynamics-ideal-gas": {
    domainId: "thermodynamics",
    order: 30,
    title: "Состояние идеального газа",
    summary: "Давление, объём, количество вещества и абсолютная температура связаны одной моделью.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-temperature-energy"],
    helpSectionIds: ["ideal-gas", "gas-equation"],
    formulaSupport: [formula("mendeleev-clapeyron")],
  },
  "thermodynamics-gas-state-ratio": {
    domainId: "thermodynamics",
    order: 40,
    title: "Изменение состояния газа",
    summary: "Для одной массы газа сравниваются два состояния через отношение pV/T.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-ideal-gas"],
    helpSectionIds: ["gas-equation", "gas-isoprocesses"],
    formulaSupport: [formula("gas-state-ratio"), formula("ideal-gas-isoprocess")],
  },
  "thermodynamics-solid-structure": {
    domainId: "thermodynamics",
    order: 45,
    title: "Строение и свойства твёрдых тел",
    summary: "Дальний порядок, ориентация кристаллов и аморфное состояние определяют наблюдаемые свойства твёрдого тела.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-particles-and-state"],
    helpSectionIds: ["solid-structure"],
    formulaSupport: [formula("solid-structure-properties")],
  },
  "thermodynamics-liquid-structure": {
    domainId: "thermodynamics",
    order: 46,
    title: "Строение и свойства жидкостей",
    summary: "Ближний порядок и смена временных положений объясняют текучесть, а поверхностный слой — стремление сократить площадь.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-solid-structure"],
    helpSectionIds: ["liquid-structure"],
    formulaSupport: [formula("liquid-structure-properties")],
  },
  "thermodynamics-vapor-equilibrium": {
    domainId: "thermodynamics",
    order: 47,
    title: "Испарение, конденсация и насыщенный пар",
    summary: "Два встречных молекулярных потока создают динамическое равновесие, а насыщение задаёт границу применимости газовых законов.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-liquid-structure"],
    helpSectionIds: ["vapor-equilibrium"],
    formulaSupport: [formula("vapor-dynamic-equilibrium")],
  },
  "thermodynamics-air-humidity": {
    domainId: "thermodynamics",
    order: 48,
    title: "Влажность воздуха и точка росы",
    summary: "Относительная влажность сравнивает фактический водяной пар с насыщением при той же температуре, а психрометр измеряет это отношение через охлаждение при испарении.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-vapor-equilibrium"],
    helpSectionIds: ["air-humidity"],
    formulaSupport: [formula("relative-humidity-pressure")],
  },
  "thermodynamics-heat-amount": {
    domainId: "thermodynamics",
    order: 50,
    title: "Количество теплоты при нагревании",
    summary: "Теплота нагревания зависит от массы, теплоёмкости и изменения температуры.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-particles-and-state", "core-algebra-and-proportions"],
    helpSectionIds: ["heat-amount"],
    formulaSupport: [formula("heat-amount")],
  },
  "thermodynamics-heat-balance": {
    domainId: "thermodynamics",
    order: 60,
    title: "Тепловой баланс",
    summary: "В изолированной модели отданная теплота равна полученной.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-heat-amount"],
    helpSectionIds: ["heat-balance"],
    formulaSupport: [formula("heat-balance-simple")],
  },
  "thermodynamics-fuel-combustion": {
    domainId: "thermodynamics",
    order: 65,
    title: "Горение и энергия топлива",
    summary: "При полном сгорании теплота равна произведению удельной теплоты сгорания на массу топлива.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-heat-amount"],
    helpSectionIds: ["fuel-combustion"],
    formulaSupport: [formula("fuel-combustion-heat")],
  },
  "thermodynamics-phase-change": {
    domainId: "thermodynamics",
    order: 70,
    title: "Нагревание и фазовый переход",
    summary: "Нагрев и плавление — разные этапы, поэтому их энергии складываются.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-heat-amount"],
    helpSectionIds: ["heating-melting"],
    formulaSupport: [formula("phase-change-heat")],
  },
  "thermodynamics-vaporization": {
    domainId: "thermodynamics",
    order: 80,
    title: "Испарение, кипение и парообразование",
    summary: "Нагревание воды и превращение её в пар — отдельные энергетические стадии.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["thermodynamics-heat-amount", "thermodynamics-phase-change"],
    helpSectionIds: ["vaporization"],
    formulaSupport: [formula("vaporization-heat")],
  },
  "thermodynamics-heat-engine-reference": {
    domainId: "thermodynamics",
    order: 90,
    title: "КПД теплового двигателя",
    summary: "Справочная связь полезной работы с теплотой, полученной от нагревателя.",
    availability: "referenceOnly",
    isIntroduction: false,
    stagePlanId: null,
    prerequisiteIds: ["thermodynamics-heat-amount", "dynamics-work"],
    helpSectionIds: [],
    formulaSupport: [formula("heat-engine-efficiency", "referenceOnly")],
  },
  "optics-ray-model": {
    domainId: "optics",
    order: 10,
    title: "Лучевая модель света",
    summary: "Луч показывает направление распространения света; граничные лучи объясняют тень и полутень.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-vectors-and-projections"],
    helpSectionIds: ["shadow-and-penumbra", "reflection"],
    formulaSupport: [],
  },
  "optics-reflection": {
    domainId: "optics",
    order: 20,
    title: "Отражение света",
    summary: "Угол отражения равен углу падения; оба измеряются от нормали.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-ray-model"],
    helpSectionIds: ["reflection"],
    formulaSupport: [formula("reflection-angle")],
  },
  "optics-plane-mirror": {
    domainId: "optics",
    order: 30,
    title: "Изображение в плоском зеркале",
    summary: "Мнимое изображение симметрично предмету относительно плоскости зеркала.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-reflection"],
    helpSectionIds: ["plane-mirror"],
    formulaSupport: [formula("plane-mirror-separation")],
  },
  "optics-refractive-index": {
    domainId: "optics",
    order: 40,
    title: "Показатель преломления",
    summary: "Показатель показывает, во сколько раз свет в среде медленнее, чем в вакууме.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-ray-model", "core-algebra-and-proportions"],
    helpSectionIds: ["refractive-index"],
    formulaSupport: [formula("refractive-index-speed")],
  },
  "optics-refraction": {
    domainId: "optics",
    order: 50,
    title: "Преломление света",
    summary: "Направление луча меняется на границе сред согласно отношению показателей и синусов углов.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-refractive-index", "optics-reflection"],
    helpSectionIds: ["refraction-direction", "refraction"],
    formulaSupport: [formula("refraction-direction"), formula("snell-index-ratio")],
  },
  "optics-thin-lens": {
    domainId: "optics",
    order: 70,
    title: "Изображения в тонкой линзе",
    summary: "Опорные лучи и положение предмета относительно F и 2F определяют свойства изображения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-optical-power"],
    helpSectionIds: ["lens-image-properties", "thin-lens"],
    formulaSupport: [formula("lens-image-properties"), formula("thin-lens-image-distance")],
  },
  "optics-optical-power": {
    domainId: "optics",
    order: 60,
    title: "Оптическая сила линзы",
    summary: "Оптическая сила — обратная величина фокусного расстояния в метрах.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-refraction", "core-quantities-and-units"],
    helpSectionIds: ["optical-power"],
    formulaSupport: [formula("lens-optical-power")],
  },
  "optics-magnification": {
    domainId: "optics",
    order: 80,
    title: "Линейное увеличение",
    summary: "Отношение размеров изображения и предмета связано с расстояниями до линзы.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-thin-lens"],
    helpSectionIds: ["magnification"],
    formulaSupport: [formula("lens-image-height")],
  },
  "optics-vision-correction": {
    domainId: "optics",
    order: 90,
    title: "Коррекция зрения линзами",
    summary: "Положение фокуса относительно сетчатки определяет знак и тип корректирующей линзы.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-thin-lens", "optics-optical-power"],
    helpSectionIds: ["vision-correction"],
    formulaSupport: [formula("vision-correction")],
  },
} as const satisfies Record<ConceptNodeId, ConceptNodeDefinition>;

export const conceptNodes: readonly ConceptNode[] = CONCEPT_NODE_IDS.map((id) => ({
  id,
  ...conceptNodeDefinitions[id],
}));

export const taskFamilyConceptNodeIds = {
  "archimedes-force": "dynamics-archimedes-force",
  "ship-payload": "dynamics-buoyant-transport",
  "contact-pressure":"dynamics-contact-pressure",
  "free-fall": "kinematics-free-fall",
  "projectile-components": "kinematics-projectile-motion",
  "vt-slope": "kinematics-vt-slope",
  "vt-area": "kinematics-vt-area",
  "relative-velocity-vectors": "kinematics-relative-velocity",
  "rotation-frequency": "kinematics-rotation-frequency",
  "centripetal-acceleration": "kinematics-centripetal-acceleration",
  "average-speed-segments": "kinematics-average-speed",
  "average-speed-with-stop": "kinematics-average-speed",
  "uniform-motion-basic": "kinematics-motion-description",
  "uniform-coordinate-law": "kinematics-uniform-coordinate-law",
  "uniform-motion-graphs": "kinematics-uniform-motion-graphs",
  "unit-conversion-speed": "kinematics-speed-units",
  "gravity-force": "dynamics-gravity-and-weight",
  "gravitation-distance": "dynamics-universal-gravitation",
  "hydrostatic-pressure": "dynamics-hydrostatic-pressure",
  "newton-second": "dynamics-newton-second-law",
  "friction-force": "dynamics-friction",
  "incline-force": "dynamics-incline",
  "resultant-force": "dynamics-resultant-force-1d",
  "resultant-force-2d": "dynamics-resultant-force-2d",
  "weight-lift": "dynamics-apparent-weight",
  "torque-balance": "dynamics-torque-equilibrium",
  "movable-pulley": "dynamics-simple-machines",
  "inelastic-collision-speed": "dynamics-momentum-conservation",
  "kinetic-energy": "dynamics-kinetic-energy",
  "gravitational-potential-energy": "dynamics-potential-energy",
  "mechanical-energy-conservation": "dynamics-mechanical-energy-conservation",
  "work-force-distance": "dynamics-work",
  "work-at-angle": "dynamics-work",
  "mechanical-power": "dynamics-power",
  "mechanical-efficiency": "dynamics-mechanical-efficiency",
  "ohm-law": "electrodynamics-ohm-law",
  "conductor-resistance": "electrodynamics-wire-resistance",
  "elementary-charge-count": "electrodynamics-electrostatics",
  "resistor-network": "electrodynamics-resistor-networks",
  "source-internal-resistance": "electrodynamics-complete-circuit",
  "capacitor-energy": "electrodynamics-capacitor-energy",
  "density-volume-ratio": "thermodynamics-density-and-volume",
  "impulse-momentum": "dynamics-impulse",
  "charge-sharing": "electrodynamics-charge-sharing",
  "electric-power": "electrodynamics-electric-power",
  "magnetic-field-direction": "electrodynamics-magnetic-field",
  "ideal-gas-state": "thermodynamics-ideal-gas",
  "ideal-gas-isoprocess": "thermodynamics-gas-state-ratio",
  "solid-structure-properties": "thermodynamics-solid-structure",
  "liquid-structure-properties": "thermodynamics-liquid-structure",
  "vapor-dynamic-equilibrium": "thermodynamics-vapor-equilibrium",
  "relative-humidity-pressure": "thermodynamics-air-humidity",
  "molecule-count-from-mass": "thermodynamics-amount-of-substance",
  "particle-concentration": "thermodynamics-gas-pressure-micro",
  "molecular-kinetic-energy": "thermodynamics-temperature-energy",
  "heat-amount": "thermodynamics-heat-amount",
  "fuel-combustion-heat": "thermodynamics-fuel-combustion",
  "phase-change-heat": "thermodynamics-phase-change",
  "vaporization-heat": "thermodynamics-vaporization",
  "gas-state-ratio": "thermodynamics-gas-state-ratio",
  "heat-balance-simple": "thermodynamics-heat-balance",
  "shadow-and-penumbra": "optics-ray-model",
  "reflection-angle": "optics-reflection",
  "plane-mirror-separation": "optics-plane-mirror",
  "refraction-direction": "optics-refraction",
  "refractive-index-speed": "optics-refractive-index",
  "snell-index-ratio": "optics-refraction",
  "thin-lens-image-distance": "optics-thin-lens",
  "lens-optical-power": "optics-optical-power",
  "lens-image-height": "optics-magnification",
  "lens-image-properties": "optics-thin-lens",
  "vision-correction": "optics-vision-correction",
} as const satisfies Record<TemplateId, ConceptNodeId>;

export type ConceptGraphValidationIssueCode =
  | "duplicate-node-id"
  | "duplicate-domain-order"
  | "missing-prerequisite"
  | "self-prerequisite"
  | "cycle"
  | "missing-family-target"
  | "invalid-stage-plan"
  | "intro-node-count";

export type ConceptGraphValidationIssue = {
  code: ConceptGraphValidationIssueCode;
  message: string;
};

export type ConceptGraphValidationResult = {
  valid: boolean;
  issues: readonly ConceptGraphValidationIssue[];
};

const conceptNodeById = new Map(conceptNodes.map((node) => [node.id, node]));
const domainRank = new Map(LEARNING_DOMAIN_IDS.map((domainId, index) => [domainId, index]));

function compareNodes(left: ConceptNode, right: ConceptNode): number {
  const domainDifference =
    (domainRank.get(left.domainId) ?? Number.MAX_SAFE_INTEGER) -
    (domainRank.get(right.domainId) ?? Number.MAX_SAFE_INTEGER);
  return domainDifference || left.order - right.order || left.id.localeCompare(right.id);
}

function topologicalSortInternal(nodes: readonly ConceptNode[]): {
  ordered: ConceptNode[];
  unresolvedIds: ConceptNodeId[];
} {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const incomingCount = new Map<ConceptNodeId, number>();
  const dependants = new Map<ConceptNodeId, ConceptNodeId[]>();

  for (const node of nodes) {
    const knownPrerequisites = node.prerequisiteIds.filter((id) => nodeMap.has(id));
    incomingCount.set(node.id, knownPrerequisites.length);
    for (const prerequisiteId of knownPrerequisites) {
      const current = dependants.get(prerequisiteId) ?? [];
      current.push(node.id);
      dependants.set(prerequisiteId, current);
    }
  }

  const queue = nodes.filter((node) => incomingCount.get(node.id) === 0).sort(compareNodes);
  const ordered: ConceptNode[] = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    ordered.push(node);

    for (const dependantId of dependants.get(node.id) ?? []) {
      const nextCount = (incomingCount.get(dependantId) ?? 0) - 1;
      incomingCount.set(dependantId, nextCount);
      if (nextCount === 0) {
        const dependant = nodeMap.get(dependantId);
        if (dependant) {
          queue.push(dependant);
          queue.sort(compareNodes);
        }
      }
    }
  }

  const orderedIds = new Set(ordered.map((node) => node.id));
  return {
    ordered,
    unresolvedIds: nodes.filter((node) => !orderedIds.has(node.id)).map((node) => node.id),
  };
}

export function validateConceptGraph(
  nodes: readonly ConceptNode[] = conceptNodes,
  familyMapping: Readonly<Record<string, string>> = taskFamilyConceptNodeIds,
): ConceptGraphValidationResult {
  const issues: ConceptGraphValidationIssue[] = [];
  const nodeMap = new Map<ConceptNodeId, ConceptNode>();
  const orderKeys = new Set<string>();

  for (const node of nodes) {
    if (nodeMap.has(node.id)) {
      issues.push({
        code: "duplicate-node-id",
        message: `Concept node "${node.id}" is declared more than once.`,
      });
    }
    nodeMap.set(node.id, node);

    const orderKey = `${node.domainId}:${node.order}`;
    if (orderKeys.has(orderKey)) {
      issues.push({
        code: "duplicate-domain-order",
        message: `Domain "${node.domainId}" has more than one node at order ${node.order}.`,
      });
    }
    orderKeys.add(orderKey);

    const hasStagePlan =
      node.stagePlanId !== null && node.stagePlanId in learningStagePlans;
    if (node.stagePlanId !== null && !hasStagePlan) {
      issues.push({
        code: "invalid-stage-plan",
        message: `Concept node "${node.id}" references an unknown stage plan.`,
      });
    }

    for (const prerequisiteId of node.prerequisiteIds) {
      if (prerequisiteId === node.id) {
        issues.push({
          code: "self-prerequisite",
          message: `Concept node "${node.id}" cannot depend on itself.`,
        });
      }
    }
  }

  for (const node of nodes) {
    for (const prerequisiteId of node.prerequisiteIds) {
      if (!nodeMap.has(prerequisiteId)) {
        issues.push({
          code: "missing-prerequisite",
          message: `Concept node "${node.id}" depends on missing node "${prerequisiteId}".`,
        });
      }
    }
  }

  for (const [familyId, nodeId] of Object.entries(familyMapping)) {
    if (!nodeMap.has(nodeId as ConceptNodeId)) {
      issues.push({
        code: "missing-family-target",
        message: `Task family "${familyId}" points to missing concept node "${nodeId}".`,
      });
    }
  }

  const { unresolvedIds } = topologicalSortInternal(nodes);
  if (unresolvedIds.length > 0) {
    issues.push({
      code: "cycle",
      message: `Concept graph contains a cycle among: ${unresolvedIds.join(", ")}.`,
    });
  }

  for (const topicId of ACTIVE_TOPIC_IDS) {
    const introductions = nodes.filter(
      (node) =>
        node.domainId === topicId &&
        node.availability === "learnable" &&
        node.isIntroduction,
    );
    if (introductions.length !== 1) {
      issues.push({
        code: "intro-node-count",
        message: `Topic "${topicId}" must have exactly one learnable introduction; found ${introductions.length}.`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

export function assertConceptGraphValid(): void {
  const result = validateConceptGraph();
  if (!result.valid) {
    throw new Error(
      `Invalid concept graph:\n${result.issues.map((issue) => `- ${issue.message}`).join("\n")}`,
    );
  }
}

export function isConceptNodeId(value: string): value is ConceptNodeId {
  return conceptNodeById.has(value as ConceptNodeId);
}

export function getConceptNode(nodeId: string): ConceptNode | null {
  return isConceptNodeId(nodeId) ? conceptNodeById.get(nodeId) ?? null : null;
}

export function getConceptNodesForDomain(domainId: LearningDomainId): readonly ConceptNode[] {
  return conceptNodes.filter((node) => node.domainId === domainId).sort(compareNodes);
}

export function getIntroductoryConceptNode(topicId: TopicId): ConceptNode | null {
  return (
    conceptNodes.find(
      (node) =>
        node.domainId === topicId &&
        node.availability === "learnable" &&
        node.isIntroduction,
    ) ?? null
  );
}

function isMappedTaskFamilyId(value: string): value is TemplateId {
  return Object.prototype.hasOwnProperty.call(taskFamilyConceptNodeIds, value);
}

export function getConceptNodeForTaskFamily(familyId: string): ConceptNode | null {
  if (!isMappedTaskFamilyId(familyId)) {
    return null;
  }
  return getConceptNode(taskFamilyConceptNodeIds[familyId]);
}

export function getTaskFamiliesForConceptNode(nodeId: string): readonly TemplateId[] {
  if (!isConceptNodeId(nodeId)) {
    return [];
  }

  return (Object.entries(taskFamilyConceptNodeIds) as [TemplateId, ConceptNodeId][])
    .filter(([, mappedNodeId]) => mappedNodeId === nodeId)
    .map(([familyId]) => familyId);
}

/**
 * Orders practice families by the same prerequisite graph that defines the
 * teaching sequence. Keeping this in the graph module prevents API mixes from
 * silently falling back to registry/import order.
 */
export function orderTaskFamiliesByConceptGraph(
  familyIds: readonly TemplateId[],
): readonly TemplateId[] {
  const nodePositions = new Map(
    topologicallySortConceptNodes().map((node, index) => [node.id, index]),
  );

  return [...familyIds].sort((left, right) => {
    const leftNodeId = taskFamilyConceptNodeIds[left];
    const rightNodeId = taskFamilyConceptNodeIds[right];
    const graphDifference =
      (nodePositions.get(leftNodeId) ?? Number.MAX_SAFE_INTEGER) -
      (nodePositions.get(rightNodeId) ?? Number.MAX_SAFE_INTEGER);

    return graphDifference || left.localeCompare(right);
  });
}

/** Returns the next taught topic, derived from introductory graph nodes. */
export function getNextActiveTopicId(topicId: TopicId): TopicId | null {
  const introductions = topologicallySortConceptNodes().filter(
    (node): node is ConceptNode & { domainId: TopicId } =>
      node.domainId !== "core" && node.availability === "learnable" && node.isIntroduction,
  );
  const currentIndex = introductions.findIndex((node) => node.domainId === topicId);

  return currentIndex >= 0 ? introductions[currentIndex + 1]?.domainId ?? null : null;
}

export function getDirectPrerequisites(nodeId: string): readonly ConceptNode[] {
  const node = getConceptNode(nodeId);
  if (!node) return [];
  return node.prerequisiteIds.flatMap((id) => {
    const prerequisite = getConceptNode(id);
    return prerequisite ? [prerequisite] : [];
  });
}

export function getPrerequisiteClosure(nodeId: string): readonly ConceptNode[] {
  const node = getConceptNode(nodeId);
  if (!node) return [];

  const collected = new Set<ConceptNodeId>();
  const collect = (currentId: ConceptNodeId) => {
    const current = conceptNodeById.get(currentId);
    if (!current) return;
    for (const prerequisiteId of current.prerequisiteIds) {
      if (collected.has(prerequisiteId)) continue;
      collected.add(prerequisiteId);
      collect(prerequisiteId);
    }
  };
  collect(node.id);

  return topologicallySortConceptNodes().filter((candidate) => collected.has(candidate.id));
}

export function isConceptPrerequisite(
  prerequisiteId: string,
  conceptId: string,
): boolean {
  if (!isConceptNodeId(prerequisiteId)) return false;
  return getPrerequisiteClosure(conceptId).some((node) => node.id === prerequisiteId);
}

export function isConceptUnlocked(
  nodeId: string,
  completedNodeIds: ReadonlySet<ConceptNodeId>,
): boolean {
  const node = getConceptNode(nodeId);
  return Boolean(
    node && node.prerequisiteIds.every((prerequisiteId) => completedNodeIds.has(prerequisiteId)),
  );
}

export function getStagePlanForConceptNode(nodeId: string): LearningStagePlan | null {
  const node = getConceptNode(nodeId);
  if (!node || node.stagePlanId === null) return null;
  return learningStagePlans[node.stagePlanId];
}

export function topologicallySortConceptNodes(
  nodes: readonly ConceptNode[] = conceptNodes,
): readonly ConceptNode[] {
  const { ordered, unresolvedIds } = topologicalSortInternal(nodes);
  if (unresolvedIds.length > 0) {
    throw new Error(`Concept graph contains a cycle among: ${unresolvedIds.join(", ")}.`);
  }
  return ordered;
}

assertConceptGraphValid();
