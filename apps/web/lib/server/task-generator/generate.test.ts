import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import {
  generateTasks,
  getCandidateParams,
  getBlueprint,
  getTemplateIdsByGroup,
  templateRegistry,
} from "./generate.ts";
import type { GeneratedTask, TaskBlueprint } from "./types.ts";
import { formatAnswerValue, validateGeneratedTask } from "./validator.ts";
import { FINITE_TEXT_POOLS } from "./test-fixtures.ts";
import { schoolChecks } from "../../learning/school-checks.ts";

const kinematicsTemplateIds = [
  "free-fall",
  "projectile-components",
  "vt-slope",
  "vt-area",
  "relative-velocity-vectors",
  "average-speed-segments",
  "average-speed-with-stop",
  "uniform-motion-basic",
  "uniform-coordinate-law",
  "uniform-motion-graphs",
  "unit-conversion-speed",
  "rotation-frequency",
  "centripetal-acceleration",
] as const;
const measurementTemplateIds = [
  "length-unit-conversion",
  "graduated-scale-reading",
  "rectangular-block-volume",
  "irregular-body-volume",
] as const;
const dynamicsTemplateIds = [
  "archimedes-force",
  "ship-payload",
  "contact-pressure",
  "oscillation-frequency",
  "spring-oscillation-period",
  "mathematical-pendulum-period",
  "oscillation-energy",
  "mechanical-wave-speed",
  "echo-ranging",
  "resonance-frequency-match",
  "gravity-force",
  "gravitation-distance",
  "gravitational-potential-energy",
  "hydrostatic-pressure",
  "mechanical-power",
  "mechanical-efficiency",
  "mechanical-energy-conservation",
  "newton-second",
  "friction-force",
  "incline-force",
  "resultant-force",
  "resultant-force-2d",
  "weight-lift",
  "torque-balance",
  "movable-pulley",
  "impulse-momentum",
  "inelastic-collision-speed",
  "kinetic-energy",
  "work-force-distance",
  "work-at-angle",
] as const;

test("archimedes-force uses the immersed volume in cubic metres", () => {
  const tasks = generateTasks("archimedes-force", 50);

  for (const task of tasks) {
    const expected = Number((task.params.rho * 10 * (task.params.volume / 1_000_000)).toFixed(3));
    assert.equal(task.answerValue, expected);
    assert.equal(task.answerUnit, "Н");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes("полностью погружено"));
    const volumeM3 = (task.params.volume / 1_000_000)
      .toFixed(6)
      .replace(/0+$/, "")
      .replace(/\.$/, "")
      .replace(".", "{,}");
    assert.ok(task.explanation?.includes(`=${volumeM3}$ м³`));
    assert.ok(!task.explanation?.includes("=0$ м³"));
  }
});

test("ship-payload subtracts the empty vessel mass from displacement", () => {
  const tasks = generateTasks("ship-payload", 100);

  assert.equal(tasks.length, 100);
  for (const task of tasks) {
    const emptyMass = task.params.displacement - task.params.payload;
    assert.equal(task.answerValue, task.params.displacement - emptyMass);
    assert.equal(task.answerUnit, "т");
    assert.ok(task.text.includes(`${emptyMass} т`));
    assert.ok(task.explanation?.includes(`${task.params.displacement}-${emptyMass}`));
  }
});
const electrodynamicsTemplateIds = [
  "elementary-charge-count",
  "magnetic-field-direction",
  "ohm-law",
  "conductor-resistance",
  "resistor-network",
  "source-internal-resistance",
  "source-efficiency",
  "capacitor-energy",
  "lc-period",
  "ac-oscillogram-frequency",
  "induced-emf-magnitude",
  "charge-sharing",
  "coulomb-force",
  "electric-field-strength",
  "electric-field-superposition",
  "electrostatic-field-work",
  "point-charge-potential",
  "multi-source-potential",
  "uniform-field-voltage",
  "parallel-plate-capacitance",
  "electric-power",
  "household-load-current",
  "ampere-force-magnitude",
  "lorentz-force-magnitude",
  "metal-temperature-current",
  "electrolyte-ion-transport",
  "gas-discharge-conditions",
  "semiconductor-carriers",
  "self-induction-emf",
  "transformer-voltage-ratio",
  "transmission-line-loss",
  "em-wavelength-vacuum",
] as const;

const thermodynamicsTemplateIds = [
  "density-volume-ratio",
  "molecule-count-from-mass",
  "particle-concentration",
  "molecular-kinetic-energy",
  "ideal-gas-state",
  "ideal-gas-isoprocess",
  "solid-structure-properties",
  "liquid-structure-properties",
  "vapor-dynamic-equilibrium",
  "relative-humidity-pressure",
  "monoatomic-internal-energy",
  "isobaric-gas-work",
  "first-law-energy-balance",
  "heat-engine-efficiency",
  "heat-amount",
  "fuel-combustion-heat",
  "phase-change-heat",
  "vaporization-heat",
  "gas-state-ratio",
  "heat-balance-simple",
] as const;

type ApiTaskBase = {
  id: string;
  answerUnit: string;
  blueprint: string;
  coach_lines: { correct: string; wrong: string; hint: string };
  explanation: string;
  params: Record<string, number>;
  text: string;
  graph?: { type: string } | null;
  diagram?: { kind: string } | null;
};

type ApiSingleChoiceTask = ApiTaskBase & {
  type: "single_choice";
  answer: string;
  options: { correct?: boolean; text: string; misconception?: string }[];
};

type ApiNumericTask = ApiTaskBase & {
  type: "numeric_input";
  answer: {
    value: number;
    unit: string;
    decimals: number;
    tolerance: number;
    sign: string;
  };
  misconceptions: { value: number; label: string }[];
};

type ApiTask = ApiSingleChoiceTask | ApiNumericTask;

type ApiTaskResponse = {
  tasks: ApiTask[];
};

// Это coarse regression guard, не микробенчмарк: shared CI runner уже
// показывал 126 ms на валидном baseline-пуле. Порог ловит только явный
// переход к существенно более дорогому алгоритму генерации.
const MAX_GENERATION_BATCH_MS = 500;

function assertSingleChoice(task: ApiTask): asserts task is ApiSingleChoiceTask {
  assert.equal(task.type, "single_choice");
}

