"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { formatWeakness } from "../../lib/learning/weakness-labels";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { hasTopicMeme, TopicMemePostcard } from "./TopicMemePostcard";

interface SessionSummaryProps {
  score: number;
  total: number;
  weakTraps: string[];
  onRestart: () => void;
  restartLabel?: string;
  topic?: string;
  nextHref?: string;
  nextLabel?: string;
  variant?: "diagnostic" | "exam";
}

type ResultVariant =
  | "kinematics"
  | "dynamics"
  | "electro"
  | "thermo"
  | "optics"
  | "diagnostic"
  | "exam";

function resultVariantFor(topic?: string, variant?: "diagnostic" | "exam"): ResultVariant {
  if (variant) return variant;
  if (topic === "Динамика") return "dynamics";
  if (topic === "Электродинамика") return "electro";
  if (topic === "Термодинамика") return "thermo";
  if (topic === "Оптика") return "optics";
  if (topic === "Смешанная тренировка") return "exam";
  return "kinematics";
}

const resultBodies: Record<ResultVariant, [string, string, string, string]> = {
  kinematics: [
    "В этом наборе сошлись ответы про скорость, ускорение и графики. Это результат одной попытки, а не статус освоения темы: дальше проверь перенос без подсказки и вернись к теме позже.",
    "Посмотри ошибки: чаще всего сбивает график, знак или выбор формулы.",
    "Сначала пойми, что дано на графике. Потом выбирай формулу.",
    "Вернись к разбору выше и проверь, что показывает график.",
  ],
  dynamics: [
    "В этом наборе сошлись ответы про силы и направление ускорения. Это результат одной попытки, а не статус освоения темы: дальше проверь перенос без подсказки и вернись к теме позже.",
    "Посмотри ошибки: чаще всего сбивает направление силы или ускорения.",
    "Сначала отметь силы и направление. Потом записывай уравнение.",
    "Вернись к разбору выше и проверь направления сил.",
  ],
  electro: [
    "В этом наборе сошлись ответы про закон Ома и деление заряда. Это результат одной попытки, а не статус освоения темы: дальше проверь перенос без подсказки и вернись к теме позже.",
    "Посмотри ошибки: чаще всего сбивает, что на что делить, или знак заряда.",
    "Сначала запиши закон, потом выражай нужную величину.",
    "Вернись к разбору выше и повтори, что показывают U, I, R и q.",
  ],
  thermo: [
    "В этом наборе сошлись ответы про состояние газа и количество теплоты. Это результат одной попытки, а не статус освоения темы: дальше проверь перенос без подсказки и вернись к теме позже.",
    "Посмотри ошибки: чаще всего сбивают кельвины или пропущенный множитель.",
    "Сначала переведи температуру в кельвины, потом считай остальное.",
    "Вернись к разбору выше и проверь единицы измерения по каждой величине.",
  ],
  optics: [
    "В этом наборе сошлись ответы про отражение, преломление и собирающую линзу. Это результат одной попытки, а не статус освоения темы: дальше проверь перенос без подсказки и вернись к теме позже.",
    "Посмотри ошибки: чаще всего сбивают нормаль, порядок отношений или единицы фокусного расстояния.",
    "Сначала отметь нормаль или главную ось, затем выбери нужную связь величин.",
    "Вернись к справке и проверь, откуда отсчитан угол и в каких единицах дано расстояние.",
  ],
  exam: [
    "В открытой части этой диагностики большинство ответов верны. Это результат одной попытки, а не оценка устойчивого знания или готовности ко всей программе: четыре раздела покрыты частично, два пока не покрыты.",
    "Разбор ошибок ниже покажет, что повторить в открытой части каталога. Полную готовность к ЦТ/ЦЭ этот результат не измеряет.",
    "В этой диагностике верна половина ответов. Разбери слабые места, но помни: два раздела программы здесь пока отсутствуют.",
    "Вернись к темам, повтори слабые места и пройди диагностику снова. Непокрытые разделы нужно готовить отдельно.",
  ],
  diagnostic: [
    "В этой попытке большинство ответов верны. Теперь можно выбрать место, которое хочется проверить глубже и затем воспроизвести после перерыва.",
    "Микс показал несколько мест для повторения. Выбери одно — не нужно разбирать всё сразу.",
    "Это нормальная стартовая точка. Посмотри, какая тема сбивала чаще, и начни с неё.",
    "Этот результат ничего не говорит о твоих способностях. Он только показывает, с какой открытой темы удобнее начать.",
  ],
};

