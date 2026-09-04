"use client";

import {
  ArrowRight,
  Books,
  GraduationCap,
  ListChecks,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import {
  CONTEXTUAL_TOOLS,
  getProductDestination,
  PRODUCT_DESTINATIONS,
} from "../../lib/product-routes";
import { useHomeLearningState } from "../landing/HomeLearningState";
import { MathText } from "../ui/MathText";
import styles from "./HomeEditorial.module.css";

const learnDestination = getProductDestination("learn");
const examDestination = getProductDestination("exam");
const taskTool = CONTEXTUAL_TOOLS.find((tool) => tool.id === "tasks")!;
const heroArt = "/art/production/hero-night-study-ultrawide-v3.webp";

const homeActions = [
  {
    id: "learn",
    href: learnDestination.href,
    label: "Выбрать тему",
    description: "Разобраться в теме",
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
    id: "exam",
    href: examDestination.href,
    label: "Подготовиться к ЦТ/ЦЭ",
    description: "10 задач по 5 темам",
    icon: GraduationCap,
  },
] as const;

export function HomeEditorial() {
  const learningState = useHomeLearningState();

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        data-theme-preserve="dark"
        aria-labelledby="home-title"
      >
        <div
          className={styles.heroScene}
          data-art-id="home-night-study"
          data-art-source={heroArt}
          data-art-viewport-policy="single-source-crop"
          aria-hidden="true"
        >
          <Image
            src={heroArt}
            alt=""
            fill
            priority
            unoptimized
            quality={92}
            sizes="100vw"
            className={styles.heroArt}
          />
          <div className={styles.heroShade} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {learningState.hasActivity ? "С возвращением" : "PhysicsLab"}
            </p>
            {learningState.hasActivity ? (
              <>
                <h1 id="home-title">Продолжим?</h1>
                <p className={styles.heroLead}>
                  Вернись к теме, задаче или подготовке с того места, где тебе удобно.
                </p>
                <aside
                  className={styles.todayStep}
                  data-tone={learningState.nextStep.tone}
                  aria-label="Следующее действие"
                >
                  <div className={styles.todayCopy}>
                    <p>{learningState.nextStep.label}</p>
                    <h2>{learningState.nextStep.title}</h2>
                    <span><MathText text={learningState.nextStep.body} /></span>
                  </div>
                  <Link href={learningState.nextStep.href}>
                    {learningState.nextStep.cta}
                    <ArrowRight size={18} weight="bold" aria-hidden="true" />
                  </Link>
                </aside>
              </>
            ) : (
              <>
                <h1 id="home-title">
                  Физика. Без ощущения, что ты должен был уже всё понять.
                </h1>
                <p className={styles.heroLead}>
                  Принёс задачу — найдём похожую. Не понял тему — разберём.
                  Скоро ЦТ/ЦЭ — посмотрим, что уже держится.
                </p>
              </>
            )}

            <nav className={styles.quickActions} aria-label="С чего начать">
              {homeActions.map(({ id, href, label, description, icon: Icon }) => (
                <Link key={id} href={href} data-action={id}>
                  <Icon size={22} weight="duotone" aria-hidden="true" />
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowRight size={17} weight="bold" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            {!learningState.hasActivity ? (
              <Link className={styles.diagnosticLink} href="/practice/diagnostic">
                Не знаешь, с чего начать? Попробуй 10 задач без таймера
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className={styles.tools} aria-labelledby="tools-title">
        <header className={styles.toolsHeading}>
          <p className={styles.eyebrow}>
            {learningState.hasActivity ? "Быстрый доступ" : "Если уже знаешь, что ищешь"}
          </p>
          <h2 id="tools-title">
            {learningState.hasActivity ? "Вернуться к нужному" : "Формулы, задачи и ошибки"}
          </h2>
        </header>

        <div className={styles.toolList}>
          {CONTEXTUAL_TOOLS.map((tool) => (
            <Link key={tool.id} className={styles.toolLink} href={tool.href}>
              <span>
                <strong>{tool.label}</strong>
                <small>{tool.description}</small>
              </span>
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          ))}
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