for (const templateId of kinematicsTemplateIds) {
  test(`${templateId}: generates 500 deterministic valid variants`, () => {
    const startedAt = performance.now();
    const tasks = generateTasks(templateId, 500);
    const durationMs = performance.now() - startedAt;
    const blueprint = getBlueprint(templateId);

    assert.equal(tasks.length, 500);
    assert.equal(
      durationMs < MAX_GENERATION_BATCH_MS,
      true,
      `${templateId} took ${durationMs.toFixed(2)}ms`,
    );

    for (const task of tasks) {
      const validation = validateGeneratedTask(task, blueprint);
      assert.deepEqual(validation.issues, []);
      assert.equal(validation.valid, true);
      assert.ok(task.answerUnit);
    }

    const answerDistribution = new Set(tasks.map((task) => task.answerValue));
    assert.equal(
      answerDistribution.size >= 4,
      true,
      `${templateId} should produce at least 4 different answers`,
    );

    // Пул relative-velocity-vectors ограничен пифагоровыми тройками:
    // 12 пар × 3 сюжета = 36 уникальных текстов, дальше цикл повторяется.
    const uniqueBatchSize = Math.min(FINITE_TEXT_POOLS[templateId] ?? 50, 50);
    const firstBatchTexts = tasks.slice(0, uniqueBatchSize).map((task) => task.text);
    assert.equal(
      new Set(firstBatchTexts).size,
      uniqueBatchSize,
      `${templateId} duplicated a text in batch ${uniqueBatchSize}`,
    );
  });
}

test("uniform-motion-basic asks for path, speed and time without changing the physical relation", () => {
  const tasks = generateTasks("uniform-motion-basic", 3);

  assert.deepEqual(tasks.map((task) => task.answerUnit), ["м", "м/с", "с"]);
  assert.deepEqual(tasks.map((task) => task.answerValue), [9, 3, 5]);
  assert.ok(tasks[0].text.includes("3 м/с") && tasks[0].text.includes("3 с"));
  assert.ok(tasks[1].text.includes("12 м") && tasks[1].text.includes("4 с"));
  assert.ok(tasks[2].text.includes("3 м/с") && tasks[2].text.includes("15 м"));
});

test("mechanical-power asks for power, work and time through one relation", () => {
  const tasks = generateTasks("mechanical-power", 3);

  assert.deepEqual(tasks.map((task) => task.answerUnit), ["Вт", "Дж", "с"]);
  assert.deepEqual(tasks.map((task) => task.answerValue), [50, 200, 6]);
  assert.ok(tasks[0].text.includes("100 Дж") && tasks[0].text.includes("2 с"));
  assert.ok(tasks[1].text.includes("50 Вт") && tasks[1].text.includes("4 с"));
  assert.ok(tasks[2].text.includes("300 Дж") && tasks[2].text.includes("50 Вт"));
});

test("mechanical-efficiency asks for efficiency, useful work and total work", () => {
  const tasks = generateTasks("mechanical-efficiency", 3);

  assert.deepEqual(tasks.map((task) => task.answerUnit), ["%", "Дж", "Дж"]);
  assert.ok(tasks[0].text.includes("полной работы") && tasks[0].text.includes("полезная работа"));
  assert.ok(tasks[1].text.includes("КПД") && tasks[1].text.includes("полезную работу"));
  assert.ok(tasks[2].text.includes("полная совершённая работа"));
});

test("gravitational-potential-energy asks for energy, mass and height from one chosen level", () => {
  const tasks = generateTasks("gravitational-potential-energy", 3);

  assert.deepEqual(tasks.map((task) => task.answerUnit), ["Дж", "кг", "м"]);
  assert.deepEqual(tasks.map((task) => task.answerValue), [10, 1, 3]);
  assert.ok(tasks[0].text.includes("1 кг") && tasks[0].text.includes("1 м"));
  assert.ok(tasks[1].text.includes("20 Дж") && tasks[1].text.includes("2 м"));
  assert.ok(tasks[2].text.includes("30 Дж") && tasks[2].text.includes("1 кг"));
});

test("mechanical-energy-conservation turns launch speed into maximum height", () => {
  const tasks = generateTasks("mechanical-energy-conservation", 20);

  for (const task of tasks) {
    assert.equal(task.answerUnit, "м");
    assert.equal(task.answerValue, task.params.v ** 2 / 20);
    assert.ok(task.text.includes("Сопротивлением воздуха пренебречь"));
    assert.ok(task.explanation?.includes("Масса сокращается"));
  }
});

