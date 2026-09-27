import assert from "node:assert/strict";
import test from "node:test";
import { textbookChapters } from "./textbook.ts";
import { learningEntries } from "./learning-entry.ts";
import { lessonDraftExportCodecs } from "./lesson-draft.ts";
import { textbookChapterIds } from "./textbook-index.ts";
import { projectTextbookContents, projectTextbookContentsEntry, projectTextbookOutline } from "./textbook-outline.ts";
import { buildTextbookReviewItem, projectTextbookReviewChapter } from "./textbook-review.ts";

test("the lightweight textbook registry and contents stay aligned", () => {
  const outlines = textbookChapters.map(projectTextbookOutline);
  const entries = learningEntries.filter(entry => entry.grade !== undefined).map(projectTextbookContentsEntry);
  const contents = projectTextbookContents(outlines, entries);
  const reviewChapters = textbookChapters.map(projectTextbookReviewChapter);

  assert.deepEqual(textbookChapters.map(chapter => chapter.id), textbookChapterIds);
  assert.deepEqual(
    lessonDraftExportCodecs
      .filter(codec => codec.key.startsWith("physicslab-lesson-draft-textbook-check-"))
      .map(codec => codec.key.slice("physicslab-lesson-draft-textbook-check-".length)),
    textbookChapterIds,
  );
  assert.deepEqual(contents.map(item => item.id), outlines.map(chapter => chapter.id));
  assert.deepEqual(outlines[0].check, {
    question: textbookChapters[0].check.question,
    options: textbookChapters[0].check.options,
    correct: textbookChapters[0].check.correct,
  });
  assert.equal("sections" in outlines[0], false);
  assert.equal("example" in outlines[0], false);
  assert.equal("lead" in outlines[0], false);
  assert.equal("keywords" in entries[0], false);
  assert.equal("coverage" in entries[0], false);
  const firstCheck = textbookChapters[0].check;
  const wrongAnswer = firstCheck.options.find((_, index) => index !== firstCheck.correct);
  assert.ok(wrongAnswer);
  const reviewItem = buildTextbookReviewItem(reviewChapters[0], {
    questionKey: JSON.stringify([firstCheck.question, firstCheck.options]),
    answer: wrongAnswer,
    checked: true,
  });
  assert.equal(reviewItem?.id, textbookChapters[0].id);
  assert.equal(reviewItem?.feedback, firstCheck.feedback[firstCheck.options.indexOf(wrongAnswer)]);

  const fullBytes = Buffer.byteLength(JSON.stringify(textbookChapters));
  const allLearningEntriesBytes = Buffer.byteLength(JSON.stringify(learningEntries.filter(entry => entry.grade !== undefined)));
  const projectedEntriesBytes = Buffer.byteLength(JSON.stringify(entries));
  const chapterOutlineBytes = Buffer.byteLength(JSON.stringify(outlines));
  const outlineBytes = Buffer.byteLength(JSON.stringify({ chapters: outlines, entries }));
  const contentsBytes = Buffer.byteLength(JSON.stringify(contents));
  const reviewBytes = Buffer.byteLength(JSON.stringify(reviewChapters));
  assert.ok(chapterOutlineBytes < fullBytes * 0.15, `${chapterOutlineBytes} bytes is not smaller than ${fullBytes} bytes`);
  assert.ok(reviewBytes < fullBytes * 0.3, `${reviewBytes} bytes is not smaller than ${fullBytes} bytes`);
  assert.ok(projectedEntriesBytes < allLearningEntriesBytes, `${projectedEntriesBytes} bytes is not smaller than ${allLearningEntriesBytes} bytes`);
  assert.ok(outlineBytes < (fullBytes + allLearningEntriesBytes) * 0.25, `${outlineBytes} bytes is not smaller than the full page data`);
  assert.ok(contentsBytes < outlineBytes, `${contentsBytes} bytes is not smaller than the separate contents props`);
});

