import {BookOpen,Flask,Calculator,ListChecks} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import styles from "./LearningModes.module.css";
const modes=[{title:"Учебник",href:"/learn",icon:BookOpen},{title:"Задачи",href:"/tasks",icon:ListChecks},{title:"Опыты",href:"#experiments",icon:Flask},{title:"Формулы",href:"/formulas",icon:Calculator}];
export function LearningModes(){return <nav className={styles.modes} aria-label="Разделы обучения">{modes.map(({title,href,icon:Icon})=><Link key={title} href={href}><Icon size={27} weight="duotone" aria-hidden="true"/><span>{title}</span><span aria-hidden="true">→</span></Link>)}</nav>;}
