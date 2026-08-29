"use client";

import Link from "next/link";
import { InteractivePreview } from "../landing/InteractivePreview";
import { topics } from "../../lib/topics";
import { getTopicAccent } from "../topics/topic-accents";
import { TopicGlyph } from "../topics/TopicGlyph";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const steps = [
  {
    title: "Урок темы",
    body: "Опорные идеи, формулы и ловушки: что спрашивают и как решать, без зубрёжки.",
    cta: "Открыть темы",
    href: "/topics",
  },
  {
    title: "Пять похожих задач",
    body: "Один навык, пять задач подряд, разбор после каждого ответа.",
    cta: "Каталог задач",
    href: "/tasks",
  },
  {
    title: "Диагностика",
    body: "Десять задач по всем темам вперемешку — видно, что держится на самом деле.",
    cta: "Пройти диагностику",
    href: "/exam",
  },
];

export function StartHere() {
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="start-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-cyan/80">
            С чего начать
          </p>
          <h2 id="start-title" className="text-[22px] font-[800] leading-tight text-white">
            Три шага до первой честной проверки
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex flex-col gap-2.5 border-white/[.08] !p-4">
              <span className="physics-number text-[12px] font-bold text-nova-cyan/80">
                Шаг {index + 1}
              </span>
              <h3 className="text-[16px] font-[800] leading-snug text-white">{step.title}</h3>
              <p className="text-[13px] leading-[1.6] text-white/62">{step.body}</p>
              <Link
                href={step.href}
                className="mt-auto w-fit rounded-option pt-1 text-[12px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
              >
                {step.cta}
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="warmup-title" className="flex flex-col gap-4">
        <div className="flex max-w-[620px] flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Задача на разогрев
          </p>
          <h2 id="warmup-title" className="text-2xl font-[800] text-white">
            Проверь себя на графике скорости
          </h2>
        </div>
        <InteractivePreview />
      </section>

      <section aria-labelledby="inside-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 id="inside-title" className="text-[22px] font-[800] leading-tight text-white">
            Что внутри
          </h2>
          <p className="text-[13px] leading-[1.6] text-white/58">
            Пять тем ЦЭ/ЦТ с задачами и разборами. Прогресс и ошибки хранятся только в твоём
            браузере — без регистрации.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);

            return (
              <Card key={topic.id} className="flex flex-col gap-3 border-white/[.08] !p-4">
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-option border ${accent.tile}`}>
                    <TopicGlyph topic={topic.id} className="h-6 w-6" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="text-[15px] font-[800] leading-snug text-white">{topic.title}</h3>
                    <p className="text-[13px] leading-[1.55] text-white/60">{topic.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{topic.skillsCount} навыков</Badge>
                  <Button asChild size="sm" variant="ghost" className="ml-auto">
                    <Link href={`/topics/${topic.id}`}>Урок</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-[13px] leading-[1.7] text-white/55">
          Тренажёр не притворяется полным вариантом ЦТ/ЦЭ: квантовая и атомная физика, колебания
          и волны, магнитное поле пока без задач. Текущее покрытие —{" "}
          <Link
            href="/about"
            className="rounded-option font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            на странице «О проекте»
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
