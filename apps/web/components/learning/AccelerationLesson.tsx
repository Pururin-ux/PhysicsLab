"use client";

import {
  ArrowRight,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { FormulaBox } from "../ui/FormulaBox";
import { MathText } from "../ui/MathText";
import { SpeedometerStrip } from "./SpeedometerStrip";
import { AccelerationStudyStage } from "./AccelerationStudyStage";
import { cn } from "../../lib/utils";
import { defineLessonStageSequence } from "../../lib/learning/lesson-stage-contract";
import { LessonStageEngine } from "./LessonStageEngine";

const ACCELERATION_STAGES = defineLessonStageSequence([
  { id: "context", nextAction: "Сделать прогноз" },
  { id: "prediction", nextAction: "Посмотреть на метки" },
  { id: "observation", nextAction: "Сверить со спидометром" },
  { id: "causal-explanation", nextAction: "Назвать связь" },
  { id: "representation", nextAction: "Разобрать запись" },
  { id: "worked-example", nextAction: "Дополнить расчёт" },
  { id: "faded-example", nextAction: "Решить самостоятельно" },
  { id: "independent-practice", nextAction: "Проверить величину" },
  { id: "transfer", nextAction: "Подвести итог" },
  { id: "summary" },
] as const);

const accelerationEngineClasses = {
  root: "relative isolate min-w-0 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-2",
  header: "mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/[.09] px-1 pb-3",
  progressMeta: "w-[220px] max-w-[65%] sm:w-[330px] sm:max-w-none",
  progressTrack: "h-1 overflow-hidden bg-white/[.09] [&>span]:block [&>span]:h-full [&>span]:w-full [&>span]:origin-left [&>span]:bg-nova-cyan",
  stageShell: "min-w-0 [scroll-margin-top:10rem]",
  stage: "min-w-0",
  footer: "mt-5 flex items-center justify-between gap-3 px-1",
  backButton: "inline-flex min-h-11 items-center gap-2 rounded-option px-3 text-sm font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan",
  nextButton: "inline-flex min-h-11 items-center gap-2 rounded-option bg-nova-cyan px-5 text-sm font-bold text-[#0f1115] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115] disabled:cursor-not-allowed disabled:opacity-40",
};

function TrolleybusScene() {
  return (
    <figure className="relative isolate overflow-hidden bg-[#11161a]">
      <div className="relative aspect-[16/8] sm:aspect-[16/5]">
        <Image
          src="/art/production/lesson-acceleration-trolleybus-cozy.webp"
          alt="Ночной троллейбус у остановки на мокрой городской улице"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1180px"
          className="object-cover object-[55%_50%] sm:object-[52%_48%]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,21,.02)_35%,rgba(15,17,21,.72)_100%)]"
          aria-hidden="true"
        />
      </div>
    </figure>
  );
}

// Метки стоят там, где троллейбус был в конце каждой секунды. Расстояния
// между ними взяты из тех же чисел, что и весь урок (скорость 2→8 м/с):
// за первую секунду 3 м, за вторую 5 м, за третью 7 м. Позиции на шкале
// пропорциональны этим метрам, поэтому рост промежутков виден без слов.
function PositionTimeline() {
  const moments = [
    { time: "старт", position: "left-[4%]" },
    { time: "1 с", position: "left-[22%]" },   // 3 из 15 м
    { time: "2 с", position: "left-[52%]" },   // 8 из 15 м
    { time: "3 с", position: "left-[94%]" },   // 15 из 15 м
  ];
  const gaps = [
    { label: "3 м", position: "left-[13%]" },
    { label: "5 м", position: "left-[37%]" },
    { label: "7 м", position: "left-[73%]" },
  ];

  return (
    <figure className="py-4" aria-labelledby="position-timeline-caption">
      <div
        role="img"
        aria-label="Метки троллейбуса в конце каждой секунды. За первую секунду 3 метра, за вторую 5, за третью 7."
        className="relative h-32 min-w-0"
      >
        <div className="absolute inset-x-3 top-[58px] h-px bg-white/28" aria-hidden="true" />
        {moments.map((moment) => (
          <div
            key={moment.time}
            className={cn("absolute top-0 -translate-x-1/2 text-center", moment.position)}
            aria-hidden="true"
          >
            <span className="whitespace-nowrap text-[12px] font-bold text-[#f0c98d]">
              {moment.time}
            </span>
            <span className="mx-auto mt-3 block h-7 w-px bg-nova-cyan/70" />
            <span className="mx-auto -mt-1 block size-3 rounded-full border-2 border-nova-cyan bg-space-950 shadow-[0_0_14px_rgba(121,217,238,.45)]" />
          </div>
        ))}
        {gaps.map((gap) => (
          <span
            key={gap.label}
            aria-hidden="true"
            className={cn(
              "absolute top-[76px] -translate-x-1/2 whitespace-nowrap text-[13px] font-bold text-nova-cyan",
              gap.position,
            )}
          >
            {gap.label}
          </span>
        ))}
      </div>
      <figcaption id="position-timeline-caption" className="max-w-[64ch] text-[13px] leading-[1.6] text-white/58">
        Секунды одинаковые, а метры разные: 3, потом 5, потом 7.
      </figcaption>
    </figure>
  );
}

function SceneChoice({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-12 w-full border-b px-1 py-2 text-left text-[14px] font-bold leading-[1.45] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11161a]",
        selected
          ? "border-nova-cyan/70 text-white"
          : "border-white/[.14] text-white/74 hover:border-nova-cyan/45 hover:text-white",
      )}
    >
      <span
        className={cn(
          "mr-3 inline-grid size-5 place-items-center rounded-full border align-[-4px]",
          selected ? "border-nova-cyan bg-nova-cyan text-[#0f1115]" : "border-white/32",
        )}
        aria-hidden="true"
      >
        {selected ? "✓" : ""}
      </span>
      {children}
    </button>
  );
}

