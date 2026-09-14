"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {TextbookChapter} from "../../lib/learning/textbook";
import type {LearningEntry} from "../../lib/learning/learning-entry";
import {lessonDraftExportCodecs,readLessonDraft} from "../../lib/learning/lesson-draft";
import {classifyTextbookCheck,type TextbookCheckState} from "../../lib/learning/textbook-check-state";
import {getSchoolCheckByGrade} from "../../lib/learning/school-checks";
import styles from "./TextbookContents.module.css";
const actionLabels:Record<TextbookCheckState,string>={untouched:"Открыть",draft:"Продолжить",retry:"Повторить",correct:"Вернуться",updated:"Ответить снова",unavailable:"Открыть"};
const needsReview=(state?:TextbookCheckState)=>state==="retry"||state==="draft"||state==="updated";
const normalize=(text:string)=>text.toLocaleLowerCase("ru").replace(/ё/g,"е");
const topicCountLabel=(count:number)=>`${count} ${count%10===1&&count%100!==11?"тема":[2,3,4].includes(count%10)&&![12,13,14].includes(count%100)?"темы":"тем"}`;
type OutlineItem={
  id:string;grade:number;unit:string;title:string;question:string;prerequisite:string;
  href:string;resources:LearningEntry["resources"];connection?:LearningEntry["connection"];
  chapter?:TextbookChapter;
};
export function TextbookContents({chapters,entries}:{chapters:TextbookChapter[];entries:LearningEntry[]}){
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
  const chapterIds=new Set(chapters.map(chapter=>chapter.id));
  const outline:OutlineItem[]=[
    ...chapters.map(chapter=>{
      const entry=entries.find(item=>item.id===chapter.id);
      return {id:chapter.id,grade:chapter.grade,unit:chapter.unit??"Основы движения",title:chapter.title,question:entry?.question??chapter.title,prerequisite:chapter.prerequisite,href:`/learn/${chapter.id}`,resources:entry?.resources??[],connection:entry?.connection,chapter};
    }),
    ...entries.filter((entry):entry is LearningEntry&{grade:number}=>entry.grade!==undefined&&!chapterIds.has(entry.id)&&entry.resources.length>0).map(entry=>({id:entry.id,grade:entry.grade,unit:entry.unit??entry.group,title:entry.title,question:entry.question,prerequisite:entry.prerequisite,href:entry.resources[0].href,resources:entry.resources,connection:entry.connection})),
  ];
  const shown=outline.filter(item=>(grade===null||item.grade===grade)&&(!reviewOnly||(item.chapter&&needsReview(states?.[item.id])))&&normalize(`${item.title} ${item.unit} ${item.question}`).includes(normalize(query.trim())));
  const groups=Array.from(new Set(shown.map(item=>item.grade))).sort((a,b)=>a-b).map(groupGrade=>({
    grade:groupGrade,
    items:shown.filter(item=>item.grade===groupGrade),
    total:outline.filter(item=>item.grade===groupGrade).length,
  })).map(group=>({
    ...group,
    units:Array.from(new Set(group.items.map(item=>item.unit))).map(unit=>({
      title:unit,
      items:group.items.filter(item=>item.unit===unit),
    })),
  }));
  const itemNumber=new Map(outline.map(item=>[
    item.id,
    outline.filter(candidate=>candidate.grade===item.grade).findIndex(candidate=>candidate.id===item.id)+1,
  ]));
  return <>
    <div className={styles.toolbar}>
      <label className={styles.search}><span className="sr-only">Найти тему</span><input type="search" placeholder="Найти тему" value={query} onChange={event=>setQuery(event.target.value)}/></label>
      <div className={styles.filters} role="group" aria-label="Класс"><button aria-pressed={grade===null} onClick={()=>setGrade(null)}>Все классы</button>{[...new Set(outline.map(item=>item.grade))].sort((a,b)=>a-b).map(value=><button key={value} aria-pressed={grade===value} onClick={()=>setGrade(value)}>{value} класс</button>)}</div>
      {(count>0||reviewOnly)&&<button className={styles.review} aria-pressed={reviewOnly} disabled={!states} onClick={()=>setReviewOnly(!reviewOnly)}>Повторить{states?` · ${count}`:""}</button>}
    </div>
    {states&&Object.values(states).includes("unavailable")&&<p role="alert" className={styles.notice}>Часть ответов не загрузилась. Читать темы по-прежнему можно.</p>}
    {shown.length===0&&<p role="status" className={styles.empty}>{reviewOnly?"Нет тем для повторения с этими фильтрами.":"Тема не найдена. Попробуй другое название."}</p>}
    {groups.map((group,index)=><section key={group.grade} aria-labelledby={`grade-${index}`} className={styles.group}>
      <div className={styles.groupHeading}><h2 id={`grade-${index}`}>{group.grade} класс</h2><p>{group.items.length===group.total?topicCountLabel(group.total):`${group.items.length} из ${topicCountLabel(group.total)}`}</p></div>
      {group.units.map((unit,unitIndex)=><section key={unit.title} className={styles.unit} aria-labelledby={`grade-${group.grade}-unit-${unitIndex}`}>
        <h3 id={`grade-${group.grade}-unit-${unitIndex}`} className={styles.unitHeading}>{unit.title}</h3>
        <ol start={itemNumber.get(unit.items[0].id)}>{unit.items.map(item=>{
          const state=item.chapter?(states?.[item.id]??"untouched"):"untouched";
          return <li key={item.id}>
            <div className={styles.chapterRow}>
              <span className={styles.number} aria-hidden="true">{itemNumber.get(item.id)}</span>
              <div className={styles.chapterBody}>
                <Link className={styles.chapterLink} href={`${item.href}${reviewOnly&&item.chapter?"#self-check":""}`}>
                  <h4>{item.question}</h4>
                  <span className={styles.action}>{actionLabels[state]} <span aria-hidden="true">→</span></span>
                </Link>
                <details className={styles.context}><summary>Что пригодится</summary><p>{item.prerequisite}</p>{item.connection&&<Link href={item.connection.href}>{item.connection.label} →</Link>}{item.resources.filter(resource=>resource.href!==item.href).map(resource=><Link key={resource.href} href={resource.href}>{resource.label} →</Link>)}</details>
              </div>
            </div>
          </li>;
        })}</ol>
      </section>)}
      {!query.trim()&&!reviewOnly&&getSchoolCheckByGrade(group.grade)&&<Link className={styles.classCheck} href={`/practice/class-check/${group.grade}`}><span>Проверить доступные темы</span><small>5 задач без таймера</small><span aria-hidden="true">→</span></Link>}
    </section>)}
  </>;
}
