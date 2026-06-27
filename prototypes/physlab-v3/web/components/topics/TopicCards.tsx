"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopWeaknessesForTopic } from "../../lib/learning/weakness-labels";
import { topics } from "../../lib/topics";
import { $appProgress } from "../../lib/stores/progress-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const topicAccentClass = {
  kinematics: {
    border: "border-nova-cyan/30",
  },
  dynamics: {
    border: "border-nova-gold/30",
  },
} as const;

export function TopicCards() {
  const progress = useStore($appProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="grid gap-4 md:grid-cols-2"
      aria-label="Доступные темы"
    >
      {topics.map((topic) => {
        const accent = topicAccentClass[topic.id];
        const isDynamics = topic.id === "dynamics";
        const depthClass = isDynamics
          ? "ring-1 ring-white/[.045] !shadow-[0_18px_60px_rgba(0,0,0,0.50),0_0_34px_rgba(212,175,55,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "ring-1 ring-white/[.045] !shadow-[0_18px_60px_rgba(0,0,0,0.50),0_0_34px_rgba(0,224,255,0.09),inset_0_1px_0_rgba(255,255,255,0.06)]";
        const topicProgress = mounted ? progress.topics[topic.id] : null;
        const hasProgress = Boolean(
          topicProgress &&
            (topicProgress.completedSessions > 0 || topicProgress.solved > 0),
        );
        const weakTrapCount = topicProgress
          ? Object.keys(topicProgress.weakTraps).length
          : 0;
        const topWeaknesses = topicProgress
          ? getTopWeaknessesForTopic(topicProgress.weakTraps, topic.id, 2)
          : [];
        const topWeaknessLabels = Array.from(
          new Set(topWeaknesses.map((weakness) => weakness.skillTitle)),
        );

        return (
          <Card
            key={topic.id}
            variant="elevated"
            className={`flex min-h-[270px] flex-col gap-5 border-l-2 ${accent.border} ${depthClass}`}
          >
            <div className="flex items-center">
              <Badge tone={isDynamics ? "gold" : "cyan"}>
                {hasProgress ? "В процессе" : "Не начато"}
              </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <h2 className="text-2xl font-[800] leading-tight text-white">
                {topic.title}
              </h2>
              <p className="text-[14px] leading-[1.7] text-white/70">
                {topic.description}
              </p>

              {hasProgress && topicProgress ? (
                <div className="mt-1 flex flex-col gap-1 rounded-option border border-white/[.06] bg-white/[.025] px-3 py-2 text-[12px] font-semibold leading-[1.5] text-white/55">
                  <span>
                    Решено: {topicProgress.solved} · Верно: {topicProgress.correct}
                  </span>
                  <span>Тренировок: {topicProgress.completedSessions}</span>
                  {weakTrapCount > 0 && topWeaknessLabels.length > 0 ? (
                    <span className="text-[12px] text-white/55">
                      Чаще всего: {topWeaknessLabels.join(", ")}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <Button
              asChild
              size="lg"
              className={
                isDynamics
                  ? "mt-auto border-nova-gold bg-nova-gold shadow-gold-glow focus-visible:ring-nova-gold/50"
                  : "mt-auto"
              }
            >
              <Link href={topic.href}>{hasProgress ? "Продолжить" : "Начать"}</Link>
            </Button>
          </Card>
        );
      })}
    </section>
  );
}
