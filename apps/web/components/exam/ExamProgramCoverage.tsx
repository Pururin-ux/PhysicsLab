import {ArrowRight,ArrowSquareOut} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import {EXAM_PROGRAM_SOURCE,type CoverageSection} from "../../lib/learning/coverage";
import styles from "./ExamProgramCoverage.module.css";

export function ExamProgramCoverage({coverage}:{coverage:readonly CoverageSection[]}){
  return <div className={styles.page}>
    <header><p className={styles.eyebrow}>ЦТ/ЦЭ</p><h1>Темы для подготовки</h1><p className={styles.lead}>Посмотри, какие части программы уже можно тренировать в PhysicsLab.</p></header>
    <ol className={styles.sections} aria-label="Разделы спецификации по физике">{coverage.map(section=><li key={section.id}>
      <h2>{section.title}</h2><p className={styles.weight}>{section.officialTaskCount} из 30 заданий в полном варианте</p>
      {section.catalogDestinations.length>0?<>
        <p className={styles.description}>{section.summary}</p>
        <div className={styles.links} aria-label={`Доступные тренировки: ${section.title}`}>{section.catalogDestinations.map(destination=><Link key={destination.id} href={destination.href}>{destination.label}<ArrowRight size={18} aria-hidden="true"/></Link>)}</div>
        <details className={styles.details}><summary>Что ещё нужно изучить?</summary><ul>{section.knownGaps.map(gap=><li key={gap}>{gap}</li>)}</ul></details>
      </>:<><p className={styles.description}>В PhysicsLab пока нет задач этого раздела.</p><details className={styles.details}><summary>Что входит в раздел?</summary><ul>{section.knownGaps.map(gap=><li key={gap}>{gap}</li>)}</ul></details></>}
    </li>)}</ol>
    <aside className={styles.source}><p>Сверено с официальной спецификацией РИКЗ на 2026 год. Полный вариант содержит 30 заданий; PhysicsLab пока покрывает только отдельные типы.</p><a href={EXAM_PROGRAM_SOURCE.url} target="_blank" rel="noreferrer">Официальная спецификация ЦЭ/ЦТ 2026<ArrowSquareOut size={16} aria-hidden="true"/></a></aside>
    <nav className={styles.actions} aria-label="Продолжить подготовку"><Link href="/practice/exam-demo">Проверить себя: 10 задач<ArrowRight size={18} aria-hidden="true"/></Link><Link href="/tasks">Все задачи</Link></nav>
  </div>;
}
