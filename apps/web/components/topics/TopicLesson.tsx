import Link from "next/link";
import { getTaskLessonData, type TopicLessonEntry } from "../../lib/learning/topic-lesson-data";
import { getTopicAccent } from "./topic-accents";
import { TopicGlyph } from "./TopicGlyph";
import { TopicProgressSummary } from "./TopicProgressSummary";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { ProgressBar } from "../ui/ProgressBar";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { cn } from "../../lib/utils";

const TOPIC_ORDER: readonly TopicLessonEntry["topicId"][] = [
  "kinematics",
  "dynamics",
  "electrodynamics",
  "thermodynamics",
  "optics",
  "oscillations",
  "quantum",
];

const sections = [
  { id: "why", label: "Зачем тема" },
  { id: "ideas", label: "Опорные идеи" },
  { id: "approach", label: "Как решать" },
  { id: "types", label: "Типы задач" },
];

function difficultyLabel(entry: { difficultyRange: { min: number; max: number } }) {
  const { min, max } = entry.difficultyRange;
  return min === max ? `сложность ${min}` : `сложность ${min}–${max}`;
}

export function TopicLesson({ topicId }: { topicId: TopicLessonEntry["topicId"] }) {
  const data = getTaskLessonData(topicId);
  const accent = getTopicAccent(topicId);
  const index = TOPIC_ORDER.indexOf(topicId);
  const prevTopicId = TOPIC_ORDER[(index - 1 + TOPIC_ORDER.length) % TOPIC_ORDER.length];
  const nextTopicId = TOPIC_ORDER[(index + 1) % TOPIC_ORDER.length];
  const prevTopic = getTaskLessonData(prevTopicId);
  const nextTopic = getTaskLessonData(nextTopicId);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <nav
        aria-label="Хлебные крошки"
        className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink-soft"
      >
        <Link href="/topics" className="pl-focus rounded-option hover:text-white">
          Учиться
        </Link>
        <span aria-hidden="true" className="text-white/30">
          /
        </span>
        <span className="text-white/80">{data.topic.title}</span>
      </nav>

      <header className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid h-14 w-14 shrink-0 place-items-center rounded-card border",
              accent.tile,
            )}
          >
            <TopicGlyph topic={topicId} className="h-8 w-8" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <p className="pl-eyebrow">
              Тема {index + 1} из {TOPIC_ORDER.length}
            </p>
            <h1 className="pl-h1">{data.topic.title}</h1>
            <p className="pl-body pl-measure">
              <MathText text={data.lesson.tagline} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={accent.badge} size="sm" dot>
            {data.taskTypes.length} типов задач
          </Badge>
          <Badge size="sm">{data.topic.skillsCount} навыков</Badge>
          <Badge size="sm">{data.ideas.length} опорных идей</Badge>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href={data.topic.href}>Тренировка темы · 10 задач</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href={`/tasks?topic=${topicId}`}>Все типы задач темы</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-10">
          <section id="why" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="pl-h2">Зачем эта тема</h2>
            <p className="pl-body pl-measure">
              <MathText text={data.lesson.whyItMatters} />
            </p>

            <Card padding="md" className="flex flex-col gap-3.5">
              <p className="pl-eyebrow">Что спрашивают в задачах</p>
              <ul className="flex flex-col gap-2.5">
                {data.lesson.examFocus.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-3 text-[14px] leading-[1.7] text-ink-muted"
                  >
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

          <section id="ideas" className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="pl-h2">Опорные идеи</h2>
              <p className="text-[14px] leading-[1.65] text-ink-soft">
                Идея — это формула, её смысл и ловушка, на которой ошибаются чаще всего.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {data.ideas.map((idea, ideaIndex) => (
                <article
                  key={idea.id}
                  className={cn(
                    "pl-panel flex scroll-mt-24 flex-col gap-3 rounded-card p-4",
                    accent.border,
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "physics-number grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-[12px] font-bold",
                        accent.text,
                      )}
                    >
                      {ideaIndex + 1}
                    </span>
                    <h3 className="pl-h3 leading-snug">{idea.label}</h3>
                  </div>

                  <p className="text-[13px] leading-[1.65] text-ink-muted">
                    <MathText text={idea.shortHint} />
                  </p>

                  {idea.formula ? (
                    <div
                      className="formula-white rounded-option border border-line bg-surface-2 px-3 py-3 text-center text-[15px] leading-[1.7]"
                      dangerouslySetInnerHTML={{
                        __html: renderFormulaToHtml(idea.formula, { displayMode: false }),
                      }}
                    />
                  ) : null}

                  {idea.mistake ? (
                    <p className="rounded-option border border-nova-gold/20 bg-nova-gold/[.05] px-3 py-2 text-[12px] leading-[1.6] text-ink-muted">
                      <span className="font-bold text-nova-gold">Ловушка: </span>
                      <MathText text={idea.mistake} />
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section id="approach" className="flex scroll-mt-24 flex-col gap-5">
            <h2 className="pl-h2">Как решать задачи темы</h2>

            <ol className="flex flex-col gap-3">
              {data.lesson.approach.map((step, stepIndex) => (
                <li
                  key={step}
                  className="grid grid-cols-[auto_1fr] items-start gap-3.5 rounded-card border border-line bg-surface-1 px-4 py-3.5"
                >
                  <span
                    className={cn(
                      "physics-number grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong bg-surface-2 text-[13px] font-bold",
                      accent.text,
                    )}
                  >
                    {stepIndex + 1}
                  </span>
                  <p className="text-[14px] leading-[1.7] text-ink-muted">
                    <MathText text={step} />
                  </p>
                </li>
              ))}
            </ol>

            <Card
              padding="md"
              className="flex flex-col gap-2.5 border-nova-gold/25 bg-nova-gold/[.045]"
            >
              <p className="pl-eyebrow text-nova-gold/85">На что смотреть</p>
              <ul className="flex flex-col gap-2">
                {data.lesson.watchOut.map((item) => (
                  <li key={item} className="text-[13px] leading-[1.65] text-ink-muted">
                    <MathText text={item} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section id="types" className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="pl-h2">Типы задач в теме</h2>
              <p className="text-[14px] leading-[1.65] text-ink-soft">
                Разбор — страница типа с эталонным решением. «Пять задач» — короткая серия на один
                навык.
              </p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {data.taskTypes.map((entry) => (
                <li key={entry.slug}>
                  <article className="pl-row flex flex-col gap-3 rounded-card px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <h3 className="pl-h3">{entry.title}</h3>
                      <p className="text-[13px] leading-[1.6] text-ink-soft">
                        {entry.shortDescription}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-[.1em] text-ink-faint">
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
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/practice/family/${entry.slug}`}>5 задач</Link>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-[92px]">
          <Card padding="sm">
            <nav aria-label="Разделы урока" className="flex flex-col gap-1">
              <p className="pl-eyebrow px-2 pb-1">На странице</p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="pl-focus rounded-option px-2 py-1.5 text-[13px] font-semibold text-ink-muted transition-colors hover:bg-surface-1 hover:text-white"
                >
                  {section.label}
                </a>
              ))}
              <div className="my-1.5 h-px bg-line-subtle" />
              <p className="px-2 pb-1 text-[11px] font-semibold text-ink-faint">
                {data.taskTypes.length} типов задач · {data.topic.skillsCount} навыков
              </p>
              <ProgressBar
                value={Math.min(100, (data.taskTypes.length / 12) * 100)}
                size="sm"
                tone={accent.badge === "neutral" ? "neutral" : accent.badge}
                label="Доля темы в каталоге типов задач"
              />
            </nav>
          </Card>

          <TopicProgressSummary
            topicId={topicId}
            practiceHref={data.topic.href}
            skillsCount={data.topic.skillsCount}
            practiceLabel="Начать тренировку"
          />

          <Card padding="sm" className="flex flex-col gap-2.5">
            <p className="pl-eyebrow">Связанное</p>
            <ul className="flex flex-col gap-2 text-[13px] font-semibold">
              <li>
                <Link href={`/formulas?topic=${topicId}`} className="pl-link">
                  Формулы темы
                </Link>
              </li>
              <li>
                <Link href="/exam" className="pl-link">
                  Проверить себя: диагностика
                </Link>
              </li>
              <li>
                <Link href="/mistakes" className="pl-link">
                  Мои ошибки
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <nav
        aria-label="Другие темы"
        className="grid gap-3 border-t border-line-subtle pt-6 sm:grid-cols-2"
      >
        <Link
          href={`/topics/${prevTopicId}`}
          className="pl-focus group flex flex-col gap-1 rounded-card border border-line bg-surface-1 px-4 py-3.5 transition-colors hover:border-line-strong hover:bg-surface-2"
        >
          <span className="pl-eyebrow">Предыдущая тема</span>
          <span className="text-[15px] font-[800] text-white">{prevTopic.topic.title}</span>
        </Link>
        <Link
          href={`/topics/${nextTopicId}`}
          className="pl-focus group flex flex-col gap-1 rounded-card border border-line bg-surface-1 px-4 py-3.5 text-right transition-colors hover:border-line-strong hover:bg-surface-2"
        >
          <span className="pl-eyebrow">Следующая тема</span>
          <span className="text-[15px] font-[800] text-white">{nextTopic.topic.title}</span>
        </Link>
      </nav>
    </div>
  );
}