test("monoatomic-internal-energy uses absolute temperature and returns kilojoules", () => {
  const tasks = generateTasks("monoatomic-internal-energy", 24);
  const blueprint = getBlueprint("monoatomic-internal-energy");

  for (const task of tasks) {
    const expected = Number((1.5 * task.params.nu * 8.31 * task.params.T / 1000).toFixed(3));
    assert.equal(task.answerValue, expected);
    assert.equal(task.answerUnit, "кДж");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes(String(task.params.T) + " К"));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("isobaric-gas-work uses volume change and returns joules", () => {
  const tasks = generateTasks("isobaric-gas-work", 30);
  const blueprint = getBlueprint("isobaric-gas-work");

  for (const task of tasks) {
    assert.equal(task.answerValue, task.params.pressure * task.params.volumeChange);
    assert.equal(task.answerUnit, "Дж");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.text.includes(String(task.params.volumeStart + task.params.volumeChange) + " л"));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("first-law-energy-balance keeps heat and gas-work signs distinct", () => {
  const blueprint = getBlueprint("first-law-energy-balance");
  const expected = [360, -360, 0, 600];

  for (let caseId = 1; caseId <= 4; caseId += 1) {
    for (let scale = 1; scale <= 3; scale += 1) {
      const params = { caseId, scale };
      const answer = blueprint.solver(params);
      assert.equal(answer, expected[caseId - 1] * scale);
      assert.equal(blueprint.answerKind, "signed");
      assert.equal(blueprint.answerFormat, "numeric_input");
      assert.ok(blueprint.textTemplate(params, answer).includes("укажите минус"));
      const wrongValues = blueprint.distractors.map(rule => rule.compute(params));
      assert.equal(new Set([answer, ...wrongValues]).size, 4);
    }
  }

  const tasks = generateTasks("first-law-energy-balance", 12);
  for (const task of tasks) {
    assert.equal(task.answerValue, blueprint.solver(task.params));
    assert.equal(task.answerUnit, "Дж");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("heat-engine-efficiency conserves energy over a cycle and reports percent", () => {
  const blueprint = getBlueprint("heat-engine-efficiency");
  for (const heatInput of [5, 7, 10, 13, 16, 20]) {
    for (const coolerPercent of [55, 60, 70, 80]) {
      const params = { heatInput, coolerPercent };
      const coolerHeat = heatInput * coolerPercent / 100;
      const cycleWork = heatInput - coolerHeat;
      const answer = blueprint.solver(params);
      assert.equal(cycleWork + coolerHeat, heatInput);
      assert.ok(Math.abs(answer - 100 * cycleWork / heatInput) < 1e-9);
      assert.equal(blueprint.answerUnit, "%");
      assert.equal(blueprint.answerFormat, "numeric_input");
      assert.ok(blueprint.textTemplate(params, answer).includes(formatAnswerValue(coolerHeat)));
      const wrongValues = blueprint.distractors.map(rule => rule.compute(params));
      assert.equal(new Set([answer, ...wrongValues]).size, 4);
    }
  }

  const tasks = generateTasks("heat-engine-efficiency", 12);
  for (const task of tasks) {
    assert.equal(task.answerValue, blueprint.solver(task.params));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("coulomb-force keeps magnitude separate from sign and follows the inverse square", () => {
  const blueprint = getBlueprint("coulomb-force");
  for (const q1 of [2, 4, 6, 8]) {
    for (const q2 of [2, 4, 6, 8]) {
      for (const rCm of [10, 20, 30, 40]) {
        for (const epsilon of [1, 2]) {
          const attraction = { q1, q2, rCm, epsilon, sign: 2 };
          const repulsion = { ...attraction, sign: 1 };
          const force = blueprint.solver(attraction);
          assert.equal(force, blueprint.solver(repulsion));
          assert.equal(force, Number((90 * q1 * q2 / (epsilon * rCm ** 2)).toFixed(1)));
          assert.ok(blueprint.textTemplate(attraction, force).includes("−" + q2 + " нКл"));
          assert.ok(blueprint.textTemplate(repulsion, force).includes("+" + q2 + " нКл"));
          assert.equal(new Set([force, ...blueprint.distractors.map(rule => rule.compute(attraction))]).size, 4);
        }
      }
    }
  }

  for (const task of generateTasks("coulomb-force", 12)) {
    assert.equal(task.answerUnit, "мкН");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("electric-field-strength depends on the source and distance, not source sign", () => {
  const blueprint = getBlueprint("electric-field-strength");
  for (const sourceCharge of [2, 4, 6, 8]) {
    for (const distanceCm of [10, 20, 30, 40]) {
      for (const epsilon of [1, 2]) {
        const positive = { sourceCharge, distanceCm, epsilon, sourceSign: 1 };
        const negative = { ...positive, sourceSign: 2 };
        const answer = blueprint.solver(positive);
        assert.equal(answer, blueprint.solver(negative));
        assert.equal(answer, Number((90_000 * sourceCharge / (epsilon * distanceCm ** 2)).toFixed(1)));
        assert.ok(blueprint.textTemplate(positive, answer).includes("+" + sourceCharge + " нКл"));
        assert.ok(blueprint.textTemplate(negative, answer).includes("−" + sourceCharge + " нКл"));
        assert.equal(new Set([answer, ...blueprint.distractors.map(rule => rule.compute(positive))]).size, 4);
      }
    }
  }

  for (const task of generateTasks("electric-field-strength", 12)) {
    assert.equal(task.answerUnit, "Н/Кл");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("electric-field-superposition adds signed field components at a point between two sources", () => {
  const blueprint = getBlueprint("electric-field-superposition");
  const params = {
    leftCharge: 2,
    leftSign: 1,
    leftDistanceCm: 10,
    rightCharge: 8,
    rightSign: 1,
    rightDistanceCm: 20,
  };
  // The fields oppose: 1800 N/C rightward and 1800 N/C leftward would
  // cancel, so choose unequal magnitudes to retain a signed result.
  const unbalanced = { ...params, rightCharge: 4 };
  assert.equal(blueprint.solver(unbalanced), 900);
  assert.equal(blueprint.solver({ ...unbalanced, leftSign: 2 }), -2700);
  assert.equal(blueprint.solver({ ...unbalanced, rightSign: 2 }), 2700);
  assert.equal(blueprint.solver({ ...unbalanced, leftSign: 2, rightSign: 2 }), -900);

  for (const task of generateTasks("electric-field-superposition", 40)) {
    assert.equal(task.answerUnit, "Н/Кл");
    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.answerValue, blueprint.solver(task.params));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("electrostatic-field-work keeps charge, displacement and energy signs distinct", () => {
  const blueprint = getBlueprint("electrostatic-field-work");
  for (const chargeSign of [1, 2]) {
    for (const direction of [1, 2]) {
      for (const asked of [1, 2]) {
        const params = { chargeMicroC: 2, chargeSign, fieldNPerC: 200, distanceCm: 20, direction, asked };
        const charge = chargeSign === 1 ? 2 : -2;
        const dx = direction === 1 ? 0.2 : -0.2;
        const work = charge * 200 * dx;
        assert.equal(blueprint.solver(params), asked === 1 ? work : -work);
        assert.equal(blueprint.solver({ ...params, asked: 1 }), -blueprint.solver({ ...params, asked: 2 }));
        assert.equal(new Set([blueprint.solver(params), ...blueprint.distractors.map(rule => rule.compute(params))]).size, 4);
        assert.ok(blueprint.textTemplate(params, blueprint.solver(params)).includes(direction === 1 ? "правее" : "левее"));
      }
    }
  }

  for (const task of generateTasks("electrostatic-field-work", 24)) {
    assert.equal(task.answerUnit, "мкДж");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("point-charge-potential keeps the source sign and inverse-distance law", () => {
  const blueprint = getBlueprint("point-charge-potential");
  for (const sourceCharge of [2, 4, 6, 8, 10]) {
    for (const distanceCm of [10, 20, 30, 40, 50]) {
      const positive = { sourceCharge, distanceCm, sourceSign: 1 };
      const negative = { ...positive, sourceSign: 2 };
      const answer = 900 * sourceCharge / distanceCm;
      assert.equal(blueprint.solver(positive), answer);
      assert.equal(blueprint.solver(negative), -answer);
      assert.equal(blueprint.solver({ ...positive, distanceCm: distanceCm * 2 }), answer / 2);
      assert.equal(new Set([answer, ...blueprint.distractors.map(rule => rule.compute(positive))]).size, 4);
      assert.ok(blueprint.textTemplate(negative, -answer).includes("−" + sourceCharge + " нКл"));
    }
  }

  for (const task of generateTasks("point-charge-potential", 24)) {
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("multi-source-potential adds signed scalar potentials independently of source position", () => {
  const blueprint = getBlueprint("multi-source-potential");
  const params = {
    leftCharge: 2,
    leftSign: 1,
    leftDistanceCm: 20,
    rightCharge: 4,
    rightSign: 2,
    rightDistanceCm: 20,
  };
  assert.equal(blueprint.solver(params), -90);
  assert.equal(blueprint.solver({ ...params, rightSign: 1 }), 270);
  assert.equal(blueprint.solver({ ...params, leftSign: 2 }), -270);
  assert.equal(blueprint.solver({ ...params, leftSign: 2, rightSign: 1 }), 90);
  assert.equal(blueprint.solver({ ...params, rightCharge: 2 }), 0);
  const validCandidates = getCandidateParams("multi-source-potential");
  const zeroOffset = validCandidates.findIndex(candidate => blueprint.solver(candidate) === 0);
  assert.ok(zeroOffset >= 0, "zero potential remains a valid generated case");
  const zeroTask = generateTasks("multi-source-potential", 1, { offset: zeroOffset })[0];
  assert.equal(zeroTask.answerValue, 0);
  assert.deepEqual(validateGeneratedTask(zeroTask, blueprint).issues, []);
  assert.ok(blueprint.textTemplate(params, -90).includes("A = +2 нКл"));
  assert.ok(blueprint.textTemplate(params, -90).includes("B = −4 нКл"));

  for (const task of generateTasks("multi-source-potential", 40)) {
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.equal(task.answerValue, blueprint.solver(task.params));
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("uniform-field-voltage uses oriented separation and does not depend on an absolute potential", () => {
  const blueprint = getBlueprint("uniform-field-voltage");
  for (const fieldVPerM of [100, 200, 500]) {
    for (const distanceCm of [10, 20, 40, 60]) {
      const along = { fieldVPerM, distanceCm, direction: 1 };
      const against = { ...along, direction: 2 };
      const voltage = fieldVPerM * distanceCm / 100;
      assert.equal(blueprint.solver(along), voltage);
      assert.equal(blueprint.solver(against), -voltage);
      assert.equal(blueprint.solver({ ...along, distanceCm: distanceCm * 2 }), 2 * voltage);
      assert.equal(new Set([voltage, ...blueprint.distractors.map(rule => rule.compute(along))]).size, 4);
      assert.ok(blueprint.textTemplate(against, -voltage).includes("левее"));
    }
  }

  for (const task of generateTasks("uniform-field-voltage", 24)) {
    assert.equal(task.answerUnit, "В");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("parallel-plate-capacitance applies direct and inverse scaling without unit ambiguity", () => {
  const blueprint = getBlueprint("parallel-plate-capacitance");
  for (const initialCapacitancePf of [24, 30, 36, 42, 48, 54, 60]) {
    for (const factor of [2, 3]) {
      for (const changeKind of [1, 2, 3]) {
        const params = { initialCapacitancePf, factor, changeKind };
        const expected = changeKind === 2 ? initialCapacitancePf / factor : initialCapacitancePf * factor;
        assert.equal(blueprint.solver(params), expected);
        assert.equal(new Set([expected, ...blueprint.distractors.map(rule => rule.compute(params))]).size, 4);
      }
    }
  }

  for (const task of generateTasks("parallel-plate-capacitance", 24)) {
    assert.equal(task.answerUnit, "пФ");
    assert.equal(task.answerFormat, "numeric_input");
    assert.deepEqual(validateGeneratedTask(task, blueprint).issues, []);
  }
});

test("average-speed-with-stop includes stationary time in the denominator", () => {
  const tasks = generateTasks("average-speed-with-stop", 20);

  for (const task of tasks) {
    const params = task.params;
    const expected = (params.v1 * params.t1 + params.v2 * params.t2) / (params.t1 + params.stop + params.t2);
    assert.equal(task.answerValue, expected);
    assert.ok(task.text.includes(`остановился на ${params.stop} с`));
    assert.ok(task.explanation?.includes(`${params.t1}+${params.stop}+${params.t2}`));
  }
});

test("uniform-motion-graphs keeps path and speed graphs semantically distinct", () => {
  const tasks = generateTasks("uniform-motion-graphs", 3);

  assert.deepEqual(tasks.map((task) => task.graph?.type), ["xt", "xt", "vt"]);
  assert.deepEqual(tasks.map((task) => task.answerUnit), ["м", "м/с", "м"]);
  assert.equal(tasks[0].graph?.yLabel, "s, м");
  assert.equal(tasks[1].answerValue, 2);
  assert.equal(tasks[2].graph?.showArea, true);
  assert.equal(tasks[2].answerValue, 10);
});

test("vt-slope answers use whole or half-step acceleration values", () => {
  const tasks = generateTasks("vt-slope", 200);

  tasks.forEach((task) => {
    assert.equal(
      Math.abs(task.answerValue * 2 - Math.round(task.answerValue * 2)) < 1e-9,
      true,
      `Got ugly vt-slope answer: ${task.answerValue}`,
    );
    assert.equal(task.answerValue > 0, true, `Answer must be positive: ${task.answerValue}`);
    assert.equal(task.answerValue <= 20, true, `Answer too large: ${task.answerValue}`);
  });

  assert.equal(
    new Set(tasks.map((task) => task.text)).size,
    200,
    "vt-slope should keep at least 200 unique tasks after constraints",
  );
});

test("expanded task families encode the intended physical rule", () => {
  const averageSpeed = getBlueprint("average-speed-segments");
  const averageParams = { v1: 10, t1: 2, v2: 20, t2: 8 };
  assert.equal(averageSpeed.solver(averageParams), 18);
  assert.notEqual(averageSpeed.solver(averageParams), (averageParams.v1 + averageParams.v2) / 2);

  const unitConversion = getBlueprint("unit-conversion-speed");
  assert.equal(unitConversion.solver({ vKmh: 36, tMin: 5 }), 3000);

  const rotationFrequency = getBlueprint("rotation-frequency");
  assert.equal(rotationFrequency.solver({ N: 45, t: 6 }), 7.5);

  const centripetalAcceleration = getBlueprint("centripetal-acceleration");
  assert.equal(centripetalAcceleration.solver({ v: 6, R: 4 }), 9);

  const work = getBlueprint("work-force-distance");
  assert.equal(work.solver({ F: 20, s: 3, __variant: 0 }), 60);
  assert.equal(work.solver({ F: 20, s: 3, __variant: 1 }), -60);

  const angledWork = getBlueprint("work-at-angle");
  assert.deepEqual(
    [0, 1, 2, 3, 4].map((variant) => angledWork.solver({ F: 20, s: 3, __variant: variant })),
    [60, 30, 0, -30, -60],
  );

  const power = getBlueprint("electric-power");
  assert.equal(power.solver({ I: 3, R: 4, __variant: 0 }), 36);
  assert.equal(power.solver({ I: 3, R: 4, __variant: 1 }), 36);
  assert.equal(power.solver({ I: 3, R: 4, __variant: 2 }), 36);

  const gasRatio = getBlueprint("gas-state-ratio");
  assert.equal(gasRatio.solver({ p1: 100, V1: 4, V2: 2, temp1C: 27, temp2C: 327 }), 400);

  const heatBalance = getBlueprint("heat-balance-simple");
  assert.equal(heatBalance.solver({ mHot: 2, tempHot: 80, mCold: 3, tempCold: 30 }), 50);
});

test("practice changes the numerical problem between adjacent tasks", () => {
  for (const { id } of templateRegistry) {
    const tasks = generateTasks(id, 12);
    tasks.slice(1).forEach((task, index) => {
      assert.notDeepEqual(
        task.params,
        tasks[index].params,
        `${id} repeated a numerical condition at ${index + 1}`,
      );
    });
  }
});

test("production templates keep enough variants and explanations", () => {
  for (const { id } of templateRegistry) {
    const tasks = generateTasks(id, 200);
    const blueprint = getBlueprint(id);

    assert.equal(tasks.length, 200, `${id} should generate 200 tasks`);
    const minUniqueTexts = FINITE_TEXT_POOLS[id] ?? 50;
    assert.equal(
      new Set(tasks.map((task) => task.text)).size >= minUniqueTexts,
      true,
      `${id} should keep at least ${minUniqueTexts} unique texts in the first 200 tasks`,
    );

    tasks.forEach((task) => {
      assert.ok(task.explanation?.trim(), `${id} should provide a non-empty explanation`);
      assert.equal(
        task.options.filter((option) => option.value !== task.answerValue).every((option) => option.misconception),
        true,
        `${id} should label every wrong option with a misconception`,
      );
      if (blueprint.explanationTemplate) {
        assert.notEqual(task.explanation, task.coach_lines.correct);
      }
    });
  }
});

test("finite authored pools exhaust distinct conditions before repeating", () => {
  for (const [id, poolSize] of Object.entries(FINITE_TEXT_POOLS)) {
    assert.equal(getCandidateParams(id).length, poolSize, id + ": inflated or missing candidates");
    const tasks = generateTasks(id, poolSize + 1);
    assert.equal(new Set(tasks.slice(0, poolSize).map(task => task.text)).size, poolSize, id);
    assert.equal(tasks[poolSize].text, tasks[0].text, id + ": cycle starts after exhaustion");
    assert.deepEqual(tasks, generateTasks(id, poolSize + 1), id + ": deterministic cycle");
  }
});

// Условие и варианты ответа рисует QuestionCard/OptionList обычным текстом, без
// MathText. Любой $…$ в этих полях ученик увидит долларами (так вылезло
// «$c = 4200$» в задачах на количество теплоты). Разбор и подсказки идут через
// MathText, поэтому там формулы допустимы.
test("task text and options stay free of raw LaTeX markers", () => {
  for (const { id } of templateRegistry) {
    for (const task of generateTasks(id, 60)) {
      assert.equal(
        /\$|\\frac|\\Delta|\\cdot|\{,\}/.test(task.text),
        false,
        `${id}: условие показывается без MathText, а содержит разметку: ${task.text}`,
      );
      for (const option of task.options) {
        assert.equal(
          /\$|\\frac|\\Delta|\\cdot|\{,\}/.test(option.text),
          false,
          `${id}: вариант ответа содержит разметку: ${option.text}`,
        );
      }
    }
  }
});

test("newton-second: uses units for all three target quantities", () => {
  const tasks = generateTasks("newton-second", 200);
  const units = new Set(tasks.map((task) => task.answerUnit));
  assert.deepEqual(units, new Set(["Н", "кг", "м/с²"]));

  for (const unit of units) {
    const targetTasks = tasks.filter((task) => task.answerUnit === unit);
    assert.ok(targetTasks.length > 0, `newton-second should generate target unit ${unit}`);
    targetTasks.forEach((task) => {
      assert.equal(new Set(task.options.map((option) => option.value)).size, 4);
      assert.equal(task.options.some((option) => option.value === task.answerValue), true);
    });
  }
});

test("registry groups every template exactly once", () => {
  assert.equal(new Set(templateRegistry.map((entry) => entry.id)).size, templateRegistry.length);
  assert.deepEqual(new Set(getTemplateIdsByGroup("measurements")), new Set(measurementTemplateIds));
  assert.deepEqual(new Set(getTemplateIdsByGroup("kinematics")), new Set(kinematicsTemplateIds));
  assert.deepEqual(new Set(getTemplateIdsByGroup("dynamics")), new Set(dynamicsTemplateIds));
  assert.deepEqual(
    new Set(getTemplateIdsByGroup("electrodynamics")),
    new Set(electrodynamicsTemplateIds),
  );
  assert.deepEqual(
    new Set(getTemplateIdsByGroup("thermodynamics")),
    new Set(thermodynamicsTemplateIds),
  );
  assert.deepEqual(new Set(getTemplateIdsByGroup("optics")), new Set([
    "reflection-angle", "plane-mirror-separation", "refraction-direction",
    "shadow-and-penumbra", "refractive-index-speed", "snell-index-ratio",
    "thin-lens-image-distance", "lens-optical-power", "lens-image-height",
    "lens-image-properties", "vision-correction",
  ]));
  assert.deepEqual(new Set(getTemplateIdsByGroup("quantum")), new Set(["bohr-transition-radiation"]));
  const grouped = [
    ...measurementTemplateIds, ...kinematicsTemplateIds, ...dynamicsTemplateIds,
    ...electrodynamicsTemplateIds, ...thermodynamicsTemplateIds,
    ...getTemplateIdsByGroup("optics"), ...getTemplateIdsByGroup("quantum"),
  ];
  assert.equal(grouped.length, templateRegistry.length);
  assert.equal(new Set(grouped).size, grouped.length);
});

test("ohm-law: покрывает все три искомые величины с единицами", () => {
  const tasks = generateTasks("ohm-law", 200);
  const units = new Set(tasks.map((task) => task.answerUnit));

  assert.deepEqual(units, new Set(["А", "В", "Ом"]));

  for (const task of tasks) {
    assert.equal(new Set(task.options.map((option) => option.value)).size, 4);
    assert.equal(
      task.options.some((option) => option.value === task.answerValue),
      true,
    );
  }
});

test("validator allows signed answers without weakening current templates", () => {
  const signedBlueprint: TaskBlueprint = {
    id: "signed-mock",
    skill: "Signed mock",
    topic: "Test",
    group: "kinematics",
    difficulty: 1,
    params: {
      x: { min: -2, max: -2, step: 1, unit: "м" },
    },
    formula: "x=-2",
    answerUnit: "м",
    answerKind: "signed",
    solver: () => -2,
    distractors: [
      { label: "minus one", compute: () => -1 },
      { label: "zero", compute: () => 0 },
      { label: "plus one", compute: () => 1 },
    ],
    textTemplate: () => "Найдите проекцию координаты.",
    trap: "Игнорирует знак.",
    coachLines: {
      correct: () => "Верно.",
      wrong: () => "Проверь знак.",
    },
  };
  const signedTask: GeneratedTask = {
    id: "signed-mock-0001",
    blueprint: signedBlueprint.id,
    skill: signedBlueprint.skill,
    topic: signedBlueprint.topic,
    difficulty: signedBlueprint.difficulty,
    params: { x: -2 },
    text: "Найдите проекцию координаты.",
    formula: signedBlueprint.formula,
    answerUnit: "м",
    answerFormat: "single_choice",
    options: [
      { id: "a", text: "-2", value: -2 },
      { id: "b", text: "-1", value: -1, misconception: "minus one" },
      { id: "c", text: "0", value: 0, misconception: "zero" },
      { id: "d", text: "1", value: 1, misconception: "plus one" },
    ],
    answer: "a",
    answerValue: -2,
    trap: signedBlueprint.trap,
    coach_lines: {
      correct: "Верно.",
      wrong: "Проверь знак.",
    },
  };

  assert.deepEqual(validateGeneratedTask(signedTask, signedBlueprint).issues, []);
});

for (const templateId of [
  ...dynamicsTemplateIds,
  ...electrodynamicsTemplateIds,
  ...thermodynamicsTemplateIds,
]) {
  if (templateId === "ohm-law") {
    continue; // отдельный тест ниже: покрывает три целевые величины.
  }

  test(`${templateId}: generates 200 deterministic valid variants`, () => {
    const startedAt = performance.now();
    const tasks = generateTasks(templateId, 200);
    const durationMs = performance.now() - startedAt;
    const blueprint = getBlueprint(templateId);

    assert.equal(tasks.length, 200);
    assert.equal(
      durationMs < MAX_GENERATION_BATCH_MS,
      true,
      `${templateId} took ${durationMs.toFixed(2)}ms`,
    );

    for (const task of tasks) {
      const validation = validateGeneratedTask(task, blueprint);
      assert.deepEqual(validation.issues, []);
      assert.equal(validation.valid, true);
      assert.ok(task.explanation);
      assert.notEqual(task.explanation, task.coach_lines.correct);
    }

    // Categorical values are option indices; their semantic answers are the
    // labels. Numerical tasks still compare the displayed numerical values.
    const answerDistribution = new Set(tasks.map(task =>
      task.options.find(option => option.id === task.answer)?.text,
    ));
    const minimumAnswers = templateId === "oscillation-frequency" || templateId === "molecular-kinetic-energy" ? 3 : 4;
    assert.equal(
      answerDistribution.size >= minimumAnswers,
      true,
      `${templateId} should produce at least ${minimumAnswers} different semantic answers`,
    );

    const batchSize = Math.min(FINITE_TEXT_POOLS[templateId] ?? 50, 50);
    const firstBatchTexts = tasks.slice(0, batchSize).map((task) => task.text);
    assert.equal(
      new Set(firstBatchTexts).size,
      batchSize,
      `${templateId} duplicated a text in batch ${batchSize}`,
    );
  });
}

test("API route возвращает валидные задачи", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&count=5"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 5);
  data.tasks.forEach((task) => {
    assertSingleChoice(task);
    assert.ok(task.answer);
    assert.ok(task.explanation.trim());
    assert.equal(task.options.length, 4);
    assert.equal(task.options.filter((option) => option.correct).length, 1);
    assert.equal(
      task.options.filter((option) => !option.correct).every((option) => option.misconception),
      true,
    );
  });
});

test("API route возвращает vt-slope batch", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=vt-slope&count=10"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 10);
  assert.equal(data.tasks.every((task) => task.graph?.type === "vt"), true);
});

test("API route возвращает все шаблоны динамики с единицами", async () => {
  for (const template of dynamicsTemplateIds) {
    const response = await GET(
      new Request(`http://localhost/api/tasks?template=${template}&count=3&batch=7`),
    );
    const data = (await response.json()) as ApiTaskResponse;

    assert.equal(response.status, 200);
    assert.equal(data.tasks.length, 3);
    data.tasks.forEach((task) => {
      assert.equal(task.blueprint, template);
      assert.ok(task.answerUnit);
      assert.ok(task.explanation);
      assert.notEqual(task.explanation, task.coach_lines.correct);

      if (task.type === "numeric_input") {
        // Числовой формат: без фиктивных вариантов, с единицей и допуском.
        assert.equal("options" in task, false);
        assert.equal(typeof task.answer.value, "number");
        assert.equal(task.answer.unit, task.answerUnit);
        assert.equal(task.answer.tolerance > 0, true);
        assert.equal(Array.isArray(task.misconceptions), true);
        return;
      }

      assert.equal(task.options.filter((option) => option.correct).length, 1);
      assert.equal(
        task.options.filter((option) => !option.correct).every((option) => option.misconception),
        true,
      );
      assert.equal(
        task.options.every((option) => option.text.endsWith(` ${task.answerUnit}`)),
        true,
      );
    });
  }
});

test("API route делает batch детерминированным и меняет набор", async () => {
  const batchZeroUrl =
    "http://localhost/api/tasks?template=newton-second&count=10&batch=0";
  const batchOneUrl =
    "http://localhost/api/tasks?template=newton-second&count=10&batch=1";
  const firstResponse = await GET(new Request(batchZeroUrl));
  const repeatResponse = await GET(new Request(batchZeroUrl));
  const nextResponse = await GET(new Request(batchOneUrl));
  const first = (await firstResponse.json()) as ApiTaskResponse;
  const repeat = (await repeatResponse.json()) as ApiTaskResponse;
  const next = (await nextResponse.json()) as ApiTaskResponse;

  assert.deepEqual(first.tasks, repeat.tasks);
  assert.equal(first.tasks.length, 10);
  assert.equal(next.tasks.length, 10);
  assert.equal(
    first.tasks.some((task, index) => task.id !== next.tasks[index]?.id),
    true,
  );
  assert.equal(
    first.tasks.some(
      (task, index) =>
        JSON.stringify(task.params) !== JSON.stringify(next.tasks[index]?.params),
    ),
    true,
  );
  assert.equal(
    first.tasks.filter((task) => next.tasks.some((nextTask) => nextTask.id === task.id)).length,
    0,
  );
});

test("conductor-resistance: R = rho l / S и согласованные единицы", () => {
  const tasks = generateTasks("conductor-resistance", 80);
  for (const task of tasks) {
    const rho = task.params.materialId === 2 ? 1.1 : 0.1;
    const expected = Math.round((rho * task.params.length / task.params.area) * 1000) / 1000;
    assert.equal(task.answerValue, expected);
    assert.equal(task.answerUnit, "Ом");
    assert.equal(task.answerFormat, "numeric_input");
    assert.ok(task.answerValue > 0);
  }
});

test("gravitation-distance: сила меняется обратно квадрату расстояния", () => {
  const tasks = generateTasks("gravitation-distance", 50);
  assert.equal(new Set(tasks.map((task) => task.text)).size, 50);
  for (const task of tasks) {
    assert.equal(task.answerValue, task.params.k ** 2);
    assert.equal(task.answerUnit, "раз");
    assert.match(task.text, /между центрами/);
  }
});

test("torque-balance: противоположные моменты равны", () => {
  const tasks = generateTasks("torque-balance", 200);
  assert.equal(new Set(tasks.map((task) => task.text)).size, 200);
  for (const task of tasks) {
    assert.equal(task.answerValue, (task.params.F1 * task.params.l1) / task.params.l2);
    assert.equal(task.answerUnit, "Н");
    assert.match(task.text, /перпендикулярно плечам/);
  }
});

test("movable-pulley: две несущие ветви делят вес поровну", () => {
  const tasks = generateTasks("movable-pulley", 120);
  assert.equal(new Set(tasks.map((task) => task.text)).size, 120);
  for (const task of tasks) {
    assert.equal(task.answerValue, task.params.P / 2);
    assert.equal(task.answerUnit, "Н");
    assert.match(task.text, /идеальным подвижным блоком/);
    assert.match(task.explanation ?? "", /две ветви/);
  }
});

test("school checks rotate through the full authored grade-specific set", async () => {
  for (const check of schoolChecks) {
    const seen = new Set<string>();
    let firstFamilies: string[] = [];
    for (let batch = 0; batch < Math.ceil(check.familyIds.length / 5); batch++) {
      const url = `http://localhost/api/tasks?template=${check.template}&count=5&batch=${batch}`;
      const response = await GET(new Request(url));
      const data = (await response.json()) as ApiTaskResponse;
      assert.equal(response.status, 200);
      assert.equal(data.tasks.length, 5);
      const families = data.tasks.map(task => task.blueprint);
      if (batch === 0) {
        firstFamilies = families;
        assert.deepEqual(families, check.familyIds.slice(0, 5));
        const repeat = await GET(new Request(url));
        assert.deepEqual((await repeat.json()).tasks, data.tasks);
      } else {
        assert.notDeepEqual(families, firstFamilies);
      }
      families.forEach(id => seen.add(id));
    }
    assert.deepEqual(seen, new Set(check.familyIds), check.template);
  }
});

for (const [template, families] of [
  ["mixed", kinematicsTemplateIds],
  ["dynamics-mixed", dynamicsTemplateIds],
  ["electro-mixed", electrodynamicsTemplateIds],
  ["thermo-mixed", thermodynamicsTemplateIds],
  ["optics-mixed", getTemplateIdsByGroup("optics")],
] as const) {
  test(`API route ${template} covers every family over a bounded batch cycle`, async () => {
    const seen = new Set<string>();
    // A session is capped at 20 and count=10 reserves 5/3/2 difficulty
    // slots. Covering the bank requires rotation, not one oversized request.
    for (let batch = 0; batch < 2 * families.length && seen.size < families.length; batch++) {
      const response = await GET(new Request(
        `http://localhost/api/tasks?template=${template}&count=10&batch=${batch}`,
      ));
      const data = (await response.json()) as ApiTaskResponse;
      assert.equal(response.status, 200);
      assert.equal(data.tasks.length, 10);
      for (const task of data.tasks) {
        assert.ok((families as readonly string[]).includes(task.blueprint), task.blueprint);
        seen.add(task.blueprint);
      }
    }
    assert.deepEqual(seen, new Set(families), template);
  });
}

test("API route exam собирает сбалансированную смешанную тренировку", async () => {
  const url = "http://localhost/api/tasks?template=exam&count=10&batch=3";
  const firstResponse = await GET(new Request(url));
  const repeatResponse = await GET(new Request(url));
  const first = (await firstResponse.json()) as ApiTaskResponse;
  const repeat = (await repeatResponse.json()) as ApiTaskResponse;

  assert.equal(firstResponse.status, 200);
  assert.equal(first.tasks.length, 10);
  assert.deepEqual(first.tasks, repeat.tasks);
  assert.equal(
    first.tasks.some((task) => (measurementTemplateIds as readonly string[]).includes(task.blueprint)),
    false,
    "измерения VII класса не занимают неподтверждённые экзаменационные слоты",
  );

  // Учебная диагностика: две задачи каждого из пяти включённых разделов.
  const groupOf = (blueprint: string) =>
    (kinematicsTemplateIds as readonly string[]).includes(blueprint)
      ? "kinematics"
      : (dynamicsTemplateIds as readonly string[]).includes(blueprint)
        ? "dynamics"
        : (electrodynamicsTemplateIds as readonly string[]).includes(blueprint)
          ? "electrodynamics"
          : (thermodynamicsTemplateIds as readonly string[]).includes(blueprint)
            ? "thermodynamics"
            : "optics";

  const counts: Record<string, number> = {};
  for (const task of first.tasks) {
    const group = groupOf(task.blueprint);
    counts[group] = (counts[group] ?? 0) + 1;
  }

  assert.equal(counts.kinematics, 2, "в mixed должно быть 2 задачи кинематики");
  assert.equal(counts.dynamics, 2, "в mixed должно быть 2 задачи динамики");
  assert.equal(counts.electrodynamics, 2, "в mixed должно быть 2 задачи электродинамики");
  assert.equal(counts.thermodynamics, 2, "в mixed должно быть 2 задачи термодинамики");
  assert.equal(counts.optics, 2, "в mixed должно быть 2 задачи оптики");

  // Порядок перемешан: первые пять задач не могут быть одной группы.
  const firstFiveGroups = new Set(first.tasks.slice(0, 5).map((task) => groupOf(task.blueprint)));
  assert.equal(firstFiveGroups.size > 1, true, "exam не должен идти блоками по темам");

  const ids = new Set(first.tasks.map((task) => task.id));
  assert.equal(ids.size, first.tasks.length, "id задач в exam должны быть уникальны");

  // Повторное семейство должно давать разные условия внутри сессии.
  const texts = new Set(first.tasks.map((task) => task.text));
  assert.equal(texts.size, first.tasks.length, "в exam не должно быть одинаковых задач");

  // Другой batch должен давать другой набор задач.
  const nextResponse = await GET(
    new Request("http://localhost/api/tasks?template=exam&count=10&batch=4"),
  );
  const next = (await nextResponse.json()) as ApiTaskResponse;
  assert.equal(
    first.tasks.some((task, index) => task.id !== next.tasks[index]?.id),
    true,
  );
});

test("relative-velocity-vectors несёт векторную диаграмму с ответом-гипотенузой", () => {
  const tasks = generateTasks("relative-velocity-vectors", 36);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "vector");
    if (task.diagram?.kind !== "vector") {
      continue;
    }
    assert.equal(task.diagram.spec.layout, "chain");
    assert.equal(task.diagram.spec.vectors.length, 2);
    assert.equal(task.diagram.spec.showResultant, true);
    assert.equal(
      task.answerValue,
      Math.hypot(task.params.v1, task.params.v2),
      "ответ должен быть гипотенузой треугольника скоростей",
    );
    assert.equal(Number.isInteger(task.answerValue), true);
  }
});

test("source-internal-resistance несёт схему цепи и целый ток", () => {
  const tasks = generateTasks("source-internal-resistance", 60);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "circuit");
    if (task.diagram?.kind !== "circuit") {
      continue;
    }
    assert.equal(task.diagram.spec.topology, "source-internal");
    assert.equal(
      task.answerValue,
      task.params.emf / (task.params.R + task.params.r),
    );
    assert.equal(Number.isInteger(task.answerValue), true);
    assert.equal(task.params.R > task.params.r, true);
  }
});

test("resultant-force-2d несёт concurrent-диаграмму с ответом-гипотенузой", () => {
  const tasks = generateTasks("resultant-force-2d", 20);

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "vector");
    if (task.diagram?.kind !== "vector") {
      continue;
    }
    assert.equal(task.diagram.spec.layout, "concurrent");
    assert.equal(task.diagram.spec.showResultant, true);
    assert.equal(task.answerValue, Math.hypot(task.params.f1, task.params.f2));
    assert.equal(Number.isInteger(task.answerValue), true);
    assert.equal(task.params.f1 % 5, 0, "силы кратны 5 Н");
  }
});

test("resistor-network: обе топологии со схемой и чистым ответом", () => {
  const tasks = generateTasks("resistor-network", 200);
  const topologies = new Set<string>();

  for (const task of tasks) {
    assert.equal(task.diagram?.kind, "circuit");
    if (task.diagram?.kind !== "circuit") {
      continue;
    }
    topologies.add(task.diagram.spec.topology);

    if (task.diagram.spec.topology === "parallel") {
      const expected = (task.params.r1 * task.params.r2) / (task.params.r1 + task.params.r2);
      assert.equal(task.answerValue, expected);
      assert.equal(Number.isInteger(task.answerValue), true, "параллельный ответ целый");
      assert.equal(
        task.answerValue < Math.min(task.params.r1, task.params.r2),
        true,
        "параллельное сопротивление меньше меньшего",
      );
    } else {
      assert.equal(task.answerValue, task.params.r1 + task.params.r2);
    }
  }

  assert.deepEqual(topologies, new Set(["series", "parallel"]));
});

test("API route пробрасывает diagram в задачи", async () => {
  const response = await GET(
    new Request("http://localhost/api/tasks?template=relative-velocity-vectors&count=3&batch=1"),
  );
  const data = (await response.json()) as ApiTaskResponse & {
    tasks: { diagram?: { kind: string } | null }[];
  };

  assert.equal(response.status, 200);
  data.tasks.forEach((task) => {
    assert.equal(task.diagram?.kind, "vector");
  });
});

test("API route обрезает count до 20", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=free-fall&count=100"));
  const data = (await response.json()) as ApiTaskResponse;

  assert.equal(response.status, 200);
  assert.equal(data.tasks.length, 20);
});

test("API route отдаёт 400 для неизвестного template", async () => {
  const response = await GET(new Request("http://localhost/api/tasks?template=unknown&count=5"));
  const data = await response.json();

  assert.equal(response.status, 400);
  assert.match(data.error, /Unknown template/);
});
