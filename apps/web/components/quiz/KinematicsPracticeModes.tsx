"use client";

import { PracticeQuickBar } from "./PracticeQuickBar";
import { QuizSession } from "./QuizSession";

export function KinematicsPracticeModes() {
  return (
    <div className="flex flex-col gap-5">
      <PracticeQuickBar />

      <QuizSession
        mode="static"
        topicId="kinematics"
      />
    </div>
  );
}
