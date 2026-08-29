import { ProfileOverview } from "../../components/profile/ProfileOverview";

export const metadata = {
  title: "Прогресс | PhysicsLab",
};

export default function ProfilePage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[680px] flex-col gap-3">
        <h1 className="pl-h1">Прогресс</h1>
        <p className="pl-body pl-measure">
          Твой прогресс по решённым задачам — без даты экзамена и обратного
          отсчёта.
        </p>
      </section>

      <ProfileOverview />
    </div>
  );
}
