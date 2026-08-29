import { MistakesList } from "../../components/mistakes/MistakesList";

export const metadata = {
  title: "Ошибки | PhysicsLab",
};

export default function MistakesPage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[680px] flex-col gap-3">
        <h1 className="pl-h1">Ошибки</h1>
        <p className="pl-body pl-measure">
          Ловушки, на которых ты ошибался. Каждую можно потренировать отдельно.
        </p>
      </section>

      <MistakesList />
    </div>
  );
}
