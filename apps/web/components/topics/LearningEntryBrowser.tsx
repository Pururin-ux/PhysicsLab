"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { learningGroupDefinitions, type LearningEntry } from "../../lib/learning/learning-entry";
import { schoolGrades, type SchoolGrade } from "../../lib/learning/textbook";
import styles from "./LearningEntryBrowser.module.css";

const normalize = (text: string) => text.toLocaleLowerCase("ru").replace(/ё/g, "е");

export function LearningEntryBrowser({ entries }: { entries: LearningEntry[] }) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState<SchoolGrade | null>(null);
  useEffect(() => {
    const readFilters = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      const value = Number(params.get("grade"));
      setGrade(schoolGrades.includes(value as SchoolGrade) ? value as SchoolGrade : null);
    };
    readFilters();
    window.addEventListener("popstate", readFilters);
    return () => window.removeEventListener("popstate", readFilters);
  }, []);
  function chooseFilters(nextQuery: string, nextGrade: SchoolGrade | null) {
    setQuery(nextQuery);
    setGrade(nextGrade);
    const url = new URL(window.location.href);
    if (nextQuery) url.searchParams.set("q", nextQuery); else url.searchParams.delete("q");
    if (nextGrade) url.searchParams.set("grade", String(nextGrade)); else url.searchParams.delete("grade");
    url.hash = "";
    window.history.replaceState(window.history.state, "", url);
  }
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const shown = entries.filter(entry => (grade === null || entry.grade === grade) && words.every(word => normalize(`${entry.title} ${entry.question} ${entry.keywords ?? ""} ${entry.resources.map(resource => resource.label).join(" ")}`).includes(word)));
  return <div className={styles.browser}>
    <div className={styles.searchArea}>
      <label htmlFor="learning-search">Найти тему или вопрос</label>
      <div className={styles.searchBox}><input id="learning-search" type="search" placeholder="Например, плотность или график скорости" value={query} onChange={event => chooseFilters(event.target.value, grade)} />{query && <button onClick={() => chooseFilters("", grade)}>Очистить</button>}</div>
      <div className={styles.filters} role="group" aria-label="Класс материала">
        <button aria-pressed={grade === null} onClick={() => chooseFilters(query, null)}>Все материалы</button>
        {schoolGrades.map(value => <button key={value} aria-pressed={grade === value} onClick={() => chooseFilters(query, value)}>{value} класс</button>)}
        <span role="status">{shown.length} из {entries.length} тем</span>
      </div>
      <nav className={styles.shortcuts} aria-label="Открыть напрямую"><Link href="/learn">Учебник →</Link><Link href="/tasks">Все задачи →</Link><Link href="/formulas">Формулы →</Link></nav>
    </div>
    <div className={styles.layout}>
      <nav className={styles.groupChips} aria-label="Классы">
        {learningGroupDefinitions.filter(group => shown.some(entry => entry.group === group.id)).map(group => (
          <a key={group.id} href={`#learning-group-${group.id}`} className={styles.groupChip}>
            {group.label}
            <span>{shown.filter(entry => entry.group === group.id).length}</span>
          </a>
        ))}
      </nav>
      <div>
        {shown.length === 0 && <div className={styles.empty}><h2>По этому запросу темы не нашлись</h2><p>Попробуй более короткое название{grade ? " или другой класс" : ""}. В банке задач есть и другие вопросы.</p><button onClick={() => chooseFilters("", null)}>Показать все материалы</button><Link href={`/tasks?q=${encodeURIComponent(query)}`}>Поискать в задачах →</Link></div>}
        {learningGroupDefinitions.map(group => {
          const items = shown.filter(entry => entry.group === group.id);
          if (!items.length) return null;
          return <section key={group.id} id={`learning-group-${group.id}`} className={styles.group}>
            <header><p>{group.label}</p></header>
            {items.map(entry => <article key={entry.id} id={`topic-${entry.id}`} className={styles.entry}>
              <div className={styles.question}><h2>{entry.question}</h2></div>
              <div className={styles.materials}>
                <div className={styles.actions}>
                  <nav aria-label={`Материалы к вопросу: ${entry.question}`}>{entry.resources.map((resource, resourceIndex) => <Link key={resource.href} href={resource.href}>{resourceIndex === 0 ? (resource.href.startsWith("/tasks") ? resource.label : "Разобраться") : resource.label}{resourceIndex === 0 && <span aria-hidden="true">→</span>}</Link>)}</nav>
                  <details className={styles.context}><summary>Что нужно знать</summary><p>{entry.prerequisite}</p>{entry.coverage && <p>{entry.coverage}</p>}</details>
                </div>
                {entry.connection && <div className={styles.nextStep}><span>Дальше</span><Link href={entry.connection.href}>{entry.connection.label}<span aria-hidden="true"> →</span></Link></div>}
              </div>
            </article>)}
          </section>;
        })}
      </div>
    </div>
    <footer className={styles.footer}>
      <h2>Нужен другой вопрос?</h2>
      <p>Не все школьные темы уже есть в учебнике. Если нужного параграфа нет, поищи задачу с разбором.</p>
      <nav aria-label="Другие материалы"><Link href="/tasks">Все задачи →</Link><Link href="/formulas">Формулы →</Link><Link href="/practice/exam-demo">Подготовка к ЦТ/ЦЭ →</Link><Link href="/profile/notebook">Мой блокнот →</Link><Link href="/mistakes">Мои ошибки →</Link></nav>
    </footer>
  </div>;
}
