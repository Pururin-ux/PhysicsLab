import { TopicCards } from "../../components/topics/TopicCards";

export const metadata = {
  title: "Темы | PhysicsLab V3",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <section className="flex max-w-[640px] flex-col gap-3">
        <h1 className="text-3xl font-[800] leading-tight tracking-tight text-white">
          Что хочешь повторить?
        </h1>
        <p className="text-[14px] leading-[1.7] text-white/70">
          Выбери тему. Прогресс сохранится, а ошибки появятся в разборе.
        </p>
      </section>

      <TopicCards />
    </div>
  );
}