test("contents projection keeps chapter order, first matching entry and resource-only extras", () => {
  const chapters = textbookChapters.slice(0, 2).map(projectTextbookOutline);
  const entry = projectTextbookContentsEntry(learningEntries.find(item => item.id === chapters[0].id)!);
  const duplicate = { ...entry, question: "Поздний дубликат" };
  const extra = {
    ...entry,
    id: "extra-resource",
    grade: 7 as const,
    unit: undefined,
    resources: [{ label: "Задача", href: "/practice/family/example" }],
  };
  const hidden = { ...extra, id: "unavailable-resource", grade: undefined };
  const contents = projectTextbookContents(chapters, [entry, duplicate, extra, hidden]);

  assert.deepEqual(contents.map(item => item.id), [chapters[0].id, chapters[1].id, extra.id]);
  assert.equal(contents[0].question, entry.question);
  assert.equal(contents[0].href, "/learn/" + chapters[0].id);
  assert.equal(contents[0].check?.correct, chapters[0].check.correct);
  assert.equal(contents[1].question, chapters[1].title);
  assert.deepEqual(contents[1].resources, []);
  assert.equal(contents[2].href, extra.resources[0].href);
  assert.equal(contents[2].unit, extra.group);
  assert.equal(contents[2].check, undefined);
});

test("topic entries keep direct chapter practice beside the explanation", () => {
  const unitsEntry = learningEntries.find(entry => entry.id === "si-units-and-operations");
  assert.ok(unitsEntry);
  assert.deepEqual(unitsEntry.resources.slice(0, 2), [
    { label: "Объяснение и опыт", href: "/learn/si-units-and-operations" },
    { label: "Потренировать перевод длины в метры", href: "/practice/family/length-unit-conversion" },
  ]);
  assert.equal(
    unitsEntry.resources.filter(resource => resource.href === "/practice/family/length-unit-conversion").length,
    1,
  );

  const scalesEntry = learningEntries.find(entry => entry.id === "reading-scales");
  assert.ok(scalesEntry);
  assert.ok(scalesEntry.resources.some(resource => resource.href === "/practice/family/graduated-scale-reading"));

  const volumeEntry = learningEntries.find(entry => entry.id === "irregular-body-volume");
  assert.ok(volumeEntry);
  assert.equal(scalesEntry.connection?.href, "/learn/irregular-body-volume");
  assert.equal(volumeEntry.connection?.href, "/learn/particle-model-and-diffusion");
  assert.deepEqual(volumeEntry.resources.slice(0, 2), [
    { label: "Объяснение и опыт", href: "/learn/irregular-body-volume" },
    { label: "Решать задачи на объём по двум отсчётам", href: "/practice/family/irregular-body-volume" },
  ]);
  assert.ok(volumeEntry.resources.some(resource => resource.href === "/practice/family/graduated-scale-reading"));
  assert.equal(volumeEntry.resources.filter(resource => resource.href === "/practice/family/irregular-body-volume").length, 1);
  assert.equal(volumeEntry.resources.filter(resource => resource.href === "/practice/family/graduated-scale-reading").length, 1);

  const firstEntry = learningEntries.find(entry => entry.id === "physical-body-phenomenon-quantity");
  assert.ok(firstEntry);
  assert.equal(firstEntry.connection?.href, "/learn/scientific-method");
  assert.equal(firstEntry.resources.some(resource => resource.href === "/learn/scientific-method"), false);
});

