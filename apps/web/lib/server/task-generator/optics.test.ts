import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "../../../app/api/tasks/route.ts";
import { generateTasks, getBlueprint, getTemplateIdsByGroup } from "./generate.ts";
import { validateGeneratedTask } from "./validator.ts";
import type { GeneratedTask } from "./types.ts";
import type { OpticsDiagramSpec } from "../../physics/optics-diagram-spec.ts";

// Физический аудит оптических семейств: 1000 задач на семейство, инварианты
// решателя и согласованность диаграмм с параметрами условия.

const OPTICS_TEMPLATES = [
  "reflection-angle",
  "plane-mirror-separation",
  "refractive-index-speed",
  "snell-index-ratio",
  "thin-lens-image-distance",
  "lens-optical-power",
  "lens-image-height",
] as const;

function opticsSpec(task: GeneratedTask): OpticsDiagramSpec | null {
  if (!task.diagram) return null;
  assert.equal(task.diagram.kind, "optics", `${task.id}: диаграмма должна быть optics`);
  return task.diagram.kind === "optics" ? task.diagram.spec : null;
}

function hasOnlyFiniteNumbers(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(hasOnlyFiniteNumbers);
  if (value && typeof value === "object") {
    return Object.values(value).every(hasOnlyFiniteNumbers);
  }
  return true;
}

test("оптика: группа содержит ровно 7 шаблонов", () => {
  assert.deepEqual(new Set(getTemplateIdsByGroup("optics")), new Set(OPTICS_TEMPLATES));
});

for (const templateId of OPTICS_TEMPLATES) {
  test(`${templateId}: 1000 задач валидны и разнообразны`, () => {
    const tasks = generateTasks(templateId, 1000);
    const blueprint = getBlueprint(templateId);

    assert.equal(tasks.length, 1000);

    for (const task of tasks) {
      const validation = validateGeneratedTask(task, blueprint);
      assert.deepEqual(validation.issues, [], `${task.id}: ${JSON.stringify(validation.issues)}`);
      assert.ok(task.explanation && task.explanation.trim().length > 0);
      if (task.diagram) {
        assert.equal(
          hasOnlyFiniteNumbers(task.diagram.spec),
          true,
          `${task.id}: диаграмма содержит NaN/Infinity`,
        );
      }
    }

    // Разнообразие измеряем по тексту условия, а не по id.
    const texts = new Set(tasks.map((task) => task.text));
    const answers = new Set(tasks.map((task) => task.answerValue));
    assert.ok(texts.size >= 12, `${templateId}: слишком мало уникальных условий (${texts.size})`);
    assert.ok(answers.size >= 4, `${templateId}: слишком мало уникальных ответов (${answers.size})`);

    // Самое частое условие не должно доминировать в выборке.
    const frequency = new Map<string, number>();
    for (const task of tasks) {
      frequency.set(task.text, (frequency.get(task.text) ?? 0) + 1);
    }
    const maxFrequency = Math.max(...frequency.values());
    assert.ok(
      maxFrequency <= Math.ceil(1000 / texts.size) + 1,
      `${templateId}: одно условие встречается ${maxFrequency} раз при пуле ${texts.size}`,
    );
  });
}

test("reflection-angle: закон отражения и все варианты в 0–90°", () => {
  for (const task of generateTasks("reflection-angle", 500)) {
    assert.equal(task.answerValue, task.params.angle, "θr = θi");
    for (const option of task.options) {
      assert.ok(option.value > 0 && option.value < 90, `${task.id}: вариант ${option.value}° вне 0–90°`);
    }
    const spec = opticsSpec(task);
    assert.ok(spec && spec.scene === "reflection");
    if (spec?.scene === "reflection") {
      assert.equal(spec.reflectionAngleDeg, spec.incidenceAngleDeg, "диаграмма симметрична");
      assert.equal(spec.incidenceAngleDeg, task.params.angle);
    }
  }
});

