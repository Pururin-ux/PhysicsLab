"use client";

import { useStore } from "@nanostores/react";
import { Compass, Info } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import styles from "./ExamEntry.module.css";
import { $examLog, getBestAttempt } from "../../lib/stores/exam-log-store";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import { Button } from "../ui/Button";
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
    <p className="mt-4 text-[13px] font-semibold leading-[1.6] text-white/64">
      Твои сохранённые попытки: <span className="physics-number text-white/82">{log.length}</span>
      {best ? <span> · лучший результат <span className="physics-number text-nova-cyan">{best.score}/{best.total}</span></span> : null}
      {last ? <span> · последний <span className="physics-number text-white/80">{last.score}/{last.total}</span></span> : null}
    </p>
  );
}

function ExamTools() {
  const [scratch, setScratch] = useState("");

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
    <section aria-labelledby="exam-entry-title" className={`${styles.entry} rise-seq`}>
      <Link href="/exam/program" className={styles.topics}>
        <span aria-hidden="true" className={styles["topics-icon"]}>
          <Compass size={24} weight="duotone" />
        </span>
        <span>
          <strong>Выбрать тему</strong>
          <small>Задачи по разделам физики: от движения до оптики</small>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
      <div className={styles.check}>
        <div className={styles.body}>
          <h2 id="exam-entry-title">Проверить себя</h2>
          <p>10 задач без таймера: решай в своём темпе, затем посмотри разбор.</p>
          <ul className={styles["exam-topics"]} aria-label="Темы диагностики">
            <li style={{ "--exam-topic-accent": "var(--topic-kinematics-accent)" } as CSSProperties}>Движение</li>
            <li style={{ "--exam-topic-accent": "var(--topic-dynamics-accent)" } as CSSProperties}>Силы</li>
            <li style={{ "--exam-topic-accent": "var(--topic-electrodynamics-accent)" } as CSSProperties}>Электричество</li>
            <li style={{ "--exam-topic-accent": "var(--topic-thermodynamics-accent)" } as CSSProperties}>Теплота</li>
            <li style={{ "--exam-topic-accent": "var(--topic-optics-accent)" } as CSSProperties}>Оптика</li>
          </ul>
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
        <Image src={MIO_PORTRAITS.attentive.src} width={1254} height={1254} alt="Мио внимательно слушает, держа блокнот" className={styles.mio} sizes="(max-width:640px) 110px, 240px" />
      </div>
      <p className={styles.note}>
          <Info size={16} weight="duotone" aria-hidden="true" className={styles["note-icon"]} />
          <span>Это проверка отдельных тем, а не полный вариант ЦТ/ЦЭ. Результат поможет выбрать, что повторить.</span>
        </p>
    </section>
  );
}
