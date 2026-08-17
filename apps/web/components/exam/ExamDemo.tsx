"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { QuizSession } from "../quiz/QuizSession";
import {
  clearExamResumeCandidate,
  readExamResumeCandidate,
  type ExamResumeCandidate,
} from "../../lib/quiz/active-session-snapshot";

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
  const [started, setStarted] = useState<"normal" | "resume" | "fresh" | null>(null);
  const [resumeCandidate, setResumeCandidate] = useState<ExamResumeCandidate | null>();
  const [discardedAttemptId, setDiscardedAttemptId] = useState<string | undefined>();

  useEffect(() => {
    setResumeCandidate(readExamResumeCandidate());
  }, []);

  if (started) {
    return (
      <QuizSession
        generatedTemplate="exam"
        generatedTopic="Смешанная тренировка"
        generatedTitle="Смешанная тренировка · открытые темы"
        sessionKind="exam"
        recoveryMode={started === "fresh" ? "fresh" : "auto"}
        freshAttemptId={discardedAttemptId}
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
          Кинематика, динамика, электродинамика, термодинамика и оптика — по две задачи из каждой темы.
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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] leading-[1.55] text-white/55">
        <span>Это тренировочный набор, а не полный вариант ЦТ/ЦЭ.</span>
        <Link
          href="/tasks#coverage"
          className="font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
        >
          Посмотреть покрытие программы
        </Link>
      </div>

      <ExamHistoryLine />

      {resumeCandidate === undefined ? (
        <Button size="lg" disabled aria-label="Проверяем незавершённый вариант">
          Проверяем сохранение…
        </Button>
      ) : resumeCandidate ? (
        <section
          aria-labelledby="exam-resume-title"
          className="flex flex-col gap-3 border-t border-white/10 pt-5"
          data-testid="exam-resume-candidate"
        >
          <div className="flex flex-col gap-1">
            <h2 id="exam-resume-title" className="text-[17px] font-bold text-white">
              Незавершённый вариант
            </h2>
            <p className="text-[14px] leading-[1.6] text-white/68">
              {resumeCandidate.phase === "answered"
                ? `Ответ на задание ${resumeCandidate.currentTaskNumber} уже сохранён — можно продолжить с разбора.`
                : `Можно продолжить с задания ${resumeCandidate.currentTaskNumber} из ${resumeCandidate.total}.`}
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Button
              size="lg"
              className="border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
              onClick={() => setStarted("resume")}
            >
              Продолжить вариант
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                setDiscardedAttemptId(resumeCandidate.attemptId);
                clearExamResumeCandidate(resumeCandidate.attemptId);
                setStarted("fresh");
              }}
            >
              Начать новый вариант
            </Button>
          </div>
        </section>
      ) : (
        <Button
          size="lg"
          className="border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
          onClick={() => setStarted("normal")}
        >
          Начать тренировку
        </Button>
      )}
    </Card>
  );
}
