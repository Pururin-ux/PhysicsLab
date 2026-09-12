"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {TextbookChapter} from "../../lib/learning/textbook";
import {lessonDraftExportCodecs,readLessonDraft} from "../../lib/learning/lesson-draft";
import {classifyTextbookCheck,type TextbookCheckState} from "../../lib/learning/textbook-check-state";
import styles from "./TextbookContents.module.css";
const labels:Record<TextbookCheckState,string>={untouched:"",draft:"Продолжить",retry:"Повторить",correct:"Ответ верный",updated:"Новый вопрос",unavailable:"Не удалось загрузить ответ"};
const needsReview=(state?:TextbookCheckState)=>state==="retry"||state==="draft"||state==="updated";
const normalize=(text:string)=>text.toLocaleLowerCase("ru").replace(/ё/g,"е");
export function TextbookContents({chapters}:{chapters:TextbookChapter[]}){
  const [states,setStates]=useState<Record<string,TextbookCheckState>|null>(null);
  const [reviewOnly,setReviewOnly]=useState(false);
  const [grade,setGrade]=useState<number|null>(null);
  const [query,setQuery]=useState("");
  useEffect(()=>{
    const refresh=()=>setStates(Object.fromEntries(chapters.map(chapter=>{
      const codec=lessonDraftExportCodecs.find(item=>item.key===`physicslab-lesson-draft-textbook-check-${chapter.id}`);
      if(!codec)return [chapter.id,"unavailable"];
      const result=readLessonDraft(codec);
      return [chapter.id,result.ok?classifyTextbookCheck(chapter.check,result.value):result.reason==="empty"?"untouched":"unavailable"];
    })));
    refresh();window.addEventListener("storage",refresh);window.addEventListener("focus",refresh);window.addEventListener("pageshow",refresh);
    return()=>{window.removeEventListener("storage",refresh);window.removeEventListener("focus",refresh);window.removeEventListener("pageshow",refresh);};
  },[chapters]);
  const count=states?Object.values(states).filter(needsReview).length:0;
  const shown=chapters.filter(chapter=>(grade===null||chapter.grade===grade)&&(!reviewOnly||needsReview(states?.[chapter.id]))&&normalize(`${chapter.title} ${chapter.unit} ${chapter.lead}`).includes(normalize(query.trim())));
  const groups=Array.from(new Set(shown.map(chapter=>`${chapter.grade}|${chapter.unit??"Основы движения"}`))).map(key=>{
    const [grade,unit]=key.split("|");return {grade:Number(grade),unit,chapters:shown.filter(chapter=>chapter.grade===Number(grade)&&(chapter.unit??"Основы движения")===unit)};
  }).sort((a,b)=>a.grade-b.grade);
  return <>
    <div className={styles.toolbar}>
      <label className={styles.search}><span className="sr-only">Найти тему</span><input type="search" placeholder="Найти тему" value={query} onChange={event=>setQuery(event.target.value)}/></label>
      <div className={styles.filters} role="group" aria-label="Класс"><button aria-pressed={grade===null} onClick={()=>setGrade(null)}>Все классы</button>{[...new Set(chapters.map(chapter=>chapter.grade))].sort((a,b)=>a-b).map(value=><button key={value} aria-pressed={grade===value} onClick={()=>setGrade(value)}>{value} класс</button>)}</div>
      <button className={styles.review} aria-pressed={reviewOnly} disabled={!states} onClick={()=>setReviewOnly(!reviewOnly)}>Повторить{states?` · ${count}`:""}</button>
    </div>
    {states&&Object.values(states).includes("unavailable")&&<p role="alert" className={styles.notice}>Часть ответов не загрузилась. Читать темы по-прежнему можно.</p>}
    {shown.length===0&&<p role="status" className={styles.empty}>{reviewOnly?"Нет тем для повторения с этими фильтрами.":"Тема не найдена. Попробуй другое название."}</p>}
    {groups.map((group,index)=><section key={`${group.grade}-${group.unit}`} aria-labelledby={`unit-${index}`} className={styles.group}><p>{group.grade} класс</p><h2 id={`unit-${index}`}>{group.unit}</h2><ol>{group.chapters.map(chapter=><li key={chapter.id}><Link href={`/learn/${chapter.id}${reviewOnly?"#self-check":""}`}><h3>{chapter.title}</h3>{states&&labels[states[chapter.id]]&&<span className={styles.state}>{labels[states[chapter.id]]}</span>}<span aria-hidden="true" className={styles.arrow}>→</span></Link></li>)}</ol></section>)}
  </>;
}