test("XI electricity questions reach transmission and its environmental context without a required sequence", () => {
  const lc = learningEntries.find(entry => entry.id === "lc-oscillations");
  const ac = learningEntries.find(entry => entry.id === "alternating-current");
  const transformer = learningEntries.find(entry => entry.id === "transformer");
  const transformerChapter = textbookChapters.find(chapter => chapter.id === "transformer");
  const transmission = learningEntries.find(entry => entry.id === "electric-energy-transmission");
  const transmissionChapter = textbookChapters.find(chapter => chapter.id === "electric-energy-transmission");
  const environment = learningEntries.find(entry => entry.id === "energy-sources-and-environment");
  const environmentChapter = textbookChapters.find(chapter => chapter.id === "energy-sources-and-environment");
  assert.ok(lc);
  assert.ok(ac);
  assert.ok(transformer);
  assert.ok(transformerChapter);
  assert.ok(transmission);
  assert.ok(transmissionChapter);
  assert.ok(environment);
  assert.ok(environmentChapter);
  assert.equal(lc.connection?.href, "/learn/alternating-current");
  assert.equal(ac.question, "Почему ток меняет направление при вращении рамки?");
  assert.equal(ac.connection?.href, "/learn/transformer");
  assert.ok(ac.resources.some(resource => resource.href === "/practice/family/ac-oscillogram-frequency"));
  assert.ok(ac.resources.some(resource => resource.href === "/learn/lc-oscillations"));
  assert.equal(ac.resources.filter(resource => resource.href === "/practice/family/ac-oscillogram-frequency").length, 1);
  assert.equal(transformerChapter.source.section, "§ 9");
  assert.equal(transformerChapter.practice.href, "/practice/family/transformer-voltage-ratio");
  assert.ok(transformer.resources.some(resource => resource.href === transformerChapter.practice.href));
  assert.equal(transformer.connection?.href, "/learn/electric-energy-transmission");
  assert.equal(transmissionChapter.source.section, "§ 10");
  assert.equal(transmissionChapter.practice.href, "/practice/family/transmission-line-loss");
  assert.ok(transmission.resources.some(resource => resource.href === transmissionChapter.practice.href));
  assert.equal(transmission.connection?.href, "/learn/energy-sources-and-environment");
  assert.equal(environmentChapter.source.section, "§ 11");
  assert.equal(environmentChapter.practice.href, "/learn/energy-sources-and-environment#self-check");
  assert.ok(environment.resources.some(resource => resource.href === environmentChapter.practice.href));
  assert.equal(environment.connection, undefined);
});

test("Grade X magnetic force, induction and self-induction connect to exact practice and optional XI foundations", () => {
  const magneticChapter = textbookChapters.find(item => item.id === "magnetic-field-and-ampere-force");
  const magnetic = learningEntries.find(item => item.id === "magnetic-field-and-ampere-force");
  const lorentzChapter = textbookChapters.find(item => item.id === "lorentz-force-and-charge-motion");
  const lorentz = learningEntries.find(item => item.id === "lorentz-force-and-charge-motion");
  const chapter = textbookChapters.find(item => item.id === "electromagnetic-induction");
  const induction = learningEntries.find(item => item.id === "electromagnetic-induction");
  const selfChapter = textbookChapters.find(item => item.id === "self-induction");
  const selfInduction = learningEntries.find(item => item.id === "self-induction");
  const lc = learningEntries.find(item => item.id === "lc-oscillations");
  const ac = learningEntries.find(item => item.id === "alternating-current");
  assert.ok(magneticChapter);
  assert.ok(magnetic);
  assert.ok(lorentzChapter);
  assert.ok(lorentz);
  assert.ok(chapter);
  assert.ok(induction);
  assert.ok(selfChapter);
  assert.ok(selfInduction);
  assert.ok(lc);
  assert.ok(ac);
  assert.equal(magneticChapter.grade, 10);
  assert.equal(magneticChapter.source.section, "§§ 27–29");
  assert.equal(magneticChapter.practice.href, "/practice/family/ampere-force-magnitude");
  assert.equal(magnetic.connection?.href, "/learn/lorentz-force-and-charge-motion");
  assert.equal(magnetic.resources.filter(item => item.href === magneticChapter.practice.href).length, 1);
  assert.equal(lorentzChapter.grade, 10);
  assert.equal(lorentzChapter.source.section, "§ 30");
  assert.equal(lorentzChapter.practice.href, "/practice/family/lorentz-force-magnitude");
  assert.equal(lorentz.connection?.href, "/learn/electromagnetic-induction");
  assert.equal(lorentz.resources.filter(item => item.href === lorentzChapter.practice.href).length, 1);
  assert.ok(induction.resources.some(item => item.href === "/learn/magnetic-field-and-ampere-force"));
  assert.equal(chapter.grade, 10);
  assert.equal(chapter.source.section, "§§ 31–32");
  assert.equal(chapter.practice.href, "/practice/family/induced-emf-magnitude");
  assert.equal(induction.connection?.href, "/learn/self-induction");
  assert.equal(induction.resources.filter(item => item.href === chapter.practice.href).length, 1);
  assert.equal(selfChapter.grade, 10);
  assert.equal(selfChapter.source.section, "§ 33");
  assert.equal(selfChapter.practice.href, "/practice/family/self-induction-emf");
  assert.equal(selfInduction.connection?.href, "/learn/lc-oscillations");
  assert.equal(selfInduction.resources.filter(item => item.href === selfChapter.practice.href).length, 1);
  assert.ok(lc.resources.some(item => item.href === "/learn/self-induction"));
  assert.ok(ac.resources.some(item => item.href === "/learn/electromagnetic-induction"));
});

