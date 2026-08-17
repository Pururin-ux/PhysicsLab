import { MistakesList } from "../../components/mistakes/MistakesList";

export const metadata = {
  title: "Ошибки | PhysicsLab",
};

export default function MistakesPage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[680px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Ошибки
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Ловушки, на которых ты ошибался. Каждую можно потренировать отдельно.
        </p>
      </section>

      <MistakesList />
    </div>
  );
}
