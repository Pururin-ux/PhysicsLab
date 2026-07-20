import { TopicCards } from "../../components/topics/TopicCards";

export const metadata = {
  title: "Темы | PhysicsLab",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1220px] min-w-0 flex-col gap-8">
      <section className="flex max-w-[760px] flex-col gap-2 pt-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-nova-pink">Курс по школьной физике</p>
        <h1 className="text-[38px] font-[800] leading-tight tracking-[-.04em] text-white sm:text-[48px]">Темы и контрольные точки</h1>
        <p className="text-[15px] leading-[1.7] text-white/62">Начни с ближайшего навыка или вернись к месту, где появилась ошибка.</p>
      </section>

      <TopicCards />
    </div>
  );
}