function ChoiceButton({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-14 w-full rounded-option border px-4 py-3 text-left text-[14px] font-bold leading-[1.45] transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1115]",
        selected
          ? "border-nova-cyan/70 bg-nova-cyan/[.09] text-white"
          : "border-white/[.12] bg-[#171b1f] text-white/76 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function FormulaCatHint() {
  return (
    <aside className="mt-4 max-w-[64ch] border-l-2 border-[#e8b66d]/55 pl-4" aria-label="Как читать формулу">
      <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Прочитай как действие</p>
      <p className="mt-1 text-[13px] leading-[1.55] text-white/72 sm:text-[14px]">
        «Изменение скорости делим на время, за которое оно произошло».
      </p>
    </aside>
  );
}

function CatStateHint({
  text,
}: {
  state: "thinking" | "support";
  text: string;
}) {
  return (
    <aside className="max-w-[64ch] border-l-2 border-[#e8b66d]/55 py-1 pl-4" aria-label="Связь с наблюдением">
      <p className="text-[13px] leading-[1.6] text-white/70">{text}</p>
    </aside>
  );
}

function parseNumber(raw: string) {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

// Подсказки по числу, которое ввёл ученик: за каждым числом стоит своя
// путаница, и называть её лучше словами из самой задачи.
function hintForWrongAnswer(raw: string) {
  const value = parseNumber(raw);
  if (value === null) return "Впиши одно число. Единицы уже стоят справа от поля.";
  if (value === -3) return "По величине получилось верно. Здесь запиши 3, а направление выбери отдельно.";
  if (value === 7) return "Это среднее между 10 и 4. Для ускорения нужна разность: 4 − 10.";
  if (value === 14) return "Скорости не складывают. Из конечной скорости вычитают начальную: 4 − 10.";
  if (value === 6 || value === -6) return "Ты нашёл, на сколько изменилась скорость. Осталось разделить 6 м/с на 2 секунды.";
  return "Скорость уменьшилась на 6 м/с: раздели 6 на 2 секунды.";
}

export function AccelerationLesson() {
  const [screen, setScreen] = useState(0);
  const [feeling, setFeeling] = useState<"grows" | "same" | null>(null);
  const [unitGuess, setUnitGuess] = useState<"two" | "six" | null>(null);
  const [workedAnswer, setWorkedAnswer] = useState("");
  const [workedChecked, setWorkedChecked] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalDirection, setFinalDirection] = useState<"left" | "right" | null>(null);
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const [magnitudeChecked, setMagnitudeChecked] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [summaryTried, setSummaryTried] = useState(false);
  const [summarySaved, setSummarySaved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  const workedCorrect = parseNumber(workedAnswer) === 2;
  const finalMagnitudeCorrect = parseNumber(finalAnswer) === 3;
  const finalCorrect = finalMagnitudeCorrect && finalDirection === "left";
  const summaryReady = summaryText.trim().length >= 12;
  const canContinue = screen === 1
    ? feeling !== null
    : screen === 4
      ? unitGuess !== null
      : screen === 6
        ? workedChecked && workedCorrect
        : screen === 7
          ? magnitudeChecked && finalMagnitudeCorrect
          : screen === 8
            ? finalFeedback !== null && finalCorrect
            : screen === 9
              ? summarySaved
              : true;

  function renderScreen() {
    if (screen === 0) {
      return (
        <div className="relative isolate overflow-hidden rounded-[12px] border border-white/[.12] bg-[#11161a]">
          <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">
            Троллейбус начинает разгоняться
          </h2>
          <TrolleybusScene />
          <div className="border-t border-white/[.12] px-5 py-5 text-white sm:px-7 sm:py-6">
            <p className="max-w-[64ch] text-[22px] font-[800] leading-[1.08] tracking-[-.025em] sm:text-[30px]">
              Троллейбус набирает скорость. Пассажира отклоняет назад относительно салона: тело ещё сохраняет прежнюю скорость, а пол уже разгоняет его вместе с троллейбусом.
            </p>
            <p className="mt-4 max-w-[64ch] border-l-2 border-nova-cyan/60 pl-4 text-[14px] leading-[1.65] text-white/70">
              Что меняется каждую секунду: положение, скорость или обе величины?
            </p>
          </div>
        </div>
      );
    }

    if (screen === 1) {
      return (
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">
            Троллейбус отходит от остановки
          </h2>
          <div className="relative isolate overflow-hidden rounded-[12px] border border-white/[.12] bg-[#11161a]">
            <TrolleybusScene />
            <fieldset className="relative isolate border-t border-white/[.12] px-5 py-5 text-white sm:px-7 sm:py-6">
              <div
                className="pointer-events-none absolute inset-0 -z-10 bg-[length:540px_auto] opacity-[.035] mix-blend-screen"
                style={{ backgroundImage: "url('/art/production/paper-texture.webp')" }}
                aria-hidden="true"
              />
              <legend className="sr-only">
                Что происходит со скоростью троллейбуса относительно дороги
              </legend>
              <p className="text-[22px] font-[800] leading-[1.08] tracking-[-.025em] sm:text-[30px]">
                Троллейбус уже едет и начинает разгоняться. Твоё тело по инерции стремится сохранить
                прежнюю скорость. Что происходит со скоростью троллейбуса относительно дороги?
              </p>
              <div className="mt-4 grid gap-x-6 sm:grid-cols-2">
                <SceneChoice selected={feeling === "grows"} onClick={() => setFeeling("grows")}>
                  Становится больше
                </SceneChoice>
                <SceneChoice selected={feeling === "same"} onClick={() => setFeeling("same")}>
                  Не меняется
                </SceneChoice>
              </div>
              {feeling ? (
                <p role="status" className="mt-3 max-w-[64ch] text-[13px] leading-[1.55] text-white/64">
                  {feeling === "grows"
                    ? "Да. Пол и сиденье ускоряют тебя вперёд вместе с троллейбусом, а тело по инерции сохраняет прежнюю скорость. Поэтому относительно салона кажется, что тебя отклонило назад."
                    : "При постоянной скорости ускорение равно нулю. Здесь пол и сиденье начинают ускорять тело вперёд — метки покажут, как меняется скорость троллейбуса."}
                </p>
              ) : null}
            </fieldset>
          </div>
        </div>
      );
    }

    if (screen === 2) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Оставим метки на дороге
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Ставим метку там, где троллейбус был через секунду. Потом ещё через одну.
          </p>
          <div className="mt-5">
            <AccelerationStudyStage compact />
          </div>
          <div className="mt-5 border-y border-white/[.12]">
            <PositionTimeline />
          </div>
          <div className="mt-5 max-w-[64ch] border-l-2 border-[#e8b66d]/55 pl-4">
            <p className="text-[16px] font-bold leading-[1.55] text-white">Что видно</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/70">
              Время между метками одинаковое, а расстояние растёт. Троллейбус едет всё быстрее.
            </p>
          </div>
        </div>
      );
    }

    if (screen === 3) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Посмотри на спидометр
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            У водителя на панели стрелка. Вот что она показывает каждую секунду.
          </p>
          <div className="mt-6 rounded-[12px] border border-white/[.1] bg-[#15191d] px-4 py-5 sm:px-6">
            <SpeedometerStrip />
          </div>
          <div className="mt-5 max-w-[64ch] border-l-2 border-nova-cyan/55 pl-4">
            <p className="text-[16px] font-bold leading-[1.55] text-white">Заметил?</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/70">
              Стрелка каждый раз прыгает на одно и то же: плюс 2 м/с. И так каждую секунду.
            </p>
          </div>
        </div>
      );
    }

    if (screen === 4) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Откуда берётся м/с²
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Стрелка прибавляла по 2 м/с каждую секунду. Как коротко сказать, насколько быстро троллейбус разгоняется?
          </p>
          <fieldset className="mt-5">
            <legend className="sr-only">Как назвать разгон троллейбуса</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceButton selected={unitGuess === "two"} onClick={() => setUnitGuess("two")}>
                2 м/с за каждую секунду
              </ChoiceButton>
              <ChoiceButton selected={unitGuess === "six"} onClick={() => setUnitGuess("six")}>
                6 м/с — столько всего прибавилось
              </ChoiceButton>
            </div>
          </fieldset>
          {unitGuess ? (
            <div role="status" className={cn("mt-5 max-w-[64ch] border-l-2 pl-4 text-[14px] leading-[1.65] text-white/76", unitGuess === "two" ? "border-nova-cyan/60" : "border-[#e8b66d]/70")}>
              {unitGuess === "two" ? (
                <p>
                  Так и есть. «2 м/с за каждую секунду» пишут короче: 2 м/с². Значок в квадрате прячет
                  вторую секунду, но читается всё так же.
                </p>
              ) : (
                <p>
                  6 м/с — это сколько набежало за все три секунды вместе. А нам нужна прибавка за одну:
                  каждую секунду стрелка сдвигалась на 2 м/с.
                </p>
              )}
            </div>
          ) : null}
        </div>
      );
    }

    if (screen === 5) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Та же мысль — теперь в расчёте
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Писать «на сколько выросла скорость, делённое на время» каждый раз долго. Поэтому договорились
            о значках.
          </p>
          <dl className="mt-6 divide-y divide-white/[.1] border-y border-white/[.12]">
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text="$v$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">скорость; в формулах её принято обозначать латинской буквой v</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text="$v_0$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                скорость в самом начале. Маленький нолик внизу — пометка «в нулевую секунду», как подпись на полях
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text={"$\\Delta v$"} /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                на сколько скорость выросла. Треугольник Δ у физиков значит «насколько изменилось»: 8 − 2 = 6 м/с
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text={"$\\Delta t$"} /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                сколько секунд прошло. Тот же треугольник: насколько изменилось время
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-gold"><MathText text="$a$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">ускорение: та самая прибавка скорости за одну секунду</dd>
            </div>
          </dl>
          <ol className="mt-6 space-y-5">
            <li className="border-l-2 border-[#e8b66d]/55 pl-4">
              <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Словами</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-white/78">на сколько выросла скорость ÷ за сколько секунд</p>
            </li>
            <li>
              <FormulaBox
                label="То же значками"
                formula={"a=\\frac{\\Delta v}{\\Delta t}=\\frac{v-v_0}{\\Delta t}"}
                caption="У троллейбуса: (8 − 2) ÷ 3 = 2 м/с²."
                surface="lesson"
              />
              <FormulaCatHint />
              <div className="mt-8 max-w-[760px] border-t border-white/[.12] pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[.1em] text-nova-cyan">Разберём пример</p>
                <p className="mt-2 text-[15px] font-bold leading-[1.55] text-white">Скорость выросла с 2 до 8 м/с за 3 секунды.</p>
                <div className="mt-4 grid gap-3 border-y border-white/[.1] py-4 text-[14px] leading-[1.6] text-white/72">
                  <p><strong className="text-white">Изменение скорости:</strong> <MathText text="$8-2=6$" /> м/с.</p>
                  <p><strong className="text-white">Время:</strong> <MathText text="$\\Delta t=3$" /> с.</p>
                  <p><strong className="text-white">Ускорение:</strong> <MathText text="$a=6\\div3=2$" /> м/с².</p>
                </div>
                <p className="mt-4 border-l-2 border-nova-cyan/55 pl-4 text-[13px] leading-[1.6] text-white/70">Каждую секунду скорость прибавлялась на 2 м/с — это и есть ускорение.</p>
              </div>
            </li>
          </ol>
        </div>
      );
    }

    if (screen === 6) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Первую половину сделаю я
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Троллейбус разогнался с 2 до 8 м/с за 3 секунды.</p>
          <ol className="mt-5 space-y-4 border-y border-white/[.12] py-4">
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-cyan">·</span>
              <div>
                <p className="font-bold text-white">Смотрю, на сколько выросла скорость</p>
                <p className="mt-1 text-[14px] leading-[1.6] text-white/68"><MathText text={"$8-2=6$"} /> м/с</p>
                <p className="mt-1 text-[12px] leading-[1.55] text-white/60">Из конечной скорости вычитаю начальную: на столько её стало больше.</p>
              </div>
            </li>
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-cyan">·</span>
              <div>
                <p className="font-bold text-white">Дальше твоя очередь: подели на секунды</p>
                <div className="mt-3 flex max-w-[360px] items-center gap-2">
                  <label htmlFor="worked-answer" className="sr-only">Ускорение троллейбуса</label>
                  <span className="text-[18px] text-white"><MathText text="$a=$" /></span>
                  <input
                    id="worked-answer"
                    value={workedAnswer}
                    onChange={(event) => { setWorkedAnswer(event.target.value); setWorkedChecked(false); }}
                    inputMode="decimal"
                    className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-[#0f1115] px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75"
                  />
                  <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
                </div>
                <Button type="button" size="sm" variant="ghost" className="mt-3" onClick={() => setWorkedChecked(true)}>Посмотреть, что вышло</Button>
              </div>
            </li>
          </ol>
          {workedChecked ? (
            <div role={workedCorrect ? "status" : "alert"} className={cn("mt-5 flex gap-3 border-l-2 pl-4", workedCorrect ? "border-nova-cyan/65" : "border-[#e8b66d]/70")}>
              {workedCorrect ? <CheckCircle className="mt-0.5 shrink-0 text-nova-cyan" size={20} weight="fill" /> : <WarningCircle className="mt-0.5 shrink-0 text-[#e8b66d]" size={20} weight="fill" />}
              <p className="text-[14px] leading-[1.6] text-white/74">{workedCorrect ? "Да: 6 ÷ 3 = 2. Каждую секунду скорость росла на 2 м/с." : "Скорость выросла на 6 м/с. Подели именно эти 6 на 3 секунды."}</p>
            </div>
          ) : null}
        </div>
      );
    }

    if (screen === 7) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Теперь сам: найди величину
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Скорость троллейбуса уменьшилась с 10 до 4 м/с за 2 секунды. Сначала найди только модуль ускорения.
          </p>
          <div className="mt-5 max-w-[430px] border-y border-white/[.12] py-5">
            <label htmlFor="final-answer" className="text-[14px] font-bold text-white">Модуль ускорения</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="final-answer"
                value={finalAnswer}
                onChange={(event) => { setFinalAnswer(event.target.value); setMagnitudeChecked(false); setFinalFeedback(null); }}
                inputMode="decimal"
                className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-[#0f1115] px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75"
              />
              <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
            </div>
            <Button
              type="button"
              className="mt-4 w-full sm:w-auto"
              disabled={finalAnswer.trim().length === 0}
              onClick={() => { setMagnitudeChecked(true); setFinalFeedback(finalMagnitudeCorrect ? "Да: скорость изменилась на 6 м/с за 2 секунды, значит модуль ускорения равен 3 м/с²." : hintForWrongAnswer(finalAnswer)); }}
            >Проверить величину</Button>
          </div>
          {magnitudeChecked ? (
            <div role={finalMagnitudeCorrect ? "status" : "alert"} aria-live="polite" className={cn("mt-5 border-l-2 pl-4", finalMagnitudeCorrect ? "border-nova-cyan/65" : "border-[#e8b66d]/70")}>
              <p className="text-[14px] leading-[1.65] text-white/76">{finalFeedback}</p>
            </div>
          ) : null}
        </div>
      );
    }

    if (screen === 9) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Что осталось главным?
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Запиши связь своими словами — так будет проще узнать ускорение в другой задаче.
          </p>
          <label htmlFor="acceleration-summary" className="mt-6 block text-[14px] font-bold text-white">Объяснение для себя</label>
          <textarea
            id="acceleration-summary"
            value={summaryText}
            onChange={(event) => { setSummaryText(event.target.value); setSummaryTried(false); setSummarySaved(false); }}
            rows={5}
            placeholder="Например: ускорение показывает, на сколько меняется скорость за одну секунду…"
            className="mt-2 block min-h-[132px] w-full max-w-[700px] rounded-option border border-white/[.16] bg-[#0f1115] px-3 py-3 text-[14px] leading-[1.6] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75"
            aria-describedby="acceleration-summary-hint"
          />
          <p id="acceleration-summary-hint" className="mt-2 max-w-[64ch] text-[12px] leading-[1.55] text-white/60">Одной-двух фраз достаточно. Пиши так, как объяснил бы другу.</p>
          <Button type="button" className="mt-4" onClick={() => { if (!summaryReady) { setSummaryTried(true); setSummarySaved(false); return; } setSummarySaved(true); }}>Сохранить итог</Button>
          {summaryTried && !summaryReady ? <p role="alert" className="mt-3 text-[12px] leading-[1.5] text-[#e8b66d]">Добавь ещё немного слов — хотя бы одну законченную мысль.</p> : null}
          {summarySaved ? <div className="mt-5 border-l-2 border-nova-cyan/65 pl-4"><p className="text-[14px] leading-[1.6] text-white/75">Связь сформулирована. Можно потренироваться ещё.</p><Link href="/practice/family/vt-slope" className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75">5 задач на ускорение по графику <ArrowRight size={17} weight="bold" /></Link></div> : null}
        </div>
      );
    }

    if (screen === 8) {
      return (
      <div className="mx-auto max-w-[900px] py-2">
        <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">Теперь торможение</h2>
        <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Троллейбус едет вправо и снижает скорость с 10 до 4 м/с за 2 секунды. Найди, насколько велико ускорение, и укажи его направление.</p>
        <div className="mt-5 max-w-[430px] border-y border-white/[.12] py-5">
          <label htmlFor="final-answer" className="text-[14px] font-bold text-white">Величина ускорения</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="final-answer"
              value={finalAnswer}
              onChange={(event) => { setFinalAnswer(event.target.value); setFinalFeedback(null); }}
              inputMode="decimal"
              className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-[#0f1115] px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75"
            />
            <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
          </div>
          <fieldset className="mt-5">
            <legend className="text-[14px] font-bold text-white">Куда направлено ускорение?</legend>
            <div className="mt-2 grid gap-x-5 sm:grid-cols-2">
              <SceneChoice selected={finalDirection === "left"} onClick={() => { setFinalDirection("left"); setFinalFeedback(null); }}>Влево, против движения</SceneChoice>
              <SceneChoice selected={finalDirection === "right"} onClick={() => { setFinalDirection("right"); setFinalFeedback(null); }}>Вправо, по движению</SceneChoice>
            </div>
          </fieldset>
          <Button
            type="button"
            className="mt-4 w-full sm:w-auto"
            disabled={finalAnswer.trim().length === 0 || finalDirection === null}
            onClick={() => setFinalFeedback(
              finalCorrect
                ? "Скорость уменьшилась на 6 м/с за 2 секунды: 6 ÷ 2 = 3 м/с². Ускорение направлено влево — против движения."
                : !finalMagnitudeCorrect
                  ? hintForWrongAnswer(finalAnswer)
                  : "Величина верная. При торможении ускорение направлено против движения — здесь влево.",
            )}
          >Проверить решение</Button>
        </div>
        {finalFeedback ? (
          <div role={finalCorrect ? "status" : "alert"} aria-live="polite" className={cn("mt-5 border-l-2 pl-4", finalCorrect ? "border-nova-cyan/65" : "border-[#e8b66d]/70")}>
            <p className="text-[11px] font-bold uppercase tracking-[.1em] text-white/52">{finalCorrect ? "Готово" : "Смотри сюда"}</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/76">{finalFeedback}</p>
            {/* Урок заканчивается тренажёром темы — так же, как урок динамики
                ведёт в /practice/dynamics-demo. */}
            {finalCorrect ? (
              <Link href="/practice/family/vt-slope" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-option font-bold text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/75">
                5 задач на ускорение по графику <ArrowRight size={17} weight="bold" />
              </Link>
            ) : null}
          </div>
        ) : null}
        {finalFeedback ? (
          <div className="mt-5">
            <CatStateHint
              state="support"
              text={finalCorrect ? "Ускорение описывает и разгон, и торможение. Здесь величина и направление записаны отдельно; знаки появятся позже, вместе с координатной осью." : "Сначала сравни скорости: троллейбус замедляется, поэтому ускорение направлено против движения."}
            />
          </div>
        ) : null}
      </div>
      );
    }

    return null;
  }

  return (
    <LessonStageEngine
      ariaLabelledBy="acceleration-lesson-title"
      identity={(
        <div>
          <p id="acceleration-lesson-title" className="text-[12px] font-bold text-[#f0c98d]">Ускорение</p>
          <p className="mt-0.5 text-[12px] text-white/58">как быстро меняется скорость</p>
        </div>
      )}
      progressAriaLabel="Урок «Ускорение»"
      stages={ACCELERATION_STAGES}
      activeIndex={screen}
      canContinue={canContinue}
      onActiveIndexChange={setScreen}
      reduceMotion={Boolean(reduceMotion)}
      classes={accelerationEngineClasses}
      themePreserveDark
      renderNextLabel={(label) => <>{label}<ArrowRight size={17} weight="bold" /></>}
    >
      {renderScreen()}
    </LessonStageEngine>
  );
}