test("Grade X current in metals opens a qualitative return to the same lesson", () => {
  const chapter = textbookChapters.find(item => item.id === "electric-current-in-metals");
  const entry = learningEntries.find(item => item.id === "electric-current-in-metals");
  assert.ok(chapter);
  assert.ok(entry);
  assert.equal(chapter.grade, 10);
  assert.equal(chapter.source.section, "§ 34");
  assert.equal(chapter.practice.href, "/practice/family/metal-temperature-current");
  assert.equal(entry.resources.filter(item => item.href === chapter.practice.href).length, 1);
  assert.ok(entry.resources.some(item => item.href === "/learn/electric-current-and-ohms-law"));
  assert.equal(entry.connection?.href, "/learn/electric-current-in-electrolytes");
});

test("Grade X electrolyte lesson connects observations, ions and exact-family practice", () => {
  const chapter = textbookChapters.find(item => item.id === "electric-current-in-electrolytes");
  const entry = learningEntries.find(item => item.id === "electric-current-in-electrolytes");
  assert.ok(chapter);
  assert.ok(entry);
  assert.equal(chapter.grade, 10);
  assert.equal(chapter.source.section, "§ 35");
  assert.equal(chapter.practice.href, "/practice/family/electrolyte-ion-transport");
  assert.equal(entry.resources.filter(item => item.href === chapter.practice.href).length, 1);
  assert.ok(chapter.sections.some(section => section.paragraphs.some(paragraph => paragraph.includes("Cu²⁺"))));
  assert.equal(entry.connection?.href, "/learn/electric-current-in-gases");
});

test("Grade X gas lesson distinguishes the external ionizer from a self-sustained discharge", () => {
  const chapter = textbookChapters.find(item => item.id === "electric-current-in-gases");
  const entry = learningEntries.find(item => item.id === "electric-current-in-gases");
  assert.ok(chapter);
  assert.ok(entry);
  assert.equal(chapter.grade, 10);
  assert.equal(chapter.source.section, "§ 36");
  assert.equal(chapter.practice.href, "/practice/family/gas-discharge-conditions");
  assert.equal(entry.resources.filter(item => item.href === chapter.practice.href).length, 1);
  assert.ok(chapter.sections.some(section => section.paragraphs.some(paragraph => paragraph.includes("рекомбинировать"))));
  assert.equal(entry.connection?.href, "/learn/electric-current-in-semiconductors");
});

test("Grade X semiconductor lesson links light, carrier models, and exact-family practice", () => {
  const chapter = textbookChapters.find(item => item.id === "electric-current-in-semiconductors");
  const entry = learningEntries.find(item => item.id === "electric-current-in-semiconductors");
  assert.ok(chapter);
  assert.ok(entry);
  assert.equal(chapter.grade, 10);
  assert.equal(chapter.source.section, "§ 37");
  assert.equal(chapter.practice.href, "/practice/family/semiconductor-carriers");
  assert.equal(entry.resources.filter(item => item.href === chapter.practice.href).length, 1);
  assert.ok(chapter.sections.some(section => section.paragraphs.some(paragraph => paragraph.includes("Дырка — удобная модель"))));
});
