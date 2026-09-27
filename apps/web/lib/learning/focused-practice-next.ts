import type { TemplateId } from "../server/task-generator/generate.ts";

type NextConcept = { href: string; label: string };

// Authored handoffs after a focused five-task practice, not a topic-wide rule.
const nextConceptByFamily: Partial<Record<TemplateId, NextConcept>> = {
  "length-unit-conversion": {
    href: "/learn/measuring-volume",
    label: "Как найти объём по размерам?",
  },
  "rectangular-block-volume": {
    href: "/learn/reading-scales",
    label: "Как снять показание со шкалы?",
  },
  "graduated-scale-reading": {
    href: "/learn/irregular-body-volume",
    label: "Как измерить объём камешка?",
  },
  "heat-amount": {
    href: "/practice/family/heat-balance-simple",
    label: "Какая температура получится при смешивании воды?",
  },
  "heat-balance-simple": {
    href: "/learn/fuel-combustion",
    label: "Сколько теплоты выделит топливо?",
  },
  "lc-period": {
    href: "/learn/alternating-current",
    label: "Почему ток меняет направление при вращении рамки?",
  },
};

export function getFocusedPracticeNextConcept(familyId: TemplateId): NextConcept | null {
  return nextConceptByFamily[familyId] ?? null;
}
