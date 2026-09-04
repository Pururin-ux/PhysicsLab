import { TopicCards } from "../../components/topics/TopicCards";

export const metadata = {
  title: "Учиться | PhysicsLab",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1220px] min-w-0 flex-col gap-8">
      <header className="pt-2">
        <p className="mb-2 text-[11px] font-[800] uppercase tracking-[.14em] text-[var(--mode-learn-accent)]">
          Учиться
        </p>
        <h1 className="text-[38px] font-[800] leading-tight tracking-[-.04em] text-[var(--text-primary)] sm:text-[48px]">
          Выбери, что хочешь понять
        </h1>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Выбери тему, которая нужна сейчас. Можно сначала разобраться в ней или сразу перейти к задачам.
        </p>
      </header>

      <TopicCards />
    </div>
  );
}
