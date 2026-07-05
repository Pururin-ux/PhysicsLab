import { TopicCards } from "../../components/topics/TopicCards";

export const metadata = {
  title: "Темы | PhysicsLab",
};

export default function TopicsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[680px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Темы
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Выбери, что хочешь повторить.
        </p>
      </section>

      <TopicCards />
    </div>
  );
}
