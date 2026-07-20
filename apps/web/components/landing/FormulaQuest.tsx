"use client";

import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";
import { FormulaSignalPlayer } from "./remotion/FormulaSignalPlayer";

type FormulaOption = {
  label: string;
  correct: boolean;
  feedback: string;
};

type FormulaQuestion = {
  topic: string;
  prompt: string;
  hint: string;
  options: FormulaOption[];
};

const questions: FormulaQuestion[] = [
  {
    topic: "Кинематика",
    prompt:
      "Тело движется равномерно и проходит путь $s$ за время $t$. Как найти его скорость?",
    hint: "Скорость показывает, какой путь приходится на единицу времени.",
    options: [
      {
        label: "$v = \\frac{s}{t}$",
        correct: true,
        feedback:
          "Точно. Делим весь путь на всё время: $v = \\frac{s}{t}$. Единицы тоже сходятся — $\\text{м}/\\text{с}$.",
      },
      {
        label: "$v = st$",
        correct: false,
        feedback:
          "Здесь спряталась ловушка с умножением. Произведение $st$ имеет единицы $\\text{м}\\cdot\\text{с}$, а скорость — $\\text{м}/\\text{с}$. Нужна формула $v = \\frac{s}{t}$.",
      },
      {
        label: "$v = \\frac{t}{s}$",
        correct: false,
        feedback:
          "Дробь перевернулась: $\\frac{t}{s}$ — это время на единицу пути. Для скорости путь должен быть в числителе: $v = \\frac{s}{t}$.",
      },
    ],
  },
  {
    topic: "Ускорение",
    prompt:
      "Скорость изменилась от $v_0$ до $v$ за время $t$. Какая формула описывает постоянное ускорение?",
    hint: "Сначала найди изменение скорости, затем раздели его на время.",
    options: [
      {
        label: "$a = \\frac{v-v_0}{t}$",
        correct: true,
        feedback:
          "Верно: ускорение — это изменение скорости за единицу времени. Поэтому $a = \\frac{v-v_0}{t}$.",
      },
      {
        label: "$a = \\frac{v+v_0}{t}$",
        correct: false,
        feedback:
          "Сумма скоростей здесь не показывает изменение. Нужно вычесть начальную скорость из конечной: $a = \\frac{v-v_0}{t}$.",
      },
      {
        label: "$a = \\frac{v}{t}$",
        correct: false,
        feedback:
          "Эта запись молча считает, что $v_0=0$. Но в условии начальная скорость дана, поэтому её нельзя потерять: $a = \\frac{v-v_0}{t}$.",
      },
    ],
  },
  {
    topic: "Электрический ток",
    prompt:
      "Через поперечное сечение проводника за время $t$ проходит заряд $q$. Как найти силу тока?",
    hint: "Сила тока — заряд, прошедший через сечение за единицу времени.",
    options: [
      {
        label: "$I = \\frac{q}{t}$",
        correct: true,
        feedback:
          "Да. Один ампер — это один кулон за одну секунду, поэтому $I = \\frac{q}{t}$.",
      },
      {
        label: "$I = qt$",
        correct: false,
        feedback:
          "При умножении получатся кулон-секунды, а не амперы. Заряд нужно разделить на время: $I = \\frac{q}{t}$.",
      },
      {
        label: "$I = \\frac{t}{q}$",
        correct: false,
        feedback:
          "Это обратная величина: сколько времени приходится на кулон. Сила тока показывает заряд за секунду, значит $I = \\frac{q}{t}$.",
      },
    ],
  },
  {
    topic: "Сила упругости",
    prompt:
      "Пружину жёсткостью $k$ растянули на $\\Delta x$. Как найти модуль силы упругости?",
    hint: "Чем жёстче пружина и больше деформация, тем больше сила.",
    options: [
      {
        label: "$F_{\\text{упр}} = k\\Delta x$",
        correct: true,
        feedback:
          "Именно. Для модуля силы закон Гука даёт $F_{\\text{упр}} = k\\Delta x$: обе величины усиливают результат.",
      },
      {
        label: "$F_{\\text{упр}} = \\frac{k}{\\Delta x}$",
        correct: false,
        feedback:
          "По этой формуле сила уменьшалась бы при большем растяжении — это противоречит поведению пружины. Верно: $F_{\\text{упр}} = k\\Delta x$.",
      },
      {
        label: "$F_{\\text{упр}} = \\frac{\\Delta x}{k}$",
        correct: false,
        feedback:
          "Здесь жёсткая пружина неожиданно давала бы меньшую силу. В законе Гука жёсткость умножается на деформацию: $F_{\\text{упр}} = k\\Delta x$.",
      },
    ],
  },
];

