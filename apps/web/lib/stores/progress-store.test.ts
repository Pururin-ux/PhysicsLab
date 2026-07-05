import assert from "node:assert/strict";
import test from "node:test";
import {
  $appProgress,
  recordCompletedSession,
  resetProgress,
} from "./progress-store.ts";
import type { AnswerRecord } from "../../components/quiz/quiz-session-store.ts";

test("progress store records completed topic sessions as aggregates", () => {
  resetProgress();

  const answers: AnswerRecord[] = [
    {
      taskId: "d-01",
      selectedOptionId: "a",
      correctOptionId: "a",
      isCorrect: true,
      attempt: 1,
      blueprint: "newton-second",
      taskTrap: "единицы",
    },
    {
      taskId: "d-02",
      selectedOptionId: "b",
      correctOptionId: "c",
      isCorrect: false,
      attempt: 1,
      blueprint: "friction-force",
      taskTrap: "перепутал N и mg",
      selectedMisconception: "подставил массу вместо реакции опоры",
    },
    {
      taskId: "d-03",
      selectedOptionId: "b",
      correctOptionId: "c",
      isCorrect: false,
      attempt: 1,
      blueprint: "friction-force",
      taskTrap: "",
    },
  ];

  recordCompletedSession({
    topicId: "dynamics",
    score: 1,
    total: 3,
    answers,
  });

  const progress = $appProgress.get().topics.dynamics;

  assert.equal(progress.solved, 3);
  assert.equal(progress.correct, 1);
  assert.equal(progress.completedSessions, 1);
  assert.equal(progress.weakTraps["friction-force:подставил массу вместо реакции опоры"], 1);
  assert.equal(progress.weakTraps.undefined, undefined);
  assert.equal(typeof progress.lastPracticedAt, "string");
});
