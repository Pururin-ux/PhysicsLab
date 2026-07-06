"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CoachAvatar } from "../coach/CoachAvatar";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import { vtSlopeExample } from "../../lib/physics/physics-graph-examples";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

type PreviewOption = {
  value: string;
  correct: boolean;
  // Реплика Nova привязана к конкретной ловушке выбранного варианта.
  novaLine: string;
};

const options: PreviewOption[] = [
  {
    value: "2 м/с²",
    correct: true,
    novaLine:
      "Верно! Ты взял $\\frac{\\Delta v}{\\Delta t} = \\frac{8 - 4}{2}$ — изменение скорости за время, а не саму скорость.",
  },
  {
    value: "4 м/с²",
    correct: false,
    novaLine:
      "Это $\\frac{v_2}{t} = \\frac{8}{2}$ — конечная скорость, делённая на время. А ускорение — про изменение скорости: $\\frac{8 - 4}{2}$.",
  },
  {
    value: "6 м/с²",
    correct: false,
    novaLine:
      "Это средняя скорость $\\frac{4 + 8}{2}$, а спрашивают ускорение. Смотри, на сколько скорость выросла за 2 с.",
  },
  {
    value: "8 м/с²",
    correct: false,
    novaLine:
      "Это конечная скорость тела, а не ускорение. Ускорение — наклон графика: $\\frac{8 - 4}{2}$.",
  },
];

export function InteractivePreview() {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = answered ? options[selected].correct : false;

  return (
    <Card
      variant="elevated"
      className="flex flex-col gap-5 border-nova-cyan/[.14] !p-5 md:!p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge tone="cyan">Кинематика</Badge>
        <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
          попробуй прямо здесь
        </span>
      </div>

      <p className="text-[16px] font-semibold leading-[1.6] text-white">
        Скорость тела равномерно выросла с{" "}
        <span className="physics-number">4</span> до{" "}
        <span className="physics-number">8</span> м/с за{" "}
        <span className="physics-number">2</span> с. Чему равно ускорение?
      </p>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PhysicsGraph
          spec={vtSlopeExample}
          compact
          ariaLabel="График скорости: линия от 4 до 8 метров в секунду за 2 секунды"
        />

        <div
          className="flex flex-col gap-2"
          role="group"
          aria-label="Варианты ответа"
        >
          {options.map((option, index) => {
            const state = !answered
              ? "idle"
              : option.correct
                ? "correct"
                : index === selected
                  ? "wrong"
                  : "dimmed";

            return (
              <button
                key={option.value}
                type="button"
                disabled={answered}
                data-state={state}
                onClick={() => setSelected(index)}
                className={cn(
                  "quiz-option flex min-h-11 items-center justify-between rounded-option border px-4 text-left text-[14px] font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
                  "disabled:cursor-default",
                  state === "idle" &&
                    "border-white/[.09] bg-white/[.02] text-white/75 hover:-translate-y-px hover:border-nova-blue/55 hover:bg-space-800",
                  state === "correct" &&
                    "border-nova-cyan/55 bg-nova-cyan-10 text-white",
                  state === "wrong" &&
                    "border-nova-gold/45 bg-nova-gold/[.07] text-white",
                  state === "dimmed" &&
                    "border-white/[.06] bg-white/[.015] text-white/45",
                )}
              >
                <span className="physics-number">{option.value}</span>
                {state === "correct" ? (
                  <span className="text-[12px] font-bold text-nova-cyan">
                    ✓ верно
                  </span>
                ) : state === "wrong" ? (
                  <span className="text-[12px] font-bold text-nova-gold">
                    выбрано
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {answered ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
            <div
              className={cn(
                "flex items-start gap-3 rounded-option border bg-space-950/50 p-3",
                isCorrect ? "border-nova-cyan/25" : "border-nova-gold/25",
              )}
              role="status"
              aria-live="polite"
            >
              <CoachAvatar state={isCorrect ? "encouraging" : "warning"} />
              <p className="text-[13px] leading-[1.7] text-white/75">
                <span className="font-bold text-white">Nova:</span>{" "}
                <MathText text={options[selected].novaLine} />
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="sm">
                <Link href="/topics">Хочу ещё — к темам</Link>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
              >
                Попробовать снова
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
