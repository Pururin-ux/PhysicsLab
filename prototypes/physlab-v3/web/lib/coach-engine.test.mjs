import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Buffer } from "node:buffer";
import ts from "typescript";

async function loadCoachEngine() {
  const source = await readFile(new URL("./coach-engine.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  }).outputText;

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(moduleUrl);
}

const { getCoachResponse } = await loadCoachEngine();

const coachLines = {
  correct: "Ты заметил ключевую ловушку.",
  wrong: "Проверь первый шаг рассуждения.",
  hint: "Выдели известные величины отдельно.",
};

test("session_start returns calm intro", () => {
  assert.deepEqual(getCoachResponse({ type: "session_start" }, coachLines), {
    state: "calm",
    text: "Разберём 10 задач в формате ЦТ. Начнём.",
    duration: 3500,
    priority: 1,
  });
});

test("correct answer uses task coach line before streak threshold", () => {
  assert.deepEqual(
    getCoachResponse(
      { type: "correct_answer", streak: 2, taskId: "k-02" },
      coachLines,
    ),
    {
      state: "encouraging",
      text: coachLines.correct,
      duration: 3500,
      priority: 2,
    },
  );
});

test("streak >= 3 overrides regular correct response", () => {
  assert.deepEqual(
    getCoachResponse(
      { type: "correct_answer", streak: 3, taskId: "k-03" },
      coachLines,
    ),
    {
      state: "surprised",
      text: "Три подряд — отличный темп!",
      duration: 3000,
      priority: 3,
    },
  );
});

test("wrong answer switches from wrong line to hint after first attempt", () => {
  assert.equal(
    getCoachResponse(
      { type: "wrong_answer", attempt: 1, taskId: "k-04" },
      coachLines,
    ).text,
    coachLines.wrong,
  );
  assert.equal(
    getCoachResponse(
      { type: "wrong_answer", attempt: 2, taskId: "k-04" },
      coachLines,
    ).text,
    coachLines.hint,
  );
});

test("pause only returns thinking response after 20 seconds", () => {
  assert.equal(
    getCoachResponse({ type: "pause", seconds: 19 }, coachLines).priority,
    0,
  );
  assert.deepEqual(getCoachResponse({ type: "pause", seconds: 20 }, coachLines), {
    state: "thinking",
    text: "Какой закон здесь главный?",
    duration: 4000,
    priority: 1,
  });
});

test("session_end maps score percentage to final state", () => {
  assert.equal(
    getCoachResponse({ type: "session_end", score: 8, total: 10 }, coachLines)
      .state,
    "surprised",
  );
  assert.equal(
    getCoachResponse({ type: "session_end", score: 5, total: 10 }, coachLines)
      .state,
    "encouraging",
  );
  assert.equal(
    getCoachResponse({ type: "session_end", score: 4, total: 10 }, coachLines)
      .state,
    "warning",
  );
});
