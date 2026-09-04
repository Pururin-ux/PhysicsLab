import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { topics } from "../../lib/topics";

const topicArt = {
  kinematics: "/art/production/topic-kinematics-cozy.webp",
  dynamics: "/art/production/topic-dynamics.webp",
  electrodynamics: "/art/production/topic-electricity.webp",
  thermodynamics: "/art/production/topic-thermodynamics-clean-v2.webp",
  optics: "/art/production/topic-optics.webp",
} as const;

// Порядок соответствует крупным разделам школьной программы. Визуальный вес
// у разделов одинаковый: без данных о прогрессе каталог не назначает ученику
// «главную» тему от себя.
const topicOrder = [
  "kinematics",
  "dynamics",
  "thermodynamics",
  "electrodynamics",
  "optics",
] as const;

const topicPresentation = {
  kinematics: {
    accent: "var(--topic-kinematics-accent)",
    label: "var(--topic-kinematics-label)",
    imagePosition: "object-[58%_center]",
  },
  dynamics: {
    accent: "var(--topic-dynamics-accent)",
    label: "var(--topic-dynamics-label)",
    imagePosition: "object-center",
  },
  thermodynamics: {
    accent: "var(--topic-thermodynamics-accent)",
    label: "var(--topic-thermodynamics-label)",
    imagePosition: "object-center",
  },
  electrodynamics: {
    accent: "var(--topic-electrodynamics-accent)",
    label: "var(--topic-electrodynamics-label)",
    imagePosition: "object-center",
  },
  optics: {
    accent: "var(--topic-optics-accent)",
    label: "var(--topic-optics-label)",
    imagePosition: "object-center",
  },
} as const;

const orderedTopics = topicOrder.map(
  (id) => topics.find((topic) => topic.id === id)!,
);

function TopicActions({
  learnHref,
  learnLabel = "Разобрать тему",
  practiceHref,
  topicTitle,
}: {
  learnHref: string;
  learnLabel?: string;
  practiceHref: string;
  topicTitle: string;
}) {
  const shared =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-4 text-[13px] font-[800] transition-[background-color,border-color,color,transform] duration-150 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-deep)]";

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
      <Link
        href={learnHref}
        aria-label={`${learnLabel} «${topicTitle}»`}
        className={`${shared} bg-[var(--action-primary)] text-[var(--action-ink)] hover:bg-[var(--action-hover)] sm:min-w-[158px]`}
      >
        <span>{learnLabel}</span>
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </Link>
      <Link
        href={practiceHref}
        aria-label={`Решать задачи по теме «${topicTitle}»`}
        className={`${shared} border border-[var(--border-strong)] bg-[var(--surface-panel)] text-[var(--text-strong)] hover:border-[var(--mode-learn-accent)] hover:bg-[var(--surface-hover)] sm:min-w-[158px]`}
      >
        <span>Решать задачи</span>
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function TopicCards() {
  return (
    <section aria-label="Темы физики">
      <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-strong)]">
        {orderedTopics.map((topic) => {
          const presentation = topicPresentation[topic.id];

          return (
            <li key={topic.id} id={topic.id} className="scroll-mt-28">
              <article className="group grid grid-cols-[84px_minmax(0,1fr)] gap-x-4 gap-y-4 py-5 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-x-6 sm:py-6 lg:grid-cols-[144px_minmax(0,1fr)_auto] lg:items-center lg:gap-x-8">
                <div className="relative h-[84px] overflow-hidden rounded-[8px] bg-[var(--surface-panel-raised)] ring-1 ring-[var(--border-subtle)] sm:h-[96px] lg:h-[104px]">
                  <Image
                    src={topicArt[topic.id]}
                    alt=""
                    fill
                    loading="eager"
                    quality={90}
                    sizes="(max-width: 639px) 84px, (max-width: 1023px) 112px, 144px"
                    className={`object-cover saturate-[.84] transition-[filter,transform] duration-500 group-hover:scale-[1.035] group-hover:saturate-100 ${presentation.imagePosition}`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: presentation.accent }}
                  />
                </div>

                <div className="min-w-0 self-center">
                  <p
                    className="text-[10px] font-[800] uppercase tracking-[.15em]"
                    style={{ color: presentation.label }}
                  >
                    {topic.modeLabel}
                  </p>
                  <h2 className="mt-1.5 text-[21px] font-[830] leading-[1.08] tracking-[-.03em] text-[var(--text-strong)] sm:text-[26px]">
                    {topic.title}
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--text-default)] sm:max-w-[58ch] sm:text-[14px]">
                    {topic.description}
                  </p>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <TopicActions
                    learnHref={topic.learnHref}
                    learnLabel={"learnLabel" in topic ? topic.learnLabel : undefined}
                    practiceHref={topic.practiceHref}
                    topicTitle={topic.title}
                  />
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
