import { notFound } from "next/navigation";

export default function DesignLabDevPage() {
  // Файл сохраняет прежний локальный entrypoint как обратимую границу,
  // но исследовательская витрина не является частью learner-facing сайта.
  // Сам прототип остаётся в components/design-lab для отдельной работы.
  notFound();
}
