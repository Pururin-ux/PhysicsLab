"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatWeakness } from "../../lib/learning/weakness-labels";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

interface SessionSummaryProps {
  score: number;
  total: number;
  weakTraps: string[];
  onRestart: () => void;
  restartLabel?: string;
  topic?: string;
  nextHref?: string;
  nextLabel?: string;
}

type ResultVariant = "kinematics" | "dynamics" | "electro" | "thermo" | "exam";

function resultVariantFor(topic?: string): ResultVariant {
  if (topic === "Динамика") return "dynamics";
  if (topic === "Электродинамика") return "electro";
  if (topic === "Термодинамика") return "thermo";
  if (topic === "Пробный вариант") return "exam";
  return "kinematics";
}

const resultBodies: Record<ResultVariant, [string, string, string, string]> = {
  kinematics: [
    "Ты уверенно работаешь со скоростью, ускорением и графиками.",
    "Посмотри ошибки: чаще всего сбивает график, знак или выбор формулы.",
    "Сначала пойми, что дано на графике. Потом выбирай формулу.",
    "Вернись к разбору выше и проверь, что показывает график.",
  ],
  dynamics: [
    "Ты уверенно работаешь с силами и направлением ускорения.",
    "Посмотри ошибки: чаще всего сбивает направление силы или ускорения.",
    "Сначала отметь силы и направление. Потом записывай уравнение.",
    "Вернись к разбору выше и проверь направления сил.",
  ],
  electro: [
    "Ты уверенно работаешь с законом Ома и делением заряда.",
    "Посмотри ошибки: чаще всего сбивает, что на что делить, или знак заряда.",
    "Сначала запиши закон, потом выражай нужную величину.",
    "Вернись к разбору выше и повтори, что показывают U, I, R и q.",
  ],
  thermo: [
    "Ты уверенно работаешь с уравнением состояния газа и количеством теплоты.",
    "Посмотри ошибки: чаще всего сбивают кельвины или пропущенный множитель.",
    "Сначала переведи температуру в кельвины, потом считай остальное.",
    "Вернись к разбору выше и проверь единицы измерения по каждой величине.",
  ],
  exam: [
    "Все разделы в хорошей форме. На реальном ЦЭ будут ещё оптика и квант.",
    "Крепкая база. Разбор ошибок ниже — там самые доступные баллы.",
    "Половина варианта твоя. Разбери слабые места и возьми новый вариант.",
    "Вернись к темам и разбери их спокойно — потом вариант пойдёт легче.",
  ],
};

function getResultCopy(score: number, total: number, topic?: string) {
  const ratio = total === 0 ? 0 : score / total;
  const bodies = resultBodies[resultVariantFor(topic)];

  if (ratio >= 0.9) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "✦",
      title: "Отлично получилось",
      body: bodies[0],
    };
  }

  if (ratio >= 0.7) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "◈",
      title: "Хороший результат",
      body: bodies[1],
    };
  }

  if (ratio >= 0.5) {
    return {
      tone: "gold" as const,
      scoreClass: "text-nova-gold",
      marker: "△",
      title: "Есть над чем поработать",
      body: bodies[2],
    };
  }

  return {
    tone: "gold" as const,
    scoreClass: "text-nova-gold",
    marker: "○",
    title: "Повтори теорию и попробуй снова",
    body: bodies[3],
  };
}

type SummaryWeakness = {
  key: string;
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
        title: formatted.title,
        hint: formatted.hint,
      };
    }
  }

  return {
    key: trimmed,
    title: "Типовая ошибка",
    hint: trimmed,
  };
}

function getUniqueSummaryWeaknesses(weakTraps: string[]) {
  const seen = new Set<string>();
  const weaknesses: SummaryWeakness[] = [];

  for (const trap of weakTraps) {
    const weakness = formatSummaryWeakness(trap);

    if (!weakness || seen.has(weakness.key)) {
      continue;
    }

    seen.add(weakness.key);
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
}: SessionSummaryProps) {
  const copy = getResultCopy(score, total, topic);
  const summaryWeaknesses = getUniqueSummaryWeaknesses(weakTraps);
  const ratio = total === 0 ? 0 : score / total;

  return (
    <motion.section
      className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="flex flex-col items-center gap-6 text-center">
        <Badge tone={copy.tone}>Итог тренировки</Badge>

        <div className="flex flex-col items-center gap-3">
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

        {summaryWeaknesses.length > 0 ? (
          <div className="w-full rounded-card border border-white/[.08] bg-space-900 p-6 text-left">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              На что обратить внимание
            </p>
            <ol className="space-y-3 text-[13px] font-normal leading-[1.6] text-white/75">
              {summaryWeaknesses.map((weakness, index) => (
                <li key={weakness.key} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="mt-0.5 shrink-0 text-nova-gold">
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
              className="mt-4 inline-flex items-center gap-1 rounded-option text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50"
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
