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
    label: "Разобрать тему",
    description: "Три формы второго закона Ньютона: найти силу, массу или ускорение.",
    template: "newton-second",
    title: "Второй закон Ньютона",
  },
  {
    id: "exam",
    label: "Тренировка ЦТ",
    description: "Смешанный набор: силы, трение, наклонная плоскость и лифт.",
    template: "dynamics-mixed",
    title: "Тренировка ЦТ по динамике",
  },
];

export function DynamicsPracticeModes() {
  const [mode, setMode] = useState<DynamicsMode>("foundation");
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="mx-auto grid w-full max-w-[580px] grid-cols-2 gap-2 rounded-card border border-white/[.08] bg-white/[.025] p-1"
        role="tablist"
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
      />
    </div>
  );
}
