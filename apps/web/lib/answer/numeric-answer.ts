// Единая политика числового ответа. Один источник правды для генератора,
// API, клиента и тестов: разбор ввода, точность/допуск и подбор misconception
// по значению живут здесь, чтобы server-валидация, client-фидбэк и тесты
// никогда не разъезжались. Файл намеренно без server-зависимостей (KaTeX и
// генератор сюда не тянем), поэтому его можно импортировать и на клиенте.

// Формат ввода ответа — отдельная ось от числовой семантики (answerKind).
// Дискриминированный union, а не boolean, чтобы позже добавить multi-select
// и matching без переписывания контракта.
export type AnswerFormat = "single_choice" | "numeric_input";

// Числовая семантика ответа (совпадает с AnswerKind генератора).
export type AnswerSign = "positive" | "magnitude" | "signed";

export type NumericAnswerSpec = {
  // Каноничное значение. Нужно клиенту для проверки ответа: проверка идёт на
  // клиенте (как и correct-флаги вариантов у single_choice). Значение не
  // рендерится в DOM до submit — оно живёт только в данных задачи.
  value: number;
  unit: string;
  // Отображаемая точность: сколько знаков после запятой в каноничном ответе.
  decimals: number;
  // Абсолютный допуск: половина единицы в последнем разряде отображаемой
  // точности (минимум 1 знак, чтобы целые ответы гасили floating-point-шум,
  // но не принимали явный промах).
  tolerance: number;
  sign: AnswerSign;
};

export type NumericMisconception = {
  value: number;
  label: string;
};

export type ParsedNumericAnswer =
  | { ok: true; value: number }
  | { ok: false };

// Принимаем: целые, десятичные через точку и запятую, ведущий минус, пробелы
// по краям. Отклоняем: пустую строку, несколько разделителей, текст, выражения
// (2+2), единицы внутри поля, Infinity/NaN.
const NUMERIC_PATTERN = /^-?\d+(?:[.,]\d+)?$/;

export function parseNumericAnswer(raw: string): ParsedNumericAnswer {
  const trimmed = raw.trim();

  if (!NUMERIC_PATTERN.test(trimmed)) {
    return { ok: false };
  }

  const value = Number(trimmed.replace(",", "."));

  if (!Number.isFinite(value)) {
    return { ok: false };
  }

  return { ok: true, value };
}

// Количество значащих знаков после запятой у значения, нормализованного к
// 3 знакам (генератор округляет ответы к 3 знакам через normalizeAnswerValue).
export function decimalsOf(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const fixed = value.toFixed(3);
  const trimmed = fixed.replace(/0+$/, "").replace(/\.$/, "");
  const dotIndex = trimmed.indexOf(".");

  return dotIndex === -1 ? 0 : trimmed.length - dotIndex - 1;
}

// Половина единицы в последнем отображаемом разряде. Минимум 1 знак: целый
// ответ получает допуск 0,05 — гасит floating-point, но отвергает промах вроде
// 23,6 при ответе 24.
export function toleranceFor(value: number): number {
  const toleranceDecimals = Math.max(1, decimalsOf(value));

  return 0.5 * 10 ** -toleranceDecimals;
}

const CORRECTNESS_EPSILON = 1e-9;

export function isNumericAnswerCorrect(
  value: number,
  spec: Pick<NumericAnswerSpec, "value" | "tolerance">,
): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }

  return Math.abs(value - spec.value) <= spec.tolerance + CORRECTNESS_EPSILON;
}

// Возвращает misconception, только если ввод действительно попал в значение
// одного из дистракторов (в пределах того же допуска). Ложную причину не
// придумываем — если совпадения нет, вернём undefined.
export function getNumericMisconception(
  value: number,
  misconceptions: NumericMisconception[],
  tolerance: number,
): string | undefined {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  for (const misconception of misconceptions) {
    if (Math.abs(value - misconception.value) <= tolerance + CORRECTNESS_EPSILON) {
      return misconception.label;
    }
  }

  return undefined;
}

// Форматирование значения для показа ученику: десятичная запятая, фиксированная
// отображаемая точность. Используется в фидбэке ("правильно: 3,2 м/с").
export function formatNumericValue(value: number, decimals?: number): string {
  const places = decimals ?? decimalsOf(value);
  const normalized = Object.is(value, -0) ? 0 : value;

  return normalized.toFixed(places).replace(".", ",");
}
