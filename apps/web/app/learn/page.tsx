import Link from "next/link";
import { textbookChapters } from "../../lib/learning/textbook";
import { TextbookContents } from "../../components/learning/TextbookContents";
import { learningEntries } from "../../lib/learning/learning-entry";
import { projectTextbookContents, projectTextbookContentsEntry, projectTextbookOutline } from "../../lib/learning/textbook-outline";
import { schoolGrades } from "../../lib/learning/textbook-index";
import { SCHOOL_CHECK_GRADES } from "../../lib/learning/school-checks";

export const metadata = { title: "Учебник | PhysicsLab", description: "Объяснения физики, разобранные примеры и самопроверка." };
export default async function TextbookPage({ searchParams }: { searchParams: Promise<{ grade?: string | string[] }> }) {
  const gradeParam = (await searchParams).grade;
  const initialGrade = typeof gradeParam === "string"
    ? schoolGrades.find(value => String(value) === gradeParam) ?? null
    : null;
  return <div className="mx-auto flex w-full max-w-[940px] flex-col gap-8 text-[var(--text-primary)]">
    <header><Link href="/topics" className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]">Выбрать вопрос, опыт или задачи →</Link><h1 className="type-h1 mt-3">Учебник</h1><p className="mt-3 max-w-[640px] leading-relaxed text-[var(--text-secondary)]">Объяснения, примеры и самопроверка. Открывай любой параграф.</p></header>
    <TextbookContents items={projectTextbookContents(textbookChapters.map(projectTextbookOutline), learningEntries.filter(entry => entry.grade !== undefined).map(projectTextbookContentsEntry))} initialGrade={initialGrade} schoolCheckGrades={SCHOOL_CHECK_GRADES}/>
  </div>;
}
