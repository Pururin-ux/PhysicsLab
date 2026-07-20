"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import { FormulaBox } from "../ui/FormulaBox";
import { MathText } from "../ui/MathText";
import { SpeedometerStrip } from "./SpeedometerStrip";
import { cn } from "../../lib/utils";

// Экраны названы тем, что на них происходит. Ученик читает названия как
// оглавление истории, а не как пункты плана урока.
const SCREENS = [
  "Троллейбус трогается",
  "Метки на дороге",
  "Стрелка спидометра",
  "Откуда м/с²",
  "Куда смотрит ось",
  "Как это пишут",
  "Считаем вместе",
  "Теперь ты",
] as const;

const FIRST_HINT = "Не считай. Просто вспомни, как тебя качнуло назад.";

function TrolleybusScene() {
  return (
    <figure className="relative isolate overflow-hidden bg-space-950">
      <div className="relative aspect-[16/9] sm:aspect-[16/5]">
        <Image
          src="/art/production/lesson-acceleration-trolleybus-cozy.webp"
          alt="Вечерний троллейбус отъезжает вправо от городской остановки"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1180px"
          className="object-cover object-[58%_52%] sm:object-[50%_55%]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,11,39,.03)_35%,rgba(8,8,31,.9)_100%)]"
          aria-hidden="true"
        />
      </div>
      <figcaption className="sr-only">
        Троллейбус отходит от остановки, пассажиров слегка качает назад.
      </figcaption>
    </figure>
  );
}

