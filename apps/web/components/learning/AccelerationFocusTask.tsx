"use client";

import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { AccelerationStudyStage } from "./AccelerationStudyStage";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

const OPTIONS = ["на 2 м/с каждую секунду", "на 6 м/с каждую секунду", "на 8 м/с каждую секунду", "на 10 м/с каждую секунду"] as const;

export function AccelerationFocusTask() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [hasObserved, setHasObserved] = useState(false);
  const correct = answer === "на 2 м/с каждую секунду";

  return (
    <section data-theme-preserve="dark" className="relative isolate -mx-4 pb-5 sm:-mx-6">
      <div className="pointer-events-none absolute left-[12%] top-28 -z-10 h-[480px] w-[70%] rounded-full bg-[#d79455]/[.075] blur-3xl" aria-hidden="true" />
      <header className="mx-auto max-w-[940px] px-4 sm:px-8">
        <p className="text-[14px] font-semibold text-[#f3cb8b]">Кинематика · один разгон</p>
        <h1 className="mt-1 text-[34px] font-[800] leading-[1.04] tracking-[-.045em] text-white sm:text-[50px]">Разгон у остановки</h1>
        <p className="mt-3 max-w-[650px] text-[16px] leading-[1.65] text-white/74">
          Троллейбус увеличил скорость с 2 до 8 м/с за 3 с. Сначала посмотри на его движение — затем назови темп разгона.
        </p>
      </header>

      <div className="mt-7">
        <AccelerationStudyStage onObservedChange={setHasObserved} />
      </div>

      <div className="mx-auto mt-7 max-w-[940px] px-4 sm:px-8">
        <fieldset disabled={!hasObserved} className="min-w-0 border-t border-white/[.12] pt-5 disabled:opacity-55">
          <legend className="text-[20px] font-bold tracking-[-.02em] text-white">Как менялась скорость за секунду?</legend>
          <p className="mt-1 text-[14px] leading-[1.6] text-white/64">
            {hasObserved ? "Не общую разницу скоростей, а то, на сколько она менялась за одну секунду." : "Перейди к моменту 3 с — тогда станет виден весь разгон."}
          </p>
          <div className="mt-4 grid gap-x-6 sm:grid-cols-2">
            {OPTIONS.map((option) => {
              const chosen = answer === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => setAnswer(option)}
                  className={cn(
                    "min-h-14 border-b px-1 text-left text-[16px] font-bold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#090c1e] disabled:cursor-not-allowed",
                    chosen ? "border-[#f1c47d]/70 text-white" : "border-white/[.12] text-white/74 hover:border-white/32 hover:text-white",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        {answer ? (
          <div data-testid="acceleration-answer-feedback" role={correct ? "status" : "alert"} aria-live="polite" className={cn("mt-7 border-l-2 pl-4 sm:pl-5", correct ? "border-[#8de7d4]/75" : "border-[#f1c47d]/70")}>
            {correct ? (
              <div className="flex gap-3">
                <CheckCircle className="mt-0.5 shrink-0 text-[#8de7d4]" size={21} weight="fill" />
                <div>
                  <p className="font-bold text-white">Верно: скорость прибавляла по 2 м/с каждую секунду.</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-white/72">Именно эту мысль физики записывают короче:</p>
                  <p className="mt-2 border-t border-white/[.12] pt-3 text-[19px] text-white"><MathText text="$a=\frac{\Delta v}{\Delta t}=\frac{8-2}{3}=2\ \text{м/с}^2$." /></p>
                  <Link href="/practice/kinematics-demo" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan">
                    Продолжить с другими задачами <ArrowRight size={17} weight="bold" />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-bold text-white">Сначала найди, на сколько изменилась скорость.</p>
                <p className="mt-1 text-[14px] leading-[1.6] text-white/72">Было 2 м/с, стало 8 м/с: прибавилось 6 м/с. Эти 6 м/с распределились на 3 с.</p>
                <Button type="button" size="sm" variant="ghost" className="mt-3" onClick={() => setAnswer(null)}>Выбрать ещё раз</Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
