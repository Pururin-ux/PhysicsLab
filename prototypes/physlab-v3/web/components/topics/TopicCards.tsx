"use client";

import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { topics } from "../../lib/topics";
import { $appProgress } from "../../lib/stores/progress-store";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const topicAccentClass = {
  kinematics: {
    border: "border-nova-cyan/30",
    text: "text-nova-cyan",
    bg: "bg-nova-cyan/[.06]",
  },
  dynamics: {
    border: "border-nova-gold/30",
    text: "text-nova-gold",
    bg: "bg-nova-gold/[.06]",
  },
} as const;

function skillsLabel(count: number) {
  if (count === 1) {
    return "1 навык";
  }

  if (count > 1 && count < 5) {
    return `${count} навыка`;
  }

  return `${count} навыков`;
}

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

        return (
          <Card
            key={topic.id}
            variant="elevated"
            className={`flex min-h-[270px] flex-col gap-5 border-l-2 ${accent.border} ${depthClass}`}
          >
            <div className="flex items-center justify-between gap-3">
              <Badge tone={isDynamics ? "gold" : "cyan"}>
                {hasProgress ? "В процессе" : "Не начата"}
              </Badge>
              <span
                className={`rounded-badge border px-2.5 py-1 text-[12px] font-semibold ${accent.border} ${accent.bg} ${accent.text}`}
              >
                {isDynamics ? "ΣF" : "v(t)"}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <h2 className="text-2xl font-[800] leading-tight text-white">
                {topic.title}
              </h2>
              <p className="text-[14px] leading-[1.7] text-white/70">
                {topic.description}
              </p>
              <p className="text-[13px] font-semibold leading-[1.6] text-white/55">
                {skillsLabel(topic.skillsCount)} · {topic.modeLabel}
              </p>

              {hasProgress && topicProgress ? (
                <div className="mt-1 flex flex-col gap-1 rounded-option border border-white/[.06] bg-white/[.025] px-3 py-2 text-[12px] font-semibold leading-[1.5] text-white/55">
                  <span>
                    Решено: {topicProgress.solved} · Верно: {topicProgress.correct}
                  </span>
                  <span>Сессий: {topicProgress.completedSessions}</span>
                  {weakTrapCount > 0 ? (
                    <span>Слабые места: {weakTrapCount}</span>
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
              <Link href={topic.href}>Открыть тему</Link>
            </Button>
          </Card>
        );
      })}
    </section>
  );
}
