"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface SessionSummaryProps {
  score: number;
  total: number;
  weakTraps: string[];
  onRestart: () => void;
  onNext?: () => void;
}

function getResultCopy(score: number, total: number) {
  const ratio = total === 0 ? 0 : score / total;

  if (ratio >= 0.9) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "✦",
      title: "Отличная подготовка к ЦТ",
      body: "Ты уверенно держишь базовую кинематику и замечаешь типовые ловушки ЦТ.",
    };
  }

  if (ratio >= 0.7) {
    return {
      tone: "cyan" as const,
      scoreClass: "text-nova-cyan",
      marker: "◈",
      title: "Хороший результат — разбери ошибки",
      body: "Разбор ошибок покажет, где теряется балл: график, знак перемещения или выбор формулы.",
    };
  }

  if (ratio >= 0.5) {
    return {
      tone: "gold" as const,
      scoreClass: "text-nova-gold",
      marker: "△",
      title: "Есть над чем поработать",
      body: "Разбор ошибок покажет, где теряется балл: график, знак перемещения или выбор формулы.",
    };
  }

  return {
    tone: "gold" as const,
    scoreClass: "text-nova-gold",
    marker: "○",
    title: "Повтори теорию и попробуй снова",
    body: "Вернись к моделям выше и проверь, что именно показывает график перед вычислением.",
  };
}

export function SessionSummary({
  score,
  total,
  weakTraps,
  onRestart,
  onNext,
}: SessionSummaryProps) {
  const copy = getResultCopy(score, total);
  const uniqueWeakTraps = Array.from(new Set(weakTraps));
  const ratio = total === 0 ? 0 : score / total;

  return (
    <motion.section
      className="relative mx-auto flex max-w-[580px] flex-col gap-4 pb-32 sm:pb-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="flex flex-col items-center gap-6 text-center">
        <Badge tone={copy.tone}>Итог сессии</Badge>

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

        {uniqueWeakTraps.length > 0 ? (
          <div className="w-full rounded-card border border-white/[.08] bg-space-900 p-6 text-left">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Слабые места
            </p>
            <ul className="space-y-2 text-[13px] font-normal leading-[1.6] text-white/75">
              {uniqueWeakTraps.map((trap) => (
                <li key={trap} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-nova-gold">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Button type="button" variant="primary" size="lg" onClick={onRestart}>
            Повторить
          </Button>
          <Button type="button" variant="ghost" size="lg" disabled onClick={onNext}>
            Следующая тема →
          </Button>
        </div>
      </Card>
    </motion.section>
  );
}
