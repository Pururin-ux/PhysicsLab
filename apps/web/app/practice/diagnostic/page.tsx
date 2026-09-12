import { StartDiagnostic } from "../../../components/diagnostic/StartDiagnostic";

export const metadata = {
  title: "С чего начать | PhysicsLab",
  description:
    "Десять задач по пяти открытым темам без таймера и без экзаменационной оценки.",
};

const OPEN_TOPICS = [
  "Движение",
  "Силы",
  "Электричество",
  "Теплота",
  "Оптика",
] as const;

export default function StartDiagnosticPage() {
  return (
    <div className="mx-auto flex w-full max-w-[920px] min-w-0 flex-col gap-6">
      <header className="border-b border-white/[.1] pb-5 pt-1">
        <p className="text-[11px] font-[850] uppercase tracking-[.16em] text-[var(--physics-cyan)]">
          Не знаешь, с чего начать?
        </p>
        <h1 className="mt-2 max-w-[760px] text-[30px] font-[820] leading-[1.04] tracking-[-.035em] text-white sm:text-[42px]">
          Попробуй 10 задач — без таймера
        </h1>
        <p className="mt-3 max-w-[66ch] text-[14px] leading-[1.65] text-white/68">
          По две задачи из пяти открытых тем. После ответа можно посмотреть
          разбор, а в конце — выбрать одно место, с которого удобнее продолжить.
        </p>
        <p className="mt-2 max-w-[66ch] text-[12px] leading-[1.6] text-white/52">
          Это не экзамен и не проверка всей школьной программы.
        </p>
        <ul
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-white/64"
          aria-label="Темы стартовой диагностики"
        >
          {OPEN_TOPICS.map((topic) => (
            <li key={topic} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--physics-cyan)]" aria-hidden="true" />
              {topic}
            </li>
          ))}
        </ul>
      </header>

      <StartDiagnostic />
    </div>
  );
}
