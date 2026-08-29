"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  ExamMissingSection,
  ExamMixTopic,
} from "../../lib/learning/exam-mix";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { Badge } from "../ui/Badge";
// Длина диагностики выведена из состава открытых тем: по две задачи из каждой.
import { EXAM_QUESTION_COUNT } from "../../lib/quiz/generated-quiz-count";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { QuizSession } from "../quiz/QuizSession";
import {
  clearExamResumeCandidate,
  readExamResumeCandidate,
  type ExamResumeCandidate,
} from "../../lib/quiz/active-session-snapshot";


interface ExamDemoProps {
  // Темы, из которых собирается вариант, и разделы программы без задач.
  // Карта показывается ДО кнопки старта — иначе непонятно, что именно
  // проверяет диагностика и каких разделов в ней принципиально нет.
  sections: readonly ExamMixTopic[];
  missing: readonly ExamMissingSection[];
  totalTaskTypes: number;
}

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
    <p className="text-[13px] font-semibold leading-[1.6] text-ink-soft">
      Попыток: <span className="physics-number text-white/80">{log.length}</span>
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

function ExamCoverageMap({
  sections,
  missing,
  totalTaskTypes,
}: {
  sections: readonly ExamMixTopic[];
  missing: readonly ExamMissingSection[];
  totalTaskTypes: number;
}) {
  return (
    <section
      data-testid="exam-coverage-map"
      aria-labelledby="exam-coverage-title"
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <h2 id="exam-coverage-title" className="text-[15px] font-[800] text-white">
          Что внутри варианта
        </h2>
        <p className="text-[12px] leading-[1.6] text-ink-soft">
          По две задачи из каждой из {sections.length} открытых тем: всего {sections.length * 2}{" "}
          заданий из {totalTaskTypes} доступных типов.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {sections.map((section) => (
          <li
            key={section.id}
            className="flex flex-col gap-1.5 rounded-option border border-line bg-surface-1 px-3.5 py-2.5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] font-bold text-white">
                {section.title}
              </span>
              <span className="shrink-0 text-[12px] font-semibold text-ink-soft">
                <span className="physics-number text-white/85">{section.familyCount}</span> типов ·
                2 задачи
              </span>
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1].map((slot) => (
                <span key={slot} className="h-1.5 flex-1 rounded-full bg-nova-gold/70" />
              ))}
            </div>
          </li>
        ))}
      </ul>

      {missing.length > 0 ? (
        <div className="flex flex-col gap-1.5 rounded-option border border-line bg-surface-1 px-3.5 py-3">
          <p className="pl-eyebrow">
            Чего в варианте нет
          </p>
          <ul className="flex flex-col gap-1">
            {missing.map((section) => (
              <li key={section.id} className="text-[12px] leading-[1.55] text-white/55">
                {section.title} — {section.summary}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function ExamDemo({ sections, missing, totalTaskTypes }: ExamDemoProps) {
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
        generatedTopic="Диагностика"
        generatedTitle="Диагностика · открытые темы"
        sessionKind="exam"
        generatedCount={EXAM_QUESTION_COUNT}
        recoveryMode={started === "fresh" ? "fresh" : "auto"}
        freshAttemptId={discardedAttemptId}
      />
    );
  }

  return (
    <Card
      variant="raised"
      padding="lg"
      className="mx-auto flex w-full max-w-[640px] flex-col gap-6 border-nova-gold/25"
    >
      <div className="flex items-center gap-2.5">
        <Badge tone="gold">Открытые темы</Badge>
        <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
          {EXAM_QUESTION_COUNT} задач
        </span>
      </div>

      <ExamCoverageMap sections={sections} missing={missing} totalTaskTypes={totalTaskTypes} />

      <ul className="flex flex-col gap-2.5 text-[14px] leading-[1.65] text-ink-muted">
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          Темы идут вперемешку: как на экзамене, а не блоками по разделу.
        </li>
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          После каждого ответа — разбор решения и ловушки.
        </li>
        <li className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="text-nova-gold">—</span>
          Ошибки попадут в список слабых мест и в план повторения.
        </li>
      </ul>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] leading-[1.55] text-ink-soft">
        <span>Это тренировочный набор, а не полный вариант ЦТ/ЦЭ.</span>
        <Link
          href="/tasks#coverage"
          className="font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
        >
          Все типы задач
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
            <Button size="lg" variant="gold" onClick={() => setStarted("resume")}>
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
        <Button size="lg" variant="gold" fullWidth onClick={() => setStarted("normal")}>
          Начать тренировку
        </Button>
      )}
    </Card>
  );
}
