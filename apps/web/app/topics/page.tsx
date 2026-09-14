import { LearningEntryBrowser } from "../../components/topics/LearningEntryBrowser";
import { learningEntries } from "../../lib/learning/learning-entry";

export const metadata = { title: "Учиться | PhysicsLab", description: "Найди свой вопрос по физике: объяснения, опыты и задачи рядом." };

export default function TopicsPage() {
  return <div className="mx-auto w-full max-w-[1120px] text-[var(--text-primary)]">
    <header>
      <p className="mb-2 text-sm font-semibold text-[var(--action-primary)]">Учиться</p>
      <h1 className="type-h1">Что хочешь понять?</h1>
      <p className="mt-3 max-w-[640px] leading-relaxed text-[var(--text-secondary)]">Найди свой вопрос и начни разбираться.</p>
    </header>
    <LearningEntryBrowser entries={learningEntries} />
  </div>;
}
