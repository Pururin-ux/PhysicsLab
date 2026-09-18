"use client";

import {
  ArrowRight,
  BookOpenText,
  Books,
  ChartLineUp,
  ListChecks,
  Notebook,
  GraduationCap,
  Lightbulb,
  Atom,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import {
  CONTEXTUAL_TOOLS,
  PRODUCT_DESTINATIONS,
} from "../../lib/product-routes";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import { useHomeLearningState } from "../landing/HomeLearningState";
import styles from "./HomeEditorial.module.css";

const taskTool = CONTEXTUAL_TOOLS.find((tool) => tool.id === "tasks")!;
const heroArt = MIO_PORTRAITS.thinking.src;

// Вечерняя лаборатория — утверждённый прод-арт (общий фон сцены).
const heroSceneArt = "/art/production/hero-night-study-ultrawide-v3.webp";

const toolIcons = {
  notebook: Notebook,
  formulas: Atom,
  tasks: ListChecks,
  mistakes: ChartLineUp,
} as const;

const homeActions = [
  {
    id: "learn",
    href: "/learn/path-and-displacement",
    label: "Начать с движения",
    description: "9 класс · Путь, перемещение и средняя скорость",
    icon: Books,
  },
  {
    id: "tasks",
    href: taskTool.href,
    label: "Решить задачу",
    description: "Найти похожий тип",
    icon: ListChecks,
  },
  {
    id: "diagnostic",
    href: "/practice/diagnostic",
    label: "Понять, с чего начать",
    description: "10 задач без таймера",
    icon: GraduationCap,
  },
] as const;

export function HomeEditorial() {
  const learningState = useHomeLearningState();

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        aria-labelledby="home-title"
      >
        {/* Фон сцены: вечерняя лаборатория, мягко размытая и утопленная
            в темноту — глубина без конкуренции с текстом. */}
        <div className={styles.heroBackdrop} aria-hidden="true">
          <Image
            src={heroSceneArt}
            alt=""
            fill
            priority
            quality={75}
            sizes="100vw"
            className={styles.heroBackdropArt}
          />
          <span className={styles.heroLampGlow} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {learningState.hasActivity ? "С возвращением" : "PhysicsLab"}
            </p>
            <h1 id="home-title">Физика с Мио</h1>
            <p className={styles.heroLead}>
              Уроки, опыты и задачи — в одном месте.
            </p>

            <div className={styles.rise}>
              {learningState.hasActivity && (
                <aside
                  className={styles.todayStep}
                  data-tone={learningState.nextStep.tone}
                  aria-label="Твоя работа"
                >
                  <div className={styles.todayCopy}>
                    <p>{learningState.nextStep.label}</p>
                    <h2>{learningState.nextStep.title}</h2>
                    {learningState.quizResume || learningState.lessonResume ? (
                      <p className={styles.resumeDetail}>{learningState.nextStep.body}</p>
                    ) : null}
                  </div>
                  <Link href={learningState.nextStep.href}>
                    {learningState.nextStep.cta}
                    <ArrowRight size={18} weight="bold" aria-hidden="true" />
                  </Link>
                  {learningState.lessonResumes.filter(lesson => lesson.href !== learningState.nextStep.href).map(lesson => (
                    <Link key={lesson.href} className={styles.secondaryResume} href={lesson.href}>
                      {lesson.title}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  ))}
                </aside>
              )}

              <nav className={styles.quickActions} aria-label="С чего начать">
                {homeActions.map(({ id, href, label, description, icon: Icon }) => (
                  <Link key={id} href={href} data-action={id} className={styles.actionCard}>
                    <span className={styles.actionIcon}>
                      <Icon size={22} weight="duotone" aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <ArrowRight size={17} weight="bold" aria-hidden="true" className={styles.actionArrow} />
                  </Link>
                ))}
              </nav>

              <Link className={styles.diagnosticLink} href="/topics">
                Выбрать другую тему
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Мио на переднем плане: вырезанный портрет с тёплым светом
              позади, чтобы персонаж «стоял» в сцене, а не висел. */}
          <div
            className={styles.heroScene}
            data-art-id="home-mio"
            data-art-source={heroArt}
            data-art-viewport-policy="single-source-crop"
            aria-hidden="true"
          >
            <span className={styles.heroSceneGlow} />
            <Image
              src={heroArt}
              alt=""
              fill
              priority
              quality={92}
              sizes="(max-width:700px) 110px, 440px"
              className={styles.heroArt}
            />
          </div>
        </div>
      </section>

      <section className={styles.tools} aria-labelledby="tools-title">
        <header className={styles.toolsHeading}>
          <p className={styles.eyebrow}>
            <Lightbulb size={14} weight="duotone" aria-hidden="true" />
            Под рукой
          </p>
          <h2 id="tools-title">
            Справочник и записи
          </h2>
          <p className={styles.toolsNote}>
            Всё, что нужно рядом с уроком: формулы, разборы и твои заметки.
          </p>
        </header>

        <div className={`${styles.toolList} rise-seq`}>
          {CONTEXTUAL_TOOLS.map((tool) => {
            const Icon = toolIcons[tool.id as keyof typeof toolIcons] ?? BookOpenText;
            return (
              <Link key={tool.id} className={styles.toolLink} href={tool.href}>
                <span className={styles.toolIcon}>
                  <Icon size={20} weight="duotone" aria-hidden="true" />
                </span>
                <span>
                  <strong>{tool.label}</strong>
                  <small>{tool.description}</small>
                </span>
                <ArrowRight size={18} weight="bold" aria-hidden="true" className={styles.actionArrow} />
              </Link>
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Physics<span>Lab</span></p>
        <nav aria-label="Разделы PhysicsLab">
          {PRODUCT_DESTINATIONS.map((destination) => (
            <Link key={destination.id} href={destination.href}>{destination.label}</Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
