"use client";

import Link from "next/link";
import { InteractivePreview } from "../landing/InteractivePreview";
import { topics } from "../../lib/topics";
import { getTopicAccent } from "../topics/topic-accents";
import { TopicGlyph } from "../topics/TopicGlyph";
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
    body: "14 задач по всем семи темам вперемешку — видно, что держится на самом деле.",
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

        <ol className="grid gap-x-8 gap-y-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-1.5 border-t-2 border-nova-cyan/30 pt-3">
              <span className="physics-number text-[12px] font-bold text-nova-cyan/85">
                Шаг {index + 1}
              </span>
              <h3 className="pl-h3">{step.title}</h3>
              <p className="text-[13px] leading-[1.65] text-ink-muted">{step.body}</p>
              <Link href={step.href} className="pl-link w-fit pt-0.5 text-[13px]">
                {step.cta}
              </Link>
            </li>
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
          description="Семь тем ЦЭ/ЦТ с задачами и разборами. Прогресс и ошибки хранятся только в твоём браузере — без регистрации."
        />

        <ul className="grid gap-x-8 sm:grid-cols-2">
          {topics.map((topic) => {
            const accent = getTopicAccent(topic.id);

            return (
              <li key={topic.id} className="border-b border-white/[.07] last:border-b-0">
                <Link
                  href={`/topics/${topic.id}`}
                  className="group flex items-start gap-3 py-3.5 transition-colors hover:bg-white/[.03] focus-visible:bg-white/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nova-cyan/55"
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-option border ${accent.tile}`}
                  >
                    <TopicGlyph topic={topic.id} className="h-6 w-6" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="text-[15px] font-[800] leading-snug text-white group-hover:text-nova-cyan">
                      {topic.title}
                    </h3>
                    <span className="text-[13px] leading-[1.6] text-ink-muted">
                      {topic.description}
                    </span>
                    <span className="text-[11px] font-semibold text-ink-faint">
                      {topic.skillsCount} навыков
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-[13px] leading-[1.7] text-ink-soft">
          Тренажёр не притворяется полным вариантом ЦТ/ЦЭ: гидростатика, статика и момент силы,
          переменный ток и волновая оптика пока без задач. Текущее покрытие —{" "}
          <Link href="/tasks#coverage" className="pl-link">
            в каталоге задач
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
