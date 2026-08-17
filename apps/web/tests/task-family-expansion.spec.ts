import { expect, test } from "@playwright/test";

const expandedFamilies = [
  { template: "average-speed-segments", topic: "Кинематика", format: "numeric_input" },
  { template: "unit-conversion-speed", topic: "Кинематика", format: "single_choice" },
  { template: "work-force-distance", topic: "Динамика", format: "numeric_input" },
  { template: "electric-power", topic: "Электродинамика", format: "numeric_input" },
  { template: "gas-state-ratio", topic: "Термодинамика", format: "single_choice" },
  { template: "heat-balance-simple", topic: "Термодинамика", format: "numeric_input" },
] as const;

type ApiTaskBase = {
  type: "single_choice" | "numeric_input";
  blueprint: string;
  topic: string;
  answerUnit: string;
  explanation: string;
};

type ApiTask = ApiTaskBase & {
  options?: Array<{ correct?: boolean; misconception?: string }>;
  answer: string | { value: number; unit: string; tolerance: number };
  misconceptions?: Array<{ value: number; label: string }>;
};

for (const family of expandedFamilies) {
  test(`expanded task family API smoke: ${family.template}`, async ({ request }) => {
    const response = await request.get(
      `/api/tasks?template=${family.template}&count=3&batch=0`,
    );
    expect(response.ok()).toBe(true);

    const data = (await response.json()) as { tasks: ApiTask[] };

    expect(data.tasks).toHaveLength(3);
    for (const task of data.tasks) {
      expect(task.blueprint).toBe(family.template);
      expect(task.topic).toBe(family.topic);
      expect(task.answerUnit.trim().length).toBeGreaterThan(0);
      expect(task.explanation.trim().length).toBeGreaterThan(0);
      expect(task.type).toBe(family.format);

      if (task.type === "numeric_input") {
        expect("options" in task).toBe(false);
        expect(typeof task.answer).toBe("object");
        expect((task.answer as { unit: string }).unit).toBe(task.answerUnit);
        expect((task.answer as { tolerance: number }).tolerance).toBeGreaterThan(0);
        expect(task.misconceptions).toHaveLength(3);
        expect(
          task.misconceptions?.every((misconception) => misconception.label.trim()),
        ).toBe(true);
        continue;
      }

      expect(task.options).toHaveLength(4);
      expect(task.options?.filter((option) => option.correct)).toHaveLength(1);
      expect(
        task.options
          ?.filter((option) => !option.correct)
          .every((option) => option.misconception?.trim()),
      ).toBe(true);
    }
  });
}