function PositionTimeline() {
  const moments = [
    { time: "1 секунда", position: "left-[8%]" },
    { time: "2 секунда", position: "left-[35%]" },
    { time: "3 секунда", position: "left-[82%]" },
  ];

  return (
    <figure className="py-4" aria-labelledby="position-timeline-caption">
      <div
        role="img"
        aria-label="Метки троллейбуса через каждую секунду. Промежутки между ними всё длиннее."
        className="relative h-28 min-w-0"
      >
        <div className="absolute inset-x-3 top-[58px] h-px bg-white/28" aria-hidden="true" />
        <ArrowRight
          size={24}
          weight="bold"
          className="absolute right-0 top-[46px] text-nova-blue"
          aria-hidden="true"
        />
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
      </div>
      <figcaption id="position-timeline-caption" className="max-w-[64ch] text-[13px] leading-[1.6] text-white/58">
        Каждая метка — это ещё одна секунда пути. Промежутки между ними растут.
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

function CatHint({ text }: { text: string }) {
  return (
    <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0" aria-label="Кот подсказывает">
      <div className="absolute bottom-[-10px] right-1 h-[158px] w-[143px] sm:bottom-[-13px] sm:right-5 sm:h-[246px] sm:w-[223px]">
        <Image
          src="/art/production/curator-mechanics-helper.webp"
          alt="Чёрный кот в фиолетовом платке показывает лапой на троллейбус"
          fill
          sizes="(max-width: 640px) 143px, 223px"
          className="object-contain object-bottom drop-shadow-[0_14px_20px_rgba(232,182,109,.12)]"
        />
      </div>
      <div className="absolute bottom-4 right-[132px] w-[154px] border-l-2 border-[#e8b66d]/65 pl-3 sm:bottom-7 sm:right-[215px] sm:w-[230px]">
        <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Кот шепчет</p>
        <p className="mt-1 text-[11px] leading-[1.45] text-white/80 sm:text-[12px] sm:leading-[1.55]">{text}</p>
      </div>
    </aside>
  );
}

function FormulaCatHint() {
  return (
    <aside className="pointer-events-none absolute inset-0 z-10" aria-label="Кот подсказывает, как читать запись">
      <div className="absolute bottom-0 right-1 h-[187px] w-[116px] sm:right-4 sm:h-[235px] sm:w-[145px]">
        <Image
          src="/art/production/curator-mechanics-thinking.webp"
          alt="Чёрный кот задумался у нижнего края листа с формулой"
          fill
          sizes="(max-width: 640px) 116px, 145px"
          className="object-contain object-bottom drop-shadow-[0_12px_18px_rgba(232,182,109,.1)]"
        />
      </div>
      <div className="absolute bottom-5 left-5 right-[128px] border-l-2 border-[#e8b66d]/55 pl-3 sm:left-7 sm:right-[195px] sm:max-w-[420px]">
        <p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">Прочитай вслух</p>
        <p className="mt-1 text-[11px] leading-[1.5] text-white/68 sm:text-[12px]">
          «Сколько скорости прибавилось, делим на то, за сколько секунд».
        </p>
      </div>
    </aside>
  );
}

function CatStateHint({
  state,
  label,
  text,
}: {
  state: "thinking" | "support";
  label: string;
  text: string;
}) {
  const alt = state === "thinking"
    ? "Чёрный кот задумался"
    : "Чёрный кот сидит рядом и поддерживает";

  return (
    <aside className="flex max-w-[470px] items-end gap-3" aria-label={`Кот говорит: ${label}`}>
      <div className="relative h-[180px] w-[132px] shrink-0 sm:h-[200px] sm:w-[148px]">
        <Image
          src={`/art/production/curator-mechanics-${state}.webp`}
          alt={alt}
          fill
          sizes="(max-width: 640px) 132px, 148px"
          className="object-contain object-bottom"
        />
      </div>
      <div className="mb-3 border-l-2 border-[#e8b66d]/55 pl-3">
        <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f0c98d]">{label}</p>
        <p className="mt-1 text-[13px] leading-[1.55] text-white/68">{text}</p>
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

// Подсказки по числу, которое ввёл ученик: за каждым числом стоит своя
// путаница, и называть её лучше словами из самой задачи.
function hintForWrongAnswer(raw: string) {
  const value = parseNumber(raw);
  if (value === null) return "Впиши одно число. Единицы уже стоят справа от поля.";
  if (value === -3) return "Минус здесь не нужен: троллейбус едет туда же, куда смотрит стрелка оси, и скорость растёт.";
  if (value === 5) return "Похоже, ты взял только последнюю скорость. А прибавилось всего 10 − 4 = 6 м/с.";
  if (value === 7) return "Это середина между 4 и 10. А нужна разница: на сколько скорость выросла.";
  if (value === 12) return "Скорости не складывают. Смотрим, насколько выросла: 10 − 4.";
  if (value === 6) return "Ты нашёл, на сколько выросла скорость. Осталось поделить эти 6 м/с на 2 секунды.";
  return "Сначала найди, на сколько выросла скорость: 10 − 4. Потом подели это на 2 секунды.";
}

export function AccelerationLesson() {
  const [screen, setScreen] = useState(0);
  const [feeling, setFeeling] = useState<"grows" | "same" | null>(null);
  const [unitGuess, setUnitGuess] = useState<"two" | "six" | null>(null);
  const [direction, setDirection] = useState<"right" | "left" | null>(null);
  const [workedAnswer, setWorkedAnswer] = useState("");
  const [workedChecked, setWorkedChecked] = useState(false);
  const [ownWords, setOwnWords] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const workedCorrect = parseNumber(workedAnswer) === 2;
  const finalCorrect = parseNumber(finalAnswer) === 3;
  const axisReady = direction === "right";
  const canContinue =
    screen === 0
      ? feeling !== null
      : screen === 3
        ? unitGuess !== null
        : screen === 4
          ? axisReady
          : screen === 6
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
            Троллейбус отходит от остановки
          </h2>
          <div className="relative isolate overflow-hidden rounded-[18px] border border-[#d6a6c9]/24 bg-[linear-gradient(145deg,#2b193f_0%,#17152f_58%,#10142d_100%)] shadow-[0_26px_70px_rgba(3,4,22,.32)]">
            <div className="relative">
              <TrolleybusScene />
              <CatHint text={FIRST_HINT} />
            </div>
            <fieldset className="relative isolate border-t border-[#d6a6c9]/22 px-5 py-5 text-white sm:px-7 sm:py-6">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/art/production/paper-texture.webp')] bg-[length:540px_auto] opacity-[.045] mix-blend-screen" aria-hidden="true" />
              <legend className="sr-only">Что происходит со скоростью троллейбуса</legend>
              <p className="text-[24px] font-[800] leading-[1.08] tracking-[-.025em] sm:text-[30px]">
                Ты стоишь в салоне. Что со скоростью?
              </p>
              <p className="mt-2 max-w-[64ch] text-[13px] leading-[1.55] text-white/62">
                Отвечай как чувствуешь. Правильного ответа тут пока никто не требует.
              </p>
              <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
                <SceneChoice selected={feeling === "grows"} onClick={() => setFeeling("grows")}>
                  Растёт каждую секунду
                </SceneChoice>
                <SceneChoice selected={feeling === "same"} onClick={() => setFeeling("same")}>
                  Одна и та же всё время
                </SceneChoice>
              </div>
              {feeling ? (
                <p role="status" className="mt-3 max-w-[64ch] text-[13px] leading-[1.55] text-white/64">
                  {feeling === "grows"
                    ? "Тебя качнуло назад — значит, скорость и правда росла. Дальше видно, насколько."
                    : "Тогда бы тебя не качнуло. Посмотри на метки дальше: путь за каждую секунду разный."}
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
            Оставим метки на дороге
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Ставим метку там, где троллейбус был через секунду. Потом ещё через одну.
          </p>
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

    if (screen === 2) {
      return (
        <div className="mx-auto max-w-[900px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Посмотри на спидометр
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            У водителя на панели стрелка. Вот что она показывает каждую секунду.
          </p>
          <div className="mt-6 rounded-[16px] border border-white/[.1] bg-space-900/60 px-4 py-5 sm:px-6">
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

    if (screen === 3) {
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
            <div role="status" className={cn("mt-5 max-w-[64ch] border-l-2 pl-4 text-[14px] leading-[1.65] text-white/76", unitGuess === "two" ? "border-nova-cyan/60" : "border-nova-pink/60")}>
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

    if (screen === 4) {
      return (
        <div className="mx-auto max-w-[860px] py-2">
          <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">
            Куда смотрит стрелка
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Физики рисуют вдоль дороги стрелку. Движение в её сторону считают плюсом, в обратную — минусом.
            Троллейбус едет вправо. Куда направим стрелку?
          </p>
          <div className="mt-5 flex items-center gap-3 border-y border-white/[.12] py-5" aria-hidden="true">
            <span className="text-[12px] font-bold text-white/50">остановка</span>
            <span className="h-[3px] flex-1 bg-nova-indigo" />
            <ArrowRight size={30} weight="bold" className="text-nova-blue" />
          </div>
          <fieldset className="mt-5">
            <legend className="sr-only">Куда направить стрелку</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceButton selected={direction === "right"} onClick={() => setDirection("right")}>Вправо, куда едем</ChoiceButton>
              <ChoiceButton selected={direction === "left"} onClick={() => setDirection("left")}>Влево, назад к остановке</ChoiceButton>
            </div>
          </fieldset>
          {direction ? (
            <div role="status" className={cn("mt-5 max-w-[64ch] border-l-2 pl-4 text-[14px] leading-[1.65] text-white/76", axisReady ? "border-nova-cyan/60" : "border-nova-pink/60")}>
              {axisReady ? (
                <p>Удобно: троллейбус едет туда же, куда смотрит стрелка, и все числа выйдут с плюсом.</p>
              ) : (
                <p>
                  Так тоже можно, физика не сломается. Но тогда и скорость, и разгон запишутся с минусом.
                  Давай возьмём стрелку вправо, чтобы числа были попроще.
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
            Та же мысль, только короче
          </h2>
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">
            Писать «на сколько выросла скорость, делённое на время» каждый раз долго. Поэтому договорились
            о значках.
          </p>
          <dl className="mt-6 divide-y divide-white/[.1] border-y border-white/[.12]">
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text="$v$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">скорость. Просто первая буква слова velocity</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-cyan"><MathText text="$v_0$" /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                скорость в самом начале. Маленький нолик внизу — пометка «в нулевую секунду», как подпись на полях
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-pink"><MathText text={"$\\Delta v$"} /></dt>
              <dd className="text-[14px] leading-[1.6] text-white/72">
                на сколько скорость выросла. Треугольник Δ у физиков значит «насколько изменилось»: 8 − 2 = 6 м/с
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
              <dt className="text-[21px] font-bold text-nova-pink"><MathText text={"$\\Delta t$"} /></dt>
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
            <li className="relative">
              <FormulaBox
                label="То же значками"
                formula={"a=\\frac{\\Delta v}{\\Delta t}=\\frac{v-v_0}{\\Delta t}"}
                caption="У троллейбуса: (8 − 2) ÷ 3 = 2 м/с²."
                surface="lesson"
                className="min-h-[350px] pb-[188px] sm:min-h-[280px] sm:pb-[100px] sm:pr-[205px]"
              />
              <FormulaCatHint />
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
          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Троллейбус разогнался с 2 до 8 м/с за 3 секунды. Стрелка оси смотрит вперёд, куда он едет.</p>
          <ol className="mt-5 space-y-4 border-y border-white/[.12] py-4">
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-cyan">1.</span>
              <div>
                <p className="font-bold text-white">Смотрю, на сколько выросла скорость</p>
                <p className="mt-1 text-[14px] leading-[1.6] text-white/68"><MathText text={"$8-2=6$"} /> м/с</p>
                <p className="mt-1 text-[12px] leading-[1.55] text-white/50">Из конечной скорости вычитаю начальную: на столько её стало больше.</p>
              </div>
            </li>
            <li className="grid gap-1 sm:grid-cols-[28px_1fr]">
              <span className="font-bold text-nova-pink">2.</span>
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
              <p className="text-[14px] leading-[1.6] text-white/74">{workedCorrect ? "Да: 6 ÷ 3 = 2. Каждую секунду скорость росла на 2 м/с." : "Скорость выросла на 6 м/с. Подели именно эти 6 на 3 секунды."}</p>
            </div>
          ) : null}
          {workedCorrect ? (
            <div className="mt-5">
              <label htmlFor="own-words" className="text-[14px] font-bold text-white">Скажи своими словами: почему мы делим на секунды?</label>
              <textarea
                id="own-words"
                value={ownWords}
                onChange={(event) => setOwnWords(event.target.value)}
                rows={2}
                placeholder="Пиши как думаешь…"
                className="mt-2 w-full resize-y rounded-option border border-white/[.14] bg-space-950 px-3 py-3 text-[14px] leading-[1.6] text-white placeholder:text-white/38 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75"
              />
              <p className="mt-1 text-[12px] text-white/48">Хватит одной фразы. Например: хочу узнать прибавку за одну секунду.</p>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-[900px] py-2">
        <h2 ref={headingRef} tabIndex={-1} className="text-[30px] font-[800] leading-tight tracking-[-.025em] text-white focus:outline-none sm:text-[40px]">Теперь целиком сам</h2>
        <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-white/70">Другой троллейбус разогнался с 4 до 10 м/с за 2 секунды. Стрелка оси смотрит вперёд. На сколько он прибавлял скорость каждую секунду?</p>
        <div className="mt-5 max-w-[430px] border-y border-white/[.12] py-5">
          <label htmlFor="final-answer" className="text-[14px] font-bold text-white">Твой ответ</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id="final-answer"
              value={finalAnswer}
              onChange={(event) => { setFinalAnswer(event.target.value); setFinalFeedback(null); }}
              inputMode="decimal"
              className="h-12 min-w-0 flex-1 rounded-option border border-white/[.16] bg-space-950 px-3 text-[17px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75"
            />
            <span className="shrink-0 text-[14px] text-white/68">м/с²</span>
          </div>
          <Button type="button" className="mt-3 w-full sm:w-auto" onClick={() => setFinalFeedback(finalCorrect ? "Точно: скорость выросла на 6 м/с, а 6 ÷ 2 = 3." : hintForWrongAnswer(finalAnswer))}>Посмотреть, что вышло</Button>
        </div>
        {finalFeedback ? (
          <div role={finalCorrect ? "status" : "alert"} aria-live="polite" className={cn("mt-5 border-l-2 pl-4", finalCorrect ? "border-nova-cyan/65" : "border-nova-pink/65")}>
            <p className="text-[11px] font-bold uppercase tracking-[.1em] text-white/52">{finalCorrect ? "Готово" : "Смотри сюда"}</p>
            <p className="mt-1 text-[14px] leading-[1.65] text-white/76">{finalFeedback}</p>
            {finalCorrect ? (
              <Link href="/practice/family/vt-slope" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-option font-bold text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/75">
                Порешать такие задачи <ArrowRight size={17} weight="bold" />
              </Link>
            ) : null}
          </div>
        ) : null}
        {finalFeedback ? (
          <div className="mt-5">
            <CatStateHint
              state="support"
              label={finalCorrect ? "Кот доволен" : "Кот рядом"}
              text={finalCorrect ? "Ты дошёл от «меня качнуло в троллейбусе» до настоящей формулы. Это и есть ускорение." : "Ошибка не про тебя, а про один шаг в решении. Мы его уже нашли."}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section data-theme-preserve="dark" className="relative isolate min-w-0 pb-2">
      <div className="absolute inset-x-[8%] top-24 -z-10 h-[420px] rounded-full bg-nova-pink/[.045] blur-3xl" aria-hidden="true" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/[.09] px-1 pb-3">
        <div>
          <p className="text-[12px] font-bold text-[#f0c98d]">Ускорение</p>
          <p className="mt-0.5 text-[12px] text-white/48">от толчка в троллейбусе до формулы</p>
        </div>
        <div className="w-[220px] max-w-[65%] sm:w-[330px] sm:max-w-none">
          <div className="flex items-center justify-end gap-3 text-[11px] font-bold text-white/58">
            <span className="truncate text-right text-white/48">{SCREENS[screen]}</span>
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
