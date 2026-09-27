import assert from "node:assert/strict";
import test from "node:test";
import { templateRegistry } from "../server/task-generator/generate.ts";
import { formulaReference } from "../physics/formula-reference.ts";
import { getReferenceSolution, referencePilotIds } from "./reference-solutions.ts";
import {
  buildFormulaHref,
  getFormulaEntriesForSkill,
  getFormulaReferenceView,
  getLearningDestination,
  getLearningDestinationForFamily,
  getChapterPracticeReturn,
} from "./learning-links.ts";
import { getTextbookChapter } from "./textbook.ts";
import { taskLearningMetadataByTemplateId } from "./task-metadata.ts";
import { skillMetadata } from "./taxonomy.ts";

test("every generated family has one exact learning destination", () => {
  for (const template of templateRegistry) {
    const destination = getLearningDestinationForFamily(template.id);
    assert.ok(destination, `${template.id} must resolve to a learning destination`);
    assert.equal(destination.familyId, template.id);
    assert.equal(destination.taskHref, `/tasks/${template.id}`);
    assert.equal(destination.practiceHref, `/practice/family/${template.id}`);
  }
});

test("learning destinations are driven by metadata, not display copy", () => {
  for (const metadata of Object.values(taskLearningMetadataByTemplateId)) {
    const destination = getLearningDestination(metadata.skillId);
    assert.ok(destination);
    assert.equal(destination.familyId, metadata.templateId);
    assert.ok(destination.skillId in skillMetadata);
  }

  assert.equal(getLearningDestination("not-a-skill"), null);
  assert.equal(getLearningDestinationForFamily("not-a-template"), null);
});

test("formula links expose related task families through canonical skill ids", () => {
  const view = getFormulaReferenceView();
  const visibleFormulaIds = new Set(view.flatMap((group) => group.entries.map((entry) => entry.id)));

  for (const group of formulaReference) {
    for (const entry of group.entries) {
      assert.ok(visibleFormulaIds.has(entry.id));
      assert.equal(buildFormulaHref(entry.id), `/formulas?formula=${encodeURIComponent(entry.id)}`);

      for (const skillId of entry.relatedSkillIds) {
        const destination = getLearningDestination(skillId);
        assert.ok(destination, `${entry.id} points to an unknown learning skill ${skillId}`);
        assert.ok(entry.relatedSkillIds.length >= 1);
      }
    }
  }

  assert.ok(getFormulaEntriesForSkill("ohm-law").some((entry) => entry.id === "ohm-law"));
  assert.deepEqual(getFormulaEntriesForSkill("not-a-skill"), []);
});

test("reference solution pilots remain an explicit subset of task families", () => {
  for (const familyId of referencePilotIds) {
    assert.ok(getLearningDestinationForFamily(familyId));
    assert.ok(getReferenceSolution(familyId));
  }

  assert.equal(getReferenceSolution("unit-conversion-speed"), undefined);
});

test("textbook explanations point to existing chapters and return to the same task family", () => {
  for (const template of templateRegistry) {
    const destination = getLearningDestinationForFamily(template.id);
    if (!destination?.explanation) continue;
    const url = new URL(destination.explanation.href, "https://physicslab.test");
    if (!url.pathname.startsWith("/learn/")) continue;
    const chapterId = url.pathname.split("/").pop()!;
    assert.ok(getTextbookChapter(chapterId), `Missing chapter for ${template.id}`);
    assert.equal(url.searchParams.get("practice"), template.id);
    assert.equal(getChapterPracticeReturn(chapterId, template.id)?.href, destination.practiceHref);
  }
});

test("families keep their current exact explanation routes", () => {
  assert.deepEqual(getLearningDestinationForFamily("newton-second")?.explanation, {
    href: "/learn/newton-second-law?practice=newton-second",
    label: "Как сила и масса определяют ускорение",
  });
  assert.deepEqual(getLearningDestinationForFamily("unit-conversion-speed")?.explanation, {
    href: "/learn/uniform-motion?practice=unit-conversion-speed",
    label: "Как согласовать км/ч и минуты перед расчётом пути",
  });
  assert.deepEqual(getLearningDestinationForFamily("ohm-law")?.explanation, {
    href: "/learn/electric-current-and-ohms-law?practice=ohm-law",
    label: "Как связаны ток, напряжение и сопротивление",
  });
  assert.deepEqual(getLearningDestinationForFamily("source-internal-resistance")?.explanation, {
    href: "/learn/full-circuit-ohms-law?practice=source-internal-resistance",
    label: "Почему напряжение источника падает под нагрузкой",
  });
  assert.deepEqual(getLearningDestinationForFamily("reflection-angle")?.explanation, {
    href: "/learn/reflection-of-light?practice=reflection-angle",
    label: "Откуда считать углы падения и отражения",
  });
  assert.equal(getChapterPracticeReturn("newton-second-law", "newton-second")?.href, "/practice/family/newton-second");
  assert.equal(getChapterPracticeReturn("electric-current-and-ohms-law", "ohm-law")?.href, "/practice/family/ohm-law");
  assert.equal(getChapterPracticeReturn("reflection-of-light", "reflection-angle")?.href, "/practice/family/reflection-angle");
  assert.deepEqual(getLearningDestinationForFamily("graduated-scale-reading")?.explanation, {
    href: "/learn/reading-scales?practice=graduated-scale-reading",
    label: "Как снять показание с мензурки",
  });
});

test("chapter return ignores foreign, unrelated and missing task origins", () => {
  assert.equal(getChapterPracticeReturn("density", "contact-pressure"), null);
  assert.equal(getChapterPracticeReturn("density", "https://example.com"), null);
  assert.equal(getChapterPracticeReturn("density", ""), null);
  assert.equal(getChapterPracticeReturn("unknown", "density-volume-ratio"), null);
  assert.equal(getChapterPracticeReturn("density", "density-volume-ratio")?.href, "/practice/family/density-volume-ratio");
});

test("the household load chapter opens its own practice and returns from its explanation", () => {
  const chapter = getTextbookChapter("electricity-use-and-safety");
  const destination = getLearningDestinationForFamily("household-load-current");

  assert.equal(chapter?.practice.href, "/practice/family/household-load-current");
  assert.equal(chapter?.relatedPractice?.href, "/practice/family/electric-power");
  assert.equal(destination?.explanation?.href, "/learn/electricity-use-and-safety?practice=household-load-current");
  assert.equal(getChapterPracticeReturn("electricity-use-and-safety", "household-load-current")?.href, chapter?.practice.href);
  assert.equal(getChapterPracticeReturn("electric-work-and-power", "household-load-current"), null);
});

test("irregular body volume opens its own lesson and returns to the same practice", () => {
  const chapter = getTextbookChapter("irregular-body-volume");
  const destination = getLearningDestinationForFamily("irregular-body-volume");

  assert.equal(chapter?.practice.href, "/practice/family/irregular-body-volume");
  assert.deepEqual(destination?.explanation, {
    href: "/learn/irregular-body-volume?practice=irregular-body-volume",
    label: "Как измерить объём тела по двум отсчётам",
  });
  assert.equal(
    getChapterPracticeReturn("irregular-body-volume", "irregular-body-volume")?.href,
    chapter?.practice.href,
  );
  assert.equal(getChapterPracticeReturn("measuring-volume", "irregular-body-volume"), null);
});
