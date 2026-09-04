import { ProfileOverview } from "../../components/profile/ProfileOverview";

export const metadata = {
  title: "Прогресс | PhysicsLab",
  description: "Продолжить, проверить открытые темы и вернуться к ошибкам.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-7">
      <header className="flex max-w-[680px] flex-col gap-2 pt-1">
        <h1 className="text-[34px] font-[800] leading-tight tracking-[-.035em] text-[var(--text-strong)] sm:text-[44px]">
          Прогресс
        </h1>
        <p className="max-w-[58ch] text-[15px] leading-[1.7] text-[var(--text-default)]">
          Здесь можно продолжить, проверить открытые темы и вернуться к ошибкам.
        </p>
      </header>

      <div className="[&_[aria-label='Цель_занятий']>span:first-child]:hidden">
        <ProfileOverview />
      </div>
    </div>
  );
}
