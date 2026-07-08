import { ProfileOverview } from "../../components/profile/ProfileOverview";

export const metadata = {
  title: "Профиль | PhysicsLab",
};

export default function ProfilePage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[680px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Профиль
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Твой прогресс по решённым задачам — без даты экзамена и обратного
          отсчёта.
        </p>
      </section>

      <ProfileOverview />
    </div>
  );
}
