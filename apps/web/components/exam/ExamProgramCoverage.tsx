import {ArrowRight,ArrowSquareOut} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import {EXAM_PROGRAM_SOURCE,type CoverageSection} from "../../lib/learning/coverage";
import styles from "./ExamProgramCoverage.module.css";

export function ExamProgramCoverage({coverage}:{coverage:readonly CoverageSection[]}){
  return <div className={styles.page}>
    <header><p className={styles.eyebrow}>ЦТ/ЦЭ</p><h1>Темы для подготовки</h1><p className={styles.lead}>Выбери тему и решай задачи в своём темпе.</p></header>
    <ol className={styles.sections} aria-label="Разделы программы по физике">{coverage.map(section=><li key={section.id}>
      <h2>{section.title}</h2>
      {section.catalogDestinations.length>0?<>
        <p className={styles.description}>{section.summary}</p>
        <div className={styles.links} aria-label={`Доступные тренировки: ${section.title}`}>{section.catalogDestinations.map(destination=><Link key={destination.topicId} href={destination.href}>{destination.label}<ArrowRight size={18} aria-hidden="true"/></Link>)}</div>
        <details className={styles.details}><summary>Каких тем ещё нет?</summary><ul>{section.knownGaps.map(gap=><li key={gap}>{gap}</li>)}</ul></details>
      </>:<p className={styles.description}>Задачи появятся позже.</p>}
    </li>)}</ol>
    <aside className={styles.source}><p>Здесь есть задачи по отдельным темам. Для полной подготовки занимайся также по школьному учебнику и программе экзамена.</p><a href={EXAM_PROGRAM_SOURCE.url} target="_blank" rel="noreferrer">Программа экзамена · 2026<ArrowSquareOut size={16} aria-hidden="true"/></a></aside>
    <nav className={styles.actions} aria-label="Продолжить подготовку"><Link href="/practice/exam-demo">Проверить себя: 10 задач<ArrowRight size={18} aria-hidden="true"/></Link><Link href="/tasks">Все задачи</Link></nav>
  </div>;
}
