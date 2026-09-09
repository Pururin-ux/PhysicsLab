import assert from "node:assert/strict";
import test from "node:test";
import { defineLessonStageSequence } from "./lesson-stage-contract.ts";

test("lesson stages accept short, reordered sequences with lesson-defined identities", () => {
  const stages = defineLessonStageSequence([
    { id: "apply", label: "Применить", nextAction: "Проверить" },
    { id: "notice", label: "Заметить", nextAction: "Объяснить" },
    { id: "reflect", label: "Сверить вывод" },
  ] as const);

  assert.deepEqual(stages.map((stage) => stage.id), ["apply", "notice", "reflect"]);
});

test("lesson stages reject missing structural data and duplicate identities", () => {
  assert.throws(() => defineLessonStageSequence([]), /at least one stage/);
  assert.throws(
    () => defineLessonStageSequence([{ id: "", label: "Без идентификатора" }]),
    /non-empty string id/,
  );
  assert.throws(
    () => defineLessonStageSequence([{ label: "Без идентификатора" }] as never),
    /non-empty string id/,
  );
  assert.throws(() => defineLessonStageSequence([null] as never), /must be an object/);
  assert.throws(
    () => defineLessonStageSequence([{ id: "one", label: "" }]),
    /non-empty label/,
  );
  assert.throws(
    () => defineLessonStageSequence([{ id: "one", label: "Один" }, { id: "one", label: "Два" }]),
    /more than once/,
  );
  assert.throws(
    () => defineLessonStageSequence([{ id: "one", label: "Один", nextAction: 1 }] as never),
    /invalid next action/,
  );
  assert.throws(
    () => defineLessonStageSequence([
      { id: "one", label: "Один", pedagogicalStageId: "not-in-the-catalog" },
    ] as never),
    /unknown pedagogical stage id/,
  );
});
