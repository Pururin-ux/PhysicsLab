import { DynamicsLesson } from "../../../components/learning/DynamicsLesson";
import { physics9Book } from "../../../lib/learning/textbook";

export const metadata = {
  title: "Второй закон Ньютона | PhysicsLab",
  description: "Интерактивный урок о связи силы, массы и ускорения: опыт, рисунок сил, пример и самостоятельные задачи.",
};

export default function DynamicsLessonPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] min-w-0 flex-col gap-6">
      <h1 className="sr-only">Второй закон Ньютона</h1>
      <DynamicsLesson />
      <footer className="mx-auto w-full max-w-[820px] border-t border-[var(--border-strong)] pt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
        <details>
          <summary className="min-h-11 cursor-pointer py-3">Школьный учебник</summary>
          <p>{physics9Book.title}, § 17, с. 76–78. {physics9Book.authors}.</p>
          <a className="mt-3 inline-flex min-h-11 items-center text-[var(--action-primary)]" href={`${physics9Book.url}#page=83`} target="_blank" rel="noreferrer">Открыть параграф в официальном учебнике</a>
        </details>
      </footer>
    </div>
  );
}
