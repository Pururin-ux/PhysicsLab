import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { getFocusedPracticeNextConcept } from "./focused-practice-next.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import { getTextbookChapter } from "./textbook.ts";

test("only selected focused families offer a distinct, existing next destination", () => {
  const selected: Record<string, { href: string; label: string }> = {
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
  const knownFamilies = new Set<string>(templateRegistry.map((template) => template.id));

  for (const template of templateRegistry) {
    const nextConcept = getFocusedPracticeNextConcept(template.id);
    assert.deepEqual(nextConcept, selected[template.id] ?? null, template.id);
    if (!nextConcept) continue;

    const explanation = getLearningDestinationForFamily(template.id)?.explanation;
    assert.ok(explanation, `${template.id} needs its existing explanation`);
    assert.notEqual(nextConcept.href, explanation.href);

    if (nextConcept.href.startsWith("/learn/")) {
      assert.ok(getTextbookChapter(nextConcept.href.slice("/learn/".length)));
    } else {
      assert.ok(nextConcept.href.startsWith("/practice/family/"));
      assert.ok(knownFamilies.has(nextConcept.href.slice("/practice/family/".length)));
    }
  }

  for (const familyId of Object.keys(selected)) {
    assert.ok(knownFamilies.has(familyId));
  }
});