test("plane-mirror-separation: изображение симметрично, ответ 2d", () => {
  for (const task of generateTasks("plane-mirror-separation", 500)) {
    assert.equal(task.answerValue, 2 * task.params.d);
    const spec = opticsSpec(task);
    assert.ok(spec && spec.scene === "plane_mirror");
    if (spec?.scene === "plane_mirror") {
      assert.equal(spec.imageDistance, spec.objectDistance, "мнимое изображение симметрично");
      assert.equal(spec.objectDistance, task.params.d);
    }
  }
});

test("refractive-index-speed: n = c/v и n > 1", () => {
  for (const task of generateTasks("refractive-index-speed", 500)) {
    assert.ok(task.answerValue > 1, `${task.id}: n=${task.answerValue} не больше 1`);
    assert.ok(task.params.v8 > 0 && task.params.v8 < 3, "0 < v < c");
    assert.ok(Math.abs(task.answerValue - 3 / task.params.v8) < 1e-9, "n = c/v");
    assert.equal(task.answerUnit, "", "показатель преломления безразмерный");
  }
});

test("snell-index-ratio: отношение синусов, переход в плотную среду", () => {
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  for (const task of generateTasks("snell-index-ratio", 500)) {
    const { i, r } = task.params;
    assert.ok(r > 0 && r < i && i < 90, `${task.id}: пара (${i}, ${r}) неупорядочена`);
    const exact = Math.sin(degToRad(i)) / Math.sin(degToRad(r));
    assert.ok(Math.abs(task.answerValue - Math.round(exact * 100) / 100) < 1e-9);
    assert.ok(task.answerValue > 1, "переход в оптически более плотную среду: отношение > 1");
    const spec = opticsSpec(task);
    if (spec?.scene === "refraction") {
      assert.equal(spec.incidenceAngleDeg, i);
      assert.equal(spec.refractionAngleDeg, r);
      assert.equal(spec.refractedGiven, true, "оба угла даны — луч виден до ответа");
    }
  }
});

test("thin-lens-image-distance: действительное изображение и нулевая невязка", () => {
  for (const task of generateTasks("thin-lens-image-distance", 500)) {
    const { F, dObj } = task.params;
    assert.ok(dObj > F, "предмет дальше фокуса");
    assert.ok(task.answerValue > 0, "изображение действительное");
    const residual = 1 / F - 1 / dObj - 1 / task.answerValue;
    assert.ok(Math.abs(residual) < 1e-9, `${task.id}: невязка формулы линзы ${residual}`);
    const spec = opticsSpec(task);
    if (spec?.scene === "thin_lens") {
      assert.equal(spec.focalLength, F);
      assert.equal(spec.objectDistance, dObj);
      assert.equal(spec.imageDistance, task.answerValue, "диаграмма содержит решение");
    }
  }
});

test("lens-optical-power: D > 0 и перевод сантиметров", () => {
  for (const task of generateTasks("lens-optical-power", 500)) {
    assert.ok(task.answerValue > 0);
    assert.ok(Math.abs(task.answerValue - 1 / (task.params.Fcm / 100)) < 1e-9, "D = 1/F[м]");
    assert.equal(task.answerUnit, "дптр");
  }
});

test("lens-image-height: модуль увеличения и перевёрнутое изображение в решении", () => {
  for (const task of generateTasks("lens-image-height", 500)) {
    const { h, dObj, di } = task.params;
    const magnification = di / dObj;
    assert.ok(task.answerValue > 0, "спрашивается модуль высоты");
    assert.ok(Math.abs(task.answerValue - h * magnification) < 1e-9, "h_i = h_o·|Γ|");
    const spec = opticsSpec(task);
    if (spec?.scene === "thin_lens") {
      assert.equal(spec.objectHeight, h);
      assert.equal(spec.imageDistance, di);
      assert.ok(
        spec.imageHeight !== undefined && Math.abs(spec.imageHeight - task.answerValue) < 1e-9,
        "высота изображения на диаграмме совпадает с ответом",
      );
      // Диаграмма честная: фокус восстановлен из формулы линзы.
      const F = spec.focalLength;
      assert.ok(Math.abs(1 / F - 1 / dObj - 1 / di) < 1e-9, "фокус согласован с расстояниями");
    }
  }
});

