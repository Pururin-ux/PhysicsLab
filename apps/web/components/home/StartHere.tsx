"use client";

import Link from "next/link";
import { InteractivePreview } from "../landing/InteractivePreview";
import { topics } from "../../lib/topics";
import { getTopicAccent } from "../topics/topic-accents";
import { TopicGlyph } from "../topics/TopicGlyph";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";

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
    <div className="flex flex-col gap-10">
      <section aria-labelledby="start-title" className="flex flex-col gap-5">
        <SectionHeading
          id="start-title"
          eyebrow="С чего начать"
          title="Три шага до первой честной проверки"
          description="Сначала разбираешь модель, потом закрепляешь её на короткой серии, затем проверяешь вперемешку."
        />

        <ol className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} padding="md" interactive className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="physics-number grid h-7 w-7 shrink-0 place-items-center rounded-full border border-nova-cyan/30 bg-nova-cyan-10 text-[13px] font-bold text-nova-cyan">
                  {index + 1}
                </span>
                <h3 className="pl-h3">{step.title}</h3>
              </div>
              <p className="text-[13px] leading-[1.65] text-ink-muted">{step.body}</p>
              <Link href={step.href} className="pl-link mt-auto w-fit pt-1 text-[13px]">
                {step.cta}
              </Link>
            </Card>
          ))}
        </ol>
      </section>

      <section aria-labelledby="warmup-title" className="flex flex-col gap-5">
        <SectionHeading
          id="warmup-title"
          eyebrow="Задача на разогрев"
          title="Проверь себя на графике скорости"
          description="Один клик — и сразу видно, где обычно ошибаются: наклон графика путают с самой скоростью."
        />
        <InteractivePreview />
      </section>

      <section aria-labelledby="inside-title" className="flex flex-col gap-5">
        <SectionHeading
          id="inside-title"
          eyebrow="Содержание"
          title="Что внутри"
          description="Пять тем ЦЭ/ЦТ с задачами и разборами. Прогресс и ошибки хранятся только в твоём браузере — без регистрации."
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);

            return (
              <Card key={topic.id} padding="sm" interactive className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-option border ${accent.tile}`}
                  >
                    <TopicGlyph topic={topic.id} className="h-6 w-6" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="pl-h3">{topic.title}</h3>
                    <p className="text-[13px] leading-[1.6] text-ink-muted">{topic.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">{topic.skillsCount} навыков</Badge>
                  <Button asChild size="sm" variant="secondary" className="ml-auto">
                    <Link href={`/topics/${topic.id}`}>Урок</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-[13px] leading-[1.7] text-ink-soft">
          Тренажёр не притворяется полным вариантом ЦТ/ЦЭ: квантовая и атомная физика, колебания
          и волны, магнитное поле пока без задач. Текущее покрытие —{" "}
          <Link href="/about" className="pl-link">
            на странице «О проекте»
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
