"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { QuizSession } from "./QuizSession";

type DynamicsMode = "foundation" | "exam";

const modes: {
  id: DynamicsMode;
  label: string;
  description: string;
  template: string;
  title: string;
}[] = [
  {
    id: "foundation",
    label: "Разбор",
    description: "Потренируй одну идею: найти силу, массу или ускорение.",
    template: "newton-second",
    title: "Второй закон Ньютона",
  },
  {
    id: "exam",
    label: "Задачи",
    description: "Смешанный набор: силы, трение, плоскость, лифт, импульс и плотность тел.",
    template: "dynamics-mixed",
    title: "Задачи по динамике",
  },
];

export function DynamicsPracticeModes() {
  const [mode, setMode] = useState<DynamicsMode>("foundation");
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="mx-auto grid w-full max-w-[580px] grid-cols-2 gap-2 rounded-card border border-white/[.08] bg-white/[.025] p-1"
        role="group"
        aria-label="Режим практики по динамике"
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

      <p className="mx-auto min-h-10 w-full max-w-[580px] text-center text-[13px] leading-[1.6] text-white/55">
        {activeMode.description}
      </p>

      <QuizSession
        key={mode}
        mode="generated"
        generatedTemplate={activeMode.template}
        generatedTopic="Динамика"
        generatedTitle={activeMode.title}
        topicId="dynamics"
      />
    </div>
  );
}
