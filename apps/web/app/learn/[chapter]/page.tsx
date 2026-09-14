import Link from "next/link";
import { notFound } from "next/navigation";
import { TextbookCheck } from "../../../components/learning/TextbookCheck";
import { TextbookScene } from "../../../components/learning/TextbookScene";
import { MathText } from "../../../components/ui/MathText";
import { Button } from "../../../components/ui/Button";
import { getTextbookChapter, physics9Book, textbookChapters } from "../../../lib/learning/textbook";
import { getChapterPracticeReturn } from "../../../lib/learning/learning-links";

type Props = { params: Promise<{ chapter: string }>; searchParams: Promise<{ practice?: string | string[] }> };
export function generateStaticParams() { return textbookChapters.map(chapter => ({ chapter: chapter.id })); }
export async function generateMetadata({ params }: Props) { const chapter = getTextbookChapter((await params).chapter); return { title: chapter ? `${chapter.title} | Учебник PhysicsLab` : "Раздел не найден | PhysicsLab" }; }
export default async function TextbookChapterPage({ params, searchParams }: Props) {
  const chapter = getTextbookChapter((await params).chapter);
  if (!chapter) notFound();
  const practiceParam = (await searchParams).practice;
  const practiceReturn = getChapterPracticeReturn(chapter.id, typeof practiceParam === "string" ? practiceParam : "");
  const index = textbookChapters.indexOf(chapter);
  const next = textbookChapters[index + 1];
  const book = chapter.source.book ?? physics9Book;
  const isSpeed = chapter.id === "average-speed";
  const hasChapterHandoff = chapter.practice.href.startsWith("/learn/");
  const explanation = <>
    {chapter.sections.map((section, i) => <section key={section.title} id={`idea-${i}`} className="scroll-mt-24"><h2 className="type-h2">{section.title}</h2><div className="mt-4 space-y-4 text-[17px] leading-[1.8]">{section.paragraphs.map(text => <p key={text}><MathText text={text} /></p>)}</div></section>)}
    <section className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 sm:p-7" aria-labelledby="worked-example"><h2 id="worked-example" className="type-h2">Разберём пример</h2><p className="my-5 text-[17px] leading-relaxed"><MathText text={chapter.example.question} /></p><ol className="list-decimal space-y-4 pl-5 leading-[1.8]">{chapter.example.steps.map(step => <li key={step}><MathText text={step} /></li>)}</ol><p className="mt-5 border-l-2 border-[var(--action-primary)] pl-4 leading-relaxed">{chapter.example.conclusion}</p></section>
  </>;
  return <article className="mx-auto flex w-full max-w-[800px] flex-col gap-8 text-[var(--text-primary)]">
    <header>
      {practiceReturn && <Link href={practiceReturn.href} className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)] underline underline-offset-4">Вернуться к задачам: {practiceReturn.label} →</Link>}
      <Link href="/learn" className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]">К оглавлению</Link>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{chapter.grade} класс · {chapter.unit ?? "Основы движения"}</p>
      <h1 className="type-h1 mt-3">{chapter.title}</h1>
      <p className="mt-5 text-lg leading-relaxed">{chapter.lead}</p>
    </header>
    <TextbookScene chapterId={chapter.id} />
    {isSpeed ? <details className="border-y border-[var(--border-strong)] py-2"><summary className="min-h-11 cursor-pointer py-3 font-bold">Объяснение, формулы и разобранный пример</summary><div className="flex flex-col gap-8 py-5">{explanation}</div></details> : <>
      <details className="text-sm text-[var(--text-secondary)]"><summary className="min-h-11 cursor-pointer py-3">В этой теме</summary><nav aria-label="В этом объяснении" className="flex flex-wrap gap-x-5 gap-y-3 py-3 text-[var(--action-primary)]">{chapter.sections.map((section, i) => <Link key={section.title} href={`#idea-${i}`}>{section.title}</Link>)}<Link href="#self-check">Самопроверка</Link></nav></details>
      {explanation}
    </>}
    <section id="self-check" className="scroll-mt-24"><h2 className="type-h2 mb-5">Проверь понимание</h2><TextbookCheck key={chapter.id} chapterId={chapter.id} check={chapter.check} /></section>
    <Button asChild size="lg"><Link href={isSpeed ? "/practice/family/average-speed-segments" : chapter.practice.href}>{isSpeed ? "Решать задачи на среднюю скорость" : chapter.practice.label}</Link></Button>
    {!isSpeed && !hasChapterHandoff && next && next.grade === chapter.grade && <Link href={`/learn/${next.id}`} className="inline-flex min-h-11 items-center text-[var(--action-primary)]">Следующее объяснение: {next.title} →</Link>}
    <footer className="border-t border-[var(--border-strong)] pt-5 text-sm leading-relaxed text-[var(--text-secondary)]"><details><summary className="min-h-11 cursor-pointer py-3">Школьный учебник</summary><p> {book.title}, {chapter.source.section}, с. {chapter.source.printedPage}. {book.authors}.</p><a className="mt-3 inline-flex min-h-11 items-center text-[var(--action-primary)]" href={chapter.source.pdfPage ? `${book.url}#page=${chapter.source.pdfPage}` : book.url} target="_blank" rel="noreferrer">{chapter.source.pdfPage ? "Открыть соответствующий параграф в официальном учебнике" : `Открыть официальный учебник · ${chapter.source.section}, с. ${chapter.source.printedPage}`}</a></details></footer>
  </article>;
}

