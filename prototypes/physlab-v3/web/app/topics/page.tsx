import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { topics } from "../../lib/topics";

export const metadata = {
  title: "Темы | PhysicsLab V3",
};

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

export default function TopicsPage() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <section className="flex max-w-[640px] flex-col gap-3">
        <h1 className="text-3xl font-[800] leading-tight tracking-tight text-white">
          Темы PhysicsLab
        </h1>
        <p className="text-[14px] leading-[1.7] text-white/70">
          Выбери раздел и тренируй физику через модели, графики и ловушки ЦТ.
        </p>
      </section>

      <section
        className="grid gap-4 md:grid-cols-2"
        aria-label="Доступные темы"
      >
        {topics.map((topic) => {
          const accent = topicAccentClass[topic.id];
          const isDynamics = topic.id === "dynamics";

          return (
            <Card
              key={topic.id}
              variant="elevated"
              className={`flex min-h-[270px] flex-col gap-5 border-l-2 ${accent.border}`}
            >
              <div className="flex items-center justify-between gap-3">
                <Badge tone={isDynamics ? "gold" : "cyan"}>Доступно</Badge>
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
    </div>
  );
}