function getResultCopy(
  score: number,
  total: number,
  topic?: string,
  variant?: "diagnostic" | "exam",
) {
  const ratio = total === 0 ? 0 : score / total;
  const bodies = resultBodies[resultVariantFor(topic, variant)];

  if (ratio >= 0.9) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "✦",
      title:
        variant === "diagnostic"
          ? "Есть опора для старта"
          : "Ответы сошлись",
      body: bodies[0],
    };
  }

  if (ratio >= 0.7) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "◈",
      title:
        variant === "diagnostic"
          ? "Хорошая стартовая точка"
          : "Хороший результат",
      body: bodies[1],
    };
  }

  if (ratio >= 0.5) {
    return {
      tone: variant === "diagnostic" ? ("cyan" as const) : ("gold" as const),
      scoreClass:
        variant === "diagnostic" ? "text-nova-cyan" : "text-feedback-warning",
      marker: "△",
      title:
        variant === "diagnostic"
          ? "Нашлись темы для старта"
          : "Есть над чем поработать",
      body: bodies[2],
    };
  }

  return {
    tone: variant === "diagnostic" ? ("cyan" as const) : ("gold" as const),
    scoreClass:
      variant === "diagnostic" ? "text-nova-cyan" : "text-feedback-warning",
    marker: "○",
    title:
      variant === "diagnostic"
        ? "Теперь видно, с чего начать"
        : "Повтори теорию и попробуй снова",
    body: bodies[3],
  };
}

type SummaryWeakness = {
  key: string;
  dedupeKey: string;
  title: string;
  hint: string;
};

function formatSummaryWeakness(value: string): SummaryWeakness | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed.toLowerCase() === "undefined") {
    return null;
  }

  if (trimmed.includes(":")) {
    const formatted = formatWeakness(trimmed, 1);

    if (formatted) {
      return {
        key: formatted.key,
        // Один навык — один пункт сводки, даже если ловушки внутри навыка
        // разные: ученику нужен список тем для повторения, а не журнал.
        dedupeKey: formatted.skillId,
        title: formatted.title,
        hint: formatted.hint,
      };
    }
  }

  return {
    key: trimmed,
    dedupeKey: trimmed,
    title: "Типовая ошибка",
    hint: trimmed,
  };
}

function getUniqueSummaryWeaknesses(weakTraps: string[]) {
  const seen = new Set<string>();
  const weaknesses: SummaryWeakness[] = [];

  for (const trap of weakTraps) {
    const weakness = formatSummaryWeakness(trap);

    if (!weakness || seen.has(weakness.dedupeKey)) {
      continue;
    }

    seen.add(weakness.dedupeKey);
    weaknesses.push(weakness);
  }

  return weaknesses;
}

export function SessionSummary({
  score,
  total,
  weakTraps,
  onRestart,
  restartLabel = "Повторить",
  topic,
  nextHref,
  nextLabel,
  variant,
}: SessionSummaryProps) {
  const copy = getResultCopy(score, total, topic, variant);
  const summaryWeaknesses = getUniqueSummaryWeaknesses(weakTraps);
  const ratio = total === 0 ? 0 : score / total;
  const showTopicMeme = hasTopicMeme(topic, variant);

  return (
    <motion.section
      className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="flex flex-col items-center gap-6 text-center">
        <Badge tone={copy.tone}>
          {resultVariantFor(topic, variant) === "exam" ||
          resultVariantFor(topic, variant) === "diagnostic"
            ? "Итог диагностики"
            : "Итог тренировки"}
        </Badge>

        <div
          className={
            showTopicMeme
              ? "grid w-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_132px] sm:text-left"
              : "flex w-full flex-col items-center gap-3"
          }
        >
          <div
            className={
              showTopicMeme
                ? "flex min-w-0 flex-col items-center gap-3 sm:items-start"
                : "flex w-full flex-col items-center gap-3"
            }
          >
            <p className={`${copy.scoreClass} text-[48px] font-[800] leading-none tracking-tight`}>
              {copy.marker} {score} / {total} {copy.marker}
            </p>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white">{copy.title}</h2>
              <p className="text-[14px] font-normal leading-[1.7] text-white/70">
                {copy.body}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-nova-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(ratio * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
          <TopicMemePostcard topic={topic} variant={variant} />
        </div>

        {summaryWeaknesses.length > 0 ? (
          <div className="w-full rounded-card border border-white/[.08] bg-space-900 p-6 text-left">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
              На что обратить внимание
            </p>
            <ol className="space-y-3 text-[13px] font-normal leading-[1.6] text-white/75">
              {summaryWeaknesses.map((weakness, index) => (
                <li key={weakness.key} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="mt-0.5 shrink-0 text-feedback-warning">
                    {index + 1}.
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-semibold text-white/85">
                      {weakness.title}
                    </span>
                    <MathText text={weakness.hint} />
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href="/mistakes"
              className="mt-4 inline-flex items-center gap-1 rounded-option text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/50"
            >
              Все мои слабые места →
            </Link>
          </div>
        ) : null}

        <div
          className={
            nextHref
              ? "grid w-full gap-3 sm:grid-cols-2"
              : "grid w-full gap-3"
          }
        >
          <Button type="button" variant="primary" size="lg" onClick={onRestart}>
            {restartLabel}
          </Button>
          {nextHref ? (
            <Button asChild variant="ghost" size="lg">
              <Link href={nextHref}>{nextLabel ?? "Дальше"}</Link>
            </Button>
          ) : null}
        </div>
      </Card>
    </motion.section>
  );
}
