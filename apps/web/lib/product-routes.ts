export type ProductDestinationId = "today" | "learn" | "exam" | "progress";

export type ProductDestination = {
  id: ProductDestinationId;
  label: string;
  href: string;
  description: string;
  matches: (pathname: string) => boolean;
};

const isExamRoute = (pathname: string) =>
  pathname.startsWith("/practice/exam-demo") || pathname.startsWith("/exam");

const isProgressRoute = (pathname: string) =>
  pathname.startsWith("/profile") ||
  pathname.startsWith("/progress") ||
  pathname.startsWith("/mistakes");

const isLearningRoute = (pathname: string) =>
  pathname.startsWith("/topics") ||
  pathname.startsWith("/learn") ||
  pathname.startsWith("/formulas") ||
  pathname.startsWith("/tasks") ||
  (pathname.startsWith("/practice/") && !isExamRoute(pathname));

/**
 * The visible product architecture. Legacy URLs stay behind these entries so
 * navigation, home surfaces and future redirects share one source of truth.
 */
export const PRODUCT_DESTINATIONS = [
  {
    id: "today",
    label: "Главная",
    href: "/",
    description: "Начать или продолжить с нужного места.",
    matches: (pathname: string) => pathname === "/",
  },
  {
    id: "learn",
    label: "Учиться",
    href: "/topics",
    description: "Разобраться в теме и попрактиковаться.",
    matches: isLearningRoute,
  },
  {
    id: "exam",
    label: "ЦТ/ЦЭ",
    href: "/practice/exam-demo",
    description: "Проверить открытые темы и найти пробелы.",
    matches: isExamRoute,
  },
  {
    id: "progress",
    label: "Прогресс",
    href: "/profile",
    description: "Продолжить, повторить и разобрать ошибки.",
    matches: isProgressRoute,
  },
] as const satisfies readonly ProductDestination[];

export const CONTEXTUAL_TOOLS = [
  {
    id: "formulas",
    label: "Формулы",
    href: "/formulas",
    description: "Проверить смысл, обозначения и единицы.",
    owner: "learn",
  },
  {
    id: "tasks",
    label: "Каталог задач",
    href: "/tasks",
    description: "Найти похожий тип и потренироваться.",
    owner: "learn",
  },
  {
    id: "mistakes",
    label: "Мои ошибки",
    href: "/mistakes",
    description: "Вернуться к месту, где сломалась мысль.",
    owner: "progress",
  },
] as const;

export function getProductDestination(id: ProductDestinationId) {
  return PRODUCT_DESTINATIONS.find((destination) => destination.id === id)!;
}

export function getActiveProductDestination(pathname: string) {
  return PRODUCT_DESTINATIONS.find((destination) => destination.matches(pathname)) ?? null;
}

export function isExamDestination(pathname: string) {
  return isExamRoute(pathname);
}