type ProgressState = "current" | "correct" | "review" | "pending";

const progressCopy: Record<
  ProgressState,
  { short: string; aria: string; nodeClass: string; lineClass: string }
> = {
  current: {
    short: "сейчас",
    aria: "текущий",
    nodeClass:
      "border-nova-pink bg-nova-pink text-space-950 shadow-[0_0_22px_rgba(224,121,199,.34)]",
    lineClass: "bg-nova-pink/45",
  },
  correct: {
    short: "верно",
    aria: "отвечено верно",
    nodeClass:
      "border-nova-cyan/65 bg-nova-cyan-10 text-nova-cyan shadow-[0_0_18px_rgba(121,217,238,.18)]",
    lineClass: "bg-nova-cyan/38",
  },
  review: {
    short: "разбор",
    aria: "ошибка разобрана",
    nodeClass: "border-nova-ember/65 bg-nova-ember-10 text-white",
    lineClass: "bg-nova-ember/32",
  },
  pending: {
    short: "дальше",
    aria: "ещё не открыт",
    nodeClass: "border-white/[.14] bg-space-950/70 text-white/62",
    lineClass: "bg-white/[.10]",
  },
};

function getProgressState(
  index: number,
  currentIndex: number,
  results: Array<boolean | null>,
  complete: boolean,
): ProgressState {
  if (results[index] === true) return "correct";
  if (results[index] === false) return "review";
  if (!complete && index === currentIndex) return "current";
  return "pending";
}

function getCompletionMessage(score: number) {
  if (score === questions.length) {
    return "Все четыре формулы выбраны верно. Можно переходить к задачам.";
  }

  if (score >= 3) {
    return "Очень крепко. Одна ловушка уже разобрана — в настоящей задаче ты заметишь её быстрее.";
  }

  return "Это не контрольная, а тренировка. Теперь ты знаешь, где именно формулы любят переворачиваться.";
}

