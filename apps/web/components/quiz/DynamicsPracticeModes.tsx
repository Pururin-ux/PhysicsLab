"use client";

import { PracticeQuickBar } from "./PracticeQuickBar";
import { QuizSession } from "./QuizSession";

export function DynamicsPracticeModes() {
  return (
    <div className="flex flex-col gap-5">
      <PracticeQuickBar />

      <QuizSession
        mode="generated"
        generatedTemplate="dynamics-mixed"
        generatedTopic="Динамика"
        generatedTitle="Задачи по динамике"
        topicId="dynamics"
      />
    </div>
  );
}
