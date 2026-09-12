import { MistakesList } from "../../components/mistakes/MistakesList";

export const metadata = {
  title: "К чему вернуться | PhysicsLab",
  description: "Короткие тренировки на местах, где ответ пока сбивается.",
};

export default function MistakesPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-7">
      <header className="flex max-w-[680px] flex-col gap-2 pt-1">
        <h1 className="text-[34px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[44px]">
          К чему вернуться
        </h1>
        <p className="max-w-[58ch] text-[15px] leading-[1.7] text-white/68">
          Выбери одно место, где ответ сбился. Пять похожих задач помогут
          закрепить ход решения без спешки.
        </p>
      </header>

      <MistakesList />
    </div>
  );
}
