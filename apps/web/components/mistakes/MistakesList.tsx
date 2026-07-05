"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { skillMetadata } from "../../lib/learning/taxonomy";
import { buildReviewPlan, type ReviewUrgency } from "../../lib/learning/review-plan";
import { $appProgress } from "../../lib/stores/progress-store";
import { topics } from "../../lib/topics";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

const MAX_WEAKNESSES = 12;

const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

function practiceHrefForSkill(skillId: string) {
  const skill =
    skillId in skillMetadata
      ? skillMetadata[skillId as keyof typeof skillMetadata]
      : null;

  return skill ? topicById[skill.topicId]?.href ?? "/topics" : "/topics";
}

function topicTitleForSkill(skillId: string) {
  const skill =
    skillId in skillMetadata
      ? skillMetadata[skillId as keyof typeof skillMetadata]
      : null;

  return skill ? topicById[skill.topicId]?.title ?? null : null;
}

function toneForUrgency(urgency: ReviewUrgency) {
  if (urgency === "today") return "gold";
  if (urgency === "next-session") return "cyan";
  return "neutral";
}

export function MistakesList() {
  const progress = useStore($appProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalSolved = topics.reduce(
    (sum, topic) => sum + (progress.topics[topic.id]?.solved ?? 0),
    0,
  );
  const weaknesses = buildReviewPlan(progress, MAX_WEAKNESSES);

  if (weaknesses.length === 0) {
    return (
      <Card className="flex flex-col items-start gap-4 !p-6 md:!p-8">
        {totalSolved > 0 ? (
          <>
            <h2 className="text-lg font-[800] text-white">
              Записанных ошибок нет
            </h2>
            <p className="max-w-[520px] text-[14px] leading-[1.7] text-white/65">
              Ты решил {totalSolved}{" "}
              {totalSolved === 1 ? "задачу" : totalSolved < 5 ? "задачи" : "задач"},
              и пока ни одна ловушка не повторялась. Если ошибёшься — здесь
              появится разбор, что именно пошло не так.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-[800] text-white">
              Здесь появятся твои слабые места
            </h2>
            <p className="max-w-[520px] text-[14px] leading-[1.7] text-white/65">
              После первой тренировки тренажёр запомнит, на каких ловушках ты
              ошибся, и покажет их здесь — с подсказкой и кнопкой, чтобы
              потренировать именно это.
            </p>
          </>
        )}
        <Button asChild>
          <Link href="/topics">К темам</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-label="Список слабых мест">
      {weaknesses.map((weakness) => {
        const topicTitle = topicTitleForSkill(weakness.skillId);

        return (
          <Card
            key={weakness.key}
            className="card-lift flex flex-col gap-4 border-white/[.08] !p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={topicTitle === "Динамика" ? "gold" : "cyan"}>
                  {weakness.skillTitle}
                </Badge>
                {topicTitle ? (
                  <span className="text-[11px] font-bold uppercase tracking-[.12em] text-white/40">
                    {topicTitle}
                  </span>
                ) : null}
                <Badge tone={toneForUrgency(weakness.urgency)}>
                  {weakness.dueLabel}
                </Badge>
                <span
                  className="physics-number text-[12px] font-semibold text-white/45"
                  title="Сколько раз встретилась эта ошибка"
                >
                  ×{weakness.count}
                </span>
              </div>
              <h2 className="text-[16px] font-[800] leading-snug text-white">
                {weakness.title}
              </h2>
              <p className="text-[13px] leading-[1.65] text-white/62">
                <MathText text={weakness.hint} />
              </p>
              <p className="text-[12px] font-semibold leading-[1.5] text-white/45">
                {weakness.reason}
              </p>
            </div>

            <Button asChild size="sm" className="shrink-0">
              <Link href={weakness.href || practiceHrefForSkill(weakness.skillId)}>
                Потренировать это
              </Link>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
