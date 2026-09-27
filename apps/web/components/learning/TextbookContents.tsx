"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import type {TextbookContentsItem} from "../../lib/learning/textbook-outline";
import {schoolGrades} from "../../lib/learning/textbook-index";
import {lessonDraftExportCodecs,readLessonDraft} from "../../lib/learning/lesson-draft";
import {classifyTextbookCheck,type TextbookCheckState} from "../../lib/learning/textbook-check-state";
import styles from "./TextbookContents.module.css";
const actionLabels:Record<TextbookCheckState,string>={untouched:"Открыть",draft:"Продолжить",retry:"Повторить",correct:"Вернуться",updated:"Ответить снова",unavailable:"Открыть"};
const needsReview=(state?:TextbookCheckState)=>state==="retry"||state==="draft"||state==="updated";
const normalize=(text:string)=>text.toLocaleLowerCase("ru").replace(/ё/g,"е");
const topicCountLabel=(count:number)=>`${count} ${count%10===1&&count%100!==11?"тема":[2,3,4].includes(count%10)&&![12,13,14].includes(count%100)?"темы":"тем"}`;
export function TextbookContents({items,initialGrade,schoolCheckGrades}:{items:TextbookContentsItem[];initialGrade:number|null;schoolCheckGrades:readonly number[]}){
  const [states,setStates]=useState<Record<string,TextbookCheckState>|null>(null);
  const [reviewOnly,setReviewOnly]=useState(false);
  const [grade,setGrade]=useState<number|null>(initialGrade);
  const [query,setQuery]=useState("");
  useEffect(()=>setGrade(initialGrade),[initialGrade]);
  useEffect(()=>{
    const readGrade=()=>{
      const values=new URLSearchParams(window.location.search).getAll("grade");
      setGrade(values.length===1?schoolGrades.find(candidate=>String(candidate)===values[0])??null:null);
    };
    window.addEventListener("popstate",readGrade);
    return()=>window.removeEventListener("popstate",readGrade);
  },[]);
  function chooseGrade(nextGrade:number|null){
    setGrade(nextGrade);
    const url=new URL(window.location.href);
    if(nextGrade===null)url.searchParams.delete("grade");else url.searchParams.set("grade",String(nextGrade));
    if(url.href!==window.location.href)window.history.pushState(window.history.state,"",url);
  }
  useEffect(()=>{
    const codecsByKey=new Map(lessonDraftExportCodecs.map(codec=>[codec.key,codec] as const));
    const targets=items.flatMap(item=>item.check?[{id:item.id,check:item.check,codec:codecsByKey.get(`physicslab-lesson-draft-textbook-check-${item.id}`)}]:[]);
    const targetsByKey=new Map<string,(typeof targets)[number]>();
    for(const target of targets)if(target.codec)targetsByKey.set(target.codec.key,target);
    const readState=(target:(typeof targets)[number]):TextbookCheckState=>{
      if(!target.codec)return "unavailable";
      const result=readLessonDraft(target.codec);
      return result.ok?classifyTextbookCheck(target.check,result.value):result.reason==="empty"?"untouched":"unavailable";
    };
    const refresh=()=>{
      const next:Record<string,TextbookCheckState>={};
      for(const target of targets)next[target.id]=readState(target);
      setStates(previous=>previous&&Object.keys(previous).length===targets.length&&targets.every(target=>previous[target.id]===next[target.id])?previous:next);
    };
    const onStorage=(event:StorageEvent)=>{
      if(event.storageArea){
        try{if(event.storageArea!==window.localStorage)return;}catch{return;}
      }
      if(event.key===null){refresh();return;}
      const target=targetsByKey.get(event.key);
      if(!target)return;
      const next=readState(target);
      setStates(previous=>previous&&previous[target.id]!==next?{...previous,[target.id]:next}:previous);
    };
    refresh();window.addEventListener("storage",onStorage);window.addEventListener("pageshow",refresh);
    return()=>{window.removeEventListener("storage",onStorage);window.removeEventListener("pageshow",refresh);};
  },[items]);
  const count=states?Object.values(states).filter(needsReview).length:0;
  const {itemNumber,grades,totalsByGrade}=useMemo(()=>{
    const itemNumber=new Map<string,number>();
    const totalsByGrade=new Map<number,number>();
    for(const item of items){
      const nextNumber=(totalsByGrade.get(item.grade)??0)+1;
      totalsByGrade.set(item.grade,nextNumber);
      if(!itemNumber.has(item.id)) itemNumber.set(item.id,nextNumber);
    }
    const grades=[...totalsByGrade.keys()].sort((a,b)=>a-b);
    return {itemNumber,grades,totalsByGrade};
  },[items]);
  const normalizedQuery=normalize(query.trim());
  const shown=items.filter(item=>(grade===null||item.grade===grade)&&(!reviewOnly||(item.check&&needsReview(states?.[item.id])))&&normalize(`${item.title} ${item.unit} ${item.question}`).includes(normalizedQuery));
  const groups=Array.from(new Set(shown.map(item=>item.grade))).sort((a,b)=>a-b).map(groupGrade=>({
    grade:groupGrade,
    items:shown.filter(item=>item.grade===groupGrade),
    total:totalsByGrade.get(groupGrade)??0,
  })).map(group=>({
    ...group,
    units:Array.from(new Set(group.items.map(item=>item.unit))).map(unit=>({
      title:unit,
      items:group.items.filter(item=>item.unit===unit),
    })),
  }));
  return <>
    <div className={styles.toolbar}>
      <label className={styles.search}><span className="sr-only">Найти тему</span><input type="search" placeholder="Найти тему" value={query} onChange={event=>setQuery(event.target.value)}/></label>
      <div className={styles.filters} role="group" aria-label="Класс"><button aria-pressed={grade===null} onClick={()=>chooseGrade(null)}>Все классы</button>{grades.map(value=><button key={value} aria-pressed={grade===value} onClick={()=>chooseGrade(value)}>{value} класс</button>)}</div>
      {(count>0||reviewOnly)&&<button className={styles.review} aria-pressed={reviewOnly} disabled={!states} onClick={()=>setReviewOnly(!reviewOnly)}>Повторить{states?` · ${count}`:""}</button>}
    </div>
    {states&&Object.values(states).includes("unavailable")&&<p role="alert" className={styles.notice}>Часть ответов не загрузилась. Читать темы по-прежнему можно.</p>}
    <p role="status" aria-atomic="true" className={styles.resultsStatus}>{shown.length===0
      ? reviewOnly?"Нет тем для повторения с этими фильтрами.":"Тема не найдена. Попробуй другое название."
      : `Найдено: ${topicCountLabel(shown.length)}.`}</p>
    {groups.map((group,index)=><section key={group.grade} aria-labelledby={`grade-${index}`} className={styles.group}>
      <div className={styles.groupHeading}><h2 id={`grade-${index}`}>{group.grade} класс</h2><p>{group.items.length===group.total?topicCountLabel(group.total):`${group.items.length} из ${topicCountLabel(group.total)}`}</p></div>
      {group.units.map((unit,unitIndex)=><section key={unit.title} className={styles.unit} aria-labelledby={`grade-${group.grade}-unit-${unitIndex}`}>
        <h3 id={`grade-${group.grade}-unit-${unitIndex}`} className={styles.unitHeading}>{unit.title}</h3>
        <ol start={itemNumber.get(unit.items[0].id)}>{unit.items.map(item=>{
          const state=item.check?(states?.[item.id]??"untouched"):"untouched";
          return <li key={item.id} value={itemNumber.get(item.id)}>
            <div className={styles.chapterRow}>
              <span className={styles.number} aria-hidden="true">{itemNumber.get(item.id)}</span>
              <div className={styles.chapterBody}>
                <Link className={styles.chapterLink} href={`${item.href}${item.check&&needsReview(state)?"#self-check":""}`}>
                  <h4>{item.question}</h4>
                  <span className={styles.action}>{actionLabels[state]} <span aria-hidden="true">→</span></span>
                </Link>
                {item.connection&&<Link className={styles.connection} href={item.connection.href}><strong>Дальше:</strong> {item.connection.label} →</Link>}
                <details className={styles.context}><summary>Что пригодится</summary><p>{item.prerequisite}</p>{item.resources.filter(resource=>resource.href!==item.href).map(resource=><Link key={resource.href} href={resource.href}>{resource.label} →</Link>)}</details>
              </div>
            </div>
          </li>;
        })}</ol>
      </section>)}
      {!query.trim()&&!reviewOnly&&schoolCheckGrades.some(value=>value===group.grade)&&<Link className={styles.classCheck} href={`/practice/class-check/${group.grade}`}><span>Проверить доступные темы</span><small>5 задач без таймера</small><span aria-hidden="true">→</span></Link>}
    </section>)}
  </>;
}
