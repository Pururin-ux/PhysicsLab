import { OpticsLesson } from "../../../components/learning/TopicLessons";
import { physics8Book } from "../../../lib/learning/textbook";

export const metadata = {
  title: "Отражение света | PhysicsLab",
  description: "От наблюдения за лучами к закону отражения и самостоятельной задаче.",
};

export default function OpticsLessonPage() {
  return <div className="flex flex-col gap-5">
    <OpticsLesson />
    <details className="mx-auto w-full max-w-[1120px] border-t border-[var(--border-strong)] text-sm leading-relaxed text-[var(--text-secondary)]">
      <summary className="min-h-11 cursor-pointer py-3">Школьный учебник</summary>
      <p>{physics8Book.title}, § 34, с. 132–135. {physics8Book.authors}.</p>
      <a className="mt-3 inline-flex min-h-11 items-center text-[var(--action-primary)]" href={`${physics8Book.url}#page=138`} target="_blank" rel="noreferrer">Открыть параграф в официальном учебнике</a>
    </details>
  </div>;
}