// ===== API =====

type ApiTask = {
  type: "single_choice" | "numeric_input";
  blueprint: string;
  id: string;
  diagram?: { kind: string; spec: Record<string, unknown> } | null;
  answer: unknown;
  options?: unknown[];
};

async function fetchTasks(query: string): Promise<ApiTask[]> {
  const response = await GET(new Request(`http://localhost/api/tasks?${query}`));
  assert.equal(response.status, 200, `запрос ${query}`);
  const payload = (await response.json()) as { tasks: ApiTask[] };
  return payload.tasks;
}

test("API: каждый оптический шаблон отдаёт корректный формат", async () => {
  const numericTemplates = new Set([
    "plane-mirror-separation",
    "refractive-index-speed",
    "thin-lens-image-distance",
    "lens-optical-power",
  ]);

  for (const templateId of OPTICS_TEMPLATES) {
    const tasks = await fetchTasks(`template=${templateId}&count=3&batch=1`);
    assert.equal(tasks.length, 3);

    for (const task of tasks) {
      assert.equal(task.blueprint, templateId);
      if (numericTemplates.has(templateId)) {
        assert.equal(task.type, "numeric_input");
        assert.equal("options" in task, false);
      } else {
        assert.equal(task.type, "single_choice");
        assert.equal(Array.isArray(task.options), true);
      }
    }
  }
});

test("API: optics-mixed покрывает все 7 навыков и сериализует диаграммы", async () => {
  const tasks = await fetchTasks("template=optics-mixed&count=14&batch=3");

  assert.equal(tasks.length, 14);
  assert.deepEqual(
    new Set(tasks.map((task) => task.blueprint)),
    new Set(OPTICS_TEMPLATES),
  );

  // Диаграммы переживают сериализацию: kind и числовые поля на месте.
  const withDiagram = tasks.filter((task) => task.diagram);
  assert.ok(withDiagram.length > 0, "в optics-mixed есть задачи с диаграммами");
  for (const task of withDiagram) {
    assert.equal(task.diagram!.kind, "optics");
    assert.equal(typeof task.diagram!.spec.scene, "string");
  }
});

test("API: optics-mixed детерминирован по batch", async () => {
  const first = await fetchTasks("template=optics-mixed&count=10&batch=5");
  const repeat = await fetchTasks("template=optics-mixed&count=10&batch=5");
  const other = await fetchTasks("template=optics-mixed&count=10&batch=6");

  assert.deepEqual(first, repeat);
  assert.equal(first.some((task, index) => task.id !== other[index]?.id), true);
});

test("exam: точное распределение 2 задачи на группу при count=10 и корректные длины 1–20", async () => {
  const groupsByTemplate = new Map<string, string>();
  for (const group of ["kinematics", "dynamics", "electrodynamics", "thermodynamics", "optics"] as const) {
    for (const id of getTemplateIdsByGroup(group)) {
      groupsByTemplate.set(id, group);
    }
  }

  for (const count of [1, 3, 5, 10, 13, 20]) {
    const tasks = await fetchTasks(`template=exam&count=${count}&batch=4`);
    assert.equal(tasks.length, count, `exam?count=${count}`);
    const ids = new Set(tasks.map((task) => task.id));
    assert.equal(ids.size, count, "id не дублируются");

    if (count === 10) {
      const counts: Record<string, number> = {};
      for (const task of tasks) {
        const group = groupsByTemplate.get(task.blueprint) ?? "unknown";
        counts[group] = (counts[group] ?? 0) + 1;
      }
      assert.deepEqual(counts, {
        kinematics: 2,
        dynamics: 2,
        electrodynamics: 2,
        thermodynamics: 2,
        optics: 2,
      });
    }
  }
});
