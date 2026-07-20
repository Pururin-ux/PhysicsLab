"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    <p className="text-[13px] font-semibold leading-[1.6] text-white/55">
      Твои сохранённые попытки: <span className="physics-number text-white/80">{log.length}</span>
      {best ? <span> · лучший результат <span className="physics-number text-nova-cyan">{best.score}/{best.total}</span></span> : null}
      {last ? <span> · последний <span className="physics-number text-white/80">{last.score}/{last.total}</span></span> : null}
    </p>
  );
}

function ExamTools() {
  const [scratch, setScratch] = useState("");
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  return (
    <aside aria-label="Инструменты для решения" className="border-t border-white/[.1] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/42">Рядом с задачей</p>

      <details className="group mt-3 border-t border-white/[.1] py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold text-white/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
          Черновик <span aria-hidden="true" className="text-white/40 group-open:rotate-45">＋</span>
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
        <p className="mt-2 text-[11px] leading-[1.5] text-white/42">Сохраняется только на этой странице и не отправляется с ответом.</p>
      </details>

      <details className="group border-t border-white/[.1] py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold text-white/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
          Подсказка по стратегии <span aria-hidden="true" className="text-white/40 group-open:rotate-45">＋</span>
        </summary>
        <ol className="mt-2 space-y-2 text-[12px] leading-[1.55] text-white/58">
          <li>1. Назови величину, которую нужно найти.</li>
          <li>2. Выбери направление, если в задаче есть векторы.</li>
          <li>3. Проверь единицы до подстановки.</li>
        </ol>
      </details>

      <details className="group border-y border-white/[.1] py-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[13px] font-bold text-white/76 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
          Классификация ошибки <span aria-hidden="true" className="text-white/40 group-open:rotate-45">＋</span>
        </summary>
        <fieldset className="mt-2">
          <legend className="text-[12px] leading-[1.55] text-white/52">Если ответ не сошёлся, отметь, где сбился шаг.</legend>
          <div className="mt-2 grid gap-1.5">
            {ERROR_CATEGORIES.map((category) => (
              <label key={category} className="flex min-h-9 cursor-pointer items-center gap-2 text-[12px] text-white/66">
                <input
                  type="radio"
                  name="exam-error-category"
                  checked={errorCategory === category}
                  onChange={() => setErrorCategory(category)}
                  className="size-4 accent-[#8d83f4]"
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
      <section aria-label="Тренировочное решение" className="min-w-0">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/[.1] pb-3">
          <div>
            <p className="text-[12px] font-bold text-white/76">Смешанная задача · тренировочный режим</p>
            <p className="mt-1 text-[12px] text-white/44">Решение не ограничено по времени</p>
          </div>
          <p className="text-[12px] font-bold text-nova-cyan/70">Таймер выключен</p>
        </header>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <QuizSession
              generatedTemplate="exam"
              generatedTopic="Смешанная тренировка"
              generatedTitle="Смешанная тренировка · открытые темы"
              sessionKind="exam"
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
    <section aria-labelledby="exam-mode-title" className="mx-auto w-full max-w-[860px]">
      <div className="grid gap-6 border-y border-white/[.11] py-6 md:grid-cols-[minmax(0,1fr)_260px] md:items-start md:gap-8">
        <div>
          <p className="text-[12px] font-bold text-nova-cyan/72">Спокойная тренировка</p>
          <h2 id="exam-mode-title" className="mt-2 text-[28px] font-[800] leading-tight tracking-[-.025em] text-white sm:text-[34px]">
            Смешанная тренировка
          </h2>
          <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.65] text-white/66">
            В этом наборе — 10 задач из уже открытых тем. Таймер не запускается: сначала можно понять тип задачи, сделать запись в черновике и только потом отвечать.
          </p>
          <p className="mt-3 text-[12px] leading-[1.6] text-white/48">
            Это тренировочный набор, а не полный вариант ЦТ/ЦЭ: квантовая и атомно-ядерная физика пока не включены.
          </p>
        </div>

        <div className="hidden border-l border-white/[.1] pl-5 md:block">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/42">Во время решения</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-[1.55] text-white/64">
            <li>Черновик по желанию</li>
            <li>Подсказка только по стратегии</li>
            <li>Можно отметить, на каком шаге сбился</li>
          </ul>
          <Link href="/tasks#coverage" className="mt-4 inline-flex min-h-10 items-center text-[12px] font-bold text-nova-cyan/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70">
            Что уже входит в тренировку
          </Link>
        </div>

        <details className="group border-y border-white/[.1] py-2 md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[12px] font-bold text-white/66 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70 [&::-webkit-details-marker]:hidden">
            Что доступно при решении <span aria-hidden="true" className="text-white/40 group-open:rotate-45">＋</span>
          </summary>
          <ul className="mt-2 space-y-2 text-[12px] leading-[1.55] text-white/60">
            <li>Черновик по желанию</li>
            <li>Подсказка только по стратегии</li>
            <li>Можно отметить, на каком шаге сбился</li>
          </ul>
          <Link href="/tasks#coverage" className="mt-3 inline-flex min-h-10 items-center text-[12px] font-bold text-nova-cyan/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70">
            Что уже входит в тренировку
          </Link>
        </details>
      </div>

      <div className="mt-5">
        <ExamHistoryLine />

        {resumeCandidate === undefined ? (
          <Button size="lg" disabled aria-label="Проверяем незавершённый вариант" className="mt-4 sm:w-auto">
            Проверяем сохранение…
          </Button>
        ) : resumeCandidate ? (
          <section aria-labelledby="exam-resume-title" className="mt-4 border-t border-white/10 pt-5" data-testid="exam-resume-candidate">
            <h3 id="exam-resume-title" className="text-[17px] font-bold text-white">Незавершённый вариант</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-white/68">
              {resumeCandidate.phase === "answered"
                ? `Ответ на задание ${resumeCandidate.currentTaskNumber} уже сохранён — можно продолжить с разбора.`
                : `Можно продолжить с задания ${resumeCandidate.currentTaskNumber} из ${resumeCandidate.total}.`}
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <Button size="lg" onClick={() => setStarted("resume")}>Продолжить вариант</Button>
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
          <Button size="lg" className="mt-4 sm:w-auto" onClick={() => setStarted("normal")}>
            Начать тренировку
          </Button>
        )}
      </div>
    </section>
  );
}
