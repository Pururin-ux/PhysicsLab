import { expect, test } from "@playwright/test";

const expandedFamilies = [
  { template: "average-speed-segments", topic: "Кинематика" },
  { template: "unit-conversion-speed", topic: "Кинематика" },
  { template: "work-force-distance", topic: "Динамика" },
  { template: "electric-power", topic: "Электродинамика" },
  { template: "gas-state-ratio", topic: "Термодинамика" },
  { template: "heat-balance-simple", topic: "Термодинамика" },
] as const;

for (const family of expandedFamilies) {
  test(`expanded task family API smoke: ${family.template}`, async ({ request }) => {
    const response = await request.get(
      `/api/tasks?template=${family.template}&count=3&batch=0`,
    );
    expect(response.ok()).toBe(true);

    const data = (await response.json()) as {
      tasks: Array<{
        blueprint: string;
        topic: string;
        answerUnit: string;
        explanation: string;
        options: Array<{ correct?: boolean; misconception?: string }>;
      }>;
    };

    expect(data.tasks).toHaveLength(3);
    for (const task of data.tasks) {
      expect(task.blueprint).toBe(family.template);
      expect(task.topic).toBe(family.topic);
      expect(task.answerUnit.trim().length).toBeGreaterThan(0);
      expect(task.explanation.trim().length).toBeGreaterThan(0);
      expect(task.options).toHaveLength(4);
      expect(task.options.filter((option) => option.correct)).toHaveLength(1);
      expect(
        task.options
          .filter((option) => !option.correct)
          .every((option) => option.misconception?.trim()),
      ).toBe(true);
    }
  });
}
