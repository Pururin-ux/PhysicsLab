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
  "core-quantities-and-units",
  "core-algebra-and-proportions",
  "core-vectors-and-projections",
  "core-graphs-and-change",
  "kinematics-motion-description",
  "kinematics-speed-units",
  "kinematics-average-speed",
  "kinematics-acceleration",
  "kinematics-vt-slope",
  "kinematics-vt-area",
  "kinematics-free-fall",
  "kinematics-relative-velocity",
  "dynamics-interactions",
  "dynamics-resultant-force-1d",
  "dynamics-resultant-force-2d",
  "dynamics-newton-second-law",
  "dynamics-normal-force",
  "dynamics-friction",
  "dynamics-incline",
  "dynamics-apparent-weight",
  "dynamics-impulse",
  "dynamics-momentum-conservation",
  "dynamics-kinetic-energy",
  "dynamics-work",
  "electrodynamics-charge-current-voltage",
  "electrodynamics-ohm-law",
  "electrodynamics-resistor-networks",
  "electrodynamics-complete-circuit",
  "electrodynamics-electric-power",
  "electrodynamics-charge-sharing",
  "electrodynamics-capacitor-energy",
  "electrodynamics-wire-resistance-reference",
  "thermodynamics-particles-and-state",
  "thermodynamics-density-and-volume",
  "thermodynamics-ideal-gas",
  "thermodynamics-gas-state-ratio",
  "thermodynamics-heat-amount",
  "thermodynamics-heat-balance",
  "thermodynamics-phase-change",
  "thermodynamics-heat-engine-reference",
  "optics-ray-model",
  "optics-reflection",
  "optics-plane-mirror",
  "optics-refractive-index",
  "optics-refraction",
  "optics-thin-lens",
  "optics-optical-power",
  "optics-magnification",
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
  stagePlanId: LearningStagePlanId;
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
    formulaSupport: [formula("uniform-motion", "referenceOnly")],
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
    order: 110,
    title: "Кинетическая энергия",
    summary: "Энергия движения зависит от массы и квадрата скорости.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["kinematics-motion-description", "core-algebra-and-proportions"],
    helpSectionIds: ["kinetic-energy"],
    formulaSupport: [formula("kinetic-energy")],
  },
  "dynamics-work": {
    domainId: "dynamics",
    order: 120,
    title: "Работа силы",
    summary: "Работа учитывает величину силы, перемещение и угол между ними.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["dynamics-interactions", "core-vectors-and-projections"],
    helpSectionIds: ["work-energy"],
    formulaSupport: [formula("work-force-distance")],
  },
  "electrodynamics-charge-current-voltage": {
    domainId: "electrodynamics",
    order: 10,
    title: "Заряд, ток и напряжение",
    summary: "Ток описывает перенос заряда, а напряжение — энергетическую разность между точками.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-quantities-and-units"],
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
    prerequisiteIds: ["electrodynamics-ohm-law"],
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
  "electrodynamics-wire-resistance-reference": {
    domainId: "electrodynamics",
    order: 80,
    title: "Сопротивление проводника",
    summary: "Справочная связь сопротивления с материалом и геометрией проводника.",
    availability: "referenceOnly",
    isIntroduction: false,
    stagePlanId: null,
    prerequisiteIds: ["electrodynamics-ohm-law"],
    helpSectionIds: ["ohms-law"],
    formulaSupport: [formula("resistance-wire", "referenceOnly")],
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
    prerequisiteIds: ["thermodynamics-particles-and-state", "core-algebra-and-proportions"],
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
    helpSectionIds: ["gas-equation"],
    formulaSupport: [formula("gas-state-ratio")],
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
  "thermodynamics-heat-engine-reference": {
    domainId: "thermodynamics",
    order: 80,
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
    summary: "Луч показывает направление распространения света, а углы отсчитываются от нормали.",
    availability: "learnable",
    isIntroduction: true,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["core-vectors-and-projections"],
    helpSectionIds: ["reflection"],
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
    helpSectionIds: ["refraction"],
    formulaSupport: [formula("snell-index-ratio")],
  },
  "optics-thin-lens": {
    domainId: "optics",
    order: 60,
    title: "Тонкая линза",
    summary: "Фокусное расстояние связывается с положением предмета и изображения.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-refraction"],
    helpSectionIds: ["thin-lens"],
    formulaSupport: [formula("thin-lens-image-distance")],
  },
  "optics-optical-power": {
    domainId: "optics",
    order: 70,
    title: "Оптическая сила линзы",
    summary: "Оптическая сила — обратная величина фокусного расстояния в метрах.",
    availability: "learnable",
    isIntroduction: false,
    stagePlanId: "concept-first-v1",
    prerequisiteIds: ["optics-thin-lens", "core-quantities-and-units"],
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
} as const satisfies Record<ConceptNodeId, ConceptNodeDefinition>;

export const conceptNodes: readonly ConceptNode[] = CONCEPT_NODE_IDS.map((id) => ({
  id,
  ...conceptNodeDefinitions[id],
}));

export const taskFamilyConceptNodeIds = {
  "free-fall": "kinematics-free-fall",
  "vt-slope": "kinematics-vt-slope",
  "vt-area": "kinematics-vt-area",
  "relative-velocity-vectors": "kinematics-relative-velocity",
  "average-speed-segments": "kinematics-average-speed",
  "unit-conversion-speed": "kinematics-speed-units",
  "newton-second": "dynamics-newton-second-law",
  "friction-force": "dynamics-friction",
  "incline-force": "dynamics-incline",
  "resultant-force": "dynamics-resultant-force-1d",
  "resultant-force-2d": "dynamics-resultant-force-2d",
  "weight-lift": "dynamics-apparent-weight",
  "inelastic-collision-speed": "dynamics-momentum-conservation",
  "kinetic-energy": "dynamics-kinetic-energy",
  "work-force-distance": "dynamics-work",
  "ohm-law": "electrodynamics-ohm-law",
  "resistor-network": "electrodynamics-resistor-networks",
  "source-internal-resistance": "electrodynamics-complete-circuit",
  "capacitor-energy": "electrodynamics-capacitor-energy",
  "density-volume-ratio": "thermodynamics-density-and-volume",
  "impulse-momentum": "dynamics-impulse",
  "charge-sharing": "electrodynamics-charge-sharing",
  "electric-power": "electrodynamics-electric-power",
  "ideal-gas-state": "thermodynamics-ideal-gas",
  "heat-amount": "thermodynamics-heat-amount",
  "phase-change-heat": "thermodynamics-phase-change",
  "gas-state-ratio": "thermodynamics-gas-state-ratio",
  "heat-balance-simple": "thermodynamics-heat-balance",
  "reflection-angle": "optics-reflection",
  "plane-mirror-separation": "optics-plane-mirror",
  "refractive-index-speed": "optics-refractive-index",
  "snell-index-ratio": "optics-refraction",
  "thin-lens-image-distance": "optics-thin-lens",
  "lens-optical-power": "optics-optical-power",
  "lens-image-height": "optics-magnification",
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
    if (
      (node.availability === "learnable" && !hasStagePlan) ||
      (node.availability !== "learnable" && node.stagePlanId !== null)
    ) {
      issues.push({
        code: "invalid-stage-plan",
        message: `Concept node "${node.id}" has an invalid stage plan for ${node.availability}.`,
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
