import Link from "next/link";
import { getTaskLessonData, type TopicLessonEntry } from "../../lib/learning/topic-lesson-data";
import { getTopicAccent } from "./topic-accents";
import { TopicGlyph } from "./TopicGlyph";
import { TopicProgressSummary } from "./TopicProgressSummary";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { renderFormulaToHtml } from "../../lib/formula-rendering";

const TOPIC_ORDER: readonly TopicLessonEntry["topicId"][] = [
  "kinematics",
  "dynamics",
  "electrodynamics",
  "thermodynamics",
  "optics",
];

function difficultyLabel(entry: { difficultyRange: { min: number; max: number } }) {
  const { min, max } = entry.difficultyRange;
  return min === max ? `сложность ${min}` : `сложность ${min}–${max}`;
}

export function TopicLesson({ topicId }: { topicId: TopicLessonEntry["topicId"] }) {
  const data = getTaskLessonData(topicId);
  const accent = getTopicAccent(topicId);
  const index = TOPIC_ORDER.indexOf(topicId);
  const nextTopicId = TOPIC_ORDER[(index + 1) % TOPIC_ORDER.length];

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-white/48">
        <Link
          className="rounded-option hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          href="/topics"
        >
          Учиться
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-white/70">{data.topic.title}</span>
      </nav>

      <header className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-option border ${accent.tile}`}>
            <TopicGlyph topic={topicId} className="h-8 w-8" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Тема {index + 1} из {TOPIC_ORDER.length}
            </p>
            <h1 className="text-[32px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
              {data.topic.title}
            </h1>
            <p className="max-w-[680px] text-[15px] leading-[1.7] text-white/68">
              <MathText text={data.lesson.tagline} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={accent.badge}>{data.taskTypes.length} типов задач</Badge>
          <Badge tone="neutral">{data.topic.skillsCount} навыков</Badge>
          <Badge tone="neutral">{data.ideas.length} опорных идей</Badge>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="sm:w-auto">
            <Link href={data.topic.href}>Тренировка темы · 10 задач</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="sm:w-auto">
            <Link href={`/tasks?topic=${topicId}`}>Все типы задач темы</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <section className="flex flex-col gap-4" aria-labelledby="why-title">
            <h2 id="why-title" className="text-[22px] font-[800] text-white">
              Зачем эта тема
            </h2>
            <p className="max-w-[680px] text-[15px] leading-[1.75] text-white/72">
              <MathText text={data.lesson.whyItMatters} />
            </p>

            <Card className="flex flex-col gap-3 border-white/[.08] !p-5">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
                Что спрашивают в задачах
              </p>
              <ul className="flex flex-col gap-2.5">
                {data.lesson.examFocus.map((item) => (
                  <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-[14px] leading-[1.65] text-white/72">
                    <span aria-hidden="true" className={accent.text}>
                      —
                    </span>
                    <span>
                      <MathText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="ideas-title">
            <div className="flex flex-col gap-1">
              <h2 id="ideas-title" className="text-[22px] font-[800] text-white">
                Опорные идеи
              </h2>
              <p className="text-[13px] leading-[1.6] text-white/55">
                Каждая идея — формула, короткое пояснение и ловушка, на которой ошибаются чаще всего.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {data.ideas.map((idea) => (
                <article
                  key={idea.id}
                  className={`flex flex-col gap-3 rounded-card border border-white/[.08] border-l-2 bg-space-900/70 p-4 ${accent.border}`}
                >
                  <h3 className="text-[16px] font-[800] leading-snug text-white">{idea.label}</h3>
                  <p className="text-[13px] leading-[1.65] text-white/70">
                    <MathText text={idea.shortHint} />
                  </p>
                  {idea.formula ? (
                    <div
                      className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-3 py-2.5 text-center text-[15px] leading-[1.7]"
                      dangerouslySetInnerHTML={{
                        __html: renderFormulaToHtml(idea.formula, { displayMode: false }),
                      }}
                    />
                  ) : null}
                  {idea.mistake ? (
                    <p className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-2 text-[12px] leading-[1.6] text-white/60">
                      <span className="font-bold text-white/78">Ловушка: </span>
                      <MathText text={idea.mistake} />
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="approach-title">
            <h2 id="approach-title" className="text-[22px] font-[800] text-white">
              Как решать задачи темы
            </h2>
            <ol className="flex flex-col gap-3">
              {data.lesson.approach.map((step, stepIndex) => (
                <li
                  key={step}
                  className="grid grid-cols-[auto_1fr] items-start gap-3.5 rounded-card border border-white/[.08] bg-space-900/60 px-4 py-3.5"
                >
                  <span
                    className={`physics-number grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/12 bg-white/[.04] text-[13px] font-bold ${accent.text}`}
                  >
                    {stepIndex + 1}
                  </span>
                  <p className="text-[14px] leading-[1.7] text-white/72">
                    <MathText text={step} />
                  </p>
                </li>
              ))}
            </ol>

            <Card className="flex flex-col gap-2.5 border-nova-gold/20 bg-nova-gold/[.045] !p-5">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-gold/85">
                На что смотреть
              </p>
              <ul className="flex flex-col gap-2">
                {data.lesson.watchOut.map((item) => (
                  <li key={item} className="text-[13px] leading-[1.65] text-white/70">
                    <MathText text={item} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="flex flex-col gap-4" aria-labelledby="task-types-title">
            <div className="flex flex-col gap-1">
              <h2 id="task-types-title" className="text-[22px] font-[800] text-white">
                Типы задач в теме
              </h2>
              <p className="text-[13px] leading-[1.6] text-white/55">
                Разбор — это страница типа с эталонным решением. «Пять задач» — короткая серия на один навык.
              </p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {data.taskTypes.map((entry) => (
                <li key={entry.slug}>
                  <article className="flex flex-col gap-3 rounded-card border border-white/[.08] bg-space-900/60 p-4 transition-colors hover:border-white/[.16] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <h3 className="text-[15px] font-[800] leading-snug text-white">{entry.title}</h3>
                      <p className="text-[13px] leading-[1.6] text-white/60">{entry.shortDescription}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-white/40">
                        {entry.answerFormat === "numeric_input" ? "Числовой ответ" : "Один ответ"} ·{" "}
                        {difficultyLabel(entry)}
                        {entry.visualKinds.includes("graph") ? " · график" : ""}
                        {entry.visualKinds.includes("diagram") ? " · схема" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/tasks/${entry.slug}`}>Разбор</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/practice/family/${entry.slug}`}>5 задач</Link>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
          <TopicProgressSummary
            topicId={topicId}
            practiceHref={data.topic.href}
            skillsCount={data.topic.skillsCount}
            practiceLabel="Начать тренировку"
          />

          <Card className="flex flex-col gap-3 border-white/[.08] !p-5">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
              Связанное
            </p>
            <ul className="flex flex-col gap-2 text-[13px] font-semibold">
              <li>
                <Link
                  href={`/formulas?topic=${topicId}`}
                  className="rounded-option text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                >
                  Формулы темы
                </Link>
              </li>
              <li>
                <Link
                  href="/exam"
                  className="rounded-option text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                >
                  Проверить себя: диагностика
                </Link>
              </li>
              <li>
                <Link
                  href="/mistakes"
                  className="rounded-option text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
                >
                  Мои ошибки
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <nav
        aria-label="Другие темы"
        className="flex flex-col gap-3 border-t border-white/[.08] pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-[13px] font-semibold text-white/55">
          Дальше тема {TOPIC_ORDER.indexOf(nextTopicId) + 1}: {getTaskLessonData(nextTopicId).topic.title}
        </p>
        <Button asChild variant="ghost" className="sm:w-auto">
          <Link href={`/topics/${nextTopicId}`}>Открыть следующую тему</Link>
        </Button>
      </nav>
    </div>
  );
}
