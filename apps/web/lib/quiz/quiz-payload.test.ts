import assert from "node:assert/strict";
import test from "node:test";
import { parseQuizTasksPayload } from "./quiz-payload.ts";

type LooseOption = {
  id: string;
  text: string;
  value: number;
  correct?: boolean;
  misconception?: string;
};

function validChoiceTask(id = "t-1"): Record<string, unknown> & { options: LooseOption[] } {
  return {
    id,
    type: "single_choice",
    blueprint: "reflection-angle",
    topic: "Оптика",
    text: "Условие задачи.",
    formula: "\\theta_r=\\theta_i",
    difficulty: 1,
    explanation: "Разбор.",
    coach_lines: { correct: "Верно.", wrong: "Проверь.", hint: "Подсказка." },
    graph: null,
    diagram: null,
    answer: "a",
    options: [
      { id: "a", text: "30°", value: 30, correct: true },
      { id: "b", text: "60°", value: 60, misconception: "от зеркала" },
      { id: "c", text: "15°", value: 15, misconception: "половина" },
      { id: "d", text: "45°", value: 45, misconception: "удвоил" },
    ],
  };
}

function validNumericTask(id = "n-1") {
  return {
    id,
    type: "numeric_input",
    blueprint: "plane-mirror-separation",
    topic: "Оптика",
    text: "Условие.",
    formula: "L=2d",
    difficulty: 1,
    explanation: "Разбор.",
    coach_lines: { correct: "Верно.", wrong: "Проверь.", hint: "Подсказка." },
    graph: null,
    diagram: { kind: "optics", spec: { scene: "plane_mirror" } },
    answer: { value: 80, unit: "см", decimals: 0, tolerance: 0.05, sign: "positive" },
    misconceptions: [{ value: 40, label: "взял d вместо 2d" }],
  };
}

test("валидные choice и numeric задачи проходят", () => {
  const result = parseQuizTasksPayload({ tasks: [validChoiceTask(), validNumericTask()] });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.tasks.length, 2);
});

test("не-объект и отсутствие tasks — invalid", () => {
  assert.equal(parseQuizTasksPayload(null).ok, false);
  assert.equal(parseQuizTasksPayload("json string").ok, false);
  const missing = parseQuizTasksPayload({});
  assert.equal(missing.ok, false);
  if (!missing.ok) assert.equal(missing.issue.code, "tasks_missing");
});

test("пустой tasks — tasks_empty", () => {
  const result = parseQuizTasksPayload({ tasks: [] });
  assert.equal(result.ok === false && result.issue.code, "tasks_empty");
});

test("expectedCount: неполный batch отклоняется", () => {
  const result = parseQuizTasksPayload(
    { tasks: [validChoiceTask()] },
    { expectedCount: 10 },
  );
  assert.equal(result.ok === false && result.issue.code, "count_mismatch");
});

test("дубли task id отклоняются", () => {
  const result = parseQuizTasksPayload({
    tasks: [validChoiceTask("same"), validNumericTask("same")],
  });
  assert.equal(result.ok === false && result.issue.code, "duplicate_ids");
});

test("null-элемент и неизвестный type отклоняются", () => {
  assert.equal(parseQuizTasksPayload({ tasks: [null] }).ok, false);
  const badType = { ...validChoiceTask(), type: "matching" };
  assert.equal(parseQuizTasksPayload({ tasks: [badType] }).ok, false);
});

test("невалидная difficulty отклоняется", () => {
  const task = { ...validChoiceTask(), difficulty: 4 };
  assert.equal(parseQuizTasksPayload({ tasks: [task] }).ok, false);
});

test("невалидный diagram discriminant отклоняется", () => {
  const task = { ...validChoiceTask(), diagram: { kind: "hologram", spec: {} } };
  assert.equal(parseQuizTasksPayload({ tasks: [task] }).ok, false);
});

test("choice: не 4 варианта / ноль или два correct / дубли id и value", () => {
  const three = validChoiceTask();
  three.options = three.options.slice(0, 3);
  assert.equal(parseQuizTasksPayload({ tasks: [three] }).ok, false);

  const zeroCorrect = validChoiceTask();
  zeroCorrect.options = zeroCorrect.options.map((option) => ({ ...option, correct: false }));
  assert.equal(parseQuizTasksPayload({ tasks: [zeroCorrect] }).ok, false);

  const twoCorrect = validChoiceTask();
  twoCorrect.options[1] = { ...twoCorrect.options[1], correct: true };
  assert.equal(parseQuizTasksPayload({ tasks: [twoCorrect] }).ok, false);

  const dupIds = validChoiceTask();
  dupIds.options[1] = { ...dupIds.options[1], id: "a" };
  assert.equal(parseQuizTasksPayload({ tasks: [dupIds] }).ok, false);

  const dupValues = validChoiceTask();
  dupValues.options[1] = { ...dupValues.options[1], value: 30 };
  assert.equal(parseQuizTasksPayload({ tasks: [dupValues] }).ok, false);
});

test("choice: numeric-answer объект вместо options — invalid", () => {
  const confused = { ...validChoiceTask(), answer: { value: 30, unit: "°" } };
  assert.equal(parseQuizTasksPayload({ tasks: [confused] }).ok, false);
});

test("numeric: нефинитный ответ, кривые decimals/tolerance/sign, fake options", () => {
  const nan = validNumericTask();
  nan.answer = { ...nan.answer, value: Number.NaN };
  assert.equal(parseQuizTasksPayload({ tasks: [nan] }).ok, false);

  const badDecimals = validNumericTask();
  badDecimals.answer = { ...badDecimals.answer, decimals: 5 };
  assert.equal(parseQuizTasksPayload({ tasks: [badDecimals] }).ok, false);

  const badTolerance = validNumericTask();
  badTolerance.answer = { ...badTolerance.answer, tolerance: -1 };
  assert.equal(parseQuizTasksPayload({ tasks: [badTolerance] }).ok, false);

  const badSign = validNumericTask();
  badSign.answer = { ...badSign.answer, sign: "absolute" };
  assert.equal(parseQuizTasksPayload({ tasks: [badSign] }).ok, false);

  const fakeOptions = { ...validNumericTask(), options: [] };
  assert.equal(parseQuizTasksPayload({ tasks: [fakeOptions] }).ok, false);

  const badMisconception = validNumericTask();
  badMisconception.misconceptions = [{ value: Number.POSITIVE_INFINITY, label: "x" }];
  assert.equal(parseQuizTasksPayload({ tasks: [badMisconception] }).ok, false);
});

test("numeric: пустая единица допустима (безразмерный ответ)", () => {
  const dimensionless = validNumericTask();
  dimensionless.answer = { ...dimensionless.answer, unit: "" };
  assert.equal(parseQuizTasksPayload({ tasks: [dimensionless] }).ok, true);
});
