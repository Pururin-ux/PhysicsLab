"use client";

import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useHomeLearningState } from "../landing/HomeLearningState";
import styles from "./HomeEditorial.module.css";

export function HomeActivity({ children }: { children: ReactNode }) {
  const learningState = useHomeLearningState();

  return <>
    <p className={styles.eyebrow}>
      {learningState.hasActivity ? "С возвращением" : "PhysicsLab"}
    </p>
    {children}
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
  </>;
}
