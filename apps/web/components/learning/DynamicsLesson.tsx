"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  WarningCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { FormulaBox } from "../ui/FormulaBox";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

// Урок про второй закон Ньютона. Заходим не с формулы, а с тела: тележка в
// магазине. Тот же толчок разгоняет пустую легко, а полную еле-еле — отсюда
// вырастает a = F/m, а потом привычная запись F = ma.
const SCREENS = [
  "Тележка в магазине",
  "Один толчок, две тележки",
  "Толкни сильнее",
  "Собираем в одно",
  "Как это пишут",
  "Считаем вместе",
  "Теперь ты",
] as const;

// Одна строка сравнения: слева толчок (розовая стрелка) и тележка, справа
// шкала разгона. Меняя ширину стрелки и заполнение шкалы, показываем связь
// «сильнее толчок / легче тележка → больше разгон» без единого слова.
function ForceRow({
  pushWidth,
  cartState,
  massLabel,
  accel,
  accelLabel,
}: {
  pushWidth: number;
  cartState: "empty" | "full";
  massLabel: string;
  accel: number;
  accelLabel: string;
}) {
  return (
    <div className="grid grid-cols-[128px_1fr] items-center gap-4 sm:grid-cols-[176px_1fr]" aria-hidden="true">
      <div className="flex items-center gap-1.5">
        <span className="block h-[4px] rounded-full bg-nova-pink" style={{ width: `${pushWidth}px` }} />
        <ArrowRight size={18} weight="bold" className="-ml-1 shrink-0 text-nova-pink" />
        <span className="ml-1 grid size-11 shrink-0 place-items-center rounded-[10px] border border-white/[.16] bg-white/[.04]">
          <ShoppingCart
            size={22}
            weight={cartState === "full" ? "fill" : "regular"}
            className={cartState === "full" ? "text-white" : "text-white/55"}
          />
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-3 text-[11px] font-bold">
          <span className={cartState === "full" ? "text-white/82" : "text-white/60"}>
            {cartState === "full" ? "полная" : "пустая"} · {massLabel}
          </span>
          <span className="text-nova-cyan/85">{accelLabel}</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/[.08]">
          <div className="h-full rounded-full bg-nova-cyan" style={{ width: `${accel * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function SameForceCompare() {
  return (
    <figure aria-labelledby="same-force-caption">
      <div
        role="img"
        aria-label="Один и тот же толчок. Пустая тележка разгоняется легко, полная — еле-еле."
        className="space-y-4"
      >
        <ForceRow pushWidth={44} cartState="empty" massLabel="≈2 кг" accel={0.9} accelLabel="разгоняется легко" />
        <ForceRow pushWidth={44} cartState="full" massLabel="≈8 кг" accel={0.32} accelLabel="еле разгоняется" />
      </div>
      <figcaption id="same-force-caption" className="mt-4 max-w-[64ch] text-[13px] leading-[1.6] text-white/58">
        Розовая стрелка — толчок, она одинаковая. Синяя полоса — разгон. Тяжёлую тележку тот же толчок разгоняет слабее.
      </figcaption>
    </figure>
  );
}

function StrongerPushCompare() {
  return (
    <figure aria-labelledby="push-compare-caption">
      <div
        role="img"
        aria-label="Одна и та же полная тележка. Слабый толчок разгоняет медленно, сильный — быстро."
        className="space-y-4"
      >
        <ForceRow pushWidth={24} cartState="full" massLabel="≈8 кг" accel={0.3} accelLabel="толкнул слабо → медленно" />
        <ForceRow pushWidth={60} cartState="full" massLabel="≈8 кг" accel={0.82} accelLabel="толкнул сильно → быстро" />
      </div>
      <figcaption id="push-compare-caption" className="mt-4 max-w-[64ch] text-[13px] leading-[1.6] text-white/58">
        Тележка одна и та же. Чем длиннее розовая стрелка, тем сильнее толчок — и тем быстрее разгон.
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
        "min-h-12 w-full border-b px-1 py-2 text-left text-[14px] font-bold leading-[1.45] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#19142f]",
        selected
          ? "border-nova-cyan/70 text-white"
          : "border-[#d6a6c9]/20 text-white/74 hover:border-[#d6a6c9]/45 hover:text-white",
      )}
    >
      <span
        className={cn(
          "mr-3 inline-grid size-5 place-items-center rounded-full border align-[-4px]",
          selected ? "border-nova-cyan bg-nova-cyan text-[#14132c]" : "border-white/32",
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
        "min-h-14 w-full rounded-option border px-4 py-3 text-left text-[14px] font-bold leading-[1.45] transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/80 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
        selected
          ? "border-nova-pink/70 bg-nova-pink/[.11] text-white shadow-[inset_3px_0_0_#e079c7]"
          : "border-white/[.12] bg-space-900/50 text-white/76 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function FormulaCatHint() {
  return (
    <aside className="mt-4 flex items-end gap-3" aria-label="Кот подсказывает, как читать запись">
      <div className="relative h-[132px] w-[82px] shrink-0 sm:h-[164px] sm:w-[102px]">
        <Image
          src="/art/production/curator-mechanics-thinking.webp"
          alt="Чёрный кот задумался"
          fill
          sizes="(max-width: 640px) 82px, 102px"
          className="object-contain object-bottom"
        />
      </div>
      <div className="border-l-2 border-[#e8b66d]/55 pl-3">
        <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Прочитай вслух</p>
        <p className="mt-1 text-[13px] leading-[1.55] text-white/72 sm:text-[14px]">
          «Сила равна масса умножить на ускорение».
        </p>
      </div>
    </aside>
  );
}

function CatSupport({ text }: { text: string }) {
  return (
    <aside className="flex max-w-[470px] items-end gap-3" aria-label="Кот рядом">
      <div className="relative h-[180px] w-[132px] shrink-0 sm:h-[200px] sm:w-[148px]">
        <Image
          src="/art/production/curator-mechanics-support.webp"
          alt="Чёрный кот сидит рядом и поддерживает"
          fill
          sizes="(max-width: 640px) 132px, 148px"
          className="object-contain object-bottom"
        />
      </div>
      <div className="mb-3 border-l-2 border-[#e8b66d]/55 pl-3">
        <p className="text-[13px] leading-[1.55] text-white/68">{text}</p>
      </div>
    </aside>
  );
}

function parseNumber(raw: string) {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

// Подсказки по числу: за каждой ошибкой стоит своя путаница, называем её
// словами из самой задачи (тележка 3 кг, толчок 12 Н, ответ 4 м/с²).
function hintForWrongAnswer(raw: string) {
  const value = parseNumber(raw);
  if (value === null) return "Впиши одно число. Единицы уже стоят справа от поля.";
  if (value === 36) return "Массу не умножают на силу. Тяжёлую тележку сила разгоняет хуже — значит, силу делим на массу.";
  if (value === 15) return "Складывать нельзя: ньютоны и килограммы — разные величины. Нужно 12 разделить на 3.";
  if (value === 0.25) return "Перевернулось: делим силу на массу, 12 ÷ 3, а не наоборот.";
  if (value === 9) return "Это 12 − 3. А тут делят: сила делить на массу.";
  return "Ускорение — это сила делить на массу: 12 ÷ 3.";
}

export function DynamicsLesson() {
  const [screen, setScreen] = useState(0);
  const [feeling, setFeeling] = useState<"heavy" | "tall" | null>(null);
  const [formulaGuess, setFormulaGuess] = useState<"divide" | "multiply" | null>(null);
  const [workedAnswer, setWorkedAnswer] = useState("");
  const [workedChecked, setWorkedChecked] = useState(false);
  const [ownWords, setOwnWords] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const workedCorrect = parseNumber(workedAnswer) === 3;
  const finalCorrect = parseNumber(finalAnswer) === 4;
  const canContinue =
    screen === 0
      ? feeling !== null
      : screen === 3
        ? formulaGuess !== null
        : screen === 5
          ? workedChecked && workedCorrect && ownWords.trim().length >= 8
          : true;

  function goToScreen(next: number) {
    setScreen(next);
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  function renderScreen() {
    if (screen === 0) {
      return (
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">
            Ты толкаешь тележку в магазине
          </h2>
          <div className="relative isolate overflow-hidden rounded-[18px] border border-[#d6a6c9]/24 bg-[linear-gradient(145deg,#2b193f_0%,#17152f_58%,#10142d_100%)] shadow-[0_26px_70px_rgba(3,4,22,.32)]">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/art/production/paper-texture.webp')] bg-[length:540px_auto] opacity-[.05] mix-blend-screen" aria-hidden="true" />
            <fieldset className="px-5 py-6 text-white sm:px-7 sm:py-7">
              <legend className="sr-only">Что мешает полной тележке разогнаться</legend>
              <div className="mb-5 flex items-center gap-3 text-nova-pink/90" aria-hidden="true">
                <span className="grid size-12 place-items-center rounded-[12px] border border-white/[.14] bg-white/[.04]">
                  <ShoppingCart size={26} weight="fill" />
                </span>
                <ArrowRight size={22} weight="bold" />
                <span className="text-[13px] font-bold text-white/60">толкаешь вперёд</span>
              </div>
              <p className="text-[24px] font-[800] leading-[1.1] tracking-[-.025em] sm:text-[30px]">
                Пустую тележку толкнул — покатилась. Полную толкнул так же — еле поехала.
              </p>
              <p className="mt-3 max-w-[60ch] text-[15px] font-bold text-white/78">
                Что мешает полной разогнаться?
              </p>
              <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
                <SceneChoice selected={feeling === "heavy"} onClick={() => setFeeling("heavy")}>
                  Она тяжелее
                </SceneChoice>
                <SceneChoice selected={feeling === "tall"} onClick={() => setFeeling("tall")}>
                  Она выше ростом
                </SceneChoice>
              </div>
              {feeling ? (
                <p role="status" className="mt-4 max-w-[64ch] text-[13px] leading-[1.55] text-white/64">
                  {feeling === "heavy"
                    ? "Верно. Дело в массе: чем тяжелее тележка, тем труднее её разогнать тем же толчком."
                    : "Не в росте дело, а в массе. Высокая, но лёгкая коробка покатилась бы легко. Тяжёлую разогнать труднее."}
                </p>
              ) : null}
            </fieldset>
          </div>
        </div>
      );
    }

    if (screen === 1) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Один толчок, две тележки
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Толкнём обе тележки одинаково — пустую и полную. Посмотрим, как они разгонятся.
          </p>
          <div className="mt-6 rounded-[16px] border border-white/[.1] bg-space-900/60 px-4 py-5 sm:px-6">
            <SameForceCompare />
          </div>
          <div className="mt-5 max-w-[64ch] border-l-2 border-[#e8b66d]/55 pl-4">
            <p className="text-[16px] font-bold leading-[1.55] text-white">Что видно</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/70">
              Толчок один и тот же, а разгон разный. Чем тяжелее тележка, тем меньше разгон.
            </p>
          </div>
        </div>
      );
    }

    if (screen === 2) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Толкни сильнее
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Теперь тележка одна — та же полная. Толкнём её сначала слабо, потом сильно.
          </p>
          <div className="mt-6 rounded-[16px] border border-white/[.1] bg-space-900/60 px-4 py-5 sm:px-6">
            <StrongerPushCompare />
          </div>
          <div className="mt-5 max-w-[64ch] border-l-2 border-nova-cyan/55 pl-4">
            <p className="text-[16px] font-bold leading-[1.55] text-white">Заметил?</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/70">
              Сильнее толкаешь — быстрее разгон. Разгон растёт вместе с силой толчка.
            </p>
          </div>
        </div>
      );
    }

    if (screen === 3) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Собираем в одно
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Разгон больше, когда толкаешь сильнее, и меньше, когда тележка тяжелее. Как записать это одной строчкой?
          </p>
          <fieldset className="mt-5">
            <legend className="sr-only">Как связать разгон, силу и массу</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceButton selected={formulaGuess === "divide"} onClick={() => setFormulaGuess("divide")}>
                разгон = сила ÷ масса
              </ChoiceButton>
              <ChoiceButton selected={formulaGuess === "multiply"} onClick={() => setFormulaGuess("multiply")}>
                разгон = сила × масса
              </ChoiceButton>
            </div>
          </fieldset>
          {formulaGuess ? (
            <div role="status" className={cn("mt-5 max-w-[64ch] border-l-2 pl-4 text-[14px] leading-[1.65] text-white/76", formulaGuess === "divide" ? "border-nova-cyan/60" : "border-nova-pink/60")}>
              {formulaGuess === "divide" ? (
                <p>
                  Так и есть. Сила сверху — больше сила, больше разгон. Масса снизу — тяжелее тележка, меньше
                  разгон. Ровно как мы видели.
                </p>
              ) : (
                <p>
                  Смотри: если умножать на массу, то тяжёлая тележка разгонялась бы сильнее. А на деле —
                  наоборот, еле едет. Значит, на массу делим, а не умножаем.
                </p>
              )}
            </div>
          ) : null}
        </div>
      );
    }

    if (screen === 4) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Та же мысль, только короче
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Писать «сила, делённая на массу» каждый раз долго. Поэтому договорились о значках.
          </p>
          <dl className="mt-6 divide-y divide-white/[.1] border-y border-white/[.12]">
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-pink"><MathText text="$F$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                сила, с которой толкаешь. Меряют в ньютонах (Н). 1 Н — примерно как держать на ладони небольшое яблоко
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text="$m$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">масса тележки, в килограммах. Чем она больше, тем труднее разогнать</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-gold"><MathText text="$a$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">ускорение: на сколько прибавляется скорость за секунду, м/с². Это и есть «разгон»</dd>
            </div>
          </dl>
          <ol className="mt-6 space-y-5">
            <li className="border-l-2 border-[#e8b66d]/55 pl-4">
              <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Словами</p>
              <p className="mt-1 text-[15px] leading-[1.6] text-white/78">разгон = сила ÷ масса. Или наоборот: сила = масса × разгон</p>
            </li>
            <li>
              <FormulaBox
                label="То же значками"
                formula={"a=\\frac{F}{m}\\quad\\Leftrightarrow\\quad F=ma"}
                caption="Обе записи — одно и то же, просто переставили. В задачах чаще пишут F = ma."
                surface="lesson"
              />
              <FormulaCatHint />
            </li>
          </ol>
        </div>
      );
    }

    if (screen === 5) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Первую половину сделаю я
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Тележка массой 2 кг. Толкаешь её силой 6 Н.</p>
          <ol className="mt-5 space-y-4 border-y border-white/[.12] py-4">
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-pink">1.</span>
              <div>
                <p className="font-bold text-white">Что ищем и по какой формуле</p>
                <p className="mt-1 text-[14px] leading-[1.6] text-white/68">Ищем разгон. Разгон — это сила делить на массу: <MathText text={"$a=\\frac{F}{m}$"} /></p>
                <p className="mt-1 text-[12px] leading-[1.55] text-white/58">Сила сверху, масса снизу — как мы и договорились.</p>
              </div>
            </li>
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-cyan">2.</span>
              <div>
                <p className="font-bold text-white">Дальше твоя очередь: подставь числа</p>
                <div className="mt-3 flex max-w-[380px] items-center gap-2">
                  <label htmlFor="dyn-worked-answer" className="sr-only">Ускорение тележки</label>
                  <span className="text-[18px] text-white"><MathText text="$a=6\\div2=$" /></span>
                  <input
                    id="dyn-worked-answer"
                    value={workedAnswer}
                    onChange={(event) => { setWorkedAnswer(event.target.value); setWorkedChecked(false); }}
                    inputMode="decimal"
                    className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-space-950 px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75"
                  />
                  <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
                </div>
                <Button type="button" size="sm" variant="ghost" className="mt-3" onClick={() => setWorkedChecked(true)}>Посмотреть, что вышло</Button>
              </div>
            </li>
          </ol>
          {workedChecked ? (
            <div role={workedCorrect ? "status" : "alert"} className={cn("mt-5 flex gap-3 border-l-2 pl-4", workedCorrect ? "border-nova-cyan/65" : "border-nova-pink/65")}>
              {workedCorrect ? <CheckCircle className="mt-0.5 shrink-0 text-nova-cyan" size={20} weight="fill" /> : <WarningCircle className="mt-0.5 shrink-0 text-nova-pink" size={20} weight="fill" />}
              <p className="text-[14px] leading-[1.6] text-white/74">{workedCorrect ? "Да: 6 ÷ 2 = 3. Каждую секунду тележка прибавляет по 3 м/с." : "Тут сила 6 Н делится на массу 2 кг: 6 ÷ 2. Умножать не нужно."}</p>
            </div>
          ) : null}
          {workedCorrect ? (
            <div className="mt-5">
              <label htmlFor="dyn-own-words" className="text-[14px] font-bold text-white">Скажи своими словами: почему массу ставим снизу, под черту?</label>
              <textarea
                id="dyn-own-words"
                value={ownWords}
                onChange={(event) => setOwnWords(event.target.value)}
                rows={2}
                placeholder="Пиши как думаешь…"
                className="mt-2 w-full resize-y rounded-option border border-white/[.14] bg-space-950 px-3 py-3 text-[14px] leading-[1.6] text-white placeholder:text-white/38 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75"
              />
              <p className="mt-1 text-[12px] text-white/58">Хватит одной фразы. Например: тяжёлая тележка разгоняется хуже, поэтому делим.</p>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-[900px] py-2">
        <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">Теперь целиком сам</h2>
        <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Другую тележку массой 3 кг толкнули силой 12 Н. Какое у неё ускорение?</p>
        <div className="mt-5 max-w-[430px] border-y border-white/[.12] py-5">
          <label htmlFor="dyn-final-answer" className="text-[14px] font-bold text-white">Твой ответ</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="dyn-final-answer"
              value={finalAnswer}
              onChange={(event) => { setFinalAnswer(event.target.value); setFinalFeedback(null); }}
              inputMode="decimal"
              className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-space-950 px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75"
            />
            <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
          </div>
          <Button type="button" className="mt-3 w-full sm:w-auto" onClick={() => setFinalFeedback(finalCorrect ? "Точно: 12 ÷ 3 = 4. Тележка прибавляет по 4 м/с каждую секунду." : hintForWrongAnswer(finalAnswer))}>Посмотреть, что вышло</Button>
        </div>
        {finalFeedback ? (
          <div role={finalCorrect ? "status" : "alert"} aria-live="polite" className={cn("mt-5 border-l-2 pl-4", finalCorrect ? "border-nova-cyan/65" : "border-nova-pink/65")}>
            <p className="text-[11px] font-bold uppercase tracking-[.1em] text-white/58">{finalCorrect ? "Готово" : "Смотри сюда"}</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/76">{finalFeedback}</p>
            {finalCorrect ? (
              <Link href="/practice/dynamics-demo" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-option font-bold text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75">
                Порешать задачи по динамике <ArrowRight size={17} weight="bold" />
              </Link>
            ) : null}
          </div>
        ) : null}
        {finalFeedback ? (
          <div className="mt-5">
            <CatSupport
              text={finalCorrect ? "Ты дошёл от «пустую толкнул легко, полную еле-еле» до формулы F = ma. Это и есть второй закон Ньютона." : "Ошибка не про тебя, а про один шаг. Сила делить на массу — и всё сойдётся."}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section data-theme-preserve="dark" className="relative isolate min-w-0 pb-2">
      <div className="absolute inset-x-[8%] top-24 -z-10 h-[420px] rounded-full bg-nova-blue/[.05] blur-3xl" aria-hidden="true" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/[.09] px-1 pb-3">
        <div>
          <p className="text-[12px] font-bold text-[#f0c98d]">Второй закон Ньютона</p>
          <p className="mt-0.5 text-[12px] text-white/58">от тележки в магазине до F = ma</p>
        </div>
        <div className="w-[220px] max-w-[65%] sm:w-[330px] sm:max-w-none">
          <div className="flex items-center justify-end gap-3 text-[11px] font-bold text-white/58">
            <span className="truncate text-right text-white/58">{SCREENS[screen]}</span>
          </div>
          <div className="mt-2 flex gap-1" aria-hidden="true">
            {SCREENS.map((label, index) => (
              <span key={label} className={cn("h-1 flex-1 rounded-full", index <= screen ? "bg-nova-pink" : "bg-white/[.09]")} />
            ))}
          </div>
        </div>
      </header>

      {renderScreen()}

      {screen < SCREENS.length - 1 ? (
        <footer className={cn("mt-5 flex items-center gap-3 px-1", screen === 0 ? "justify-end" : "justify-between")}>
          {screen > 0 ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => goToScreen(screen - 1)}><ArrowLeft size={16} weight="bold" />Назад</Button>
          ) : null}
          <Button type="button" disabled={!canContinue} onClick={() => goToScreen(screen + 1)}>Дальше<ArrowRight size={17} weight="bold" /></Button>
        </footer>
      ) : null}
    </section>
  );
}