export function FormulaQuest() {
  const shouldReduceMotion = useReducedMotion();
  const feedbackId = useId();
  const nextButtonContainerRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Array<boolean | null>>(() =>
    questions.map(() => null),
  );
  const [complete, setComplete] = useState(false);

  const question = questions[questionIndex];
  const answered = selectedIndex !== null;
  const selectedOption = answered ? question.options[selectedIndex] : null;
  const score = results.filter((result) => result === true).length;

  useEffect(() => {
    if (!answered) return;

    const frame = window.requestAnimationFrame(() => {
      nextButtonContainerRef.current?.querySelector("button")?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [answered]);

  useEffect(() => {
    if (!complete) return;

    const frame = window.requestAnimationFrame(() => {
      resultHeadingRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [complete]);

  function answer(optionIndex: number) {
    if (answered) return;

    const isCorrect = question.options[optionIndex].correct;
    setSelectedIndex(optionIndex);
    setResults((current) =>
      current.map((result, index) =>
        index === questionIndex ? isCorrect : result,
      ),
    );
  }

  function goNext() {
    if (!answered) return;

    if (questionIndex === questions.length - 1) {
      setComplete(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedIndex(null);
    window.requestAnimationFrame(() => firstOptionRef.current?.focus());
  }

  function restart() {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setResults(questions.map(() => null));
    setComplete(false);
    window.requestAnimationFrame(() => firstOptionRef.current?.focus());
  }

  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: "easeOut" as const };

  return (
    <section
      data-testid="formula-quest"
      aria-labelledby="formula-quest-title"
      className="relative isolate overflow-hidden rounded-[28px] border border-white/[.12] bg-space-925 shadow-[0_28px_80px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.055)]"
    >
      <Image
        src="/art/production/formula-quest.webp"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 1180px"
        className="pointer-events-none -z-30 object-cover object-center opacity-30 lg:object-right lg:opacity-42"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(8,12,19,.98)_0%,rgba(8,12,19,.93)_48%,rgba(8,12,19,.66)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_14%,rgba(224,121,199,.16),transparent_34%),radial-gradient(circle_at_12%_72%,rgba(121,217,238,.09),transparent_32%)]"
      />

      <div className="border-b border-white/[.09] px-4 py-5 min-[400px]:px-5 sm:px-7 lg:px-9 lg:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="max-w-[620px]">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="gold">Мини-квиз</Badge>
              <span className="text-[12px] font-semibold text-white/56">
                4 коротких вопроса
              </span>
            </div>
            <h2
              id="formula-quest-title"
              className="font-display text-[24px] font-[700] leading-[1.2] text-white sm:text-[30px]"
            >
              Проверь четыре формулы
            </h2>
            <p className="mt-2 max-w-[560px] text-[14px] leading-[1.65] text-white/65 sm:text-[15px]">
              Без таймера и штрафов. Выбирай связь между величинами, а после
              ответа разбирай конкретную ловушку.
            </p>
          </div>

          <ol
            className="flex w-full max-w-[400px] items-start"
            aria-label="Прогресс формульного квеста"
          >
            {questions.map((item, index) => {
              const state = getProgressState(
                index,
                questionIndex,
                results,
                complete,
              );
              const copy = progressCopy[state];

              return (
                <li
                  key={item.topic}
                  aria-label={`Вопрос ${index + 1}: ${copy.aria}`}
                  aria-current={state === "current" ? "step" : undefined}
                  className="relative flex min-w-0 flex-1 flex-col items-center"
                >
                  {index < questions.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[17px] h-px",
                        copy.lineClass,
                      )}
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-extrabold transition-colors",
                      copy.nodeClass,
                    )}
                  >
                    {state === "correct" ? (
                      <CheckCircle size={19} weight="fill" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 text-[10px] font-bold leading-none min-[390px]:text-[11px]",
                      state === "current"
                        ? "text-nova-pink"
                        : state === "correct"
                          ? "text-nova-cyan"
                          : state === "review"
                            ? "text-nova-ember"
                            : "text-white/60",
                    )}
                  >
                    {copy.short}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="grid min-h-[510px] lg:grid-cols-[minmax(0,1.22fr)_minmax(300px,.78fr)]">
        <div className="min-w-0 px-4 py-6 min-[400px]:px-5 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
          <AnimatePresence mode="wait" initial={false}>
            {!complete ? (
              <motion.div
                key={questionIndex}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, x: 18, y: 4 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: -14 }}
                transition={motionTransition}
                className="flex h-full flex-col"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <Badge tone="cyan">{question.topic}</Badge>
                  <span className="text-[12px] font-bold tracking-[.08em] text-white/62">
                    {questionIndex + 1} / {questions.length}
                  </span>
                </div>

                <h3 className="max-w-[720px] text-[19px] font-bold leading-[1.5] text-white sm:text-[22px]">
                  <MathText text={question.prompt} />
                </h3>

                <div
                  className="mt-6 flex flex-col gap-3"
                  role="group"
                  aria-label={`Варианты ответа на вопрос ${questionIndex + 1}`}
                  aria-describedby={answered ? feedbackId : undefined}
                >
                  {question.options.map((option, optionIndex) => {
                    const optionState = !answered
                      ? "idle"
                      : option.correct
                        ? "correct"
                        : optionIndex === selectedIndex
                          ? "wrong"
                          : "dimmed";

                    return (
                      <button
                        key={option.label}
                        ref={optionIndex === 0 ? firstOptionRef : undefined}
                        type="button"
                        disabled={answered}
                        aria-pressed={optionIndex === selectedIndex}
                        data-testid={`formula-option-${questionIndex}-${optionIndex}`}
                        data-state={optionState}
                        onClick={() => answer(optionIndex)}
                        className={cn(
                          "group flex min-h-14 w-full items-center justify-between gap-4 rounded-[14px] border px-4 py-3 text-left text-[15px] font-bold transition-all sm:px-5 sm:text-[16px]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
                          "disabled:cursor-default",
                          optionState === "idle" &&
                            "border-white/[.12] bg-space-950/64 text-white/84 shadow-[inset_0_1px_0_rgba(255,255,255,.035)] hover:-translate-y-px hover:border-nova-cyan/60 hover:bg-space-900",
                          optionState === "correct" &&
                            "border-nova-cyan/60 bg-nova-cyan-10 text-white shadow-[0_0_24px_rgba(121,217,238,.08)]",
                          optionState === "wrong" &&
                            "border-nova-ember/62 bg-nova-ember-10 text-white",
                          optionState === "dimmed" &&
                            "border-white/[.07] bg-space-950/40 text-white/38",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="mr-3 text-[11px] font-extrabold uppercase tracking-[.12em] text-white/58">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <MathText text={option.label} />
                        </span>
                        {optionState === "correct" ? (
                          <span className="shrink-0 text-[11px] font-extrabold text-nova-cyan sm:text-[12px]">
                            верная
                          </span>
                        ) : optionState === "wrong" ? (
                          <span className="shrink-0 text-[11px] font-extrabold text-nova-ember sm:text-[12px]">
                            твой выбор
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={motionTransition}
                className="flex h-full min-h-[380px] flex-col justify-center"
              >
                <Badge tone="gold" className="mb-5 w-fit">
                  Квиз завершён
                </Badge>
                <div className="flex items-end gap-3">
                  <span className="font-display text-[64px] font-bold leading-none text-nova-pink sm:text-[82px]">
                    {score}
                  </span>
                  <span className="pb-2 text-[18px] font-bold text-white/52">
                    из {questions.length}
                  </span>
                </div>
                <h3
                  ref={resultHeadingRef}
                  tabIndex={-1}
                  className="mt-5 max-w-[600px] text-[24px] font-extrabold leading-tight text-white outline-none sm:text-[30px]"
                >
                  Формулы уже держатся увереннее
                </h3>
                <p className="mt-3 max-w-[590px] text-[15px] leading-[1.7] text-white/67">
                  {getCompletionMessage(score)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="relative flex min-w-0 flex-col justify-between border-t border-white/[.09] bg-space-950/58 p-4 min-[400px]:p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div>
            <div className="-mx-2 -mt-2 mb-4 overflow-hidden rounded-[18px] border border-white/[.08] bg-space-925/55 shadow-[inset_0_1px_0_rgba(255,255,255,.035)]">
              <FormulaSignalPlayer
                activeIndex={questionIndex}
                correctCount={score}
                completed={complete}
                reducedMotion={Boolean(shouldReduceMotion)}
                className="opacity-90"
              />
            </div>

            <div className="mb-5 flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-nova-pink/30 bg-space-950">
                <Image src="/art/production/curator-mechanics.webp" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <div>
                <p className="text-[14px] font-extrabold text-white">Подсказка</p>
                <p className="text-[12px] text-white/60">учитывает текущий ответ</p>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={
                  complete
                    ? "complete"
                    : answered
                      ? `answer-${questionIndex}-${selectedIndex}`
                      : `hint-${questionIndex}`
                }
                id={feedbackId}
                role="status"
                aria-live="polite"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={motionTransition}
                className={cn(
                  "relative rounded-[18px] border p-4 sm:p-5",
                  complete
                    ? "border-nova-pink/30 bg-nova-pink/[.07]"
                    : answered
                      ? selectedOption?.correct
                        ? "border-nova-cyan/28 bg-nova-cyan/[.06]"
                        : "border-nova-ember/28 bg-nova-ember/[.06]"
                      : "border-white/[.11] bg-space-900/75",
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Sparkle
                    size={17}
                    weight="fill"
                    className={
                      complete || selectedOption?.correct
                        ? "text-nova-pink"
                        : answered
                          ? "text-nova-ember"
                          : "text-nova-cyan"
                    }
                    aria-hidden="true"
                  />
                  <p className="text-[12px] font-extrabold uppercase tracking-[.09em] text-white/58">
                    {complete
                      ? "итог"
                      : answered
                        ? selectedOption?.correct
                          ? "точное попадание"
                          : "разберём ловушку"
                        : "подсказка"}
                  </p>
                </div>
                <p className="text-[14px] font-semibold leading-[1.7] text-white/78">
                  {complete ? (
                    getCompletionMessage(score)
                  ) : answered && selectedOption ? (
                    <MathText text={selectedOption.feedback} />
                  ) : (
                    <MathText text={question.hint} />
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div ref={nextButtonContainerRef} className="mt-5">
            {!complete ? (
              <Button
                type="button"
                size="lg"
                disabled={!answered}
                data-testid="formula-next"
                onClick={goNext}
                className="gap-2"
              >
                {questionIndex === questions.length - 1
                  ? "Показать результат"
                  : "Следующий вопрос"}
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                data-testid="formula-restart"
                onClick={restart}
                className="gap-2"
              >
                <ArrowCounterClockwise
                  size={18}
                  weight="bold"
                  aria-hidden="true"
                />
                Пройти ещё раз
              </Button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
