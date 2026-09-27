import Link from "next/link";
import { notFound } from "next/navigation";
import { TextbookCheck } from "../../../components/learning/TextbookCheck";
import { TextbookScene } from "../../../components/learning/TextbookScene";
import { TextbookStaticStory } from "../../../components/learning/TextbookStaticStory";
import { ModernPhysicsScene } from "../../../components/learning/ModernPhysicsScene";
import { MathText } from "../../../components/ui/MathText";
import { Button } from "../../../components/ui/Button";
import { getTextbookChapter, physics9Book, textbookChapters, type TextbookBook } from "../../../lib/learning/textbook";
import { getChapterPracticeReturn } from "../../../lib/learning/learning-links";
import { learningEntries } from "../../../lib/learning/learning-entry";

const modernPhysicsChapterIds = new Set([
  "photoelectric-effect",
  "light-pressure-and-duality",
  "rutherford-scattering",
  "bohr-transitions",
  "laser-amplification",
]);

type Props = { params: Promise<{ chapter: string }>; searchParams: Promise<{ practice?: string | string[] }> };
export function generateStaticParams() { return textbookChapters.map(chapter => ({ chapter: chapter.id })); }
export async function generateMetadata({ params }: Props) { const chapter = getTextbookChapter((await params).chapter); return { title: chapter ? `${chapter.title} | Учебник PhysicsLab` : "Раздел не найден | PhysicsLab" }; }
export default async function TextbookChapterPage({ params, searchParams }: Props) {
  const chapter = getTextbookChapter((await params).chapter);
  if (!chapter) notFound();
  const LcNotebook = chapter.id === "lc-oscillations"
    ? (await import("../../../components/learning/LCOscillatorNotebook")).LCOscillatorNotebook
    : null;
  const AcNotebook = chapter.id === "alternating-current"
    ? (await import("../../../components/learning/AlternatingCurrentNotebook")).AlternatingCurrentNotebook
    : null;
  const TransformerNotebook = chapter.id === "transformer"
    ? (await import("../../../components/learning/TransformerNotebook")).TransformerNotebook
    : null;
  const EnergyTransmissionNotebook = chapter.id === "electric-energy-transmission"
    ? (await import("../../../components/learning/EnergyTransmissionNotebook")).EnergyTransmissionNotebook
    : null;
  const EnergySourcesNotebook = chapter.id === "energy-sources-and-environment"
    ? (await import("../../../components/learning/EnergySourcesNotebook")).EnergySourcesNotebook
    : null;
  const InductionNotebook = chapter.id === "electromagnetic-induction"
    ? (await import("../../../components/learning/InductionNotebook")).InductionNotebook
    : null;
  const AmpereForceNotebook = chapter.id === "magnetic-field-and-ampere-force"
    ? (await import("../../../components/learning/AmpereForceNotebook")).AmpereForceNotebook
    : null;
  const LorentzTrackNotebook = chapter.id === "lorentz-force-and-charge-motion"
    ? (await import("../../../components/learning/LorentzTrackNotebook")).LorentzTrackNotebook
    : null;
  const SelfInductionNotebook = chapter.id === "self-induction"
    ? (await import("../../../components/learning/SelfInductionNotebook")).SelfInductionNotebook
    : null;
  const MetalTemperatureNotebook = chapter.id === "electric-current-in-metals"
    ? (await import("../../../components/learning/MetalTemperatureNotebook")).MetalTemperatureNotebook
    : null;
  const ElectrolyteEvidenceNotebook = chapter.id === "electric-current-in-electrolytes"
    ? (await import("../../../components/learning/ElectrolyteEvidenceNotebook")).ElectrolyteEvidenceNotebook
    : null;
  const GasDischargeNotebook = chapter.id === "electric-current-in-gases"
    ? (await import("../../../components/learning/GasDischargeNotebook")).GasDischargeNotebook
    : null;
  const SemiconductorLightNotebook = chapter.id === "electric-current-in-semiconductors"
    ? (await import("../../../components/learning/SemiconductorLightNotebook")).SemiconductorLightNotebook
    : null;
  const CurrentCarriersComparison = chapter.id === "electric-current-in-semiconductors"
    ? (await import("../../../components/learning/CurrentCarriersComparison")).CurrentCarriersComparison
    : null;
  const practiceParam = (await searchParams).practice;
  const practiceReturn = getChapterPracticeReturn(chapter.id, typeof practiceParam === "string" ? practiceParam : "");
  const nextQuestion = learningEntries.find(entry => entry.id === chapter.id)?.connection;
  const nextExplanation = nextQuestion?.href.startsWith("/learn/") ? nextQuestion : null;
  const book: TextbookBook = chapter.source.book ?? physics9Book;
  const isSpeed = chapter.id === "average-speed";
  const hasChapterHandoff = chapter.practice.href.startsWith("/learn/");
  const defaultPractice = isSpeed ? { href: "/practice/family/average-speed-segments", label: "Решать задачи на среднюю скорость" } : chapter.practice;
  const practiceHref = practiceReturn?.href ?? defaultPractice.href;
  const practiceLabel = practiceReturn ? `Вернуться к задачам: ${practiceReturn.label}` : defaultPractice.label;
  const explanation = <>
    {chapter.sections.map((section, i) => <section key={section.title} id={`idea-${i}`} className="scroll-mt-24"><h2 className="type-h2">{section.title}</h2><div className="mt-4 space-y-4 text-[17px] leading-[1.8]">{section.paragraphs.map(text => <p key={text}><MathText text={text} /></p>)}</div></section>)}
    {CurrentCarriersComparison && <CurrentCarriersComparison />}
    <section className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-primary)] p-5 sm:p-7" aria-labelledby="worked-example"><h2 id="worked-example" className="type-h2">Разберём пример</h2><p className="my-5 text-[17px] leading-relaxed"><MathText text={chapter.example.question} /></p><ol className="list-decimal space-y-4 pl-5 leading-[1.8]">{chapter.example.steps.map(step => <li key={step}><MathText text={step} /></li>)}</ol><p className="mt-5 border-l-2 border-[var(--action-primary)] pl-4 leading-relaxed">{chapter.example.conclusion}</p></section>
  </>;
  return <article className="mx-auto flex w-full max-w-[800px] flex-col gap-8 text-[var(--text-primary)]">
    <header>
      {practiceReturn && <Link href={practiceReturn.href} className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)] underline underline-offset-4">Вернуться к задачам: {practiceReturn.label} →</Link>}
      <Link href={`/learn?grade=${chapter.grade}`} className="inline-flex min-h-11 items-center text-sm text-[var(--action-primary)]">К оглавлению</Link>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{chapter.grade} класс · {chapter.unit ?? "Основы движения"}</p>
      <h1 className="type-h1 mt-3">{chapter.title}</h1>
      <p className="mt-5 text-lg leading-relaxed">{chapter.lead}</p>
    </header>
    {chapter.id === "mechanical-oscillations" ? <TextbookStaticStory /> : LcNotebook ? <LcNotebook /> : AcNotebook ? <AcNotebook /> : TransformerNotebook ? <TransformerNotebook /> : EnergyTransmissionNotebook ? <EnergyTransmissionNotebook /> : EnergySourcesNotebook ? <EnergySourcesNotebook /> : AmpereForceNotebook ? <AmpereForceNotebook /> : LorentzTrackNotebook ? <LorentzTrackNotebook /> : InductionNotebook ? <InductionNotebook /> : SelfInductionNotebook ? <SelfInductionNotebook /> : MetalTemperatureNotebook ? <MetalTemperatureNotebook /> : ElectrolyteEvidenceNotebook ? <ElectrolyteEvidenceNotebook /> : GasDischargeNotebook ? <GasDischargeNotebook /> : SemiconductorLightNotebook ? <SemiconductorLightNotebook /> : modernPhysicsChapterIds.has(chapter.id) ? <ModernPhysicsScene chapterId={chapter.id} /> : <TextbookScene chapterId={chapter.id} />}
    {isSpeed ? <details className="border-y border-[var(--border-strong)] py-2"><summary className="min-h-11 cursor-pointer py-3 font-bold">Объяснение, формулы и разобранный пример</summary><div className="flex flex-col gap-8 py-5">{explanation}</div></details> : <>
      <details className="text-sm text-[var(--text-secondary)]"><summary className="min-h-11 cursor-pointer py-3">В этой теме</summary><nav aria-label="В этом объяснении" className="flex flex-wrap gap-x-5 gap-y-3 py-3 text-[var(--action-primary)]">{chapter.sections.map((section, i) => <Link key={section.title} href={`#idea-${i}`}>{section.title}</Link>)}<Link href="#self-check">Самопроверка</Link></nav></details>
      {explanation}
    </>}
    <section id="self-check" className="scroll-mt-24"><h2 className="type-h2 mb-5">Проверь понимание</h2><TextbookCheck key={chapter.id} chapterId={chapter.id} check={chapter.check} /></section>
    <Button asChild size="lg"><Link href={practiceHref}>{practiceLabel}</Link></Button>
    {practiceReturn && defaultPractice.href !== practiceReturn.href && !hasChapterHandoff && <Link href={defaultPractice.href} className="inline-flex min-h-11 items-center text-[var(--action-primary)]">{defaultPractice.label} →</Link>}
    {chapter.relatedPractice && chapter.relatedPractice.href !== practiceReturn?.href && <Link href={chapter.relatedPractice.href} className="inline-flex min-h-11 items-center text-[var(--action-primary)]">{chapter.relatedPractice.label} →</Link>}
    {chapter.relatedPractices?.filter(item => item.href !== practiceReturn?.href).map((item) => <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-[var(--action-primary)]">{item.label} →</Link>)}
    {!isSpeed && nextExplanation && practiceHref !== nextExplanation.href && <Link href={nextExplanation.href} className="inline-flex min-h-11 items-center text-[var(--action-primary)]">Дальше: {nextExplanation.label} →</Link>}
    <footer className="border-t border-[var(--border-strong)] pt-5 text-sm leading-relaxed text-[var(--text-secondary)]"><details><summary className="min-h-11 cursor-pointer py-3">Школьный учебник</summary><p> {book.title}, {chapter.source.section}, с. {chapter.source.printedPage}. {book.authors}.</p><a className="mt-3 inline-flex min-h-11 items-center text-[var(--action-primary)]" href={chapter.source.pdfPage ? `${book.url}#page=${chapter.source.pdfPage}` : book.url} target="_blank" rel="noreferrer">{chapter.source.pdfPage ? "Открыть страницу в официальном учебнике" : book.catalogOnly ? "Найти учебник в официальном электронном каталоге" : `Открыть официальный учебник · ${chapter.source.section}, с. ${chapter.source.printedPage}`}</a></details></footer>
  </article>;
}

