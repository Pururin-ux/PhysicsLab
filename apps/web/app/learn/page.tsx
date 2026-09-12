import Link from "next/link";
import { textbookChapters } from "../../lib/learning/textbook";
import { TextbookContents } from "../../components/learning/TextbookContents";

export const metadata = { title: "Учебник | PhysicsLab", description: "Объяснения физики, разобранные примеры и самопроверка." };
export default function TextbookPage() {
  return <div className="mx-auto flex w-full max-w-[940px] flex-col gap-8 text-[var(--text-primary)]">
    <header><Link href="/topics" className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]">К разделу «Учиться»</Link><h1 className="type-h1 mt-3">Учебник</h1></header>
    <TextbookContents chapters={textbookChapters}/>
  </div>;
}
