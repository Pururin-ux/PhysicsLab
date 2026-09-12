import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

export default function TaskFamilyNotFound() {
  return (
    <section className="mx-auto flex min-h-[48vh] w-full max-w-[760px] items-center">
      <div className="w-full border-l-2 border-feedback-warning/65 py-3 pl-5 sm:pl-7">
        <p className="text-[12px] font-[800] uppercase tracking-[.14em] text-feedback-warning/85">
          Эта ссылка не сработала
        </p>
        <h1 className="mt-2 text-[28px] font-[800] leading-tight tracking-[-.03em] text-white sm:text-[38px]">
          Такой тренировки здесь нет
        </h1>
        <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.7] text-white/66">
          Возможно, её переименовали. Вернись к списку и выбери нужную тему.
        </p>
        <Button asChild className="mt-6 w-full gap-2 sm:w-auto">
          <Link href="/tasks">
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            Все тренировки
          </Link>
        </Button>
      </div>
    </section>
  );
}
