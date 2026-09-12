"use client";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./ExamEntry.module.css";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { Button } from "../ui/Button";
import { QuizSession } from "../quiz/QuizSession";
import {
  clearExamResumeCandidate,
  readExamResumeCandidate,
  type ExamResumeCandidate,
} from "../../lib/quiz/active-session-snapshot";

const ERROR_CATEGORIES = [
  "Условие или модель",
  "Формула",
  "Знак или ось",
  "Единицы СИ",
  "Вычисление",
] as const;

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
    <p className="mt-4 text-[13px] font-semibold leading-[1.6] text-white/64">
      Твои сохранённые попытки: <span className="physics-number text-white/82">{log.length}</span>
      {best ? <span> · лучший результат <span className="physics-number text-nova-cyan">{best.score}/{best.total}</span></span> : null}
      {last ? <span> · последний <span className="physics-number text-white/80">{last.score}/{last.total}</span></span> : null}
    </p>
  );
}

function ExamTools() {
  const [scratch, setScratch] = useState("");
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  return (
    <aside aria-label="Инструменты для решения" className="border-t border-white/[.1] pt-3 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
      <details className="group border-b border-white/[.1] py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold text-white/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
          Черновик <span aria-hidden="true" className="text-white/56 group-open:rotate-45">＋</span>
        </summary>
        <label htmlFor="exam-scratch" className="sr-only">Черновик для решения задачи</label>
        <textarea
          id="exam-scratch"
          value={scratch}
          onChange={(event) => setScratch(event.target.value)}
          rows={6}
          placeholder="Запиши дано, формулу или промежуточный расчёт…"
          className="mt-2 w-full resize-y rounded-option border border-white/[.14] bg-space-950 px-3 py-3 text-[13px] leading-[1.55] text-white placeholder:text-white/32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70"
        />
        <p className="mt-2 text-[11px] leading-[1.5] text-white/58">Сохраняется только на этой странице и не отправляется с ответом.</p>
      </details>

      <details className="group border-b border-white/[.1] py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold text-white/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
          Что помешало? <span aria-hidden="true" className="text-white/56 group-open:rotate-45">＋</span>
        </summary>
        <fieldset className="mt-2">
          <legend className="text-[12px] leading-[1.55] text-white/52">Если ответ не совпал, выбери, что запутало.</legend>
          <div className="mt-2 grid gap-1.5">
            {ERROR_CATEGORIES.map((category) => (
              <label key={category} className="flex min-h-9 cursor-pointer items-center gap-2 text-[12px] text-white/66">
                <input
                  type="radio"
                  name="exam-error-category"
                  checked={errorCategory === category}
                  onChange={() => setErrorCategory(category)}
                  className="size-4 accent-[var(--mode-exam-accent)]"
                />
                {category}
              </label>
            ))}
          </div>
          {errorCategory ? <p role="status" className="mt-2 text-[11px] leading-[1.5] text-nova-cyan/72">Отмечено: {errorCategory.toLowerCase()}.</p> : null}
        </fieldset>
      </details>
    </aside>
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
      <section aria-label="Решение задач" className="min-w-0">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/[.1] pb-3">
          <p className="text-[13px] font-bold text-white/82">Диагностическая задача</p>
          <p className="text-[12px] font-bold text-nova-cyan/76">Без ограничения по времени</p>
        </header>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <QuizSession
              generatedTemplate="exam"
              generatedTopic="Смешанная тренировка"
              generatedTitle="Диагностическая задача"
              sessionKind="exam"
              summaryVariant="exam"
              preAnswerGuidance="unlabelled"
              recoveryMode={started === "fresh" ? "fresh" : "auto"}
              freshAttemptId={discardedAttemptId}
            />
          </div>
          <ExamTools />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="exam-entry-title" className={styles.entry}>
      <Link href="/exam/program" className={styles.topics}>
        <span><strong>Выбрать тему</strong><small>Задачи по разделам физики</small></span><span aria-hidden="true">→</span>
      </Link>
      <div className={styles.check}>
        <div className={styles.body}>
          <h2 id="exam-entry-title">Проверить себя</h2>
          <p>10 задач: движение, силы, электричество, теплота и оптика. Решай в своём темпе, затем посмотри разбор.</p>
          <div className={styles.actions}>
            {resumeCandidate === undefined ? (
              <Button size="lg" disabled aria-label="Проверяем незавершённую диагностику" className="sm:w-auto">
                Проверяем сохранение…
              </Button>
            ) : resumeCandidate ? (
              <section aria-labelledby="exam-resume-title" data-testid="exam-resume-candidate">
                <h3 id="exam-resume-title" className="text-[16px] font-bold text-white">Незавершённая диагностика</h3>
                <p className="mt-1 text-[14px] leading-[1.6] text-white/72">
                  {resumeCandidate.phase === "answered"
                    ? `Ответ на задание ${resumeCandidate.currentTaskNumber} уже сохранён — можно продолжить с разбора.`
                    : `Можно продолжить с задания ${resumeCandidate.currentTaskNumber} из ${resumeCandidate.total}.`}
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <Button size="lg" onClick={() => setStarted("resume")}>Продолжить диагностику</Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => {
                      setDiscardedAttemptId(resumeCandidate.attemptId);
                      clearExamResumeCandidate(resumeCandidate.attemptId);
                      setStarted("fresh");
                    }}
                  >
                    Начать новую диагностику
                  </Button>
                </div>
              </section>
            ) : (
              <Button size="lg" className="sm:w-auto" onClick={() => setStarted("normal")}>
                Начать диагностику
              </Button>
            )}

          </div>
          <ExamHistoryLine />
        </div>
        <Image src="/images/mio/mio-attentive-v1.png" width={1254} height={1254} alt="Мио внимательно слушает, держа блокнот" className={styles.mio} sizes="(max-width:640px) 110px, 240px" />
      </div>
      <p className={styles.note}>Это проверка отдельных тем, а не полный вариант ЦТ/ЦЭ. Результат поможет выбрать, что повторить.</p>
    </section>
  );
}
