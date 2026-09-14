import { ElectroLesson } from "../../../components/learning/TopicLessons";
import { physics8Book } from "../../../lib/learning/textbook";

export const metadata = {
  title: "Закон Ома | PhysicsLab",
  description: "От наблюдения за током к закону Ома и самостоятельной задаче.",
};

export default function ElectroLessonPage() {
  return <div className="flex flex-col gap-5">
    <ElectroLesson />
    <details className="mx-auto w-full max-w-[1120px] border-t border-[var(--border-strong)] text-sm leading-relaxed text-[var(--text-secondary)]">
      <summary className="min-h-11 cursor-pointer py-3">Школьный учебник</summary>
      <p>{physics8Book.title}, § 22, с. 85–87. {physics8Book.authors}.</p>
      <a className="mt-3 inline-flex min-h-11 items-center text-[var(--action-primary)]" href={`${physics8Book.url}#page=91`} target="_blank" rel="noreferrer">Открыть параграф в официальном учебнике</a>
    </details>
  </div>;
}
