"use client";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CoverageSection } from "../../lib/learning/coverage";
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

function MixedPracticeArt() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="img"
      aria-label="Кот готовит черновик к диагностике"
    >
      <Image
        src="/art/production/cat-exam-scratch-paper.webp"
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 340px"
        className="object-contain object-center p-3 md:p-5"
        priority
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,var(--mode-exam-soft),transparent_44%)]"
      />
    </div>
  );
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

function coverageStatusLabel(status: CoverageSection["status"]) {
  return status === "partial" ? "Покрыто частично" : "Пока нет задач";
}

function primaryCoverageGap(section: CoverageSection) {
  return (
    section.knownGaps.find(
      (gap) => !gap.startsWith("Не все") && !gap.includes("v1"),
    ) ?? section.knownGaps[0]
  );
}

function ExamCoverageMap({ coverage }: { coverage: readonly CoverageSection[] }) {
  const partialCount = coverage.filter((section) => section.status === "partial").length;
  const missingCount = coverage.filter((section) => section.status === "not-covered").length;

  return (
    <section aria-labelledby="exam-coverage-title" data-testid="exam-coverage-map">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-[850] uppercase tracking-[.16em] text-nova-cyan/78">
            Карта программы до старта
          </p>
          <h3 id="exam-coverage-title" className="mt-1 text-[22px] font-[820] tracking-[-.025em] text-white">
            Что эта диагностика проверяет — и чего в ней нет
          </h3>
        </div>
        <p className="text-[12px] font-semibold text-white/58">
          Полностью: 0 · Частично: {partialCount} · Пока нет: {missingCount}
        </p>
      </div>

      <p className="mt-4 border-l-2 border-[var(--mode-exam-accent)] pl-3.5 text-[13px] leading-[1.65] text-white/72">
        Это короткая диагностика открытой части каталога, а не полный вариант
        ЦТ/ЦЭ. Квантовая, атомная и ядерная физика пока не включены.
      </p>

      <ul className="mt-5 grid grid-cols-2 border-t border-white/[.12] xl:grid-cols-3" aria-label="Покрытие разделов программы">
        {coverage.map((section) => (
          <li
            key={section.id}
            className="border-b border-white/[.1] px-3 py-4 odd:border-r first:pl-0 [&:nth-child(even)]:pr-0 xl:border-r xl:px-4 xl:odd:border-r xl:[&:nth-child(3n+1)]:pl-0 xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n)]:pr-0"
          >
            <h4 className="text-[13px] font-[800] leading-[1.35] text-white sm:text-[14px]">{section.title}</h4>
            <span
              className={
                section.status === "partial"
                  ? "mt-1.5 block text-[9px] font-[800] uppercase leading-[1.35] tracking-[.07em] text-nova-cyan sm:text-[10px]"
                  : "mt-1.5 block text-[9px] font-[800] uppercase leading-[1.35] tracking-[.07em] text-[var(--mode-exam-accent)] sm:text-[10px]"
              }
            >
              {coverageStatusLabel(section.status)}
            </span>
            <p className="mt-1.5 text-[12px] font-semibold text-white/64">
              {section.familyCount > 0 ? `${section.familyCount} типов задач в каталоге` : section.summary}
            </p>
            {section.status === "partial" ? (
              <p className="mt-2 text-[11px] leading-[1.5] text-white/58">
                Не покрыто: {primaryCoverageGap(section)}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[12px] leading-[1.6] text-white/58">
        Результат покажет слабые места только в этих десяти задачах. Он не
        является оценкой готовности ко всей программе ЦТ/ЦЭ.
      </p>
      <Link
        href="/exam/program"
        className="mt-3 inline-flex min-h-10 items-center rounded-option text-[12px] font-bold text-[var(--mode-exam-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mode-exam-accent)]"
      >
        Открыть подробную карту программы
      </Link>
    </section>
  );
}

export function ExamDemo({ coverage }: { coverage: readonly CoverageSection[] }) {
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
    <section aria-labelledby="exam-entry-title" className="mx-auto flex w-full max-w-[920px] flex-col gap-6">
      {/* Одна карточка-заставка: слева — начать или продолжить, справа — арт во
          всю высоту колонки. Раньше блоки шли столбиком, а картинка висела
          отдельно с пустотой под ней. */}
      <div className="overflow-hidden rounded-card border border-white/[.1] bg-space-900/55">
        <div className="grid md:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col p-6 sm:p-8">
          <h2 id="exam-entry-title" className="text-[26px] font-[800] leading-tight tracking-[-.025em] text-white sm:text-[32px]">
            Короткая диагностика
          </h2>
          <p className="mt-2.5 text-[14px] leading-[1.65] text-white/72">
            10 задач по пяти открытым темам. Черновик рядом, время не
            ограничено, помощь и разбор доступны после ответа.
          </p>

          <ExamHistoryLine />
        </div>

        <div className="relative order-first min-h-[270px] border-b border-white/[.1] bg-[linear-gradient(145deg,var(--background-deep),var(--surface-primary))] md:order-last md:min-h-full md:border-b-0 md:border-l">
          <MixedPracticeArt />
        </div>
        </div>

        <div className="border-t border-white/[.1] px-6 py-6 sm:px-8 sm:py-7">
          <ExamCoverageMap coverage={coverage} />

          <div className="mt-6 border-t border-white/[.1] pt-5">
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

            <Link
              href="/topics"
              className="mt-3 inline-flex min-h-10 items-center rounded-option text-[13px] font-bold text-[var(--mode-exam-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Сначала разобрать тему
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
