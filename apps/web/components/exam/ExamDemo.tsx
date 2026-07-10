"use client";

import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { QuizSession } from "../quiz/QuizSession";

function ExamHistoryLine() {
  const log = useStore($examLog);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || log.length === 0) {
    return null;
  }

  const best = getBestAttempt(log);
  const last = log[log.length - 1];

  return (
    <p className="text-[13px] font-semibold leading-[1.6] text-white/55">
      Попыток:{" "}
      <span className="physics-number text-white/80">{log.length}</span>
      {best ? (
        <>
          {" "}
          · лучший результат{" "}
          <span className="physics-number text-nova-cyan">
            {best.score}/{best.total}
          </span>
        </>
      ) : null}
      {last ? (
        <>
          {" "}
          · последний{" "}
          <span className="physics-number text-white/80">
            {last.score}/{last.total}
          </span>
        </>
      ) : null}
    </p>
  );
}

export function ExamDemo() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <QuizSession
        generatedTemplate="exam"
        generatedTopic="Смешанная тренировка"
        generatedTitle="Смешанная тренировка · открытые темы"
        sessionKind="exam"
      />
    );
  }

  return (
    <Card
      variant="elevated"
      className="mx-auto flex w-full max-w-[580px] flex-col gap-5 border-nova-gold/25 !p-6 md:!p-7"
    >
      <div className="flex items-center gap-2.5">
        <Badge tone="gold">Открытые темы</Badge>
        <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
          10 задач
        </span>
      </div>

      <ul className="flex flex-col gap-2.5 text-[14px] leading-[1.65] text-white/72">
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          Кинематика, динамика, электродинамика и термодинамика вперемешку.
        </li>
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          После каждого ответа — разбор решения и ловушки.
        </li>
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          Ошибки попадут в твой список слабых мест.
        </li>
      </ul>

      <ExamHistoryLine />

      <Button
        size="lg"
        className="border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
        onClick={() => setStarted(true)}
      >
        Начать тренировку
      </Button>
    </Card>
  );
}
