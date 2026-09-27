export const learningGroupDefinitions = [
  { id: "grade-7", label: "7 класс" },
  { id: "grade-8", label: "8 класс" },
  { id: "grade-9", label: "9 класс" },
  { id: "grade-10", label: "10 класс" },
  { id: "grade-11", label: "11 класс" },
  { id: "additional-practice", label: "Дополнительная практика" },
] as const;

export type LearningGroupId = (typeof learningGroupDefinitions)[number]["id"];
