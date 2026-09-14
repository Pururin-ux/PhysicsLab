import type { TemplateId } from "../server/task-generator/generate.ts";

export const SCHOOL_CHECK_GRADES = [7, 8, 9] as const;

export type SchoolCheckGrade = (typeof SCHOOL_CHECK_GRADES)[number];
export type SchoolCheckTemplate = `school-check-${SchoolCheckGrade}`;
export type SchoolCheckHref = `/practice/class-check/${SchoolCheckGrade}`;

export type SchoolCheckConfig = {
  grade: SchoolCheckGrade;
  template: SchoolCheckTemplate;
  href: SchoolCheckHref;
  familyIds: readonly TemplateId[];
  skills: readonly string[];
};

// В проверки входят только семейства, для которых уже существует точное
// объяснение в материале указанного класса. Остальной банк нельзя распределять
// по классам по одному названию темы.
export const schoolChecks = [
  {
    grade: 7,
    template: "school-check-7",
    href: "/practice/class-check/7",
    familyIds: ["uniform-motion-basic", "uniform-motion-graphs", "average-speed-with-stop", "density-volume-ratio", "gravity-force", "resultant-force", "contact-pressure", "hydrostatic-pressure", "work-force-distance", "mechanical-efficiency", "mechanical-power", "kinetic-energy", "gravitational-potential-energy", "mechanical-energy-conservation"],
    skills: ["путь, скорость и время", "графики движения", "средняя скорость", "плотность и объём", "сила тяжести", "равнодействующая", "давление на опору", "давление жидкости", "механическая работа", "коэффициент полезного действия", "механическая мощность", "кинетическая энергия", "потенциальная энергия", "сохранение энергии"],
  },
  {
    grade: 8,
    template: "school-check-8",
    href: "/practice/class-check/8",
    familyIds: ["heat-amount", "phase-change-heat", "vaporization-heat", "ohm-law", "reflection-angle"],
    skills: ["количество теплоты", "плавление", "парообразование", "закон Ома", "отражение света"],
  },
  {
    grade: 9,
    template: "school-check-9",
    href: "/practice/class-check/9",
    familyIds: [
      "average-speed-segments",
      "relative-velocity-vectors",
      "vt-slope",
      "newton-second",
      "archimedes-force",
    ],
    skills: [
      "средняя скорость",
      "относительное движение",
      "ускорение по графику",
      "второй закон Ньютона",
      "сила Архимеда",
    ],
  },
] as const satisfies readonly SchoolCheckConfig[];

export function getSchoolCheckByGrade(value: string | number): SchoolCheckConfig | null {
  const grade = typeof value === "number" ? value : Number(value);
  return schoolChecks.find((check) => check.grade === grade) ?? null;
}

export function getSchoolCheckByTemplate(value: string): SchoolCheckConfig | null {
  return schoolChecks.find((check) => check.template === value) ?? null;
}
