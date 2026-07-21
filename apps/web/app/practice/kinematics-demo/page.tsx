import { AccelerationLesson } from "../../../components/learning/AccelerationLesson";

export const metadata = {
  title: "Что такое ускорение | PhysicsLab",
  description: "Урок про ускорение: от толчка в троллейбусе до формулы. Метки на дороге, спидометр и первая своя задача.",
};

export default function KinematicsDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] min-w-0 flex-col gap-3">
      <header className="max-w-[760px]">
        <h1 className="text-[28px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[36px]">
          Что такое ускорение
        </h1>
        <p className="sr-only">
          Урок начинается с толчка в троллейбусе. Потом метки на дороге, спидометр и только в конце формула.
        </p>
      </header>
      <AccelerationLesson />
    </div>
  );
}
