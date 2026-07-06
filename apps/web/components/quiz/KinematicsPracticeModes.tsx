"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { QuizSession } from "./QuizSession";

type PracticeMode = "static" | "generated";

const modes: { id: PracticeMode; label: string }[] = [
  { id: "static", label: "Разбор" },
  { id: "generated", label: "Задачи" },
];

export function KinematicsPracticeModes() {
  const [mode, setMode] = useState<PracticeMode>("static");

  return (
    <div className="flex flex-col gap-5">
      <div
        className="mx-auto grid w-full max-w-[580px] grid-cols-2 gap-2 rounded-card border border-white/[.08] bg-white/[.025] p-1"
        role="group"
        aria-label="Режим практики"
      >
        {modes.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={mode === item.id ? "primary" : "ghost"}
            aria-pressed={mode === item.id}
            className={cn("h-10 w-full px-2 text-[12px] sm:text-[13px]")}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <QuizSession
        key={mode}
        mode={mode}
        generatedTemplate={mode === "generated" ? "mixed" : undefined}
        topicId="kinematics"
      />
    </div>
  );
}
