import Link from "next/link";
import { textbookChapters } from "../../lib/learning/textbook";
import { TextbookContents } from "../../components/learning/TextbookContents";
import { learningEntries } from "../../lib/learning/learning-entry";

export const metadata = { title: "Учебник | PhysicsLab", description: "Объяснения физики, разобранные примеры и самопроверка." };
export default function TextbookPage() {
  return <div className="mx-auto flex w-full max-w-[940px] flex-col gap-8 text-[var(--text-primary)]">
    <header><Link href="/topics" className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]">Выбрать вопрос, опыт или задачи →</Link><h1 className="type-h1 mt-3">Учебник</h1><p className="mt-3 max-w-[640px] leading-relaxed text-[var(--text-secondary)]">Объяснения, примеры и самопроверка. Открывай любой параграф.</p><p className="mt-2 text-sm text-[var(--text-secondary)]">Сейчас — отдельные темы 7, 8 и 9 классов. Это ещё не полный курс.</p></header>
    <TextbookContents chapters={textbookChapters} entries={learningEntries.filter(entry => entry.grade !== undefined)}/>
  </div>;
}
