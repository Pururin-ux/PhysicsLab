import {LearningModes} from "../../components/topics/LearningModes";
import Link from "next/link";
export const metadata={title:"Учиться | PhysicsLab"};
const lessons=[{title:"Средняя скорость",note:"Поездка с Мио",href:"/practice/average-speed-lesson"},{title:"Ускорение",note:"График движения",href:"/practice/kinematics-lesson"},{title:"Сила и масса",note:"Движение тележки",href:"/practice/dynamics-lesson"},{title:"Плотность",note:"Масса и объём",href:"/practice/density-lesson"},{title:"Электрическая цепь",note:"Ток и напряжение",href:"/practice/electro-lesson"},{title:"Отражение света",note:"Зеркало и луч",href:"/practice/optics-lesson"}];
export default function TopicsPage(){return <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-7">
  <h1 className="type-h1">Учиться</h1><LearningModes/>
  <section id="experiments" className="scroll-mt-24"><h2 className="type-h2 mb-4">Опыты</h2><ul className="grid gap-x-8 sm:grid-cols-2">{lessons.map(lesson=><li key={lesson.href} className="border-b border-[var(--border-strong)]"><Link href={lesson.href} className="flex min-h-[84px] items-center justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4"><span><h3 className="text-lg font-bold">{lesson.title}</h3><span className="mt-1 block text-sm text-[var(--text-secondary)]">{lesson.note}</span></span><span aria-hidden="true" className="text-[var(--action-primary)]">→</span></Link></li>)}</ul></section>
  <nav aria-label="Мои записи" className="flex flex-wrap gap-6 text-sm text-[var(--action-primary)]"><Link className="inline-flex min-h-11 items-center" href="/profile/notebook">Мой блокнот →</Link><Link className="inline-flex min-h-11 items-center" href="/mistakes">Мои ошибки →</Link></nav>
</div>;}
